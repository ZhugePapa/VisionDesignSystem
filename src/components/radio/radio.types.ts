export type VisRadioState = 'default' | 'hover'
export type VisRadioGroupAlign = 'horizontal' | 'vertical'
export type VisRadioValue = string | number | boolean

export interface VisRadioProps {
  modelValue?: boolean
  disabled?: boolean
  state?: VisRadioState
  radioButton?: boolean
  label?: boolean
  id?: string
  name?: string
  value?: VisRadioValue
  ariaLabel?: string
}

export interface VisRadioOption {
  label: string
  value: VisRadioValue
  disabled?: boolean
  state?: VisRadioState
}

export interface VisRadioGroupProps {
  modelValue?: VisRadioValue | null
  options?: VisRadioOption[]
  align?: VisRadioGroupAlign
  disabled?: boolean
  name?: string
  radioButton?: boolean
}
