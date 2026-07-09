import type { IconName } from '../icons/generated/registry.generated'

export type VisToggleButtonSize = 'sm' | 'md' | 'lg'
export type VisToggleButtonState = 'default' | 'hover' | 'focus' | 'active' | 'disabled'
export type VisToggleButtonNativeType = 'button' | 'submit' | 'reset'

export interface VisToggleButtonProps {
  modelValue?: boolean
  defaultPressed?: boolean
  size?: VisToggleButtonSize
  state?: VisToggleButtonState
  disabled?: boolean
  iconOnly?: boolean
  prefix?: boolean
  suffix?: boolean
  label?: string
  iconName?: IconName
  suffixIconName?: IconName
  htmlType?: VisToggleButtonNativeType
}
