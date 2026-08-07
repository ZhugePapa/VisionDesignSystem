export type VisButtonSplitColor = 'primary' | 'grey'
export type VisButtonSplitSize = 'sm' | 'md'

export interface VisButtonSplitProps {
  /**
   * 组合按钮的视觉风格。
   * - primary：主色实心（各段背景为 `--color-fg-brand-primary`，分隔线为 `--color-component-button-border-split`）
   * - grey：灰色描边（容器边框与分隔线均为 `--color-border-default`，各段透明）
   *
   * 传入的子按钮建议与 color 匹配：primary 用 `variant="primary"`，grey 用 `variant="text"`。
   */
  color?: VisButtonSplitColor
  /**
   * 尺寸。'sm' 对应设计稿 small（24px），'md' 对应默认（32px）。
   * 子按钮的 size 建议保持一致。
   */
  size?: VisButtonSplitSize
}
