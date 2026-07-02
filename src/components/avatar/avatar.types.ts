import type { IconName } from '../icons/generated/registry.generated'
import type { VisBadgeColorType } from '../badge/badge.types'

export type VisAvatarType = 'image' | 'icon' | 'text'
export type VisAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type VisAvatarState = 'default' | 'hover'
export type VisAvatarBadge = 'none' | 'dot' | 'icon' | 'number' | 'state'
export type VisAvatarImageVariant = '00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'
export type VisAvatarRealImageVariant = Exclude<VisAvatarImageVariant, '00'>
export type VisAvatarGroupSize = VisAvatarSize | 'large'
export type VisAvatarGroupShape = 'round' | 'square'
export type VisAvatarLabelAlign = 'horizontal' | 'vertical'

export interface VisAvatarProps {
  type?: VisAvatarType
  size?: VisAvatarSize
  state?: VisAvatarState
  shapeSquare?: boolean
  badge?: VisAvatarBadge
  imageSrc?: string
  imageVariant?: VisAvatarImageVariant
  imageAlt?: string
  text?: string
  icon?: IconName
  badgeIcon?: IconName
  badgeCount?: string | number
  badgeColorType?: VisBadgeColorType
  decorative?: boolean
  groupOutlined?: boolean
}

export interface VisAvatarGroupItem {
  src?: string
  alt?: string
  variant?: VisAvatarImageVariant
}

export interface VisAvatarGroupProps {
  size?: VisAvatarGroupSize
  shape?: VisAvatarGroupShape
  items?: VisAvatarGroupItem[]
  addition?: boolean
  additionLabel?: string
}

export interface VisAvatarLabelProps {
  align?: VisAvatarLabelAlign
  size?: VisAvatarSize
  addition?: boolean
  title?: string
  subtitle?: string
  avatarType?: VisAvatarType
  avatarText?: string
  avatarIcon?: IconName
  avatarImageSrc?: string
  avatarImageVariant?: VisAvatarImageVariant
  avatarImageAlt?: string
  shapeSquare?: boolean
}
