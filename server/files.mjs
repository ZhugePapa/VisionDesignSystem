import { createHash, randomUUID } from 'node:crypto'
import {
  createReadStream,
  createWriteStream,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
} from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { finished } from 'node:stream/promises'

import Busboy from 'busboy'
import mammoth from 'mammoth'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import sharp from 'sharp'

const MAX_FILES = 8
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_BYTES = 25 * 1024 * 1024
const MAX_EXTRACTED_CHARS = 100_000
const MAX_PDF_PAGES = 50

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'log', 'csv', 'json', 'yaml', 'yml', 'xml',
  'html', 'css', 'js', 'jsx', 'ts', 'tsx', 'vue',
  'py', 'java', 'go', 'rs', 'c', 'h', 'cpp', 'hpp', 'sql', 'sh',
])
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp'])
const DOCUMENT_EXTENSIONS = new Set(['pdf', 'docx'])
const ALLOWED_EXTENSIONS = new Set([
  ...TEXT_EXTENSIONS,
  ...IMAGE_EXTENSIONS,
  ...DOCUMENT_EXTENSIONS,
])

const MIME_BY_EXTENSION = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const FILE_ICON_BY_EXTENSION = {
  pdf: 'pdf',
  docx: 'word',
  csv: 'csv',
  json: 'code',
  html: 'code',
  css: 'code',
  js: 'code',
  jsx: 'code',
  ts: 'code',
  tsx: 'code',
  vue: 'code',
  py: 'code',
  java: 'code',
  go: 'code',
  rs: 'code',
  c: 'code',
  h: 'code',
  cpp: 'code',
  hpp: 'code',
  sql: 'code',
  sh: 'code',
}

function now() {
  return new Date().toISOString()
}

function uploadRoot(env) {
  return resolve(env.VISION_AI_UPLOAD_DIR || '.data/uploads')
}

function safeOriginalName(value) {
  const normalized = basename(String(value || 'file'))
    .replaceAll('\0', '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
  return (normalized || 'file').slice(0, 255)
}

function extensionOf(filename) {
  return extname(filename).slice(1).toLowerCase()
}

function detectMagic(buffer) {
  if (
    buffer.length >= 8
    && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) return 'png'
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg'
  }
  if (
    buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) return 'webp'
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-') return 'pdf'
  if (
    buffer.length >= 4
    && buffer[0] === 0x50
    && buffer[1] === 0x4b
    && [0x03, 0x05, 0x07].includes(buffer[2])
    && [0x04, 0x06, 0x08].includes(buffer[3])
  ) return 'zip'
  return 'text'
}

function assertSupportedType(buffer, extension) {
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    const error = new Error(`不支持 .${extension || '未知'} 文件。`)
    error.statusCode = 415
    throw error
  }

  const magic = detectMagic(buffer)
  const expected = extension === 'jpg' ? 'jpeg' : extension
  if (IMAGE_EXTENSIONS.has(extension) && magic !== expected) {
    const error = new Error('图片内容与文件扩展名不一致。')
    error.statusCode = 415
    throw error
  }
  if (extension === 'pdf' && magic !== 'pdf') {
    const error = new Error('PDF 内容与文件扩展名不一致。')
    error.statusCode = 415
    throw error
  }
  if (extension === 'docx' && magic !== 'zip') {
    const error = new Error('DOCX 内容与文件扩展名不一致。')
    error.statusCode = 415
    throw error
  }
  if (TEXT_EXTENSIONS.has(extension) && magic !== 'text') {
    const error = new Error('文本文件包含不支持的二进制内容。')
    error.statusCode = 415
    throw error
  }
  if (TEXT_EXTENSIONS.has(extension)) {
    const nulCount = buffer.subarray(0, 8192).reduce(
      (count, value) => count + Number(value === 0),
      0,
    )
    if (nulCount > 0) {
      const error = new Error('文本文件包含不支持的二进制内容。')
      error.statusCode = 415
      throw error
    }
  }
}

function truncatedText(value) {
  const text = String(value || '').replace(/\r\n/g, '\n').trim()
  return text.slice(0, MAX_EXTRACTED_CHARS)
}

async function extractPdf(buffer) {
  const document = await getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
    useWorkerFetch: false,
  }).promise

  try {
    if (document.numPages > MAX_PDF_PAGES) {
      const error = new Error(`PDF 不能超过 ${MAX_PDF_PAGES} 页。`)
      error.statusCode = 413
      throw error
    }

    const pages = []
    for (let index = 1; index <= document.numPages; index += 1) {
      const page = await document.getPage(index)
      const content = await page.getTextContent()
      const text = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
        .trim()
      if (text) pages.push(`[第 ${index} 页]\n${text}`)
      if (pages.join('\n\n').length >= MAX_EXTRACTED_CHARS) break
    }
    const extracted = truncatedText(pages.join('\n\n'))
    if (!extracted) {
      const error = new Error('该 PDF 没有可复制文字，第一期暂不支持扫描版 PDF。')
      error.statusCode = 422
      throw error
    }
    return extracted
  } finally {
    await document.destroy()
  }
}

