import { randomUUID } from 'node:crypto'

function now() {
  return new Date().toISOString()
}

function parseAttachments(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseAnswerVariants(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((variant) => variant && typeof variant === 'object')
      .map((variant) => ({
        answer: String(variant.answer || ''),
        reasoning: String(variant.reasoning || ''),
      }))
  } catch {
    return []
  }
}

function conversationFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    pinned: Boolean(row.pinned),
    model: row.model_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function turnFromRow(row) {
  const answerVariants = parseAnswerVariants(row.answer_versions)
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    reasoning: row.reasoning,
    model: row.model,
    status: row.status,
    thinking: Boolean(row.thinking),
    thinkingExpanded: false,
    feedback: null,
    answerVariants,
    answerIndex: answerVariants.length,
    attachments: parseAttachments(row.attachments),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class ConversationStore {
  constructor(database) {
    this.database = database
  }

  migrate() {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS ai_conversation (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL DEFAULT 'standalone-chat',
        model_id TEXT,
        title TEXT NOT NULL,
        pinned INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS ai_conversation_user_updated_idx
        ON ai_conversation(user_id, updated_at DESC);

      CREATE TABLE IF NOT EXISTS ai_turn (
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
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES ai_conversation(id) ON DELETE CASCADE,
        UNIQUE (conversation_id, position)
      );

      CREATE INDEX IF NOT EXISTS ai_turn_conversation_position_idx
        ON ai_turn(conversation_id, position);
    `)

    const conversationColumns = this.database.prepare('PRAGMA table_info(ai_conversation)').all()
    if (!conversationColumns.some((column) => column.name === 'product_id')) {
      this.database.exec(`
        ALTER TABLE ai_conversation
        ADD COLUMN product_id TEXT NOT NULL DEFAULT 'standalone-chat'
      `)
    }
    if (!conversationColumns.some((column) => column.name === 'model_id')) {
      this.database.exec(`
        ALTER TABLE ai_conversation
        ADD COLUMN model_id TEXT
      `)
      this.database.exec(`
        UPDATE ai_conversation
        SET model_id = (
          SELECT turn.model
          FROM ai_turn AS turn
          WHERE turn.conversation_id = ai_conversation.id
          ORDER BY turn.position DESC
          LIMIT 1
        )
        WHERE model_id IS NULL
      `)
    }
    this.database.exec(`
      CREATE INDEX IF NOT EXISTS ai_conversation_product_updated_idx
      ON ai_conversation(user_id, product_id, updated_at DESC)
    `)

    const turnColumns = this.database.prepare('PRAGMA table_info(ai_turn)').all()
    if (!turnColumns.some((column) => column.name === 'answer_versions')) {
      this.database.exec(`
        ALTER TABLE ai_turn
        ADD COLUMN answer_versions TEXT NOT NULL DEFAULT '[]'
      `)
    }
  }

  listConversations(userId, productId = 'standalone-chat') {
    return this.database.prepare(`
      SELECT id, title, pinned, model_id, created_at, updated_at
      FROM ai_conversation
      WHERE user_id = ? AND product_id = ?
      ORDER BY pinned DESC, updated_at DESC
    `).all(userId, productId).map(conversationFromRow)
  }

  getConversation(userId, conversationId, productId = 'standalone-chat') {
    const row = this.database.prepare(`
      SELECT id, title, pinned, model_id, created_at, updated_at
      FROM ai_conversation
      WHERE id = ? AND user_id = ? AND product_id = ?
      LIMIT 1
    `).get(conversationId, userId, productId)

    return row ? conversationFromRow(row) : null
  }

  createConversation(userId, title, productId = 'standalone-chat', model = null) {
    const timestamp = now()
    const conversation = {
      id: randomUUID(),
      title: String(title || '新会话').trim().slice(0, 80) || '新会话',
      pinned: false,
      model,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    this.database.prepare(`
      INSERT INTO ai_conversation (
        id, user_id, product_id, model_id, title, pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `).run(
      conversation.id,
      userId,
      productId,
      model,
      conversation.title,
      timestamp,
      timestamp,
    )

    return conversation
  }

  updateConversation(userId, conversationId, patch, productId = 'standalone-chat') {
    const existing = this.getConversation(userId, conversationId, productId)
    if (!existing) return null

    const title = typeof patch.title === 'string'
      ? patch.title.trim().slice(0, 80) || existing.title
      : existing.title
    const pinned = typeof patch.pinned === 'boolean' ? patch.pinned : existing.pinned
    const model = typeof patch.model === 'string' && patch.model ? patch.model : existing.model
    const updatedAt = now()

    this.database.prepare(`
      UPDATE ai_conversation
      SET title = ?, pinned = ?, model_id = ?, updated_at = ?
      WHERE id = ? AND user_id = ? AND product_id = ?
    `).run(title, pinned ? 1 : 0, model, updatedAt, conversationId, userId, productId)

    return {
      ...existing,
      title,
      pinned,
      model,
      updatedAt,
    }
  }

  touchConversation(userId, conversationId, productId = 'standalone-chat') {
    this.database.prepare(`
      UPDATE ai_conversation
      SET updated_at = ?
      WHERE id = ? AND user_id = ? AND product_id = ?
    `).run(now(), conversationId, userId, productId)
  }

  deleteConversation(userId, conversationId, productId = 'standalone-chat') {
    return this.database.prepare(`
      DELETE FROM ai_conversation
      WHERE id = ? AND user_id = ? AND product_id = ?
    `).run(conversationId, userId, productId).changes > 0
  }

  listTurns(userId, conversationId, productId = 'standalone-chat') {
    if (!this.getConversation(userId, conversationId, productId)) return null

    return this.database.prepare(`
      SELECT
        id, question, answer, reasoning, model, status, thinking,
        attachments, answer_versions, created_at, updated_at
      FROM ai_turn
      WHERE conversation_id = ?
      ORDER BY position ASC
    `).all(conversationId).map(turnFromRow)
  }

  createTurn(userId, conversationId, input, productId = 'standalone-chat') {
    const conversation = this.getConversation(userId, conversationId, productId)
    if (!conversation) return null

    const position = Number(this.database.prepare(`
      SELECT COALESCE(MAX(position), 0) + 1 AS next_position
      FROM ai_turn
      WHERE conversation_id = ?
    `).get(conversationId).next_position)
    const timestamp = now()
    const turn = {
      id: randomUUID(),
      question: input.question,
      answer: '',
      reasoning: '',
      model: input.model,
      status: 'streaming',
      thinking: input.thinking,
      thinkingExpanded: true,
      feedback: null,
      answerVariants: [],
      answerIndex: 0,
      attachments: input.attachments,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    this.database.prepare(`
      INSERT INTO ai_turn (
        id, conversation_id, position, question, answer, reasoning,
        model, status, thinking, attachments, created_at, updated_at
      ) VALUES (?, ?, ?, ?, '', '', ?, 'streaming', ?, ?, ?, ?)
    `).run(
      turn.id,
      conversationId,
      position,
      turn.question,
      turn.model,
      turn.thinking ? 1 : 0,
      JSON.stringify(turn.attachments),
      timestamp,
      timestamp,
    )
    this.touchConversation(userId, conversationId, productId)

    return turn
  }

  prepareRegeneration(userId, conversationId, turnId, productId = 'standalone-chat') {
    const row = this.database.prepare(`
      SELECT turn.*
      FROM ai_turn AS turn
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = turn.conversation_id
      WHERE
        turn.id = ?
        AND turn.conversation_id = ?
        AND conversation.user_id = ?
        AND conversation.product_id = ?
      LIMIT 1
    `).get(turnId, conversationId, userId, productId)

    if (!row) return null

    const answerVariants = parseAnswerVariants(row.answer_versions)
    if (row.answer.trim() || row.reasoning.trim()) {
      answerVariants.push({ answer: row.answer, reasoning: row.reasoning })
    }

    this.database.exec('BEGIN')
    try {
      this.database.prepare(`
        DELETE FROM ai_turn
        WHERE conversation_id = ? AND position > ?
      `).run(conversationId, row.position)
      this.database.prepare(`
        UPDATE ai_turn
        SET answer = '', reasoning = '', answer_versions = ?, status = 'streaming', updated_at = ?
        WHERE id = ?
      `).run(JSON.stringify(answerVariants), now(), turnId)
      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    this.touchConversation(userId, conversationId, productId)
    return turnFromRow({
      ...row,
      answer: '',
      reasoning: '',
      answer_versions: JSON.stringify(answerVariants),
      status: 'streaming',
      updated_at: now(),
    })
  }

  updateTurn(userId, conversationId, turnId, patch, productId = 'standalone-chat') {
    if (!this.getConversation(userId, conversationId, productId)) return false

    const existing = this.database.prepare(`
      SELECT answer, reasoning, status
      FROM ai_turn
      WHERE id = ? AND conversation_id = ?
      LIMIT 1
    `).get(turnId, conversationId)
    if (!existing) return false

    this.database.prepare(`
      UPDATE ai_turn
      SET answer = ?, reasoning = ?, status = ?, updated_at = ?
      WHERE id = ? AND conversation_id = ?
    `).run(
      patch.answer ?? existing.answer,
      patch.reasoning ?? existing.reasoning,
      patch.status ?? existing.status,
      now(),
      turnId,
      conversationId,
    )
    this.touchConversation(userId, conversationId, productId)
    return true
  }

  messagesThroughTurn(userId, conversationId, turnId, productId = 'standalone-chat') {
    const rows = this.database.prepare(`
      SELECT turn.question, turn.answer, turn.attachments, turn.id
      FROM ai_turn AS turn
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = turn.conversation_id
      WHERE turn.conversation_id = ? AND conversation.user_id = ? AND conversation.product_id = ?
      ORDER BY turn.position ASC
    `).all(conversationId, userId, productId)
    const messages = []

    for (const row of rows) {
      messages.push({
        role: 'user',
        content: row.question,
        attachments: parseAttachments(row.attachments),
      })
      if (row.id === turnId) break
      if (row.answer.trim()) {
        messages.push({ role: 'assistant', content: row.answer })
      }
    }

    return messages
  }
}
