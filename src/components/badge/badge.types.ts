import type { TagProps as ElementTagProps } from 'element-plus'

import type { IconName } from '../icons/generated/registry.generated'

export type VisBadgeColor =
  | 'grey'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'moss'
  | 'green'
  | 'aqua'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'violet'
  | 'scarlet'
  | 'pink'

export type VisBadgeSize = 'sm' | 'md'
export type VisBadgeVariantType = 'default' | 'icon' | 'dot'

/** @deprecated Use the Figma `color` prop. Legacy semantic values remain supported. */
export type VisBadgeColorType = VisBadgeColor | 'danger' | 'warning' | 'success' | 'brand' | 'info'

/** @deprecated Prefer `default | icon | dot`. Legacy values remain supported during migration. */
export type VisBadgeType = VisBadgeVariantType | 'status' | 'text' | 'number'

export interface VisBadgeProps {
  /** Figma color axis. */
  color?: VisBadgeColor
  /** Figma size axis. */
  size?: VisBadgeSize
  /** Figma type axis, plus legacy aliases. */
  type?: VisBadgeType
  solid?: boolean
  dotOnly?: boolean
  iconOnly?: boolean
  label?: string
  iconName?: IconName
  /** @deprecated Use `color`. */
  colorType?: VisBadgeColorType
  /** @deprecated Use `label`. Kept for the legacy number badge. */
  count?: string | number
  /** @deprecated Figma Badge no longer has a subtle variant. */
  subtle?: boolean
  /** Additional Element Plus Tag props. Vision-owned props always take precedence. */
  elProps?: Partial<ElementTagProps>
}
