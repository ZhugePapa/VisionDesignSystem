import type { VisAvatarImageVariant } from '../avatar/avatar.types'

export type VisCodeLineType = 'default' | 'delete' | 'add'
export type VisCodeLineState = 'default' | 'hover'
export type VisCodeLineNumberMode = 'default' | 'double' | 'none'
export type VisCodeLineNumberValue = string | number

export interface VisCodeLineData {
  key?: string | number
  content: string
  type?: VisCodeLineType
  state?: VisCodeLineState
  active?: boolean
  divider?: boolean
  number?: VisCodeLineNumberMode
  lineNumber?: VisCodeLineNumberValue
  oldLineNumber?: VisCodeLineNumberValue
  newLineNumber?: VisCodeLineNumberValue
  commentable?: boolean
  /** Whether pointer-driven hover, active, click, and comment interactions are enabled. */
  interactive?: boolean
  wrap?: boolean
  ariaLabel?: string
}

export interface VisCodeLineProps extends Omit<VisCodeLineData, 'key'> {}

export interface VisCodeLineClickPayload {
  lineNumber?: VisCodeLineNumberValue
  oldLineNumber?: VisCodeLineNumberValue
  newLineNumber?: VisCodeLineNumberValue
  content: string
  nativeEvent: MouseEvent
}

export type VisCodeBlameRank = 'default' | 'rank2' | 'rank3' | 'rank4' | 'rank5' | 'rank6'

export interface VisCodeBlameBarProps {
  rank?: VisCodeBlameRank
}

export interface VisCodeBlameProps {
  author?: string
  avatarImageSrc?: string
  avatarImageVariant?: VisAvatarImageVariant
  avatarImageAlt?: string
  commit?: string
  time?: string
  rank?: VisCodeBlameRank
  lines?: VisCodeLineData[]
  ariaLabel?: string
}
