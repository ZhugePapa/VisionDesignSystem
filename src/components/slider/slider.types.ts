export type VisSliderType = 'single' | 'range'
export type VisSliderValue = number | [number, number]

export interface VisSliderProps {
  modelValue?: VisSliderValue
  type?: VisSliderType
  min?: number
  max?: number
  disabled?: boolean
  label?: boolean
  width?: number | string
  step?: number
}
