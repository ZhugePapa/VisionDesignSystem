import type {
  FormItemProp,
  FormItemRule,
  FormItemValidateState,
  FormRules,
  FormValidateCallback,
  FormValidationResult,
} from 'element-plus'

export type VisFormColumn = 1 | 2
export type VisFormItemSpan = 1 | 2
export type VisFormItemType =
  | 'input'
  | 'select'
  | 'select_cascading'
  | 'checkbox'
  | 'radio'
  | 'radio_button'
  | 'switch'
  | 'password'
  | 'input_number'
  | 'date_picker'
  | 'time_picker'
  | 'textarea'
  | 'rate'
  | 'upload'

export interface VisFormProps {
  model?: Record<string, any>
  rules?: FormRules
  alignLeft?: boolean
  column?: VisFormColumn
  button?: boolean
  width?: number | string
  labelWidth?: number | string
  submitText?: string
  cancelText?: string
  disabled?: boolean
  showMessage?: boolean
  validateOnRuleChange?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
}

export interface VisFormItemProps {
  prop?: FormItemProp
  label?: string
  type?: VisFormItemType
  alignLeft?: boolean
  labelWidth?: number | string
  span?: VisFormItemSpan
  required?: boolean
  optional?: boolean
  tooltip?: boolean
  tooltipText?: string
  description?: boolean | string
  rules?: FormItemRule | FormItemRule[]
  error?: string
  showMessage?: boolean
  validateStatus?: FormItemValidateState
  for?: string
}

export type VisFormRules = FormRules
export type VisFormItemRule = FormItemRule
export type VisFormValidateCallback = FormValidateCallback
export type VisFormValidationResult = FormValidationResult
export type VisFormItemProp = FormItemProp
export type VisFormItemValidateState = FormItemValidateState
