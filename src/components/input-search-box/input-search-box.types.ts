import type { IconName } from '../icons'

export type VisInputSearchBoxState = 'default' | 'hover' | 'focus'

export interface VisInputSearchBoxProps {
  modelValue?: string
  placeholder?: string
  valueText?: string
  filled?: boolean
  filter?: boolean
  simple?: boolean
  disabled?: boolean
  state?: VisInputSearchBoxState
  ariaLabel?: string
  searchIconName?: IconName
  filterIconName?: IconName
}
