export type VisTooltipPosition = 'top' | 'tl' | 'tr' | 'bottom' | 'left' | 'right'
export type VisTooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'

export interface VisTooltipProps {
  content?: string
  modelValue?: boolean
  position?: VisTooltipPosition
  trigger?: VisTooltipTrigger
  disabled?: boolean
  arrow?: boolean
}
