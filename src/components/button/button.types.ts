import type { IconName } from '../icons/generated/registry.generated'

export type VisButtonSize = 'sm' | 'md' | 'lg'
export type VisButtonVariant =
  | 'primary'
  | 'secondary'
  | 'text'
  | 'link-grey'
  | 'link-color'
  | 'link_grey'
  | 'link_color'
export type VisButtonState = 'default' | 'hover' | 'pressing' | 'focused' | 'disabled' | 'loading'
export type VisButtonNativeType = 'button' | 'submit' | 'reset'

export interface VisButtonProps {
  variant?: VisButtonVariant
  size?: VisButtonSize
  state?: VisButtonState
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  iconOnly?: boolean
  prefix?: boolean
  suffix?: boolean
  label?: string
  iconName?: IconName
  suffixIconName?: IconName
  htmlType?: VisButtonNativeType
}
