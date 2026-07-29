import type { CSSProperties } from 'vue'

export type VisCardState = 'default' | 'hover'

export interface VisCardProps {
  state?: VisCardState
  interactive?: boolean
  showAction?: boolean
  actionLabel?: string
  bodyStyle?: string | CSSProperties | Array<string | CSSProperties>
  bodyClass?: string
}
