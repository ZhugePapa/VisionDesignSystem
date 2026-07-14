export type VisTimePickerType = 'HH MM SS' | 'HH MM'
export type VisTimePickerState = 'default' | 'hover' | 'focus' | 'danger'
export type VisTimePickerSingleValue = string | null
export type VisTimePickerRangeValue = [string, string] | null
export type VisTimePickerValue = VisTimePickerSingleValue | VisTimePickerRangeValue

export interface VisTimePickerProps {
  modelValue?: VisTimePickerValue
  range?: boolean
  type?: VisTimePickerType
  timeSelect?: boolean
  state?: VisTimePickerState
  disabled?: boolean
  readView?: boolean
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  open?: boolean
}
