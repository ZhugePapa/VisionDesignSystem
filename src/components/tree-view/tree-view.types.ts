import type { IconName } from '../icons'

export type VisTreeViewKey = string | number
export type VisTreeViewFolderType = 'default' | '+/-'

export interface VisTreeViewItem {
  key: VisTreeViewKey
  label: string
  children?: VisTreeViewItem[]
  disabled?: boolean
  icon?: IconName
  suffix?: string
}

export interface VisTreeViewProps {
  items?: VisTreeViewItem[]
  expandedKeys?: VisTreeViewKey[]
  selectedKey?: VisTreeViewKey | null
  checkedKeys?: VisTreeViewKey[]
  checkable?: boolean
  draggable?: boolean
  icon?: boolean
  actions?: boolean
  folderType?: VisTreeViewFolderType
  width?: number | string
}
