export const DEFAULT_MODEL_ID = 'deepseek-v4-pro'

const EMBEDDED_ASSISTANT_PRODUCT_ID = 'embedded-assistant'
const STANDALONE_CHAT_PRODUCT_ID = 'standalone-chat'
const EMBEDDED_ASSISTANT_DEFAULT_MODEL_ID = 'deepseek-v4-flash'
const STANDALONE_CHAT_DEFAULT_MODEL_ID = DEFAULT_MODEL_ID

const API_KEY_ENV = 'OPENCODE_GO_API_KEY'
const BASE_URL_ENV = 'OPENCODE_GO_BASE_URL'
const DEFAULT_BASE_URL = 'https://opencode.ai/zen/go/v1'

const modelDefinitions = [
  {
    id: 'kimi-k3',
    label: 'Kimi K3',
    provider: 'opencode-go',
    apiStyle: 'chat-completions',
    supportsThinking: true,
    supportsImages: true,
  },
  {
    id: 'deepseek-v4-flash',
    label: 'DeepSeek V4 Flash',
    provider: 'opencode-go',
    apiStyle: 'chat-completions',
    supportsThinking: true,
  },
  {
    id: 'deepseek-v4-pro',
    label: 'DeepSeek V4 Pro',
    provider: 'opencode-go',
    apiStyle: 'chat-completions',
    supportsThinking: true,
    products: [STANDALONE_CHAT_PRODUCT_ID],
  },
  {
    id: 'glm-5.2',
    label: 'GLM-5.2',
    provider: 'opencode-go',
    apiStyle: 'chat-completions',
    supportsThinking: true,
  },
]

function publicModel(definition, env) {
  return {
    id: definition.id,
    label: definition.label,
    provider: definition.provider,
    available: Boolean(env[API_KEY_ENV]),
    supportsThinking: definition.supportsThinking === true,
    supportsImages: definition.supportsImages === true,
  }
}

function definitionsForProduct(productId = STANDALONE_CHAT_PRODUCT_ID) {
  return modelDefinitions.filter(
    (definition) => !definition.products || definition.products.includes(productId),
  )
}

export function listAiModels(env = process.env, productId = STANDALONE_CHAT_PRODUCT_ID) {
  return definitionsForProduct(productId).map((definition) => publicModel(definition, env))
}

export function defaultAiModelId(env = process.env, productId = STANDALONE_CHAT_PRODUCT_ID) {
  const fallback = productId === EMBEDDED_ASSISTANT_PRODUCT_ID
    ? EMBEDDED_ASSISTANT_DEFAULT_MODEL_ID
    : STANDALONE_CHAT_DEFAULT_MODEL_ID
  const requested = productId === EMBEDDED_ASSISTANT_PRODUCT_ID
    ? env.AI_EMBEDDED_ASSISTANT_DEFAULT_MODEL || env.AI_DEFAULT_MODEL || fallback
    : env.AI_STANDALONE_CHAT_DEFAULT_MODEL || fallback
  return definitionsForProduct(productId).some((definition) => definition.id === requested)
    ? requested
    : fallback
}

export function validatedAiModelId(
  requestedId,
  env = process.env,
  productId = STANDALONE_CHAT_PRODUCT_ID,
) {
  const id = typeof requestedId === 'string' && requestedId
    ? requestedId
    : defaultAiModelId(env, productId)
  const definition = definitionsForProduct(productId).find((candidate) => candidate.id === id)

  if (!definition) {
    const error = new Error('不支持所选模型。')
    error.statusCode = 400
    throw error
  }

  return id
}

export function resolveAiModel(
  requestedId,
  env = process.env,
  productId = STANDALONE_CHAT_PRODUCT_ID,
) {
  const id = validatedAiModelId(requestedId, env, productId)
  const definition = definitionsForProduct(productId).find((candidate) => candidate.id === id)

  const apiKey = env[API_KEY_ENV]
  if (!apiKey) {
    const error = new Error('OpenCode Go 尚未配置。')
    error.statusCode = 503
    throw error
  }

  return {
    ...publicModel(definition, env),
    apiKey,
    apiStyle: definition.apiStyle,
    baseUrl: env[BASE_URL_ENV] || DEFAULT_BASE_URL,
    upstreamModel: definition.id,
  }
}
