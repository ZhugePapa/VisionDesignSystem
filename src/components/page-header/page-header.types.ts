import type { VisBreadcrumbItem } from '../breadcrumb/breadcrumb.types'
import type { VisButtonVariant } from '../button/button.types'
import type { IconName } from '../icons/generated/registry.generated'
import type { VisTabsItem, VisTabsValue } from '../tabs/tabs.types'
import type { VisTagProps } from '../tag/tag.types'

export interface VisPageHeaderAction {
  key: string | number
  label: string
  variant?: VisButtonVariant
  iconName?: IconName
  prefix?: boolean
  suffix?: boolean
  disabled?: boolean
  loading?: boolean
}

export interface VisPageHeaderActionPayload {
  key: VisPageHeaderAction['key']
  action: VisPageHeaderAction
  event: MouseEvent
}

export interface VisPageHeaderProps {
  title?: string
  description?: string | boolean
  descriptionText?: string
  showDescription?: boolean
  breadcrumbs?: VisBreadcrumbItem[]
  breadcrumbItems?: VisBreadcrumbItem[]
  showBreadcrumb?: boolean
  breadcrumb?: boolean
  parentLink?: boolean
  tabs?: boolean | VisTabsItem[]
  tabItems?: VisTabsItem[]
  activeTab?: VisTabsValue
  icon?: IconName | boolean
  iconName?: IconName
  tag?: VisTagProps | false
  headerSuffix?: boolean
  tagLabel?: string
  tagIconName?: IconName
  actions?: boolean | VisPageHeaderAction[]
  secondaryActionLabel?: string
  primaryActionLabel?: string
  ariaLabel?: string
}
