import assert from 'node:assert/strict'
import test from 'node:test'

import { streamOpenCodeGoChat } from './opencode-go.mjs'

test('reassembles streamed OpenCode Go tool call fragments without losing content', async () => {
  const encoder = new TextEncoder()
  const events = []
  let requestBody
  await streamOpenCodeGoChat({
    apiKey: 'test-key',
    model: 'kimi-k3',
    messages: [{ role: 'user', content: '生成 Markdown 文件' }],
    systemPrompt: 'test',
    thinking: true,
    tools: [{
      type: 'function',
      function: {
        name: 'create_markdown_file',
        parameters: { type: 'object' },
      },
    }],
    toolChoice: 'required',
    fetchImpl: async (_url, options) => {
      requestBody = JSON.parse(options.body)
      return new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call-1","type":"function","function":{"name":"create_markdown_file","arguments":"{\\"filename\\":\\"总结.md\\","}}]}}]}\n\n',
          ))
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\\"content\\":\\"# 总结\\\\n\\\\n内容\\"}"}}]}}]}\n\n',
          ))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    },
    onEvent: (event, payload) => events.push({ event, payload }),
  })

  assert.equal(requestBody.tool_choice, 'required')
  assert.equal(requestBody.tools[0].function.name, 'create_markdown_file')
  const toolEvent = events.find((event) => event.event === 'tool_calls')
  assert.ok(toolEvent)
  assert.equal(toolEvent.payload.toolCalls[0].id, 'call-1')
  assert.deepEqual(
    JSON.parse(toolEvent.payload.toolCalls[0].function.arguments),
    { filename: '总结.md', content: '# 总结\n\n内容' },
  )
  assert.equal(events.at(-1).event, 'done')
})
