import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'

import { createVisionAiServer } from './app.mjs'

function sessionCookie(response) {
  return response.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ')
}

async function signIn(baseUrl, username, password) {
  const response = await fetch(`${baseUrl}/api/auth/sign-in/username`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  assert.equal(response.status, 200)
  return sessionCookie(response)
}

async function closeServer(server) {
  server.close()
  await once(server, 'close')
}

test('migrates existing built-in accounts to the stable shared password once', async (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'vision-auth-password-test-'))
  const databasePath = join(directory, 'vision.sqlite')
  const baseEnv = {
    VISION_AI_DATABASE_PATH: databasePath,
    BETTER_AUTH_SECRET: 'test-secret-with-at-least-thirty-two-random-characters',
    BETTER_AUTH_URL: 'http://127.0.0.1',
    AI_SEED_PASSWORD: 'unknown-initial-password',
    OPENCODE_GO_API_KEY: 'test-key',
  }
  let activeServer

  context.after(async () => {
    if (activeServer?.listening) await closeServer(activeServer)
    rmSync(directory, { recursive: true, force: true })
  })

  activeServer = await createVisionAiServer({ env: baseEnv })
  activeServer.listen(0, '127.0.0.1')
  await once(activeServer, 'listening')
  let address = activeServer.address()
  let baseUrl = `http://127.0.0.1:${address.port}`
  await signIn(baseUrl, 'vision01', 'unknown-initial-password')
  await closeServer(activeServer)

  const database = new DatabaseSync(databasePath)
  database
    .prepare('DELETE FROM vision_auth_migration WHERE key = ?')
    .run('builtin-account-password-v1')
  database.close()

  activeServer = await createVisionAiServer({
    env: {
      ...baseEnv,
      VISION_BUILTIN_ACCOUNT_PASSWORD: 'vision123456',
    },
  })
  activeServer.listen(0, '127.0.0.1')
  await once(activeServer, 'listening')
  address = activeServer.address()
  baseUrl = `http://127.0.0.1:${address.port}`

  await signIn(baseUrl, 'vision01', 'vision123456')
  const oldPasswordResponse = await fetch(`${baseUrl}/api/auth/sign-in/username`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'vision01',
      password: 'unknown-initial-password',
    }),
  })
  assert.equal(oldPasswordResponse.status, 401)
  await closeServer(activeServer)
})

test('seeds the shared and personal accounts, blocks registration, and isolates cloud conversations', async (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'vision-auth-test-'))
  let upstreamBody
  const encoder = new TextEncoder()
  const server = await createVisionAiServer({
    env: {
      VISION_AI_DATABASE_PATH: join(directory, 'vision.sqlite'),
      BETTER_AUTH_SECRET: 'test-secret-with-at-least-thirty-two-random-characters',
      BETTER_AUTH_URL: 'http://127.0.0.1',
      AI_SEED_PASSWORD: 'test',
      OPENCODE_GO_API_KEY: 'test-key',
    },
    fetchImpl: async (_url, options) => {
      upstreamBody = JSON.parse(options.body)
      return new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(
            'data: {"choices":[{"delta":{"content":"已读取附件。"}}]}\n\n',
          ))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    },
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')

  context.after(async () => {
    server.close()
    await once(server, 'close')
    rmSync(directory, { recursive: true, force: true })
  })

  const address = server.address()
  const baseUrl = `http://127.0.0.1:${address.port}`

  const anonymousResponse = await fetch(`${baseUrl}/api/ai/conversations`)
  assert.equal(anonymousResponse.status, 401)

  const registrationResponse = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Unexpected User',
      email: 'unexpected@example.com',
      password: 'test',
    }),
  })
  assert.equal(registrationResponse.status, 403)

  const firstCookie = await signIn(baseUrl, 'vision01', 'test')
  const personalCookie = await signIn(baseUrl, 'lyl', 'dameinv')
  assert.match(personalCookie, /vision-auth\.session_token=/)
  const createResponse = await fetch(`${baseUrl}/api/ai/conversations`, {
    method: 'POST',
    headers: {
      Cookie: firstCookie,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: '账号一的会话' }),
  })
  assert.equal(createResponse.status, 201)
  const createdConversation = (await createResponse.json()).conversation

  const firstListResponse = await fetch(`${baseUrl}/api/ai/conversations`, {
    headers: { Cookie: firstCookie },
  })
  const firstList = await firstListResponse.json()
  assert.equal(firstList.conversations.length, 1)
  assert.equal(firstList.conversations[0].title, '账号一的会话')

  const secondCookie = await signIn(baseUrl, 'vision02', 'test')
  const secondListResponse = await fetch(`${baseUrl}/api/ai/conversations`, {
    headers: { Cookie: secondCookie },
  })
  const secondList = await secondListResponse.json()
  assert.deepEqual(secondList.conversations, [])

  const uploadBody = new FormData()
  uploadBody.append(
    'files',
    new Blob(['# 上传测试\n\n这是附件正文。'], { type: 'text/markdown' }),
    '说明.md',
  )
  const uploadResponse = await fetch(`${baseUrl}/api/ai/files`, {
    method: 'POST',
    headers: { Cookie: firstCookie },
    body: uploadBody,
  })
  const uploadPayload = await uploadResponse.json()
  assert.equal(uploadResponse.status, 201)
  assert.equal(uploadPayload.files.length, 1)
  assert.equal(uploadPayload.files[0].name, '说明.md')
  assert.equal(uploadPayload.files[0].status, 'ready')

  const fileId = uploadPayload.files[0].fileId
  const ownFileResponse = await fetch(
    `${baseUrl}/api/ai/files/${encodeURIComponent(fileId)}/content`,
    { headers: { Cookie: firstCookie } },
  )
  assert.equal(ownFileResponse.status, 200)
  assert.match(await ownFileResponse.text(), /这是附件正文/)

  const otherUserFileResponse = await fetch(
    `${baseUrl}/api/ai/files/${encodeURIComponent(fileId)}/content`,
    { headers: { Cookie: secondCookie } },
  )
  assert.equal(otherUserFileResponse.status, 404)

  const streamResponse = await fetch(
    `${baseUrl}/api/ai/conversations/${encodeURIComponent(createdConversation.id)}/messages`,
    {
      method: 'POST',
      headers: {
        Cookie: firstCookie,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: '概括附件',
        model: 'deepseek-v4-flash',
        thinking: false,
        attachments: uploadPayload.files,
      }),
    },
  )
  assert.equal(streamResponse.status, 200)
  assert.match(await streamResponse.text(), /已读取附件/)
  assert.match(upstreamBody.messages.at(-1).content, /<attachment name="说明.md"/)
  assert.match(upstreamBody.messages.at(-1).content, /这是附件正文/)

  const invalidBody = new FormData()
  invalidBody.append(
    'files',
    new Blob([Buffer.from([0, 1, 2, 3])], { type: 'text/plain' }),
    '伪装.txt',
  )
  const invalidResponse = await fetch(`${baseUrl}/api/ai/files`, {
    method: 'POST',
    headers: { Cookie: firstCookie },
    body: invalidBody,
  })
  assert.equal(invalidResponse.status, 415)
})
