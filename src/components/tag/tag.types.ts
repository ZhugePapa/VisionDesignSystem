import type { IconName } from '../icons/generated/registry.generated'

export type VisTagType = 'default' | 'icon' | 'avatar' | 'dot'
export type VisTagCloseState = 'default' | 'hover'
export type VisTagAvatarVariant = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'

export interface VisTagProps {
  type?: VisTagType
  checkable?: boolean
  checked?: boolean
  closable?: boolean
  closeState?: VisTagCloseState
  label?: string
  iconName?: IconName
  avatarSrc?: string
  avatarVariant?: VisTagAvatarVariant
  avatarAlt?: string
}
