export const DEFAULT_MODEL_ID = 'deepseek-v4-flash'

const API_KEY_ENV = 'OPENCODE_GO_API_KEY'
const BASE_URL_ENV = 'OPENCODE_GO_BASE_URL'
const DEFAULT_BASE_URL = 'https://opencode.ai/zen/go/v1'

const modelDefinitions = [
  {
    id: 'gpt-5.6-luna',
    label: 'GPT-5.6 Luna',
    provider: 'opencode-go',
    apiStyle: 'responses',
    supportsImages: true,
  },
  {
    id: 'deepseek-v4-flash',
    label: 'DeepSeek V4 Flash',
    provider: 'opencode-go',
    apiStyle: 'chat-completions',
  },
  {
    id: 'glm-5.2',
    label: 'GLM-5.2',
    provider: 'opencode-go',
    apiStyle: 'chat-completions',
  },
]

function publicModel(definition, env) {
  return {
    id: definition.id,
    label: definition.label,
    provider: definition.provider,
    available: Boolean(env[API_KEY_ENV]),
    supportsThinking: true,
    supportsImages: definition.supportsImages === true,
  }
}

export function listAiModels(env = process.env) {
  return modelDefinitions.map((definition) => publicModel(definition, env))
}

export function defaultAiModelId(env = process.env) {
  const requested = env.AI_DEFAULT_MODEL || DEFAULT_MODEL_ID
  return modelDefinitions.some((definition) => definition.id === requested)
    ? requested
    : DEFAULT_MODEL_ID
}

export function resolveAiModel(requestedId, env = process.env) {
  const id = typeof requestedId === 'string' && requestedId
    ? requestedId
    : defaultAiModelId(env)
  const definition = modelDefinitions.find((candidate) => candidate.id === id)

  if (!definition) {
    const error = new Error('不支持所选模型。')
    error.statusCode = 400
    throw error
  }

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
