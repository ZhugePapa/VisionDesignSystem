export type VisDividerOrientation = 'horizontal' | 'vertical'

export interface VisDividerProps {
  orientation?: VisDividerOrientation
  dashed?: boolean
  length?: number | string
  decorative?: boolean
}
