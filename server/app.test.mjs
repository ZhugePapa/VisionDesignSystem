import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'

import { createVisionAiServer } from './app.mjs'
import { AiArtifactStore } from './artifacts.mjs'
import { ConversationStore } from './conversations.mjs'
import { completeOpenCodeGoChat } from './opencode-go.mjs'

function testRuntime(userId = 'test-user') {
  return {
    authService: {
      handleRequest: async (_req, res) => {
        res.writeHead(404)
        res.end()
      },
      getSession: async () => ({
        user: { id: userId, name: 'Test User' },
        session: { id: 'test-session' },
      }),
    },
    conversationStore: {},
  }
}

function startServer(context, options) {
  return createVisionAiServer(options).then(async (server) => {
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    context.after(() => server.close())
    const address = server.address()
    return `http://127.0.0.1:${address.port}`
  })
}

test('streams all three OpenCode Go chat-completions models through one credential', async (context) => {
  const requests = []
  const encoder = new TextEncoder()
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl: async (url, options) => {
      requests.push({ url, options, body: JSON.parse(options.body) })
      return new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(': keep-alive\n\n'))
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"reasoning_content":"先分析"}}]}\n\n',
          ))
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"content":"## 结论\\n\\n可以执行。"}}],"usage":{"total_tokens":12}}\n\n',
          ))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    },
    runtime: testRuntime(),
  })

  const models = ['kimi-k3', 'deepseek-v4-flash', 'glm-5.2']
  for (const model of models) {
    const response = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: '请分析' }],
        thinking: true,
        reasoningEffort: 'max',
      }),
    })
    const stream = await response.text()
    assert.equal(response.status, 200)
    assert.match(stream, /event: reasoning/)
    assert.match(stream, /先分析/)
    assert.match(stream, /event: content/)
    assert.match(stream, /## 结论/)
    assert.match(stream, /event: done/)
  }

  assert.equal(requests.length, 3)
  for (const [index, model] of models.entries()) {
    const request = requests[index]
    assert.equal(request.url, 'https://opencode.ai/zen/go/v1/chat/completions')
    assert.equal(request.options.headers.Authorization, 'Bearer opencode-test-key')
    assert.equal(request.body.model, model)
    assert.equal(request.body.reasoning_effort, 'max')
    assert.equal(request.body.messages[0].role, 'system')
    assert.match(request.body.messages[0].content, /通用 AI 对话助手/)
    assert.doesNotMatch(request.body.messages[0].content, /软件研发团队|代码质量|流水线/)
    assert.equal(request.body.messages[1].content, '请分析')
  }
})

test('returns an explicit fallback when reasoning ends without answer content', async (context) => {
  const encoder = new TextEncoder()
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl: async () => new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(
          'data: {"choices":[{"delta":{"reasoning_content":"正在推理"}}]}\n\n',
        ))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    }),
    runtime: testRuntime(),
  })

  const response = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kimi-k3',
      messages: [{ role: 'user', content: '请回答' }],
      thinking: true,
    }),
  })
  const stream = await response.text()

  assert.equal(response.status, 200)
  assert.match(stream, /event: reasoning/)
  assert.match(stream, /event: incomplete/)
  assert.match(stream, /未能生成最终回答/)
  assert.doesNotMatch(stream, /event: done/)
})

test('reports provider timeout as its own stream event', async (context) => {
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
      AI_REQUEST_TIMEOUT_MS: '20',
    },
    fetchImpl: async (_url, options) => new Promise((_resolve, reject) => {
      const abort = () => {
        const error = new Error('aborted')
        error.name = 'AbortError'
        reject(error)
      }
      if (options.signal.aborted) abort()
      else options.signal.addEventListener('abort', abort, { once: true })
    }),
    runtime: testRuntime(),
  })

  const response = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kimi-k3',
      messages: [{ role: 'user', content: '请回答' }],
      thinking: true,
    }),
  })
  const stream = await response.text()

  assert.equal(response.status, 200)
  assert.match(stream, /event: timeout/)
  assert.match(stream, /回答超时/)
  assert.doesNotMatch(stream, /已停止生成/)
})

test('classifies a client-side manual stop separately from timeout', async (context) => {
  let resolveTerminationReason
  const terminationReason = new Promise((resolve) => {
    resolveTerminationReason = resolve
  })
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
      AI_REQUEST_TIMEOUT_MS: '1000',
    },
    fetchImpl: async (_url, options) => new Promise((_resolve, reject) => {
      const abort = () => {
        resolveTerminationReason(options.signal.reason)
        const error = new Error('aborted')
        error.name = 'AbortError'
        reject(error)
      }
      if (options.signal.aborted) abort()
      else options.signal.addEventListener('abort', abort, { once: true })
    }),
    runtime: testRuntime(),
  })
  const controller = new AbortController()
  const response = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kimi-k3',
      messages: [{ role: 'user', content: '请回答' }],
      thinking: true,
    }),
    signal: controller.signal,
  })

  controller.abort()
  await assert.rejects(response.text(), { name: 'AbortError' })
  assert.equal(await terminationReason, 'client')
})

test('sends Kimi K3 images through the OpenCode Go Chat Completions endpoint', async () => {
  let upstream
  const result = await completeOpenCodeGoChat({
    apiKey: 'opencode-test-key',
    fetchImpl: async (url, options) => {
      upstream = { url, options, body: JSON.parse(options.body) }
      return Response.json({
        choices: [{ message: { content: '图片中显示登录界面。' } }],
      })
    },
    images: [{ data: 'aW1hZ2U=', mimeType: 'image/png' }],
    prompt: '描述图片',
  })

  assert.equal(result, '图片中显示登录界面。')
  assert.equal(upstream.url, 'https://opencode.ai/zen/go/v1/chat/completions')
  assert.equal(upstream.options.headers.Authorization, 'Bearer opencode-test-key')
  assert.equal(upstream.body.model, 'kimi-k3')
  assert.equal(upstream.body.stream, false)
  assert.deepEqual(upstream.body.messages[0].content, [
    { type: 'text', text: '描述图片' },
    {
      type: 'image_url',
      image_url: { url: 'data:image/png;base64,aW1hZ2U=' },
    },
  ])
})

