export const demoPages = [
  { id: 'accordion', title: 'Accordion', subtitle: '折叠面板', section: 'shared' },
  { id: 'alert', title: 'Alert', subtitle: '警告提示', section: 'shared' },
  { id: 'avatar', title: 'Avatar', subtitle: '头像', section: 'shared' },
  { id: 'badge', title: 'Badge', subtitle: '徽标', section: 'shared' },
  { id: 'breadcrumb', title: 'Breadcrumb', subtitle: '面包屑', section: 'shared' },
  { id: 'button', title: 'Button', subtitle: '按钮', section: 'shared' },
  { id: 'checkbox', title: 'Checkbox', subtitle: '复选框', section: 'shared' },
  { id: 'code-block', title: 'Code Block', subtitle: '代码块', section: 'shared' },
  { id: 'date-picker', title: 'Date Picker', subtitle: '日期选择器', section: 'shared' },
  { id: 'description', title: 'Description', subtitle: '描述列表', section: 'shared' },
  { id: 'divider', title: 'Divider', subtitle: '分割线', section: 'shared' },
  { id: 'drawer', title: 'Drawer', subtitle: '抽屉', section: 'shared' },
  { id: 'dropdown', title: 'Dropdown', subtitle: '下拉菜单', section: 'shared' },
  { id: 'featured-icon', title: 'Featured Icon', subtitle: '特征图标', section: 'shared' },
  { id: 'form', title: 'Form', subtitle: '表单', section: 'shared' },
  { id: 'input', title: 'Input', subtitle: '输入框', section: 'shared' },
  { id: 'input-number', title: 'InputNumber', subtitle: '数字输入框', section: 'shared' },
  { id: 'input-search-box', title: 'InputSearchBox', subtitle: '搜索输入框', section: 'shared' },
  { id: 'input-textarea', title: 'InputTextarea', subtitle: '文本域', section: 'shared' },
  { id: 'loading', title: 'Loading', subtitle: '加载', section: 'shared' },
  { id: 'markdown', title: 'Markdown', subtitle: '格式渲染', section: 'shared' },
  { id: 'message', title: 'Message', subtitle: '全局提示', section: 'shared' },
  { id: 'modal', title: 'Modal', subtitle: '弹窗', section: 'shared' },
  { id: 'notification', title: 'Notification', subtitle: '通知提醒', section: 'shared' },
  { id: 'pagination', title: 'Pagination', subtitle: '分页器', section: 'shared' },
  { id: 'popover', title: 'Popover', subtitle: '气泡框', section: 'shared' },
  { id: 'progress-bar', title: 'ProgressBar', subtitle: '进度条', section: 'shared' },
  { id: 'progress-circle', title: 'ProgressCircle', subtitle: '环形进度条', section: 'shared' },
  { id: 'radio', title: 'Radio', subtitle: '单选框', section: 'shared' },
  { id: 'rate', title: 'Rate', subtitle: '评分', section: 'shared' },
  { id: 'scroll-shadow', title: 'Scroll Shadow', subtitle: '滚动阴影', section: 'shared' },
  { id: 'segmented', title: 'Segmented', subtitle: '分段控制器', section: 'shared' },
  { id: 'select', title: 'Select', subtitle: '选择器', section: 'shared' },
  { id: 'slider', title: 'Slider', subtitle: '滑动输入', section: 'shared' },
  { id: 'table', title: 'Table', subtitle: '表格', section: 'shared' },
  { id: 'tabs', title: 'Tabs', subtitle: '标签页', section: 'shared' },
  { id: 'tag', title: 'Tag', subtitle: '标签', section: 'shared' },
  { id: 'time-picker', title: 'Time Picker', subtitle: '时间选择器', section: 'shared' },
  { id: 'toggle', title: 'Toggle', subtitle: '开关', section: 'shared' },
  { id: 'toggle-button', title: 'ToggleButton', subtitle: '切换按钮', section: 'shared' },
  { id: 'tooltip', title: 'Tooltip', subtitle: '文字提示', section: 'shared' },
  { id: 'tree-view', title: 'TreeView', subtitle: '树视图', section: 'shared' },
  { id: 'upload', title: 'Upload', subtitle: '上传', section: 'shared' },
  { id: 'menu', title: 'Menu', subtitle: '业务菜单', section: 'application' },
] as const

export type DemoPage = (typeof demoPages)[number]
export type DemoPageId = DemoPage['id']

export const defaultDemoPageId: DemoPageId = 'button'

export function getDemoRouteName(page: DemoPageId): string {
  return `demo-${page}`
}

export function getDemoRoutePath(page: DemoPage): string {
  const section = page.section === 'application' ? 'application-components' : 'components'
  return `/${section}/${page.id}`
}
