export type VisAlertType = 'info' | 'primary' | 'success' | 'warning' | 'danger'

export interface VisAlertProps {
  type?: VisAlertType
  title?: string
  description?: boolean
  descriptionText?: string
  actions?: boolean
  closeable?: boolean
  detailLabel?: string
  ignoreLabel?: string
}
