import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'

import { createVisionAiServer } from './app.mjs'

test('streams normalized DeepSeek reasoning and markdown content', async (context) => {
  let upstreamBody
  const encoder = new TextEncoder()
  const fetchImpl = async (_url, options) => {
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

  const server = createVisionAiServer({
    env: {
      DEEPSEEK_API_KEY: 'test-key',
      AI_RATE_LIMIT_PER_MINUTE: '100',
    },
    fetchImpl,
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'must-not-be-forwarded',
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
  assert.equal(upstreamBody.model, 'deepseek-v4-flash')
  assert.equal(upstreamBody.thinking.type, 'enabled')
  assert.equal(upstreamBody.reasoning_effort, 'max')
  assert.equal(upstreamBody.messages[0].role, 'system')
  assert.equal(upstreamBody.messages[1].content, '请分析')
})

test('reports whether the server key is configured', async (context) => {
  const server = createVisionAiServer({ env: {} })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`)

  assert.deepEqual(await response.json(), {
    status: 'ok',
    model: 'deepseek-v4-flash',
    configured: false,
  })
})
