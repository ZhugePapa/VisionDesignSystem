import type { LinkProps as ElementLinkProps } from 'element-plus'

import type { VisLinkProps, VisLinkType } from './link.types'

const elementLinkTypeMap: Record<VisLinkType, NonNullable<ElementLinkProps['type']>> = {
  default: 'default',
  brand: 'primary',
  subtle: 'info',
}

export function resolveElementLinkProps(props: VisLinkProps): ElementLinkProps {
  return {
    ...props.elProps,
    type: elementLinkTypeMap[props.type ?? 'default'],
    underline: 'never',
    disabled: props.disabled ?? false,
    href: props.href ?? '',
    target: props.target ?? '_self',
    icon: undefined,
  }
}
