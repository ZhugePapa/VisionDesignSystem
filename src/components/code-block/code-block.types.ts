export type VisCodeBlockType = 'default' | 'show_more'

export interface VisCodeBlockProps {
  type?: VisCodeBlockType
  collapsed?: boolean
  autoHeight?: boolean
  heading?: boolean
  copy?: boolean
  language?: string
  code?: string
}
