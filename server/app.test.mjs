import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'

import { createVisionAiServer } from './app.mjs'
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
    assert.equal(request.body.messages[1].content, '请分析')
  }
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