async function extractText(buffer, extension) {
  if (TEXT_EXTENSIONS.has(extension)) {
    return truncatedText(new TextDecoder('utf-8').decode(buffer))
  }
  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer })
    const extracted = truncatedText(result.value)
    if (!extracted) {
      const error = new Error('DOCX 中没有可读取的正文。')
      error.statusCode = 422
      throw error
    }
    return extracted
  }
  if (extension === 'pdf') return extractPdf(buffer)
  return ''
}

async function sanitizeImage(buffer, extension) {
  const image = sharp(buffer, {
    failOn: 'warning',
    limitInputPixels: 4096 * 4096 * 4,
  }).rotate().resize({
    width: 4096,
    height: 4096,
    fit: 'inside',
    withoutEnlargement: true,
  })
  if (extension === 'png') return image.png().toBuffer()
  if (extension === 'webp') return image.webp({ quality: 90 }).toBuffer()
  return image.jpeg({ quality: 90 }).toBuffer()
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function publicFile(row) {
  return {
    key: row.id,
    fileId: row.id,
    name: row.original_name,
    type: row.mime_type.startsWith('image/') ? 'image' : 'file',
    extension: row.extension,
    fileIconType: FILE_ICON_BY_EXTENSION[row.extension] || 'default',
    size: formatBytes(row.size_bytes),
    sizeBytes: row.size_bytes,
    url: `/api/ai/files/${encodeURIComponent(row.id)}/content`,
    alt: row.original_name,
    status: row.status,
    error: row.error || undefined,
    removable: true,
  }
}

export class AiFileStore {
  constructor(database, env = process.env) {
    this.database = database
    this.root = uploadRoot(env)
    mkdirSync(this.root, { recursive: true })
  }

  migrate() {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS ai_file (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        extension TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        status TEXT NOT NULL,
        extracted_text TEXT NOT NULL DEFAULT '',
        storage_path TEXT NOT NULL,
        error TEXT NOT NULL DEFAULT '',
        referenced_at TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS ai_file_user_created_idx
        ON ai_file(user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS ai_file_user_hash_idx
        ON ai_file(user_id, sha256);
    `)
    const columns = this.database.prepare('PRAGMA table_info(ai_file)').all()
    if (!columns.some((column) => column.name === 'referenced_at')) {
      this.database.exec(
        "ALTER TABLE ai_file ADD COLUMN referenced_at TEXT NOT NULL DEFAULT ''",
      )
    }
    this.cleanupOrphans()
  }

  get(userId, fileId) {
    return this.database.prepare(`
      SELECT *
      FROM ai_file
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `).get(fileId, userId) || null
  }

  async createFromTemporary(userId, input) {
    const originalName = safeOriginalName(input.filename)
    const extension = extensionOf(originalName)
    let buffer = readFileSync(input.temporaryPath)
    unlinkSync(input.temporaryPath)
    assertSupportedType(buffer, extension)

    if (IMAGE_EXTENSIONS.has(extension)) {
      if (buffer.length > MAX_IMAGE_BYTES) {
        const error = new Error('图片不能超过 8 MB。')
        error.statusCode = 413
        throw error
      }
      buffer = await sanitizeImage(buffer, extension)
    }

    const extractedText = await extractText(buffer, extension)
    const id = randomUUID()
    const storagePath = join(this.root, `${id}.${extension}`)
    const temporaryStoragePath = `${storagePath}.tmp`
    const writer = createWriteStream(temporaryStoragePath, { flags: 'wx', mode: 0o600 })
    writer.end(buffer)
    await finished(writer)
    renameSync(temporaryStoragePath, storagePath)

    const timestamp = now()
    const mimeType = MIME_BY_EXTENSION[extension] || 'text/plain'
    const sha256 = createHash('sha256').update(buffer).digest('hex')
    this.database.prepare(`
      INSERT INTO ai_file (
        id, user_id, original_name, mime_type, extension, size_bytes,
        sha256, status, extracted_text, storage_path, error, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ready', ?, ?, '', ?, ?)
    `).run(
      id,
      userId,
      originalName,
      mimeType,
      extension,
      buffer.length,
      sha256,
      extractedText,
      storagePath,
      timestamp,
      timestamp,
    )

    return publicFile(this.get(userId, id))
  }

  delete(userId, fileId) {
    const row = this.get(userId, fileId)
    if (!row) return false
    const result = this.database.prepare(`
      DELETE FROM ai_file
      WHERE id = ? AND user_id = ?
    `).run(fileId, userId)
    if (result.changes > 0) {
      try {
        unlinkSync(row.storage_path)
      } catch {
        // The database ownership record is authoritative even if the file is already absent.
      }
    }
    return result.changes > 0
  }

  markReferenced(userId, fileIds) {
    const statement = this.database.prepare(`
      UPDATE ai_file
      SET referenced_at = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `)
    const timestamp = now()
    for (const fileId of fileIds) {
      statement.run(timestamp, timestamp, fileId, userId)
    }
  }

  cleanupOrphans() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const rows = this.database.prepare(`
      SELECT id, user_id, storage_path
      FROM ai_file
      WHERE referenced_at = '' AND created_at < ?
    `).all(cutoff)
    for (const row of rows) {
      this.delete(row.user_id, row.id)
    }
  }

  fileResponse(userId, fileId) {
    const row = this.get(userId, fileId)
    if (!row || row.status !== 'ready') return null
    return {
      stream: createReadStream(row.storage_path),
      mimeType: row.mime_type,
      filename: row.original_name,
      size: row.size_bytes,
    }
  }

  resolve(userId, attachments) {
    return attachments.map((attachment) => {
      const fileId = String(attachment.fileId || attachment.key || '')
      const row = this.get(userId, fileId)
      if (!row || row.status !== 'ready') {
        const error = new Error('附件不存在、尚未处理完成或不属于当前账号。')
        error.statusCode = 400
        throw error
      }
      return {
        ...publicFile(row),
        extractedText: row.extracted_text,
        storagePath: row.storage_path,
        mimeType: row.mime_type,
      }
    })
  }

  cacheExtractedText(userId, fileIds, text) {
    const timestamp = now()
    const statement = this.database.prepare(`
      UPDATE ai_file
      SET extracted_text = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `)
    for (const fileId of fileIds) {
      statement.run(truncatedText(text), timestamp, fileId, userId)
    }
  }
}

export async function receiveMultipartFiles(req, temporaryDirectory) {
  mkdirSync(temporaryDirectory, { recursive: true })
  const busboy = Busboy({
    headers: req.headers,
    defParamCharset: 'utf8',
    limits: {
      fileSize: MAX_FILE_BYTES,
      files: MAX_FILES,
      parts: MAX_FILES,
    },
  })
  const pending = []
  const files = []
  let totalBytes = 0
  let limitError

  busboy.on('file', (_fieldName, stream, info) => {
    const temporaryPath = join(temporaryDirectory, `${randomUUID()}.upload`)
    const writer = createWriteStream(temporaryPath, { flags: 'wx', mode: 0o600 })
    const entry = {
      filename: info.filename,
      mimeType: info.mimeType,
      temporaryPath,
    }
    files.push(entry)

    stream.on('data', (chunk) => {
      totalBytes += chunk.length
      if (totalBytes > MAX_TOTAL_BYTES && !limitError) {
        limitError = new Error('单次上传总大小不能超过 25 MB。')
        limitError.statusCode = 413
        stream.destroy(limitError)
      }
    })
    stream.on('limit', () => {
      if (!limitError) {
        limitError = new Error('单个文件不能超过 10 MB。')
        limitError.statusCode = 413
      }
    })
    stream.pipe(writer)
    pending.push(finished(writer))
  })

  const completed = new Promise((resolvePromise, rejectPromise) => {
    busboy.once('error', rejectPromise)
    busboy.once('filesLimit', () => {
      const error = new Error(`单次最多上传 ${MAX_FILES} 个文件。`)
      error.statusCode = 413
      limitError = error
    })
    busboy.once('finish', resolvePromise)
  })

  req.pipe(busboy)
  await completed
  await Promise.allSettled(pending)

  if (!files.length && !limitError) {
    const error = new Error('请选择要上传的文件。')
    error.statusCode = 400
    limitError = error
  }
  if (limitError) {
    for (const file of files) {
      try {
        unlinkSync(file.temporaryPath)
      } catch {
        // Ignore incomplete temporary files.
      }
    }
    throw limitError
  }
  return files
}

export function attachmentContext(files) {
  const blocks = files
    .filter((file) => file.extractedText)
    .map((file) => (
      `<attachment name="${String(file.name).replaceAll('&', '&amp;').replaceAll('"', '&quot;')}" type="${file.mimeType}">\n`
      + `${file.extractedText}\n`
      + '</attachment>'
    ))
  return blocks.length ? `\n\n${blocks.join('\n\n')}` : ''
}

export function imagePayload(files) {
  return files
    .filter((file) => file.mimeType?.startsWith('image/'))
    .map((file) => readFileSync(file.storagePath).toString('base64'))
}

export const fileUploadLimits = {
  maxFiles: MAX_FILES,
  maxFileBytes: MAX_FILE_BYTES,
  maxTotalBytes: MAX_TOTAL_BYTES,
}
