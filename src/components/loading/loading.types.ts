export type VisLoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type VisLoadingColor = 'grey' | 'brand' | 'white' | 'danger'

export interface VisLoadingProps {
  size?: VisLoadingSize
  color?: VisLoadingColor
  text?: boolean
  label?: string
  decorative?: boolean
}
