import type { VisAiArtifactItem } from '../../../components/ai'
import { AI_PRODUCT_HEADERS } from './product'

async function responseError(response: Response): Promise<Error> {
  try {
    const payload = await response.json() as { error?: string }
    return new Error(payload.error || `Request failed with status ${response.status}`)
  } catch {
    return new Error(`Request failed with status ${response.status}`)
  }
}

export async function fetchVisionAiArtifactContent(
  artifact: VisAiArtifactItem,
): Promise<string> {
  const response = await fetch(artifact.previewUrl, {
    headers: { Accept: 'application/json', ...AI_PRODUCT_HEADERS },
  })
  if (!response.ok) throw await responseError(response)
  const payload = await response.json() as { content: string }
  return payload.content
}

export function downloadVisionAiArtifact(artifact: VisAiArtifactItem): void {
  const anchor = document.createElement('a')
  anchor.href = artifact.downloadUrl
  anchor.download = artifact.name
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}
