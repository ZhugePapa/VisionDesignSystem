import type { IconName } from '../icons/generated/registry.generated'

export type VisDescriptionDirection = 'horizontal' | 'vertical'
export type VisDescriptionItemType = 'text' | 'tag' | 'customize'

export interface VisDescriptionTag {
  label: string
  iconName?: IconName
}

export interface VisDescriptionProps {
  border?: boolean
  direction?: VisDescriptionDirection
  columns?: number
  title?: boolean
  titleText?: string
  foldable?: boolean
  collapsed?: boolean
  alert?: boolean
  alertText?: string
  labelWidth?: number | string
  ariaLabel?: string
}

export interface VisDescriptionTitleProps {
  title?: string
  foldable?: boolean
  collapsed?: boolean
}

export interface VisDescriptionItemProps {
  label?: string
  value?: string | number
  type?: VisDescriptionItemType
  tags?: VisDescriptionTag[]
  border?: boolean
  direction?: VisDescriptionDirection
  icon?: boolean
  iconName?: IconName
  span?: number
  labelWidth?: number | string
}
