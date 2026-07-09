import type { IconName } from '../icons/generated/registry.generated'

export type VisTabsAlign = 'horizontal' | 'right'
export type VisTabsValue = string | number

export interface VisTabsItem {
  value: VisTabsValue
  label?: string
  iconName?: IconName
  count?: string | number
  disabled?: boolean
  ariaLabel?: string
}

export interface VisTabsProps {
  modelValue?: VisTabsValue
  defaultValue?: VisTabsValue
  items?: VisTabsItem[]
  align?: VisTabsAlign
  actions?: boolean
  ariaLabel?: string
}
