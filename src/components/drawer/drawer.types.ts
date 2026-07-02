import type { IconName } from '../icons/generated/registry.generated'

export type VisDrawerPosition = 'right' | 'bottom'

export interface VisDrawerProps {
  modelValue?: boolean
  title?: string
  position?: VisDrawerPosition
  divider?: boolean
  actions?: boolean
  icon?: boolean
  iconName?: IconName
  twoLevel?: boolean
  closeable?: boolean
  handle?: boolean
  width?: number | string
  height?: number | string
  cancelText?: string
  confirmText?: string
  backText?: string
}
