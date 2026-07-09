import type { IconName } from '../icons/generated/registry.generated'

export type VisSegmentedSize = 'md' | 'lg'
export type VisSegmentedValue = string | number

export interface VisSegmentedOption {
  value: VisSegmentedValue
  label?: string
  iconName?: IconName
  disabled?: boolean
  ariaLabel?: string
}

export interface VisSegmentedProps {
  modelValue?: VisSegmentedValue
  defaultValue?: VisSegmentedValue
  options?: VisSegmentedOption[]
  size?: VisSegmentedSize
  icon?: boolean
  text?: boolean
  disabled?: boolean
  ariaLabel?: string
}
