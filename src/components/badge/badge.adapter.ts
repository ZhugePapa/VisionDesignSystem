import type { TagProps as ElementTagProps } from 'element-plus'

import type {
  VisBadgeColor,
  VisBadgeColorType,
  VisBadgeProps,
  VisBadgeSize,
  VisBadgeType,
  VisBadgeVariantType,
} from './badge.types'

const legacyColorMap: Record<Exclude<VisBadgeColorType, VisBadgeColor>, VisBadgeColor> = {
  danger: 'red',
  warning: 'yellow',
  success: 'green',
  brand: 'blue',
  info: 'grey',
}

export function resolveVisBadgeColor(
  color: VisBadgeColor | undefined,
  colorType: VisBadgeColorType | undefined,
  fallback: VisBadgeColor = 'grey',
): VisBadgeColor {
  if (color) return color
  if (!colorType) return fallback
  if (colorType in legacyColorMap) {
    return legacyColorMap[colorType as keyof typeof legacyColorMap]
  }
  return colorType as VisBadgeColor
}

export function resolveVisBadgeType(type: VisBadgeType): VisBadgeVariantType {
  if (type === 'status') return 'dot'
  if (type === 'text' || type === 'number') return 'default'
  return type
}

export function resolveElementBadgeProps(
  props: VisBadgeProps,
  resolvedSize: VisBadgeSize,
): Partial<ElementTagProps> {
  return {
    ...props.elProps,
    size: resolvedSize === 'sm' ? 'small' : 'default',
    type: 'info',
    effect: 'plain',
    round: false,
    closable: false,
    disableTransitions: true,
  }
}
