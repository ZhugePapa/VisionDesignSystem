export type VisionAiMessageRole = 'user' | 'assistant'
export type VisionAiReasoningEffort = 'high' | 'max'

export interface VisionAiMessage {
  role: VisionAiMessageRole
  content: string
}

export interface VisionAiChatRequest {
  model: string
  messages: VisionAiMessage[]
  thinking: boolean
  reasoningEffort: VisionAiReasoningEffort
}

export interface VisionAiModel {
  id: string
  label: string
  provider: 'opencode-go'
  available: boolean
  supportsThinking: boolean
}

export interface VisionAiModelCatalog {
  defaultModel: string
  models: VisionAiModel[]
}

export interface VisionAiStreamHandlers {
  onReasoning?: (content: string) => void
  onContent?: (content: string) => void
  onDone?: () => void
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    typeof payload.error === 'string'
  ) {
    return payload.error
  }
  return fallback
}

async function responseError(response: Response): Promise<Error> {
  const fallback = `AI request failed with status ${response.status}`

  try {
    return new Error(messageFromPayload(await response.json(), fallback))
  } catch {
    return new Error(fallback)
  }
}

export async function fetchVisionAiModels(): Promise<VisionAiModelCatalog> {
  const response = await fetch('/api/ai/models', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) throw await responseError(response)
  return response.json() as Promise<VisionAiModelCatalog>
}

function parseEventBlock(block: string): { event: string; data: unknown } | null {
  let event = 'message'
  const dataLines: string[] = []

  for (const line of block.split('\n')) {
    if (line.startsWith(':')) continue
    if (line.startsWith('event:')) event = line.slice(6).trim()
    if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
  }

  if (!dataLines.length) return null

  try {
    return { event, data: JSON.parse(dataLines.join('\n')) }
  } catch {
    return null
  }
}

function contentFromEvent(data: unknown): string {
  if (
    data &&
    typeof data === 'object' &&
    'content' in data &&
    typeof data.content === 'string'
  ) {
    return data.content
  }
  return ''
}

export async function streamVisionAiChat(
  request: VisionAiChatRequest,
  handlers: VisionAiStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) throw await responseError(response)
  if (!response.body) throw new Error('AI service returned an empty stream')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n')

    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      const parsed = parseEventBlock(block)
      if (!parsed) continue

      if (parsed.event === 'reasoning') {
        handlers.onReasoning?.(contentFromEvent(parsed.data))
      } else if (parsed.event === 'content') {
        handlers.onContent?.(contentFromEvent(parsed.data))
      } else if (parsed.event === 'done') {
        handlers.onDone?.()
      } else if (parsed.event === 'error') {
        throw new Error(messageFromPayload(parsed.data, 'AI stream returned an error'))
      }
    }

    if (done) break
  }
}
