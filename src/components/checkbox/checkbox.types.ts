export type VisCheckboxState = 'default' | 'hover'
export type VisCheckboxGroupAlign = 'horizontal' | 'vertical'
export type VisCheckboxValue = string | number

export interface VisCheckboxProps {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  state?: VisCheckboxState
  label?: boolean
  id?: string
  name?: string
  value?: string | number | boolean
  ariaLabel?: string
}

export interface VisCheckboxOption {
  label: string
  value: VisCheckboxValue
  disabled?: boolean
  indeterminate?: boolean
  state?: VisCheckboxState
}

export interface VisCheckboxGroupProps {
  modelValue?: VisCheckboxValue[]
  options?: VisCheckboxOption[]
  align?: VisCheckboxGroupAlign
  disabled?: boolean
  name?: string
}
