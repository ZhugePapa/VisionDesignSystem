import type { VisAvatarImageVariant } from '../avatar/avatar.types'
import type { IconName } from '../icons/generated/registry.generated'

export type VisNotificationType = 'info' | 'success' | 'warning' | 'danger' | 'avatar' | 'icon' | 'no_icon'

export interface VisNotificationProps {
  type?: VisNotificationType
  title?: string
  description?: string
  actions?: boolean
  closeable?: boolean
  modelValue?: boolean
  width?: number | string
  iconName?: IconName
  avatarImageVariant?: VisAvatarImageVariant
  avatarName?: string
  avatarTime?: string
  actionPrimaryText?: string
  actionSecondaryText?: string
  autoClose?: boolean
}
