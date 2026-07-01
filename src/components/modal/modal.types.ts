export interface VisModalMenuItem {
  key: string
  label: string
  disabled?: boolean
}

export interface VisModalProps {
  modelValue?: boolean
  title?: string
  menuTitle?: string
  divider?: boolean
  footer?: boolean
  icon?: boolean
  twoLevel?: boolean
  withMenu?: boolean
  closeable?: boolean
  width?: number | string
  height?: number | string
  menuItems?: VisModalMenuItem[]
  activeMenuKey?: string
  cancelText?: string
  confirmText?: string
  backText?: string
}

export type VisModalConfirmType = 'confirm' | 'info' | 'success' | 'danger' | 'warning'

export interface VisModalConfirmProps {
  modelValue?: boolean
  type?: VisModalConfirmType
  title?: string
  description?: string
  closeable?: boolean
  cancelText?: string
  confirmText?: string
  okText?: string
}
