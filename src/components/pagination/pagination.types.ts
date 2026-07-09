export type VisPaginationSize = 'md' | 'sm'

export interface VisPaginationProps {
  modelValue?: number
  total?: number
  pageSize?: number
  pageSizeOptions?: number[]
  pageCount?: number
  size?: VisPaginationSize
  simple?: boolean
  count?: boolean
  quantity?: boolean
  goto?: boolean
  disabled?: boolean
  ariaLabel?: string
}
