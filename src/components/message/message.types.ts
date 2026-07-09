export type VisMessageType = 'info' | 'success' | 'warning' | 'danger' | 'loading'

export interface VisMessageProps {
  type?: VisMessageType
  text?: string
  modelValue?: boolean
  autoClose?: boolean
  duration?: number
}
