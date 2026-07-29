import type { VisFileIconType } from './file-icon.types'

export { default as VisFileIcon } from './VisFileIcon.vue'
export { visFileIconTypes } from './file-icon.types'
export type { VisFileIconProps, VisFileIconType } from './file-icon.types'

const codeExtensions = new Set([
  'c',
  'cc',
  'cpp',
  'css',
  'go',
  'h',
  'hpp',
  'html',
  'java',
  'js',
  'jsx',
  'json',
  'kt',
  'php',
  'py',
  'rb',
  'rs',
  'sh',
  'swift',
  'ts',
  'tsx',
  'vue',
  'xml',
  'yaml',
  'yml',
])

export function resolveVisFileIconType(extension = ''): VisFileIconType {
  const value = extension.trim().toLowerCase().replace(/^\./, '')

  if (['doc', 'docx'].includes(value)) return 'word'
  if (['xls', 'xlsx', 'csv'].includes(value)) return 'excel'
  if (['ppt', 'pptx'].includes(value)) return 'ppt'
  if (value === 'pdf') return 'pdf'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(value)) return 'zip'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(value)) return 'image'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(value)) return 'video'
  if (['txt', 'md', 'rtf', 'log'].includes(value)) return 'text'
  if (codeExtensions.has(value)) return 'code'
  return 'unknown'
}
