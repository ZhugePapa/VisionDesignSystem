function eventData(block) {
  return block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
}

async function upstreamError(response) {
  const fallback = `OpenCode Go request failed with status ${response.status}`

  try {
    const payload = await response.json()
    return payload?.error?.message || payload?.error || payload?.message || fallback
  } catch {
    return fallback
  }
}

function contentText(value) {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .map((part) => (typeof part === 'string' ? part : part?.text || ''))
    .join('')
}

function reasoningText(delta) {
  if (typeof delta?.reasoning_content === 'string') return delta.reasoning_content
  if (typeof delta?.reasoning === 'string') return delta.reasoning
  if (!Array.isArray(delta?.reasoning_details)) return ''
  return delta.reasoning_details
    .map((part) => part?.text || part?.summary || '')
    .join('')
}

function chatMessage(message) {
  return {
    role: message.role,
    content: message.images?.length
      ? [
          { type: 'text', text: message.content },
          ...message.images.map((image) => ({
            type: 'image_url',
            image_url: { url: `data:${image.mimeType};base64,${image.data}` },
          })),
        ]
      : message.content,
  }
}

async function readSse(response, handlePayload) {
  if (!response.body) {
    throw new Error('OpenCode Go returned an empty response stream')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n')

    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''
    for (const block of blocks) {
      if (!block.trim() || block.trimStart().startsWith(':')) continue
      const data = eventData(block)
      if (data) handlePayload(data)
    }

    if (done) break
  }

  const remaining = eventData(buffer)
  if (remaining) handlePayload(remaining)
}

export async function streamOpenCodeGoChat({
  apiKey,
  baseUrl = 'https://opencode.ai/zen/go/v1',
  fetchImpl = fetch,
  maxTokens = 4096,
  messages,
  model,
  reasoningEffort = 'high',
  signal,
  systemPrompt,
  thinking = false,
  toolChoice,
  tools,
  onEvent,
}) {
  const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(chatMessage),
      ],
      stream: true,
      max_tokens: maxTokens,
      ...(thinking ? { reasoning_effort: reasoningEffort } : {}),
      ...(Array.isArray(tools) && tools.length ? { tools } : {}),
      ...(toolChoice ? { tool_choice: toolChoice } : {}),
    }),
    signal,
  })

  if (!response.ok) throw new Error(await upstreamError(response))

  let usage
  let doneSent = false
  const toolCalls = []
  let toolCallsSent = false
  const emitToolCalls = () => {
    if (toolCallsSent || !toolCalls.length) return
    onEvent('tool_calls', {
      toolCalls: toolCalls.map((call) => ({
        id: call.id,
        type: call.type || 'function',
        function: {
          name: call.function?.name || '',
          arguments: call.function?.arguments || '',
        },
      })),
    })
    toolCallsSent = true
  }
  await readSse(response, (data) => {
    if (data === '[DONE]') {
      emitToolCalls()
      if (!doneSent) onEvent('done', { usage })
      doneSent = true
      return
    }

    let payload
    try {
      payload = JSON.parse(data)
    } catch {
      return
    }
    if (payload.error) {
      throw new Error(payload.error.message || payload.error || 'OpenCode Go stream returned an error')
    }

    usage = payload.usage ?? usage
    const delta = payload.choices?.[0]?.delta
    const reasoning = reasoningText(delta)
    const content = contentText(delta?.content)
    for (const fragment of delta?.tool_calls ?? []) {
      const index = Number.isInteger(fragment?.index) ? fragment.index : toolCalls.length
      toolCalls[index] ??= { id: '', type: 'function', function: { name: '', arguments: '' } }
      const call = toolCalls[index]
      if (fragment?.id) call.id = fragment.id
      if (fragment?.type) call.type = fragment.type
      if (fragment?.function?.name) call.function.name += fragment.function.name
      if (fragment?.function?.arguments) call.function.arguments += fragment.function.arguments
    }
    if (reasoning) onEvent('reasoning', { content: reasoning })
    if (content) onEvent('content', { content })
  })

  emitToolCalls()
  if (!doneSent) onEvent('done', { usage })
}

export async function completeOpenCodeGoChat({
  apiKey,
  baseUrl = 'https://opencode.ai/zen/go/v1',
  fetchImpl = fetch,
  images = [],
  maxTokens = 2048,
  model = 'kimi-k3',
  prompt,
  signal,
}) {
  const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          ...images.map((image) => ({
            type: 'image_url',
            image_url: { url: `data:${image.mimeType};base64,${image.data}` },
          })),
        ],
      }],
      stream: false,
      max_tokens: maxTokens,
    }),
    signal,
  })

  if (!response.ok) throw new Error(await upstreamError(response))
  const payload = await response.json()
  return contentText(payload?.choices?.[0]?.message?.content).trim()
}
