export type VisProgressBarStatus = 'default' | 'success' | 'danger'
export type VisProgressBarLabel = 'none' | 'right' | 'bottom'

export type VisProgressBarColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'moss'
  | 'green'
  | 'aqua'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'violet'
  | 'scarlet'
  | 'pink'
  | 'grey'

export interface VisProgressBarProps {
  value?: number
  status?: VisProgressBarStatus
  label?: VisProgressBarLabel
  labelText?: string
  loading?: boolean
  width?: number | string
  decorative?: boolean
  ariaLabel?: string
}

export interface VisProgressBarSegment {
  value: number
  label: string
  color?: VisProgressBarColor
}

export interface VisProgressBarMultipleProps {
  segments?: VisProgressBarSegment[]
  label?: boolean
  width?: number | string
  decorative?: boolean
  ariaLabel?: string
}
