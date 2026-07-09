import type { IconName } from '../icons'

export type VisUploadType = 'button' | 'trigger' | 'drag'
export type VisUploadFileStatus = 'default' | 'loading' | 'danger'

export interface VisUploadFileItem {
  id: string | number
  name: string
  status?: VisUploadFileStatus
  url?: string
}

export interface VisUploadProps {
  modelValue?: VisUploadFileItem[]
  type?: VisUploadType
  uploaded?: boolean
  description?: boolean
  disabled?: boolean
  multiple?: boolean
  accept?: string
  buttonText?: string
  dragTitle?: string
  dragDescription?: string
  descriptionText?: string
  fileIconName?: IconName
}
