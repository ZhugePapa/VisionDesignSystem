import type { IconName } from '../icons'
import type { VisFileIconType } from '../file-icon'

export type VisAiKey = string | number
export type VisAiConversationAction = 'share' | 'rename' | 'pin' | 'delete'
export type VisAiSenderSpeed = 'low' | 'medium' | 'high' | 'ultra'

export type VisAiAttachmentType = 'file' | 'image'
export type VisAiSkillColor =
  | 'grey'
  | 'blue'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'moss'
  | 'green'
  | 'aqua'
  | 'cyan'
  | 'purple'
  | 'violet'
  | 'scarlet'
  | 'acarlet'
  | 'pink'
export type VisAiSkillState = 'default' | 'hover'
export type VisAiBubbleState = 'default' | 'hover'
export type VisAiActionFeedback = 'up' | 'down' | null
export type VisAiThinkingState = 'default' | 'hover'

export interface VisAiActionsProps {
  current?: number
  total?: number
  pagination?: boolean
  copy?: boolean
  refresh?: boolean
  thumbs?: boolean
  share?: boolean
  more?: boolean
  disabled?: boolean
  feedback?: VisAiActionFeedback
}

export interface VisAiThinkingProps {
  expanded?: boolean
  defaultExpanded?: boolean
  state?: VisAiThinkingState
  loading?: boolean
  label?: string
  content?: string
}

export interface VisAiBubbleProps {
  content?: string
  spilled?: boolean
  maxLines?: number
  copyable?: boolean
  editable?: boolean
  state?: VisAiBubbleState
}

export interface VisAiSkillProps {
  label?: string
  color?: VisAiSkillColor
  icon?: boolean
  iconName?: IconName
  state?: VisAiSkillState
}

export interface VisAiAttachmentItem {
  key: VisAiKey
  fileId?: string
  name: string
  type?: VisAiAttachmentType
  extension?: string
  fileIconType?: VisFileIconType
  size?: string
  url?: string
  alt?: string
  uploading?: boolean
  progress?: number
  status?: 'uploading' | 'parsing' | 'ready' | 'error'
  error?: string
  removable?: boolean
}

export interface VisAiAttachmentProps extends Omit<VisAiAttachmentItem, 'key'> {
  itemKey?: VisAiKey
}

export interface VisAiPromptItem {
  key: VisAiKey
  label: string
  descriptions?: string[]
  iconName?: IconName
  disabled?: boolean
}

export interface VisAiPromptsProps {
  items?: VisAiPromptItem[]
  oneLine?: boolean
  disabled?: boolean
}

export interface VisAiConversationItemData {
  key: VisAiKey
  label: string
  group?: string
  pinned?: boolean
  disabled?: boolean
}

export interface VisAiConversationItemProps extends Omit<VisAiConversationItemData, 'key'> {
  itemKey?: VisAiKey
  active?: boolean
}

export interface VisAiConversationProps {
  modelValue?: VisAiKey
  items?: VisAiConversationItemData[]
  title?: string
  collapsed?: boolean
  showCreation?: boolean
  creationLabel?: string
}

export interface VisAiSenderModel {
  key: VisAiKey
  label: string
  iconName?: IconName
  disabled?: boolean
  supportsThinking?: boolean
}

export interface VisAiSenderSkill {
  key: VisAiKey
  label: string
  description?: string
  iconName?: IconName
  color?: VisAiSkillColor
  disabled?: boolean
}

export interface VisAiSenderSubmitPayload {
  value: string
  model?: VisAiKey
  speed: VisAiSenderSpeed
  skill?: VisAiKey
  deepThinking: boolean
  attachments: VisAiAttachmentItem[]
}

export interface VisAiSenderProps {
  modelValue?: string
  attachments?: VisAiAttachmentItem[]
  attachmentsEnabled?: boolean
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  deepThinking?: boolean
  model?: VisAiKey
  models?: VisAiSenderModel[]
  modelSwitchable?: boolean
  speed?: VisAiSenderSpeed
  skill?: VisAiKey
  skills?: VisAiSenderSkill[]
  submitOnEnter?: boolean
  maxLength?: number
  autoFocus?: boolean
}
