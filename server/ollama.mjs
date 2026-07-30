async function upstreamError(response) {
  const fallback = `Ollama request failed with status ${response.status}`

  try {
    const payload = await response.json()
    return payload?.error || payload?.message || fallback
  } catch {
    return fallback
  }
}

export async function streamOllama({
  apiKey,
  baseUrl = 'https://ollama.com',
  fetchImpl = fetch,
  maxTokens = 4096,
  messages,
  model,
  signal,
  systemPrompt,
  thinking = false,
  onEvent,
}) {
  const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
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
      think: thinking,
      options: {
        num_predict: maxTokens,
      },
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(await upstreamError(response))
  }

  if (!response.body) {
    throw new Error('Ollama returned an empty response stream')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let doneSent = false

  const processLine = (line) => {
    if (!line.trim()) return

    let payload
    try {
      payload = JSON.parse(line)
    } catch {
      return
    }

    if (payload.error) {
      throw new Error(typeof payload.error === 'string' ? payload.error : 'Ollama stream returned an error')
    }

    if (payload.message?.thinking) {
      onEvent('reasoning', { content: payload.message.thinking })
    }
    if (payload.message?.content) {
      onEvent('content', { content: payload.message.content })
    }
    if (payload.done && !doneSent) {
      doneSent = true
      onEvent('done', {
        usage: {
          promptTokens: payload.prompt_eval_count,
          completionTokens: payload.eval_count,
        },
      })
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n')

    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    lines.forEach(processLine)

    if (done) break
  }

  processLine(buffer)
  if (!doneSent) onEvent('done', {})
}
