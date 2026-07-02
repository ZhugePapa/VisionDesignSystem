import type { VisAvatarImageVariant } from '../avatar/avatar.types'
import type { IconName } from '../icons/generated/registry.generated'

export type VisDropdownTrigger = 'button' | 'avatar'
export type VisDropdownEntryType = 'item' | 'divider' | 'search'
export type VisDropdownItemType = 'default' | 'icon' | 'avatar'
export type VisDropdownItemState = 'default' | 'hover' | 'disabled'
export type VisDropdownHeaderType = 'group' | 'avatar'

export interface VisDropdownEntry {
  type?: VisDropdownEntryType
  label?: string
  itemType?: VisDropdownItemType
  active?: boolean
  arrow?: boolean
  checkable?: boolean
  disabled?: boolean
  iconName?: IconName
  state?: VisDropdownItemState
  title?: string
  subtitle?: string
  avatarImageVariant?: VisAvatarImageVariant
}

export interface VisDropdownProps {
  items?: VisDropdownEntry[]
  open?: boolean
  trigger?: VisDropdownTrigger
  header?: boolean
  headerType?: VisDropdownHeaderType
  buttonLabel?: string
  searchValue?: string
  searchPlaceholder?: string
  avatarImageVariant?: VisAvatarImageVariant
}

export interface VisDropdownItemProps {
  label?: string
  type?: VisDropdownItemType
  active?: boolean
  arrow?: boolean
  checkable?: boolean
  disabled?: boolean
  iconName?: IconName
  title?: string
  subtitle?: string
  avatarImageVariant?: VisAvatarImageVariant
  state?: VisDropdownItemState
}

export interface VisDropdownHeaderProps {
  type?: VisDropdownHeaderType
  label?: string
  title?: string
  subtitle?: string
  avatarImageVariant?: VisAvatarImageVariant
}
