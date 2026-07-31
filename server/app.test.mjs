import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'

import { createVisionAiServer } from './app.mjs'

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

test('streams normalized DeepSeek reasoning and markdown content for the selected model', async (context) => {
  let upstreamUrl
  let upstreamBody
  const encoder = new TextEncoder()
  const fetchImpl = async (url, options) => {
    upstreamUrl = url
    upstreamBody = JSON.parse(options.body)

    return new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(': keep-alive\n\n'))
        controller.enqueue(encoder.encode(
          'data: {"choices":[{"delta":{"reasoning_content":"先分析"}}]}\n\n',
        ))
        controller.enqueue(encoder.encode(
          'data: {"choices":[{"delta":{"content":"## 结论\\n\\n"}}]}\n\n',
        ))
        controller.enqueue(encoder.encode(
          'data: {"choices":[{"delta":{"content":"可以执行。"}}],"usage":{"total_tokens":12}}\n\n',
        ))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    })
  }

  const server = await createVisionAiServer({
    env: {
      DEEPSEEK_API_KEY: 'test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl,
    runtime: testRuntime(),
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-v4-pro',
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
  assert.equal(upstreamUrl, 'https://api.deepseek.com/chat/completions')
  assert.equal(upstreamBody.model, 'deepseek-v4-pro')
  assert.equal(upstreamBody.thinking.type, 'enabled')
  assert.equal(upstreamBody.reasoning_effort, 'max')
  assert.equal(upstreamBody.messages[0].role, 'system')
  assert.equal(upstreamBody.messages[1].content, '请分析')
})

test('streams normalized Ollama thinking and content for a cloud model', async (context) => {
  let upstreamUrl
  let upstreamOptions
  const encoder = new TextEncoder()
  const fetchImpl = async (url, options) => {
    upstreamUrl = url
    upstreamOptions = options

    return new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(
          '{"message":{"thinking":"先理解问题"},"done":false}\n',
        ))
        controller.enqueue(encoder.encode(
          '{"message":{"content":"## 建议\\n"},"done":false}\n',
        ))
        controller.enqueue(encoder.encode(
          '{"message":{"content":"开始执行。"},"done":true,"prompt_eval_count":8,"eval_count":5}\n',
        ))
        controller.close()
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

  const server = await createVisionAiServer({
    env: {
      OLLAMA_API_KEY: 'ollama-test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl,
    runtime: testRuntime(),
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'glm-5.2',
      messages: [{ role: 'user', content: '制定计划' }],
      thinking: true,
      reasoningEffort: 'high',
    }),
  })
  const stream = await response.text()
  const upstreamBody = JSON.parse(upstreamOptions.body)

  assert.equal(response.status, 200)
  assert.equal(upstreamUrl, 'https://ollama.com/api/chat')
  assert.equal(upstreamOptions.headers.Authorization, 'Bearer ollama-test-key')
  assert.equal(upstreamBody.model, 'glm-5.2')
  assert.equal(upstreamBody.think, true)
  assert.equal(upstreamBody.messages[0].role, 'system')
  assert.match(stream, /event: reasoning/)
  assert.match(stream, /先理解问题/)
  assert.match(stream, /event: content/)
  assert.match(stream, /## 建议/)
  assert.match(stream, /event: done/)
})

test('rejects models outside the server allowlist', async (context) => {
  let upstreamCalled = false
  const server = await createVisionAiServer({
    env: {
      DEEPSEEK_API_KEY: 'test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl: async () => {
      upstreamCalled = true
      throw new Error('must not be called')
    },
    runtime: testRuntime(),
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/ai/chat`, {
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

test('lists model availability without exposing credentials', async (context) => {
  const server = await createVisionAiServer({
    env: {
      DEEPSEEK_API_KEY: 'deepseek-secret',
      OLLAMA_API_KEY: 'ollama-secret',
      AI_DEFAULT_MODEL: 'kimi-k2.7-code',
    },
    runtime: testRuntime(),
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/ai/models`)
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.defaultModel, 'kimi-k2.7-code')
  assert.deepEqual(
    payload.models.map((model) => [model.id, model.available]),
    [
      ['deepseek-v4-flash', true],
      ['deepseek-v4-pro', true],
      ['glm-5.2', true],
      ['kimi-k2.7-code', true],
    ],
  )
  assert.doesNotMatch(JSON.stringify(payload), /secret/)
})

test('can disable an account-gated model without removing it from the catalog', async (context) => {
  const server = await createVisionAiServer({
    env: {
      OLLAMA_API_KEY: 'ollama-secret',
      OLLAMA_KIMI_ENABLED: 'false',
      AI_DEFAULT_MODEL: 'kimi-k2.7-code',
    },
    runtime: testRuntime(),
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const catalogResponse = await fetch(`http://127.0.0.1:${address.port}/api/ai/models`)
  const catalog = await catalogResponse.json()
  const kimi = catalog.models.find((model) => model.id === 'kimi-k2.7-code')

  assert.equal(catalog.defaultModel, 'glm-5.2')
  assert.equal(kimi.available, false)

  const chatResponse = await fetch(`http://127.0.0.1:${address.port}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kimi-k2.7-code',
      messages: [{ role: 'user', content: '你好' }],
      thinking: false,
    }),
  })

  assert.equal(chatResponse.status, 503)
  assert.deepEqual(await chatResponse.json(), { error: 'Kimi K2.7 Code 当前未启用。' })
})

test('reports whether the server key is configured', async (context) => {
  const server = await createVisionAiServer({
    env: {},
    runtime: testRuntime(),
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`)

  assert.deepEqual(await response.json(), {
    status: 'ok',
    auth: 'enabled',
    database: 'connected',
    defaultModel: 'deepseek-v4-flash',
    configured: false,
    models: [],
  })
})
