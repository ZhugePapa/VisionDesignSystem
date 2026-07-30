function eventData(block) {
  const lines = block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())

  return lines.join('\n')
}

async function upstreamError(response) {
  const fallback = `DeepSeek request failed with status ${response.status}`

  try {
    const payload = await response.json()
    return payload?.error?.message || payload?.message || fallback
  } catch {
    return fallback
  }
}

export async function streamDeepSeek({
  apiKey,
  baseUrl = 'https://api.deepseek.com',
  fetchImpl = fetch,
  maxTokens = 4096,
  messages,
  model,
  reasoningEffort = 'high',
  signal,
  systemPrompt,
  thinking = false,
  userId,
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
        ...messages,
      ],
      stream: true,
      max_tokens: maxTokens,
      thinking: { type: thinking ? 'enabled' : 'disabled' },
      ...(thinking ? { reasoning_effort: reasoningEffort } : {}),
      ...(userId ? { user_id: userId } : {}),
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(await upstreamError(response))
  }

  if (!response.body) {
    throw new Error('DeepSeek returned an empty response stream')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let usage

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n')

    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      if (!block.trim() || block.trimStart().startsWith(':')) continue

      const data = eventData(block)
      if (!data) continue
      if (data === '[DONE]') {
        onEvent('done', { usage })
        return
      }

      let payload
      try {
        payload = JSON.parse(data)
      } catch {
        continue
      }

      if (payload.error) {
        throw new Error(payload.error.message || 'DeepSeek stream returned an error')
      }

      usage = payload.usage ?? usage
      const delta = payload.choices?.[0]?.delta
      if (delta?.reasoning_content) {
        onEvent('reasoning', { content: delta.reasoning_content })
      }
      if (delta?.content) {
        onEvent('content', { content: delta.content })
      }
    }

    if (done) break
  }

  onEvent('done', { usage })
}
