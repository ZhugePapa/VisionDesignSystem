import { createServer } from 'node:http'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { createAuthService } from './auth.mjs'
import { ConversationStore } from './conversations.mjs'
import {
  AiFileStore,
  attachmentContext,
  imagePayload,
  receiveMultipartFiles,
} from './files.mjs'
import {
  defaultAiModelId,
  listAiModels,
  resolveAiModel,
} from './models.mjs'
import { completeOpenCodeGoChat, streamOpenCodeGoChat } from './opencode-go.mjs'

const DEFAULT_SYSTEM_PROMPT = `你是 Vision Design System 演示应用中的“小 VI 智能助理”。
你主要帮助软件研发团队分析项目、需求、代码质量、流水线和交付风险。
请使用简体中文回答，优先给出清晰、可执行的结论。
回答使用 Markdown；不要编造当前项目中没有提供的数据，信息不足时明确说明。`

const MAX_BODY_BYTES = 256 * 1024
const MAX_MESSAGES = 24
const MAX_MESSAGE_CHARS = 12_000
const MAX_CONTEXT_MESSAGE_CHARS = 120_000
const MAX_TOTAL_CHARS = 300_000
const MAX_ATTACHMENTS = 12

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function json(res, status, payload) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(payload))
}

function sse(res, event, payload) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`)
}

function requestIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

async function readJson(req) {
  const chunks = []
  let size = 0

  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large')
      error.statusCode = 413
      throw error
    }
    chunks.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const error = new Error('Request body must be valid JSON')
    error.statusCode = 400
    throw error
  }
}

function validatedMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) {
    throw new Error(`messages must contain between 1 and ${MAX_MESSAGES} items`)
  }

  let totalChars = 0
  const messages = input.map((message) => {
    if (!message || !['user', 'assistant'].includes(message.role)) {
      throw new Error('message role must be user or assistant')
    }
    if (typeof message.content !== 'string') {
      throw new Error('message content must be a string')
    }

    const content = message.content.trim()
    if (!content || content.length > MAX_CONTEXT_MESSAGE_CHARS) {
      throw new Error(`message content must contain 1 to ${MAX_CONTEXT_MESSAGE_CHARS} characters`)
    }

    totalChars += content.length
    return { role: message.role, content }
  })

  if (totalChars > MAX_TOTAL_CHARS) {
    throw new Error(`conversation exceeds ${MAX_TOTAL_CHARS} characters`)
  }
  if (!messages.some((message) => message.role === 'user')) {
    throw new Error('conversation must contain a user message')
  }

  return messages
}

function validatedQuestion(value) {
  if (typeof value !== 'string') throw new Error('question must be a string')
  const question = value.trim()
  if (!question || question.length > MAX_MESSAGE_CHARS) {
    throw new Error(`question must contain 1 to ${MAX_MESSAGE_CHARS} characters`)
  }
  return question
}

function validatedAttachments(value) {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.length > MAX_ATTACHMENTS) {
    throw new Error(`attachments must contain at most ${MAX_ATTACHMENTS} items`)
  }

  return value.map((attachment) => {
    if (!attachment || typeof attachment !== 'object') {
      throw new Error('attachment must be an object')
    }

    return {
      key: String(attachment.key ?? ''),
      fileId: String(attachment.fileId ?? attachment.key ?? ''),
      name: String(attachment.name ?? '').slice(0, 255),
      type: attachment.type === 'image' ? 'image' : 'file',
      extension: String(attachment.extension ?? '').slice(0, 24),
      fileIconType: String(attachment.fileIconType ?? '').slice(0, 24),
      size: String(attachment.size ?? '').slice(0, 40),
      url: String(attachment.url ?? '').slice(0, 2_048),
      alt: String(attachment.alt ?? '').slice(0, 255),
      status: attachment.status === 'ready' ? 'ready' : undefined,
      removable: false,
    }
  })
}

function createRateLimiter(limitPerMinute) {
  const clients = new Map()

  return (key) => {
    const now = Date.now()
    const windowStart = now - 60_000
    const recent = (clients.get(key) ?? []).filter((timestamp) => timestamp > windowStart)
    recent.push(now)
    clients.set(key, recent)

    if (clients.size > 2_000) {
      for (const [clientKey, timestamps] of clients) {
        if (!timestamps.some((timestamp) => timestamp > windowStart)) {
          clients.delete(clientKey)
        }
      }
    }

    return recent.length <= limitPerMinute
  }
}

function routeId(pathname, suffix = '') {
  const escapedSuffix = suffix.replaceAll('/', '\\/')
  const match = pathname.match(new RegExp(
    `^\\/api\\/ai\\/conversations\\/([^/]+)${escapedSuffix}$`,
  ))
  return match ? decodeURIComponent(match[1]) : null
}

function fileRouteId(pathname, suffix = '') {
  const escapedSuffix = suffix.replaceAll('/', '\\/')
  const match = pathname.match(new RegExp(
    `^\\/api\\/ai\\/files\\/([^/]+)${escapedSuffix}$`,
  ))
  return match ? decodeURIComponent(match[1]) : null
}

function originAllowed(req, allowedOrigin) {
  const origin = req.headers.origin?.replace(/\/$/, '')
  return !allowedOrigin || !origin || origin === allowedOrigin
}

function createStreamController(req, res, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  req.once('aborted', () => controller.abort())
  res.once('close', () => {
    if (!res.writableEnded) controller.abort()
  })
  return {
    controller,
    dispose: () => clearTimeout(timeout),
  }
}

function openEventStream(res) {
  res.writeHead(200, {
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream; charset=utf-8',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders()
}

async function streamProvider({
  body,
  controller,
  env,
  fetchImpl,
  maxTokens,
  messages,
  model,
  onEvent,
}) {
  await streamOpenCodeGoChat({
    apiKey: model.apiKey,
    baseUrl: model.baseUrl,
    fetchImpl,
    maxTokens,
    messages,
    model: model.upstreamModel,
    reasoningEffort: body.reasoningEffort === 'max' ? 'max' : 'high',
    signal: controller.signal,
    systemPrompt: env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT,
    thinking: body.thinking === true,
    onEvent,
  })
}

async function describeImages({
  env,
  fetchImpl,
  files,
  userId,
  fileStore,
}) {
  const apiKey = env.OPENCODE_GO_API_KEY
  if (!apiKey) {
    const error = new Error('当前模型不能直接读取图片，且服务器尚未配置图片预解析模型。')
    error.statusCode = 503
    throw error
  }
  const description = await completeOpenCodeGoChat({
    apiKey,
    baseUrl: env.OPENCODE_GO_BASE_URL,
    fetchImpl,
    images: imagePayload(files),
    model: 'kimi-k3',
    prompt: [
      '请分析这些图片，为另一个纯文本模型生成可靠的上下文。',
      '逐张给出：文件名、完整可见文字（OCR）、界面或场景结构、关键细节；不要推测不可见信息。',
      `文件名：${files.map((file) => file.name).join('、')}`,
    ].join('\n'),
  })
  if (!description) {
    const error = new Error('图片预解析模型没有返回可用内容。')
    error.statusCode = 502
    throw error
  }
  files.forEach((file, index) => {
    const extractedText = index === 0
      ? `[图片预解析]\n${description}`
      : `[图片预解析]\n该图片与 ${files[0].name} 一并解析，结果见前一附件。`
    fileStore.cacheExtractedText(userId, [file.fileId], extractedText)
    file.extractedText = extractedText
  })
}

async function prepareProviderMessages({
  rows,
  userId,
  fileStore,
  model,
  env,
  fetchImpl,
}) {
  const prepared = []
  for (const row of rows) {
    if (row.role !== 'user' || !fileStore || !row.attachments?.length) {
      prepared.push({ role: row.role, content: row.content })
      continue
    }

    const files = fileStore.resolve(userId, row.attachments)
    const images = files.filter((file) => file.mimeType.startsWith('image/'))
    if (!model.supportsImages) {
      const imagesWithoutContext = images.filter((file) => !file.extractedText)
      if (imagesWithoutContext.length) {
        await describeImages({
          env,
          fetchImpl,
          files: imagesWithoutContext,
          userId,
          fileStore,
        })
      }
    }

    prepared.push({
      role: row.role,
      content: `${row.content}${attachmentContext(files)}`,
      ...(model.supportsImages && images.length
        ? { images: imagePayload(images) }
        : {}),
    })
  }
  return validatedMessages(prepared).map((message, index) => ({
    ...message,
    ...(prepared[index]?.images ? { images: prepared[index].images } : {}),
  }))
}

async function createRuntime(env) {
  const authService = await createAuthService(env)
  const conversationStore = new ConversationStore(authService.database)
  const fileStore = new AiFileStore(authService.database, env)
  conversationStore.migrate()
  fileStore.migrate()
  return { authService, conversationStore, fileStore }
}

export async function createVisionAiServer({
  env = process.env,
  fetchImpl = fetch,
  runtime,
} = {}) {
  const services = runtime ?? await createRuntime(env)
  const { authService, conversationStore, fileStore } = services
  const allowedOrigin = env.AI_ALLOWED_ORIGIN?.replace(/\/$/, '')
  const maxTokens = positiveInteger(env.AI_MAX_TOKENS, 4096)
  const timeoutMs = positiveInteger(env.AI_REQUEST_TIMEOUT_MS, 10 * 60_000)
  const isWithinRateLimit = createRateLimiter(
    positiveInteger(env.AI_RATE_LIMIT_PER_MINUTE, 20),
  )

  const server = createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost')

    try {
      if (url.pathname.startsWith('/api/auth/')) {
        await authService.handleRequest(req, res)
        return
      }

      if (req.method === 'GET' && url.pathname === '/api/health') {
        const models = listAiModels(env)
        json(res, 200, {
          status: 'ok',
          auth: 'enabled',
          database: 'connected',
          defaultModel: defaultAiModelId(env),
          configured: models.some((model) => model.available),
          models: models.filter((model) => model.available).map((model) => model.id),
        })
        return
      }

      if (!originAllowed(req, allowedOrigin)) {
        json(res, 403, { error: 'Origin is not allowed' })
        return
      }

      const session = await authService.getSession(req)
      if (!session?.user?.id) {
        json(res, 401, { error: '请先登录后再使用 AI 助手。' })
        return
      }
      const userId = String(session.user.id)

      if (req.method === 'GET' && url.pathname === '/api/ai/models') {
        json(res, 200, {
          defaultModel: defaultAiModelId(env),
          models: listAiModels(env),
        })
        return
      }

      if (req.method === 'GET' && url.pathname === '/api/ai/conversations') {
        json(res, 200, {
          conversations: conversationStore.listConversations(userId),
        })
        return
      }

      if (req.method === 'POST' && url.pathname === '/api/ai/files') {
        if (!fileStore) {
          json(res, 501, { error: '当前环境未启用附件存储。' })
          return
        }
        const temporaryFiles = await receiveMultipartFiles(
          req,
          join(fileStore.root, '.tmp'),
        )
        const created = []
        try {
          for (const temporaryFile of temporaryFiles) {
            created.push(await fileStore.createFromTemporary(userId, temporaryFile))
          }
        } catch (error) {
          for (const file of created) fileStore.delete(userId, file.fileId)
          for (const file of temporaryFiles.slice(created.length + 1)) {
            try {
              const { unlinkSync } = await import('node:fs')
              unlinkSync(file.temporaryPath)
            } catch {
              // Ignore temporary files already consumed by the parser.
            }
          }
          throw error
        }
        json(res, 201, { files: created })
        return
      }

      const fileContentId = fileRouteId(url.pathname, '/content')
      if (req.method === 'GET' && fileContentId) {
        const file = fileStore?.fileResponse(userId, fileContentId)
        if (!file) {
          json(res, 404, { error: '附件不存在。' })
          return
        }
        const encodedName = encodeURIComponent(file.filename)
        res.writeHead(200, {
          'Cache-Control': 'private, max-age=3600',
          'Content-Disposition': `${file.mimeType.startsWith('image/') ? 'inline' : 'attachment'}; filename*=UTF-8''${encodedName}`,
          'Content-Length': file.size,
          'Content-Type': file.mimeType,
          'X-Content-Type-Options': 'nosniff',
        })
        file.stream.pipe(res)
        return
      }

      const fileId = fileRouteId(url.pathname)
      if (req.method === 'DELETE' && fileId) {
        if (!fileStore?.delete(userId, fileId)) {
          json(res, 404, { error: '附件不存在。' })
          return
        }
        res.writeHead(204, { 'Cache-Control': 'no-store' })
        res.end()
        return
      }

      if (req.method === 'POST' && url.pathname === '/api/ai/conversations') {
        const body = await readJson(req)
        const conversation = conversationStore.createConversation(
          userId,
          body.title,
        )
        json(res, 201, { conversation })
        return
      }

      const messagesConversationId = routeId(url.pathname, '/messages')
      if (
        req.method === 'GET'
        && messagesConversationId
      ) {
        const turns = conversationStore.listTurns(userId, messagesConversationId)
        if (!turns) {
          json(res, 404, { error: '会话不存在。' })
          return
        }
        json(res, 200, { turns })
        return
      }

      const conversationId = routeId(url.pathname)
      if (conversationId && req.method === 'PATCH') {
        const body = await readJson(req)
        const conversation = conversationStore.updateConversation(
          userId,
          conversationId,
          body,
        )
        if (!conversation) {
          json(res, 404, { error: '会话不存在。' })
          return
        }
        json(res, 200, { conversation })
        return
      }

      if (conversationId && req.method === 'DELETE') {
        if (!conversationStore.deleteConversation(userId, conversationId)) {
          json(res, 404, { error: '会话不存在。' })
          return
        }
        res.writeHead(204, { 'Cache-Control': 'no-store' })
        res.end()
        return
      }

      if (
        req.method === 'POST'
        && messagesConversationId
      ) {
        const ip = requestIp(req)
        if (!isWithinRateLimit(`${userId}:${ip}`)) {
          json(res, 429, { error: '请求过于频繁，请稍后再试。' })
          return
        }

        const body = await readJson(req)
        const model = resolveAiModel(body.model, env)
        const requestedAttachments = validatedAttachments(body.attachments)
        const resolvedAttachments = fileStore
          ? fileStore.resolve(userId, requestedAttachments)
          : requestedAttachments
        const attachments = resolvedAttachments.map((attachment) => ({
          key: attachment.key,
          fileId: attachment.fileId,
          name: attachment.name,
          type: attachment.type,
          extension: attachment.extension,
          fileIconType: attachment.fileIconType,
          size: attachment.size,
          url: attachment.url,
          alt: attachment.alt,
          status: 'ready',
          removable: false,
        }))
        let turn

        if (typeof body.regenerateTurnId === 'string' && body.regenerateTurnId) {
          turn = conversationStore.prepareRegeneration(
            userId,
            messagesConversationId,
            body.regenerateTurnId,
          )
        } else {
          turn = conversationStore.createTurn(userId, messagesConversationId, {
            question: validatedQuestion(body.question),
            model: model.id,
            thinking: body.thinking === true,
            attachments,
          })
        }

        if (!turn) {
          json(res, 404, { error: '会话或消息不存在。' })
          return
        }
        if (fileStore && attachments.length) {
          fileStore.markReferenced(
            userId,
            attachments.map((attachment) => attachment.fileId),
          )
        }

        const messageRows = conversationStore.messagesThroughTurn(
          userId,
          messagesConversationId,
          turn.id,
        )
        let messages
        try {
          messages = await prepareProviderMessages({
            rows: messageRows,
            userId,
            fileStore,
            model,
            env,
            fetchImpl,
          })
        } catch (error) {
          conversationStore.updateTurn(
            userId,
            messagesConversationId,
            turn.id,
            { status: 'error' },
          )
          throw error
        }
        const stream = createStreamController(req, res, timeoutMs)
        let answer = ''
        let reasoning = ''

        openEventStream(res)
        sse(res, 'start', {
          conversationId: messagesConversationId,
          turnId: turn.id,
        })

        try {
          await streamProvider({
            body,
            controller: stream.controller,
            env,
            fetchImpl,
            maxTokens,
            messages,
            model,
            onEvent: (event, payload) => {
              if (event === 'reasoning' && typeof payload?.content === 'string') {
                reasoning += payload.content
              }
              if (event === 'content' && typeof payload?.content === 'string') {
                answer += payload.content
              }
              sse(res, event, payload)
            },
          })

          conversationStore.updateTurn(
            userId,
            messagesConversationId,
            turn.id,
            {
              answer,
              reasoning,
              status: 'done',
            },
          )
        } catch (error) {
          const stopped = stream.controller.signal.aborted
          conversationStore.updateTurn(
            userId,
            messagesConversationId,
            turn.id,
            {
              answer,
              reasoning,
              status: stopped ? 'stopped' : 'error',
            },
          )
          if (!stopped && !res.writableEnded) {
            sse(res, 'error', {
              message: error instanceof Error ? error.message : 'AI request failed',
            })
          }
        } finally {
          stream.dispose()
          res.end()
        }
        return
      }

      // Retained for component-level integrations that supply their own history.
      if (req.method === 'POST' && url.pathname === '/api/ai/chat') {
        const ip = requestIp(req)
        if (!isWithinRateLimit(`${userId}:${ip}`)) {
          json(res, 429, { error: '请求过于频繁，请稍后再试。' })
          return
        }

        const body = await readJson(req)
        body.messages = validatedMessages(body.messages)
        const model = resolveAiModel(body.model, env)
        const stream = createStreamController(req, res, timeoutMs)
        openEventStream(res)

        try {
          await streamProvider({
            body,
            controller: stream.controller,
            env,
            fetchImpl,
            maxTokens,
            messages: body.messages,
            model,
            onEvent: (event, payload) => sse(res, event, payload),
          })
        } catch (error) {
          if (!stream.controller.signal.aborted) {
            sse(res, 'error', {
              message: error instanceof Error ? error.message : 'AI request failed',
            })
          }
        } finally {
          stream.dispose()
          res.end()
        }
        return
      }

      json(res, 404, { error: 'Not found' })
    } catch (error) {
      if (!res.headersSent) {
        json(res, error.statusCode || 400, {
          error: error instanceof Error ? error.message : 'Request failed',
        })
      } else {
        res.end()
      }
    }
  })

  if (typeof authService.close === 'function') {
    server.once('close', () => authService.close())
  }

  return server
}

export async function startVisionAiServer(options = {}) {
  const env = options.env ?? process.env
  const port = positiveInteger(env.PORT, 3100)
  const host = env.HOST || '127.0.0.1'
  const server = await createVisionAiServer(options)

  server.listen(port, host, () => {
    console.log(`Vision AI API listening on http://${host}:${port}`)
  })

  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await startVisionAiServer()
}
