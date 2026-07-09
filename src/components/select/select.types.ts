import type { VisAvatarImageVariant } from '../avatar/avatar.types'
import type { IconName } from '../icons'

export type VisSelectValue = string | number
export type VisSelectModelValue = VisSelectValue | VisSelectValue[]
export type VisSelectType = 'default' | 'avatar'
export type VisSelectState = 'default' | 'hover' | 'focus' | 'danger'

export interface VisSelectOption {
  label: string
  value: VisSelectValue
  disabled?: boolean
  iconName?: IconName
  title?: string
  subtitle?: string
  avatarImageVariant?: VisAvatarImageVariant
}

export interface VisSelectProps {
  modelValue?: VisSelectModelValue
  options?: VisSelectOption[]
  type?: VisSelectType
  state?: VisSelectState
  placeholder?: string
  prefix?: boolean
  prefixIcon?: IconName
  multiSelect?: boolean
  filterable?: boolean
  disabled?: boolean
  loading?: boolean
  open?: boolean
  searchValue?: string
  width?: number | string
}
