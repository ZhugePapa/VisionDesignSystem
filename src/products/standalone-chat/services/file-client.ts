import type { VisAiAttachmentItem } from '../../../components/ai'
import { AI_PRODUCT_HEADERS } from './product'

export interface VisionAiUploadedFile extends VisAiAttachmentItem {
  fileId: string
  sizeBytes: number
  status: 'ready' | 'error'
  error?: string
}

function errorMessage(payload: unknown, fallback: string): string {
  if (
    payload
    && typeof payload === 'object'
    && 'error' in payload
    && typeof payload.error === 'string'
  ) {
    return payload.error
  }
  return fallback
}

export function uploadVisionAiFiles(
  files: File[],
  onProgress?: (progress: number) => void,
  signal?: AbortSignal,
): Promise<VisionAiUploadedFile[]> {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    files.forEach((file) => body.append('files', file, file.name))

    const request = new XMLHttpRequest()
    request.open('POST', '/api/ai/files')
    request.responseType = 'json'
    request.setRequestHeader('Accept', 'application/json')
    request.setRequestHeader('X-Vision-AI-Product', AI_PRODUCT_HEADERS['X-Vision-AI-Product'])
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100))
      }
    })
    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        const payload = request.response as { files?: VisionAiUploadedFile[] } | null
        resolve(payload?.files ?? [])
        return
      }
      reject(new Error(errorMessage(
        request.response,
        `上传失败（${request.status}）`,
      )))
    })
    request.addEventListener('error', () => reject(new Error('网络连接中断，上传失败。')))
    request.addEventListener('abort', () => reject(new DOMException('Upload aborted', 'AbortError')))
    signal?.addEventListener('abort', () => request.abort(), { once: true })
    if (signal?.aborted) {
      request.abort()
      return
    }
    request.send(body)
  })
}

export async function deleteVisionAiFile(fileId: string): Promise<void> {
  const response = await fetch(`/api/ai/files/${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
    headers: AI_PRODUCT_HEADERS,
  })
  if (response.ok || response.status === 404) return

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    payload = null
  }
  throw new Error(errorMessage(payload, `删除附件失败（${response.status}）`))
}
