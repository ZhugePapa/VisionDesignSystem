import type { CSSProperties } from 'vue'

export type VisCardState = 'default' | 'hover'
export type VisCardHoverType = 'default' | 'shadow'

export interface VisCardProps {
  state?: VisCardState
  hoverType?: VisCardHoverType
  interactive?: boolean
  showAction?: boolean
  actionLabel?: string
  bodyStyle?: string | CSSProperties | Array<string | CSSProperties>
  bodyClass?: string
}
