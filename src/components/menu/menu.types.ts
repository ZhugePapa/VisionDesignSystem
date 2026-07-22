import type { IconName } from '../icons/generated/registry.generated'

export type VisMenuKey = string | number
export type VisMenuType = 'project' | 'main'
export type VisMenuItemState = 'default' | 'hover'
export type VisProjectLogoVariant = 'logo_001' | 'logo_002' | 'logo_003' | 'logo_004'

export interface VisMenuItemData {
  key: VisMenuKey
  label: string
  iconName?: IconName
  projectLogo?: VisProjectLogoVariant
  route?: unknown
  disabled?: boolean
  badgeCount?: string | number
  children?: VisMenuItemData[]
  defaultChildKey?: VisMenuKey
}

export interface VisMenuSection {
  key: VisMenuKey
  label?: string
  items: VisMenuItemData[]
}

export interface VisMenuProject {
  key: VisMenuKey
  label: string
  iconName?: IconName
  logoVariant?: VisProjectLogoVariant
  route?: unknown
  disabled?: boolean
}

export interface VisMenuSelectPayload {
  key: VisMenuKey
  item: VisMenuItemData
  route?: unknown
  source: 'item' | 'parent' | 'flyout'
  parent?: VisMenuItemData
}

export interface VisMenuProps {
  type?: VisMenuType
  items?: VisMenuItemData[]
  sections?: VisMenuSection[]
  activeKey?: VisMenuKey
  openKey?: VisMenuKey | null
  collapsed?: boolean
  project?: VisMenuProject
  projects?: VisMenuProject[]
  projectSwitcherOpen?: boolean
  brandTitle?: string
  showFooter?: boolean
  helpLabel?: string
  moreProjectsLabel?: string
}

export interface VisMenuItemProps {
  item: VisMenuItemData
  active?: boolean
  open?: boolean
  collapsed?: boolean
  subLevel?: boolean
  state?: VisMenuItemState
}

export interface VisMenuGroupProps {
  label?: string
}

export interface VisProjectCellProps {
  project?: VisMenuProject
  collapsed?: boolean
  active?: boolean
}

export interface VisProjectLogoProps {
  variant?: VisProjectLogoVariant
  size?: number
}

export interface VisMenuBrandMarkProps {
  size?: number
}
