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

test('persists the selected model on its conversation', () => {
  const database = new DatabaseSync(':memory:')
  database.exec('CREATE TABLE "user" (id TEXT PRIMARY KEY)')
  database.prepare('INSERT INTO "user" (id) VALUES (?)').run('model-user')
  const store = new ConversationStore(database)
  store.migrate()

  const conversation = store.createConversation(
    'model-user',
    '模型偏好',
    'standalone-chat',
    'deepseek-v4-pro',
  )
  assert.equal(conversation.model, 'deepseek-v4-pro')

  const updated = store.updateConversation(
    'model-user',
    conversation.id,
    { model: 'kimi-k3' },
    'standalone-chat',
  )
  assert.equal(updated.model, 'kimi-k3')
  assert.equal(
    store.getConversation('model-user', conversation.id, 'standalone-chat')?.model,
    'kimi-k3',
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

test('backfills a legacy conversation model from its latest turn', () => {
  const database = new DatabaseSync(':memory:')
  database.exec(`
    CREATE TABLE "user" (id TEXT PRIMARY KEY);
    INSERT INTO "user" (id) VALUES ('legacy-model-user');
    CREATE TABLE ai_conversation (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL DEFAULT 'standalone-chat',
      title TEXT NOT NULL,
      pinned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE ai_turn (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      reasoning TEXT NOT NULL DEFAULT '',
      model TEXT NOT NULL,
      status TEXT NOT NULL,
      thinking INTEGER NOT NULL DEFAULT 0,
      attachments TEXT NOT NULL DEFAULT '[]',
      answer_versions TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (conversation_id, position)
    );
    INSERT INTO ai_conversation (
      id, user_id, product_id, title, created_at, updated_at
    ) VALUES (
      'legacy-model-conversation', 'legacy-model-user', 'standalone-chat',
      '旧会话', '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'
    );
    INSERT INTO ai_turn (
      id, conversation_id, position, question, model, status, created_at, updated_at
    ) VALUES
      ('turn-1', 'legacy-model-conversation', 1, '第一问', 'kimi-k3', 'done',
       '2026-08-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'),
      ('turn-2', 'legacy-model-conversation', 2, '第二问', 'deepseek-v4-flash', 'done',
       '2026-08-02T00:00:00.000Z', '2026-08-02T00:00:00.000Z');
  `)

  const store = new ConversationStore(database)
  store.migrate()

  assert.equal(
    store.getConversation(
      'legacy-model-user',
      'legacy-model-conversation',
      'standalone-chat',
    )?.model,
    'deepseek-v4-flash',
  )

  database.close()
})
