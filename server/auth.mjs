import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { betterAuth } from 'better-auth'
import { getMigrations } from 'better-auth/db/migration'
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node'
import { admin, username } from 'better-auth/plugins'

const DEV_AUTH_SECRET = 'vision-design-system-local-auth-secret-change-me'
const DEV_SEED_PASSWORD = 'vision123456'

function normalizedOrigins(env) {
  return [
    env.BETTER_AUTH_URL,
    env.AI_ALLOWED_ORIGIN,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ''))
    .filter((origin, index, origins) => origins.indexOf(origin) === index)
}

function databasePath(env) {
  return resolve(
    env.VISION_AI_DATABASE_PATH || '.data/vision-ai.sqlite',
  )
}

function authSecret(env) {
  const secret = env.BETTER_AUTH_SECRET
  if (secret) return secret
  if (env.NODE_ENV === 'production') {
    throw new Error('BETTER_AUTH_SECRET is required in production')
  }
  return DEV_AUTH_SECRET
}

function seedPassword(env) {
  const password = env.AI_SEED_PASSWORD
  if (password) return password
  if (env.NODE_ENV === 'production') {
    throw new Error('AI_SEED_PASSWORD is required in production')
  }
  return DEV_SEED_PASSWORD
}

function createAuth(database, env) {
  const origins = normalizedOrigins(env)

  return betterAuth({
    appName: 'Vision AI',
    baseURL: env.BETTER_AUTH_URL || origins[0] || 'http://127.0.0.1:3100',
    database,
    secret: authSecret(env),
    trustedOrigins: origins,
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 1,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 7 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    advanced: {
      cookiePrefix: 'vision-auth',
      useSecureCookies: (env.BETTER_AUTH_URL || '').startsWith('https://'),
    },
    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 32,
      }),
      admin({
        defaultRole: 'user',
      }),
    ],
  })
}

async function migrateAuth(auth) {
  const { runMigrations } = await getMigrations(auth.options)
  await runMigrations()
}

async function seedAccounts(auth, database, env) {
  const password = seedPassword(env)

  for (let index = 1; index <= 10; index += 1) {
    const suffix = String(index).padStart(2, '0')
    const usernameValue = `vision${suffix}`
    const email = `${usernameValue}@accounts.vision.local`
    const existing = database
      .prepare('SELECT id FROM "user" WHERE email = ? OR username = ? LIMIT 1')
      .get(email, usernameValue)

    if (existing) continue

    await auth.api.createUser({
      body: {
        email,
        name: `Vision 用户 ${suffix}`,
        password,
        role: 'user',
        data: {
          username: usernameValue,
          displayUsername: usernameValue,
        },
      },
    })
  }
}

export async function createAuthService(env = process.env) {
  const path = databasePath(env)
  mkdirSync(dirname(path), { recursive: true })

  const database = new DatabaseSync(path)
  database.exec('PRAGMA foreign_keys = ON')
  database.exec('PRAGMA journal_mode = WAL')
  database.exec('PRAGMA busy_timeout = 5000')

  const auth = createAuth(database, env)
  await migrateAuth(auth)
  await seedAccounts(auth, database, env)

  const nodeHandler = toNodeHandler(auth)

  return {
    auth,
    database,
    databasePath: path,
    handleRequest: (req, res) => nodeHandler(req, res),
    getSession: (req) => auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    }),
    close: () => database.close(),
  }
}

