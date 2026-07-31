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

function conversationFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    pinned: Boolean(row.pinned),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function turnFromRow(row) {
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
  }

  listConversations(userId) {
    return this.database.prepare(`
      SELECT id, title, pinned, created_at, updated_at
      FROM ai_conversation
      WHERE user_id = ?
      ORDER BY pinned DESC, updated_at DESC
    `).all(userId).map(conversationFromRow)
  }

  getConversation(userId, conversationId) {
    const row = this.database.prepare(`
      SELECT id, title, pinned, created_at, updated_at
      FROM ai_conversation
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `).get(conversationId, userId)

    return row ? conversationFromRow(row) : null
  }

  createConversation(userId, title) {
    const timestamp = now()
    const conversation = {
      id: randomUUID(),
      title: String(title || '新会话').trim().slice(0, 80) || '新会话',
      pinned: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    this.database.prepare(`
      INSERT INTO ai_conversation (
        id, user_id, title, pinned, created_at, updated_at
      ) VALUES (?, ?, ?, 0, ?, ?)
    `).run(
      conversation.id,
      userId,
      conversation.title,
      timestamp,
      timestamp,
    )

    return conversation
  }

  updateConversation(userId, conversationId, patch) {
    const existing = this.getConversation(userId, conversationId)
    if (!existing) return null

    const title = typeof patch.title === 'string'
      ? patch.title.trim().slice(0, 80) || existing.title
      : existing.title
    const pinned = typeof patch.pinned === 'boolean' ? patch.pinned : existing.pinned
    const updatedAt = now()

    this.database.prepare(`
      UPDATE ai_conversation
      SET title = ?, pinned = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(title, pinned ? 1 : 0, updatedAt, conversationId, userId)

    return {
      ...existing,
      title,
      pinned,
      updatedAt,
    }
  }

  touchConversation(userId, conversationId) {
    this.database.prepare(`
      UPDATE ai_conversation
      SET updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(now(), conversationId, userId)
  }

  deleteConversation(userId, conversationId) {
    return this.database.prepare(`
      DELETE FROM ai_conversation
      WHERE id = ? AND user_id = ?
    `).run(conversationId, userId).changes > 0
  }

  listTurns(userId, conversationId) {
    if (!this.getConversation(userId, conversationId)) return null

    return this.database.prepare(`
      SELECT
        id, question, answer, reasoning, model, status, thinking,
        attachments, created_at, updated_at
      FROM ai_turn
      WHERE conversation_id = ?
      ORDER BY position ASC
    `).all(conversationId).map(turnFromRow)
  }

  createTurn(userId, conversationId, input) {
    const conversation = this.getConversation(userId, conversationId)
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
    this.touchConversation(userId, conversationId)

    return turn
  }

  prepareRegeneration(userId, conversationId, turnId) {
    const row = this.database.prepare(`
      SELECT turn.*
      FROM ai_turn AS turn
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = turn.conversation_id
      WHERE
        turn.id = ?
        AND turn.conversation_id = ?
        AND conversation.user_id = ?
      LIMIT 1
    `).get(turnId, conversationId, userId)

    if (!row) return null

    this.database.exec('BEGIN')
    try {
      this.database.prepare(`
        DELETE FROM ai_turn
        WHERE conversation_id = ? AND position > ?
      `).run(conversationId, row.position)
      this.database.prepare(`
        UPDATE ai_turn
        SET answer = '', reasoning = '', status = 'streaming', updated_at = ?
        WHERE id = ?
      `).run(now(), turnId)
      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    this.touchConversation(userId, conversationId)
    return turnFromRow({
      ...row,
      answer: '',
      reasoning: '',
      status: 'streaming',
      updated_at: now(),
    })
  }

  updateTurn(userId, conversationId, turnId, patch) {
    if (!this.getConversation(userId, conversationId)) return false

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
    this.touchConversation(userId, conversationId)
    return true
  }

  messagesThroughTurn(userId, conversationId, turnId) {
    const rows = this.database.prepare(`
      SELECT turn.question, turn.answer, turn.attachments, turn.id
      FROM ai_turn AS turn
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = turn.conversation_id
      WHERE turn.conversation_id = ? AND conversation.user_id = ?
      ORDER BY turn.position ASC
    `).all(conversationId, userId)
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
