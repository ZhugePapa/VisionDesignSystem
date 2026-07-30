import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

import { streamDeepSeek } from './deepseek.mjs'
import {
  defaultAiModelId,
  listAiModels,
  resolveAiModel,
} from './models.mjs'
import { streamOllama } from './ollama.mjs'

const DEFAULT_SYSTEM_PROMPT = `你是 Vision Design System 演示应用中的“小 VI 智能助理”。
你主要帮助软件研发团队分析项目、需求、代码质量、流水线和交付风险。
请使用简体中文回答，优先给出清晰、可执行的结论。
回答使用 Markdown；不要编造当前项目中没有提供的数据，信息不足时明确说明。`

const MAX_BODY_BYTES = 256 * 1024
const MAX_MESSAGES = 24
const MAX_MESSAGE_CHARS = 12_000
const MAX_TOTAL_CHARS = 60_000

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

function anonymousUserId(ip) {
  return `web_${createHash('sha256').update(ip).digest('hex').slice(0, 24)}`
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
    if (!content || content.length > MAX_MESSAGE_CHARS) {
      throw new Error(`message content must contain 1 to ${MAX_MESSAGE_CHARS} characters`)
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

function createRateLimiter(limitPerMinute) {
  const clients = new Map()

  return (ip) => {
    const now = Date.now()
    const windowStart = now - 60_000
    const recent = (clients.get(ip) ?? []).filter((timestamp) => timestamp > windowStart)
    recent.push(now)
    clients.set(ip, recent)

    if (clients.size > 2_000) {
      for (const [key, timestamps] of clients) {
        if (!timestamps.some((timestamp) => timestamp > windowStart)) clients.delete(key)
      }
    }

    return recent.length <= limitPerMinute
  }
}

export function createVisionAiServer({
  env = process.env,
  fetchImpl = fetch,
} = {}) {
  const allowedOrigin = env.AI_ALLOWED_ORIGIN?.replace(/\/$/, '')
  const maxTokens = positiveInteger(env.AI_MAX_TOKENS, 4096)
  const timeoutMs = positiveInteger(env.AI_REQUEST_TIMEOUT_MS, 10 * 60_000)
  const isWithinRateLimit = createRateLimiter(
    positiveInteger(env.AI_RATE_LIMIT_PER_MINUTE, 20),
  )

  return createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost')

    if (req.method === 'GET' && url.pathname === '/api/health') {
      const models = listAiModels(env)
      json(res, 200, {
        status: 'ok',
        defaultModel: defaultAiModelId(env),
        configured: models.some((model) => model.available),
        models: models.filter((model) => model.available).map((model) => model.id),
      })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/ai/models') {
      json(res, 200, {
        defaultModel: defaultAiModelId(env),
        models: listAiModels(env),
      })
      return
    }

    if (req.method !== 'POST' || url.pathname !== '/api/ai/chat') {
      json(res, 404, { error: 'Not found' })
      return
    }

    const origin = req.headers.origin?.replace(/\/$/, '')
    if (allowedOrigin && origin && origin !== allowedOrigin) {
      json(res, 403, { error: 'Origin is not allowed' })
      return
    }

    const ip = requestIp(req)
    if (!isWithinRateLimit(ip)) {
      json(res, 429, { error: '请求过于频繁，请稍后再试。' })
      return
    }

    let body
    let model
    try {
      body = await readJson(req)
      body.messages = validatedMessages(body.messages)
      model = resolveAiModel(body.model, env)
    } catch (error) {
      json(res, error.statusCode || 400, { error: error.message })
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    req.once('aborted', () => controller.abort())
    res.once('close', () => {
      if (!res.writableEnded) controller.abort()
    })

    res.writeHead(200, {
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
      'X-Accel-Buffering': 'no',
    })
    res.flushHeaders()

    try {
      const streamModel = model.provider === 'ollama' ? streamOllama : streamDeepSeek
      await streamModel({
        apiKey: model.apiKey,
        baseUrl: model.baseUrl,
        fetchImpl,
        maxTokens,
        messages: body.messages,
        model: model.upstreamModel,
        reasoningEffort: body.reasoningEffort === 'max' ? 'max' : 'high',
        signal: controller.signal,
        systemPrompt: env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT,
        thinking: body.thinking === true,
        userId: anonymousUserId(ip),
        onEvent: (event, payload) => sse(res, event, payload),
      })
    } catch (error) {
      if (!controller.signal.aborted) {
        sse(res, 'error', {
          message: error instanceof Error ? error.message : 'AI request failed',
        })
      }
    } finally {
      clearTimeout(timeout)
      res.end()
    }
  })
}

export function startVisionAiServer(options = {}) {
  const env = options.env ?? process.env
  const port = positiveInteger(env.PORT, 3100)
  const host = env.HOST || '127.0.0.1'
  const server = createVisionAiServer(options)

  server.listen(port, host, () => {
    console.log(`Vision AI API listening on http://${host}:${port}`)
  })

  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startVisionAiServer()
}
