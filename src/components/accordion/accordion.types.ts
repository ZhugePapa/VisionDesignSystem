export type VisAccordionItemKey = string | number

export interface VisAccordionItemData {
  key: VisAccordionItemKey
  title: string
  content?: string
  disabled?: boolean
}

export interface VisAccordionProps {
  items?: VisAccordionItemData[]
  modelValue?: VisAccordionItemKey | null
  defaultValue?: VisAccordionItemKey | null
  borderless?: boolean
  icon?: boolean
}

export interface VisAccordionItemProps {
  title?: string
  expanded?: boolean
  borderless?: boolean
  disabled?: boolean
  icon?: boolean
}
