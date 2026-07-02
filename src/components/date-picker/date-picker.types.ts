import type { IconName } from '../icons/generated/registry.generated'

export type VisDatePickerState = 'default' | 'hover' | 'focus' | 'danger'
export type VisDatePickerSingleValue = string | null
export type VisDatePickerRangeValue = [string, string] | null
export type VisDatePickerValue = VisDatePickerSingleValue | VisDatePickerRangeValue

export interface VisDatePickerShortcut {
  label: string
  days: number
}

export interface VisDatePickerProps {
  modelValue?: VisDatePickerValue
  range?: boolean
  disabled?: boolean
  state?: VisDatePickerState
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  open?: boolean
  prefix?: boolean
  prefixIcon?: IconName
  showFooterShortcuts?: boolean
  shortcuts?: VisDatePickerShortcut[]
  disabledDate?: (date: Date) => boolean
}
