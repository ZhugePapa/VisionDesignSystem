import type { IconName } from '../icons/generated/registry.generated'

export type VisBadgeColorType = 'danger' | 'warning' | 'success' | 'brand' | 'grey' | 'info'
export type VisBadgeType = 'status' | 'text' | 'icon' | 'dot' | 'number'

export interface VisBadgeProps {
  colorType?: VisBadgeColorType
  type?: VisBadgeType
  solid?: boolean
  subtle?: boolean
  label?: string
  count?: string | number
  iconName?: IconName
}
