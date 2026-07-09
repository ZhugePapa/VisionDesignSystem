import type { IconName } from '../icons'

export type VisInputNumberPosition = 'default' | 'right'
export type VisInputNumberState = 'default' | 'hover' | 'focus' | 'danger'

export interface VisInputNumberProps {
  modelValue?: number
  width?: number | string
  position?: VisInputNumberPosition
  state?: VisInputNumberState
  disabled?: boolean
  prefixIcon?: boolean
  suffixIcon?: boolean
  rightControls?: boolean
  prefixIconName?: IconName
  suffixIconName?: IconName
  min?: number
  max?: number
  step?: number
  name?: string
  ariaLabel?: string
}
