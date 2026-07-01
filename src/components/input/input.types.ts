import type { IconName } from '../icons/generated/registry.generated'

export type VisInputModelValue = string
export type VisInputState = 'default' | 'hover' | 'focus' | 'danger'

export interface VisInputProps {
  modelValue?: VisInputModelValue
  placeholder?: string
  valueText?: string
  state?: VisInputState
  disabled?: boolean
  filled?: boolean
  readView?: boolean
  prefix?: boolean
  suffix?: boolean
  prefixIcon?: IconName
  suffixIcon?: IconName
  addonLeft?: boolean
  addonRight?: boolean
  addonLeftText?: string
  addonRightText?: string
  maxLength?: number | boolean
  type?: string
  name?: string
  ariaLabel?: string
}
