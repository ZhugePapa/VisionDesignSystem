export const DEFAULT_MODEL_ID = 'deepseek-v4-flash'

const modelDefinitions = [
  {
    id: 'deepseek-v4-flash',
    label: 'DeepSeek V4 Flash',
    provider: 'deepseek',
    upstreamModel: 'deepseek-v4-flash',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    baseUrlEnv: 'DEEPSEEK_BASE_URL',
    defaultBaseUrl: 'https://api.deepseek.com',
  },
  {
    id: 'deepseek-v4-pro',
    label: 'DeepSeek V4 Pro',
    provider: 'deepseek',
    upstreamModel: 'deepseek-v4-pro',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    baseUrlEnv: 'DEEPSEEK_BASE_URL',
    defaultBaseUrl: 'https://api.deepseek.com',
  },
  {
    id: 'glm-5.2',
    label: 'GLM-5.2',
    provider: 'ollama',
    upstreamModel: 'glm-5.2',
    upstreamModelEnv: 'OLLAMA_GLM_MODEL',
    apiKeyEnv: 'OLLAMA_API_KEY',
    baseUrlEnv: 'OLLAMA_BASE_URL',
    defaultBaseUrl: 'https://ollama.com',
  },
  {
    id: 'kimi-k2.7-code',
    label: 'Kimi K2.7 Code',
    provider: 'ollama',
    upstreamModel: 'kimi-k2.7-code',
    upstreamModelEnv: 'OLLAMA_KIMI_MODEL',
    availabilityEnv: 'OLLAMA_KIMI_ENABLED',
    apiKeyEnv: 'OLLAMA_API_KEY',
    baseUrlEnv: 'OLLAMA_BASE_URL',
    defaultBaseUrl: 'https://ollama.com',
  },
]

function modelIsEnabled(definition, env) {
  if (!definition.availabilityEnv) return true
  return env[definition.availabilityEnv] !== 'false'
}

function publicModel(definition, env) {
  return {
    id: definition.id,
    label: definition.label,
    provider: definition.provider,
    available: Boolean(env[definition.apiKeyEnv]) && modelIsEnabled(definition, env),
    supportsThinking: true,
  }
}

export function listAiModels(env = process.env) {
  return modelDefinitions.map((definition) => publicModel(definition, env))
}

export function defaultAiModelId(env = process.env) {
  const requested = env.AI_DEFAULT_MODEL || DEFAULT_MODEL_ID
  const requestedModel = modelDefinitions.find((definition) => definition.id === requested)

  if (
    requestedModel
    && env[requestedModel.apiKeyEnv]
    && modelIsEnabled(requestedModel, env)
  ) {
    return requestedModel.id
  }

  return modelDefinitions.find((definition) => (
    env[definition.apiKeyEnv] && modelIsEnabled(definition, env)
  ))?.id ?? DEFAULT_MODEL_ID
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

  if (!modelIsEnabled(definition, env)) {
    const error = new Error(`${definition.label} 当前未启用。`)
    error.statusCode = 503
    throw error
  }

  const apiKey = env[definition.apiKeyEnv]
  if (!apiKey) {
    const error = new Error(`${definition.label} 尚未配置。`)
    error.statusCode = 503
    throw error
  }

  return {
    ...publicModel(definition, env),
    apiKey,
    baseUrl: env[definition.baseUrlEnv] || definition.defaultBaseUrl,
    upstreamModel: definition.upstreamModelEnv
      ? env[definition.upstreamModelEnv] || definition.upstreamModel
      : definition.upstreamModel,
  }
}
