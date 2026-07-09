export type VisToggleState = 'default' | 'hover' | 'focus' | 'loading'

export interface VisToggleChangePayload {
  checked: boolean
  value?: string | number | boolean
}

export interface VisToggleProps {
  modelValue?: boolean
  disabled?: boolean
  state?: VisToggleState
  icon?: boolean
  text?: boolean
  id?: string
  name?: string
  value?: string | number | boolean
  ariaLabel?: string
}
