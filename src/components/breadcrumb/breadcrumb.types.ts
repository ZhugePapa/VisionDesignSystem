import type { IconName } from '../icons/generated/registry.generated'

export type VisBreadcrumbType = 'button' | 'link'
export type VisBreadcrumbSize = 'md' | 'sm'
export type VisBreadcrumbSeparator = 'slash' | 'arrow'

export interface VisBreadcrumbItem {
  label: string
  href?: string
  iconName?: IconName
  optional?: boolean
  active?: boolean
  disabled?: boolean
}

export interface VisBreadcrumbProps {
  items?: VisBreadcrumbItem[]
  type?: VisBreadcrumbType
  size?: VisBreadcrumbSize
  separator?: VisBreadcrumbSeparator
}
