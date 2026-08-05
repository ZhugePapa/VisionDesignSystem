import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'

import { AiArtifactStore } from './artifacts.mjs'
import { ConversationStore } from './conversations.mjs'

test('stores Markdown artifacts per account, conversation and answer version', (context) => {
  const root = mkdtempSync(join(tmpdir(), 'vision-artifacts-'))
  context.after(() => rmSync(root, { recursive: true, force: true }))
  const database = new DatabaseSync(':memory:')
  context.after(() => database.close())
  database.exec('CREATE TABLE "user" (id TEXT PRIMARY KEY)')
  database.prepare('INSERT INTO "user" (id) VALUES (?)').run('owner')
  database.prepare('INSERT INTO "user" (id) VALUES (?)').run('other')

  const conversationStore = new ConversationStore(database)
  conversationStore.migrate()
  const artifactStore = new AiArtifactStore(database, {
    VISION_AI_ARTIFACT_DIR: root,
  })
  artifactStore.migrate()
  const conversation = conversationStore.createConversation('owner', 'Markdown 生成')
  const turn = conversationStore.createTurn('owner', conversation.id, {
    question: '生成 Markdown 文件',
    model: 'kimi-k3',
    thinking: true,
    attachments: [],
  })

  const artifact = artifactStore.createMarkdown('owner', {
    conversationId: conversation.id,
    turnId: turn.id,
    answerVersion: 1,
    name: '../项目总结',
    description: '项目总结文档',
    content: '# 项目总结\n\n- 完成第一期',
  })

  assert.equal(artifact.name, '项目总结.md')
  assert.equal(artifact.answerVersion, 1)
  assert.equal(artifact.type, 'file-markdown')
  assert.equal(artifact.mimeType, 'text/markdown')
  assert.match(artifact.previewUrl, new RegExp(artifact.id))
  assert.deepEqual(artifactStore.listForTurn('owner', conversation.id, turn.id), [artifact])
  assert.equal(
    artifactStore.content('owner', artifact.id).content,
    '# 项目总结\n\n- 完成第一期',
  )
  assert.equal(artifactStore.content('other', artifact.id), null)

  const laterTurn = conversationStore.createTurn('owner', conversation.id, {
    question: '再生成一个文件',
    model: 'kimi-k3',
    thinking: false,
    attachments: [],
  })
  const laterArtifact = artifactStore.createMarkdown('owner', {
    conversationId: conversation.id,
    turnId: laterTurn.id,
    name: '后续文件.md',
    content: '# 后续文件',
  })
  artifactStore.deleteAfterTurn('owner', conversation.id, turn.id)
  assert.ok(artifactStore.content('owner', artifact.id))
  assert.equal(artifactStore.content('owner', laterArtifact.id), null)
})
