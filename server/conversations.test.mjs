import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'

import { ConversationStore } from './conversations.mjs'

test('preserves previous answers when regenerating a turn', () => {
  const database = new DatabaseSync(':memory:')
  database.exec('CREATE TABLE "user" (id TEXT PRIMARY KEY)')
  database.prepare('INSERT INTO "user" (id) VALUES (?)').run('test-user')
  const store = new ConversationStore(database)
  store.migrate()

  const conversation = store.createConversation('test-user', '分页回答')
  const turn = store.createTurn('test-user', conversation.id, {
    question: '请回答',
    model: 'kimi-k3',
    thinking: true,
    attachments: [],
  })
  store.updateTurn('test-user', conversation.id, turn.id, {
    answer: '第一版回答',
    reasoning: '第一版思考',
    status: 'done',
  })

  const regenerating = store.prepareRegeneration('test-user', conversation.id, turn.id)
  assert.deepEqual(regenerating.answerVariants, [{
    answer: '第一版回答',
    reasoning: '第一版思考',
  }])
  assert.equal(regenerating.answerIndex, 1)
  assert.equal(regenerating.answer, '')

  store.updateTurn('test-user', conversation.id, turn.id, {
    answer: '第二版回答',
    reasoning: '第二版思考',
    status: 'done',
  })
  const [stored] = store.listTurns('test-user', conversation.id)
  assert.deepEqual(stored.answerVariants, [{
    answer: '第一版回答',
    reasoning: '第一版思考',
  }])
  assert.equal(stored.answerIndex, 1)
  assert.equal(stored.answer, '第二版回答')

  database.close()
})

test('isolates conversations for embedded and standalone AI products', () => {
  const database = new DatabaseSync(':memory:')
  database.exec('CREATE TABLE "user" (id TEXT PRIMARY KEY)')
  database.prepare('INSERT INTO "user" (id) VALUES (?)').run('shared-user')
  const store = new ConversationStore(database)
  store.migrate()

  const embedded = store.createConversation(
    'shared-user',
    'Demo 内嵌会话',
    'embedded-assistant',
  )
  const standalone = store.createConversation(
    'shared-user',
    '独立 Chat 会话',
    'standalone-chat',
  )

  assert.deepEqual(
    store.listConversations('shared-user', 'embedded-assistant').map(({ id }) => id),
    [embedded.id],
  )
  assert.deepEqual(
    store.listConversations('shared-user', 'standalone-chat').map(({ id }) => id),
    [standalone.id],
  )
  assert.equal(
    store.updateConversation(
      'shared-user',
      embedded.id,
      { title: '不应跨产品修改' },
      'standalone-chat',
    ),
    null,
  )
  assert.equal(
    store.deleteConversation('shared-user', embedded.id, 'standalone-chat'),
    false,
  )
  assert.equal(
    store.getConversation('shared-user', embedded.id, 'embedded-assistant')?.title,
    'Demo 内嵌会话',
  )

  database.close()
})

test('migrates conversations created before the product split to standalone chat', () => {
  const database = new DatabaseSync(':memory:')
  database.exec(`
    CREATE TABLE "user" (id TEXT PRIMARY KEY);
    INSERT INTO "user" (id) VALUES ('legacy-user');
    CREATE TABLE ai_conversation (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      pinned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    INSERT INTO ai_conversation (
      id, user_id, title, pinned, created_at, updated_at
    ) VALUES (
      'legacy-conversation', 'legacy-user', '拆分前的会话', 0,
      '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'
    );
  `)

  const store = new ConversationStore(database)
  store.migrate()

  assert.deepEqual(
    store.listConversations('legacy-user', 'standalone-chat').map(({ id }) => id),
    ['legacy-conversation'],
  )
  assert.deepEqual(store.listConversations('legacy-user', 'embedded-assistant'), [])

  database.close()
})
