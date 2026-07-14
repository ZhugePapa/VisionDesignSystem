export type VisDividerOrientation = 'horizontal' | 'vertical'
export type VisDividerType = VisDividerOrientation | 'content'

export interface VisDividerProps {
  type?: VisDividerType
  /** @deprecated Use `type` instead. */
  orientation?: VisDividerOrientation
  dashed?: boolean
  length?: number | string
  content?: string
  decorative?: boolean
}
