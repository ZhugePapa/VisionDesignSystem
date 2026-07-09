export type VisInputTextareaState = 'default' | 'hover' | 'focus' | 'danger'

export interface VisInputTextareaProps {
  modelValue?: string
  placeholder?: string
  valueText?: string
  state?: VisInputTextareaState
  disabled?: boolean
  filled?: boolean
  maxLength?: number | boolean
  textCount?: boolean
  name?: string
  ariaLabel?: string
}
