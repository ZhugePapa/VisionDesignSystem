export type VisScrollShadowVariant = 'surface' | 'secondary'
export type VisScrollShadowOrientation = 'vertical' | 'horizontal'

export interface VisScrollShadowProps {
  variant?: VisScrollShadowVariant
  orientation?: VisScrollShadowOrientation
  size?: number
  hideScrollBar?: boolean
}
