import type { IconName } from '../icons/generated/registry.generated'

export type VisPopoverPosition = 'top' | 'tl' | 'tr' | 'bottom' | 'left' | 'right'
export type VisPopoverTrigger = 'hover' | 'focus' | 'click' | 'manual'

export interface VisPopoverProps {
  modelValue?: boolean
  position?: VisPopoverPosition
  trigger?: VisPopoverTrigger
  disabled?: boolean
  arrow?: boolean
  title?: string
  content?: string
  showTitle?: boolean
  icon?: boolean
  iconName?: IconName
  actions?: boolean
  closeButton?: boolean
  cancelText?: string
  confirmText?: string
  width?: number | string
}
