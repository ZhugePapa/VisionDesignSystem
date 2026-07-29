export const visFileIconTypes = [
  'code',
  'excel',
  'folder',
  'folder-opened',
  'image',
  'pdf',
  'ppt',
  'text',
  'unknown',
  'video',
  'word',
  'zip',
] as const

export type VisFileIconType = (typeof visFileIconTypes)[number]

export interface VisFileIconProps {
  type?: VisFileIconType
  size?: number | string
  label?: string
  decorative?: boolean
}
