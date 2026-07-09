export type VisProgressCircleSize = 'xs' | 'sm' | 'md' | 'lg'
export type VisProgressCircleStatus = 'default' | 'success' | 'danger'

export interface VisProgressCircleProps {
  size?: VisProgressCircleSize
  value?: number
  status?: VisProgressCircleStatus
  label?: boolean
  labelText?: string
  description?: string
  decorative?: boolean
  ariaLabel?: string
}
