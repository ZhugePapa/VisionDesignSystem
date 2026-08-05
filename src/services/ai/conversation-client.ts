import type {
  VisAiActionFeedback,
  VisAiArtifactItem,
  VisAiAttachmentItem,
  VisAiKey,
} from '../../components/ai'
import type {
  VisionAiReasoningEffort,
  VisionAiStreamHandlers,
} from './chat-client'

export type VisionAiTurnStatus = 'streaming' | 'done' | 'stopped' | 'timeout' | 'error'

export interface VisionAiConversation {
  id: string
  title: string
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export interface VisionAiAnswerVariant {
  answer: string
  reasoning: string
}

export interface VisionAiTurn {
  id: string
  question: string
  answer: string
  reasoning: string
  model: VisAiKey
  status: VisionAiTurnStatus
  thinking: boolean
  thinkingExpanded: boolean
  feedback: VisAiActionFeedback
  answerVariants: VisionAiAnswerVariant[]
  answerIndex: number
  attachments: VisAiAttachmentItem[]
  artifacts: VisAiArtifactItem[]
  createdAt: string
  updatedAt: string
}

export interface VisionAiConversationStreamRequest {
  question?: string
  regenerateTurnId?: string
  model: string
  thinking: boolean
  reasoningEffort: VisionAiReasoningEffort
  attachments?: VisAiAttachmentItem[]
}

export interface VisionAiConversationStreamHandlers extends VisionAiStreamHandlers {
  onStart?: (payload: { conversationId: string; turnId: string }) => void
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    if ('error' in payload && typeof payload.error === 'string') {
      return payload.error
    }
    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message
    }
  }
  return fallback
}

async function responseError(response: Response): Promise<Error> {
  const fallback = `Request failed with status ${response.status}`

  try {
    return new Error(messageFromPayload(await response.json(), fallback))
  } catch {
    return new Error(fallback)
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) throw await responseError(response)
  return response.json() as Promise<T>
}

export async function fetchVisionAiConversations(): Promise<VisionAiConversation[]> {
  const payload = await requestJson<{ conversations: VisionAiConversation[] }>(
    '/api/ai/conversations',
  )
  return payload.conversations
}

export async function createVisionAiConversation(
  title: string,
): Promise<VisionAiConversation> {
  const payload = await requestJson<{ conversation: VisionAiConversation }>(
    '/api/ai/conversations',
    {
      method: 'POST',
      body: JSON.stringify({ title }),
    },
  )
  return payload.conversation
}

export async function fetchVisionAiTurns(
  conversationId: string,
): Promise<VisionAiTurn[]> {
  const payload = await requestJson<{ turns: VisionAiTurn[] }>(
    `/api/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
  )
  return payload.turns
}

export async function updateVisionAiConversation(
  conversationId: string,
  patch: Partial<Pick<VisionAiConversation, 'title' | 'pinned'>>,
): Promise<VisionAiConversation> {
  const payload = await requestJson<{ conversation: VisionAiConversation }>(
    `/api/ai/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(patch),
    },
  )
  return payload.conversation
}

export async function deleteVisionAiConversation(
  conversationId: string,
): Promise<void> {
  const response = await fetch(
    `/api/ai/conversations/${encodeURIComponent(conversationId)}`,
    { method: 'DELETE' },
  )
  if (!response.ok) throw await responseError(response)
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
    data
    && typeof data === 'object'
    && 'content' in data
    && typeof data.content === 'string'
  ) {
    return data.content
  }
  return ''
}

function startPayload(data: unknown): { conversationId: string; turnId: string } | null {
  if (
    data
    && typeof data === 'object'
    && 'conversationId' in data
    && typeof data.conversationId === 'string'
    && 'turnId' in data
    && typeof data.turnId === 'string'
  ) {
    return {
      conversationId: data.conversationId,
      turnId: data.turnId,
    }
  }
  return null
}

function artifactFromEvent(data: unknown): VisAiArtifactItem | null {
  if (
    data
    && typeof data === 'object'
    && 'artifact' in data
    && data.artifact
    && typeof data.artifact === 'object'
    && 'id' in data.artifact
    && typeof data.artifact.id === 'string'
  ) {
    return data.artifact as VisAiArtifactItem
  }
  return null
}

export async function streamVisionAiConversation(
  conversationId: string,
  request: VisionAiConversationStreamRequest,
  handlers: VisionAiConversationStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    `/api/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    },
  )

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

      if (parsed.event === 'start') {
        const payload = startPayload(parsed.data)
        if (payload) handlers.onStart?.(payload)
      } else if (parsed.event === 'reasoning') {
        handlers.onReasoning?.(contentFromEvent(parsed.data))
      } else if (parsed.event === 'content') {
        handlers.onContent?.(contentFromEvent(parsed.data))
      } else if (parsed.event === 'incomplete') {
        handlers.onIncomplete?.(contentFromEvent(parsed.data))
      } else if (parsed.event === 'timeout') {
        handlers.onTimeout?.(contentFromEvent(parsed.data))
      } else if (parsed.event === 'artifact') {
        const artifact = artifactFromEvent(parsed.data)
        if (artifact) handlers.onArtifact?.(artifact)
      } else if (parsed.event === 'done') {
        handlers.onDone?.()
      } else if (parsed.event === 'error') {
        throw new Error(messageFromPayload(parsed.data, 'AI stream returned an error'))
      }
    }

    if (done) break
  }
}
