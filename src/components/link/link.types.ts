import type { LinkProps as ElementLinkProps } from 'element-plus'

import type { IconName } from '../icons/generated/registry.generated'

export type VisLinkType = 'default' | 'brand' | 'subtle'
export type VisLinkState = 'default' | 'hover'
export type VisLinkTarget = NonNullable<ElementLinkProps['target']>

export interface VisLinkProps {
  type?: VisLinkType
  state?: VisLinkState
  prefix?: boolean
  suffix?: boolean
  label?: string
  href?: string
  target?: VisLinkTarget
  disabled?: boolean
  iconName?: IconName
  suffixIconName?: IconName
  elProps?: Partial<ElementLinkProps>
}