test('rejects models outside the server allowlist', async (context) => {
  let upstreamCalled = false
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl: async () => {
      upstreamCalled = true
      throw new Error('must not be called')
    },
    runtime: testRuntime(),
  })

  const response = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'arbitrary-provider-model',
      messages: [{ role: 'user', content: '你好' }],
      thinking: false,
    }),
  })

  assert.equal(response.status, 400)
  assert.deepEqual(await response.json(), { error: '不支持所选模型。' })
  assert.equal(upstreamCalled, false)
})

test('lists only the three OpenCode Go models without exposing its credential', async (context) => {
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-secret',
      AI_DEFAULT_MODEL: 'deepseek-v4-flash',
    },
    runtime: testRuntime(),
  })

  const response = await fetch(`${baseUrl}/api/ai/models`)
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.defaultModel, 'deepseek-v4-flash')
  assert.deepEqual(
    payload.models.map((model) => [
      model.id,
      model.provider,
      model.available,
      model.supportsThinking,
    ]),
    [
      ['kimi-k3', 'opencode-go', true, true],
      ['deepseek-v4-flash', 'opencode-go', true, true],
      ['glm-5.2', 'opencode-go', true, true],
    ],
  )
  assert.doesNotMatch(JSON.stringify(payload), /secret/)
})

test('reports whether the OpenCode Go key is configured', async (context) => {
  const baseUrl = await startServer(context, {
    env: {},
    runtime: testRuntime(),
  })

  const response = await fetch(`${baseUrl}/api/health`)

  assert.deepEqual(await response.json(), {
    status: 'ok',
    auth: 'enabled',
    database: 'connected',
    defaultModel: 'deepseek-v4-flash',
    configured: false,
    models: [],
  })
})

test('creates, streams, reloads and previews a Markdown artifact in a conversation', async (context) => {
  const root = mkdtempSync(join(tmpdir(), 'vision-app-artifacts-'))
  const database = new DatabaseSync(':memory:')
  database.exec('CREATE TABLE "user" (id TEXT PRIMARY KEY)')
  database.prepare('INSERT INTO "user" (id) VALUES (?)').run('artifact-user')
  const conversationStore = new ConversationStore(database)
  conversationStore.migrate()
  const artifactStore = new AiArtifactStore(database, {
    VISION_AI_ARTIFACT_DIR: root,
  })
  artifactStore.migrate()
  const conversation = conversationStore.createConversation('artifact-user', '生成文档')
  context.after(() => {
    database.close()
    rmSync(root, { recursive: true, force: true })
  })

  let upstreamBody
  const encoder = new TextEncoder()
  const baseUrl = await startServer(context, {
    env: {
      OPENCODE_GO_API_KEY: 'opencode-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl: async (_url, options) => {
      upstreamBody = JSON.parse(options.body)
      return new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"tool-1","type":"function","function":{"name":"create_markdown_file","arguments":"{\\"filename\\":\\"会议纪要.md\\",\\"description\\":\\"会议结论\\","}}]}}]}\n\n',
          ))
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\\"content\\":\\"# 会议纪要\\\\n\\\\n- 结论 A\\"}"}}]}}]}\n\n',
          ))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } })
    },
    runtime: {
      ...testRuntime('artifact-user'),
      conversationStore,
      artifactStore,
    },
  })

  const streamResponse = await fetch(
    `${baseUrl}/api/ai/conversations/${conversation.id}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: '请生成一个 Markdown 文件',
        model: 'kimi-k3',
        thinking: true,
      }),
    },
  )
  const stream = await streamResponse.text()
  assert.equal(upstreamBody.tool_choice, 'required')
  assert.equal(upstreamBody.tools[0].function.name, 'create_markdown_file')
  assert.equal('reasoning_effort' in upstreamBody, false)
  assert.match(stream, /event: artifact/)
  assert.match(stream, /会议纪要\.md/)
  assert.match(stream, /event: content/)
  assert.match(stream, /event: done/)

  const turnsResponse = await fetch(
    `${baseUrl}/api/ai/conversations/${conversation.id}/messages`,
  )
  const { turns } = await turnsResponse.json()
  assert.equal(turns[0].artifacts.length, 1)
  assert.equal(turns[0].artifacts[0].name, '会议纪要.md')
  const previewResponse = await fetch(`${baseUrl}${turns[0].artifacts[0].previewUrl}`)
  assert.deepEqual(await previewResponse.json(), {
    artifact: turns[0].artifacts[0],
    content: '# 会议纪要\n\n- 结论 A',
  })

  const deepseekConversation = conversationStore.createConversation(
    'artifact-user',
    'DeepSeek 生成文档',
  )
  const deepseekResponse = await fetch(
    `${baseUrl}/api/ai/conversations/${deepseekConversation.id}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: '请生成一个 Markdown 文件',
        model: 'deepseek-v4-flash',
        thinking: true,
      }),
    },
  )
  assert.match(await deepseekResponse.text(), /event: artifact/)
  assert.equal(upstreamBody.tool_choice, 'auto')
  assert.equal('reasoning_effort' in upstreamBody, false)
})
