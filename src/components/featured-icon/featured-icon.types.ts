import type { IconName } from '../icons'

export type VisFeaturedIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type VisFeaturedIconColor = 'brand' | 'grey' | 'danger' | 'warning' | 'success'
export type VisFeaturedIconType = 'light-round' | 'light-square' | 'solid-round' | 'solid-square' | 'modern'

export interface VisFeaturedIconProps {
  size?: VisFeaturedIconSize
  color?: VisFeaturedIconColor
  type?: VisFeaturedIconType
  icon?: IconName
  label?: string
  decorative?: boolean
}
