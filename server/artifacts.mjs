import { createHash, randomUUID } from 'node:crypto'
import {
  createReadStream,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024

function now() {
  return new Date().toISOString()
}

function artifactRoot(env) {
  return resolve(env.VISION_AI_ARTIFACT_DIR || '.data/artifacts')
}

function safeMarkdownName(value) {
  const normalized = basename(String(value || 'AI 生成内容.md'))
    .replaceAll('\0', '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 240)
  const base = normalized || 'AI 生成内容.md'
  return extname(base).toLowerCase() === '.md' ? base : `${base}.md`
}

function sizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function publicArtifact(row) {
  return {
    id: row.id,
    name: row.name,
    type: 'file-markdown',
    extension: 'md',
    mimeType: row.mime_type,
    size: row.size_bytes,
    sizeLabel: sizeLabel(row.size_bytes),
    description: row.description,
    answerVersion: row.answer_version,
    previewUrl: `/api/ai/artifacts/${encodeURIComponent(row.id)}/content`,
    downloadUrl: `/api/ai/artifacts/${encodeURIComponent(row.id)}/download`,
    createdAt: row.created_at,
  }
}

export class AiArtifactStore {
  constructor(database, env = process.env) {
    this.database = database
    this.root = artifactRoot(env)
    mkdirSync(this.root, { recursive: true })
  }

  migrate() {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS ai_artifact (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        conversation_id TEXT NOT NULL,
        turn_id TEXT NOT NULL,
        answer_version INTEGER NOT NULL DEFAULT 0,
        kind TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        storage_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES ai_conversation(id) ON DELETE CASCADE,
        FOREIGN KEY (turn_id) REFERENCES ai_turn(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS ai_artifact_turn_created_idx
        ON ai_artifact(turn_id, created_at ASC);

      CREATE INDEX IF NOT EXISTS ai_artifact_user_created_idx
        ON ai_artifact(user_id, created_at DESC);
    `)
  }

  createMarkdown(userId, input) {
    const owner = this.database.prepare(`
      SELECT turn.id
      FROM ai_turn AS turn
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = turn.conversation_id
      WHERE turn.id = ? AND turn.conversation_id = ? AND conversation.user_id = ?
      LIMIT 1
    `).get(input.turnId, input.conversationId, userId)
    if (!owner) {
      const error = new Error('无法为不存在的会话消息创建文件。')
      error.statusCode = 404
      throw error
    }

    const content = String(input.content || '').replace(/\r\n/g, '\n')
    const buffer = Buffer.from(content, 'utf8')
    if (!content.trim()) {
      const error = new Error('Markdown 文件内容不能为空。')
      error.statusCode = 422
      throw error
    }
    if (buffer.byteLength > MAX_MARKDOWN_BYTES) {
      const error = new Error('Markdown 文件不能超过 2 MB。')
      error.statusCode = 413
      throw error
    }

    const id = randomUUID()
    const name = safeMarkdownName(input.name)
    const userDirectory = createHash('sha256').update(userId).digest('hex')
    const userRoot = join(this.root, userDirectory)
    mkdirSync(userRoot, { recursive: true })
    const storagePath = join(userRoot, `${id}.md`)
    const temporaryPath = `${storagePath}.tmp`
    const timestamp = now()
    writeFileSync(temporaryPath, buffer, { flag: 'wx', mode: 0o600 })
    renameSync(temporaryPath, storagePath)

    try {
      this.database.prepare(`
        INSERT INTO ai_artifact (
          id, user_id, conversation_id, turn_id, answer_version, kind,
          name, description, mime_type, size_bytes, sha256, storage_path,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'markdown', ?, ?, 'text/markdown', ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        input.conversationId,
        input.turnId,
        Number.isInteger(input.answerVersion) ? input.answerVersion : 0,
        name,
        String(input.description || 'Markdown 文件').trim().slice(0, 160),
        buffer.byteLength,
        createHash('sha256').update(buffer).digest('hex'),
        storagePath,
        timestamp,
        timestamp,
      )
    } catch (error) {
      try { unlinkSync(storagePath) } catch { /* Ignore cleanup failure. */ }
      throw error
    }

    return this.get(userId, id)
  }

  listForTurn(userId, conversationId, turnId) {
    return this.database.prepare(`
      SELECT artifact.*
      FROM ai_artifact AS artifact
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = artifact.conversation_id
      WHERE artifact.turn_id = ? AND artifact.conversation_id = ? AND conversation.user_id = ?
      ORDER BY artifact.created_at ASC
    `).all(turnId, conversationId, userId).map(publicArtifact)
  }

  get(userId, artifactId) {
    const row = this.database.prepare(`
      SELECT * FROM ai_artifact
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `).get(artifactId, userId)
    return row ? publicArtifact(row) : null
  }

  content(userId, artifactId) {
    const row = this.database.prepare(`
      SELECT * FROM ai_artifact
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `).get(artifactId, userId)
    if (!row) return null
    return {
      artifact: publicArtifact(row),
      content: readFileSync(row.storage_path, 'utf8'),
    }
  }

  download(userId, artifactId) {
    const row = this.database.prepare(`
      SELECT * FROM ai_artifact
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `).get(artifactId, userId)
    if (!row) return null
    return {
      artifact: publicArtifact(row),
      stream: createReadStream(row.storage_path),
    }
  }

  deleteForConversation(userId, conversationId) {
    const rows = this.database.prepare(`
      SELECT storage_path FROM ai_artifact
      WHERE user_id = ? AND conversation_id = ?
    `).all(userId, conversationId)
    for (const row of rows) {
      try { unlinkSync(row.storage_path) } catch { /* Missing files are already clean. */ }
    }
    this.database.prepare(`
      DELETE FROM ai_artifact WHERE user_id = ? AND conversation_id = ?
    `).run(userId, conversationId)
  }

  deleteAfterTurn(userId, conversationId, turnId) {
    const target = this.database.prepare(`
      SELECT turn.position
      FROM ai_turn AS turn
      INNER JOIN ai_conversation AS conversation
        ON conversation.id = turn.conversation_id
      WHERE turn.id = ? AND turn.conversation_id = ? AND conversation.user_id = ?
      LIMIT 1
    `).get(turnId, conversationId, userId)
    if (!target) return
    const rows = this.database.prepare(`
      SELECT artifact.id, artifact.storage_path
      FROM ai_artifact AS artifact
      INNER JOIN ai_turn AS turn ON turn.id = artifact.turn_id
      WHERE artifact.user_id = ? AND artifact.conversation_id = ? AND turn.position > ?
    `).all(userId, conversationId, target.position)
    for (const row of rows) {
      try { unlinkSync(row.storage_path) } catch { /* Missing files are already clean. */ }
    }
    if (rows.length) {
      const placeholders = rows.map(() => '?').join(', ')
      this.database.prepare(`
        DELETE FROM ai_artifact
        WHERE id IN (${placeholders}) AND user_id = ?
      `).run(...rows.map((row) => row.id), userId)
    }
  }
}
