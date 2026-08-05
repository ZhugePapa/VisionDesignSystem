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
