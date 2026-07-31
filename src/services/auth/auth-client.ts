export interface VisionAuthUser {
  id: string
  name: string
  username?: string | null
  displayUsername?: string | null
}

interface VisionAuthSessionResponse {
  user: VisionAuthUser
}

function errorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message
    }
    if ('error' in payload && typeof payload.error === 'string') {
      return payload.error
    }
  }
  return fallback
}

async function requestError(response: Response, fallback: string): Promise<Error> {
  try {
    return new Error(errorMessage(await response.json(), fallback))
  } catch {
    return new Error(fallback)
  }
}

export async function fetchVisionAuthUser(): Promise<VisionAuthUser | null> {
  const response = await fetch('/api/auth/get-session', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    if (response.status === 401) return null
    throw await requestError(response, '无法读取登录状态。')
  }

  const session = await response.json() as VisionAuthSessionResponse | null
  return session?.user ?? null
}

export async function signInVisionAccount(
  username: string,
  password: string,
): Promise<VisionAuthUser> {
  const response = await fetch('/api/auth/sign-in/username', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      rememberMe: true,
    }),
  })

  if (!response.ok) {
    throw await requestError(response, '账号或密码错误。')
  }

  const payload = await response.json() as { user: VisionAuthUser }
  return payload.user
}

export async function signOutVisionAccount(): Promise<void> {
  const response = await fetch('/api/auth/sign-out', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: '{}',
  })

  if (!response.ok) {
    throw await requestError(response, '退出登录失败。')
  }
}

