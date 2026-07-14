import type { TableColumnCtx } from 'element-plus'
import type { VNode } from 'vue'

import type { VisAvatarImageVariant } from '../avatar/avatar.types'
import type { VisBadgeColorType, VisBadgeType } from '../badge/badge.types'
import type { IconName } from '../icons/generated/registry.generated'

export type VisTableAppearance = 'horizontal' | 'grid'
export type VisTableAlign = 'left' | 'center' | 'right'
export type VisTableFixed = boolean | 'left' | 'right'
export type VisTableSortable = boolean | 'custom'
export type VisTableSortOrder = 'ascending' | 'descending' | null
export type VisTableDefaultSortOrder = Exclude<VisTableSortOrder, null>
export type VisTableRowKey = string | number
export type VisTableRowData = Record<string, unknown>
export type VisTableState = 'default' | 'hover'
export type VisTableHeaderType = 'default' | 'checkbox' | 'radio' | 'shortcuts' | 'empty'
export type VisTableItemType =
  | 'tree'
  | 'heading'
  | 'text'
  | 'checkbox'
  | 'radio'
  | 'drag'
  | 'shortcuts'
  | 'rate'
  | 'actions'
  | 'number'
  | 'badge'
  | 'tag'
  | 'avatar'
export type VisTableTreeLevel = 1 | 2 | 3 | 4 | 5
export type VisTableTrend = 'up' | 'down'

export interface VisTableAction {
  icon: IconName
  label: string
  disabled?: boolean
}

export interface VisTableSortIconProps {
  state?: 'default' | 'up' | 'down'
}

export interface VisTableLinkProps {
  text?: string
  href?: string
  state?: VisTableState
}

export interface VisTableTreePrefixProps {
  level?: VisTableTreeLevel
  withFolder?: boolean
  expanded?: boolean
}

export interface VisTableTrendIconProps {
  trend?: VisTableTrend
}

export interface VisTableHeaderProps {
  type?: VisTableHeaderType
  appearance?: VisTableAppearance
  state?: VisTableState
  align?: VisTableAlign
  label?: string
  leftButton?: boolean
  prefixIcon?: IconName
  sortable?: boolean
  sortOrder?: VisTableSortOrder
  checked?: boolean
  radioChecked?: boolean
}

export interface VisTableItemProps {
  type?: VisTableItemType
  appearance?: VisTableAppearance
  state?: VisTableState
  value?: unknown
  prefix?: boolean
  suffix?: boolean
  prefixIcon?: IconName
  suffixLabel?: string
  href?: string
  checked?: boolean
  radioChecked?: boolean
  rateValue?: number
  numberValue?: string | number
  trend?: VisTableTrend
  badgeType?: VisBadgeType
  badgeColorType?: VisBadgeColorType
  badgeSolid?: boolean
  badgeSubtle?: boolean
  tagLabel?: string
  avatarTitle?: string
  avatarSubtitle?: string
  avatarImageVariant?: VisAvatarImageVariant
  avatarAddition?: boolean
  treeLevel?: VisTableTreeLevel
  treeWithFolder?: boolean
  treeExpanded?: boolean
  actions?: VisTableAction[]
}

export interface VisTableRowProps {
  appearance?: VisTableAppearance
  state?: 'default' | 'hover' | 'active'
}

export type VisTableItemPropsResolver<Row extends VisTableRowData = VisTableRowData> =
  | Omit<VisTableItemProps, 'appearance' | 'type' | 'value'>
  | ((row: Row, rowIndex: number) => Omit<VisTableItemProps, 'appearance' | 'type' | 'value'>)

export interface VisTableColumn<Row extends VisTableRowData = VisTableRowData> {
  key: string
  label: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  align?: VisTableAlign
  headerAlign?: VisTableAlign
  fixed?: VisTableFixed
  sortable?: VisTableSortable
  headerType?: VisTableHeaderType
  cellType?: VisTableItemType
  headerPrefixIcon?: IconName
  headerLeftButton?: boolean
  itemProps?: VisTableItemPropsResolver<Row>
  showOverflowTooltip?: boolean
  className?: string
  formatter?: (row: Row, column: TableColumnCtx<Row>, value: unknown, index: number) => string | VNode
}

export interface VisTableSort {
  prop: string
  order: VisTableDefaultSortOrder
}

export interface VisTableProps<Row extends VisTableRowData = VisTableRowData> {
  data?: Row[]
  columns?: VisTableColumn<Row>[]
  appearance?: VisTableAppearance
  rowKey?: string | ((row: Row) => string)
  selectable?: boolean
  highlightActiveRow?: boolean
  activeRowKey?: VisTableRowKey | null
  defaultSort?: VisTableSort
  emptyText?: string
  height?: string | number
  maxHeight?: string | number
  showHeader?: boolean
  ariaLabel?: string
}

export interface VisTableSortChange<Row extends VisTableRowData = VisTableRowData> {
  column: TableColumnCtx<Row>
  prop: string | null
  order: VisTableSortOrder
}
