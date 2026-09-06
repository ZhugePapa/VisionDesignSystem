export const CURRENT_VERSION = '1.1'

export interface ChangelogSection {
  title: string
  items: string[]
}

export interface ChangelogEntry {
  version: string
  date: string
  title: string
  summary: string
  sections: ChangelogSection[]
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: '1.1',
    date: '2026-08-31',
    title: 'Table 冻结列',
    summary: '为 Table 增加按数量冻结首列和尾列的能力，完善宽表横向浏览体验。',
    sections: [
      {
        title: 'Table',
        items: [
          '新增 fixedStartColumns 与 fixedEndColumns，可按 columns 声明顺序冻结首 n 列或尾 n 列。',
          '保留 columns[].fixed 的显式列级控制；多选列自动并入左侧冻结区且不计入冻结数量。',
          '补齐自定义 Element Plus 命名空间下的 sticky、边缘阴影与表头滚动同步样式。',
        ],
      },
    ],
  },
  {
    version: '1.0',
    date: '2026-06-21',
    title: '首个稳定版本',
    summary: '建立可用于产品研发的 Vue 3 设计系统基线，统一设计变量、Element Plus 二次封装、组件演示与业务场景示例。',
    sections: [
      {
        title: '设计基础',
        items: [
          '建立全局颜色、间距、圆角、字体、阴影与明暗主题变量。',
          '提供统一的 Logo、图标注册表与组件内图标调用方式。',
          'Markdown 与代码组件采用基于 utility color 映射的 GitHub 风格代码高亮主题。',
        ],
      },
      {
        title: '基础组件',
        items: [
          '提供 Accordion、Alert、Avatar、Badge、Breadcrumb、Button、Link、Card、Checkbox 与 Divider。',
          '提供 DatePicker、Dropdown、Form、Input、InputNumber、InputSearchBox、InputTextarea、Radio、Rate、Select、Slider、TimePicker、Toggle 与 ToggleButton。',
          '提供 Drawer、Modal、Message、Notification、Popover、Tooltip、Pagination、Table、Tabs、Tag、TreeView、Upload 与 ScrollShadow。',
        ],
      },
      {
        title: '扩展与业务组件',
        items: [
          '提供 FeaturedIcon、FileIcon、Loading、ProgressBar、ProgressCircle、Segmented、Markdown、CodeBlock、CodeLine 与 CodeBlame。',
          '提供 Menu、PageHeader，以及可独立运行的项目管理与代码仓库业务演示。',
          '提供 Actions、Artifact、Attachment、Bubble、Conversation、Prompts、Sender 与 Thinking 等 AI 交互组件。',
        ],
      },
      {
        title: '工程能力',
        items: [
          '提供组件库、类型声明、设计变量与样式文件的独立构建产物。',
          '建立组件演示、Vision API 与 Element API 对照文档。',
          '支持完整 TypeScript 类型检查、文档构建与组件库构建流程。',
        ],
      },
    ],
  },
]

export const versionPolicy = [
  {
    title: '功能版本',
    description: '新增组件，或对现有组件进行结构、交互模型或大范围视觉表现的大型修改时，递增次版本，例如 1.0 → 1.1。',
  },
  {
    title: '主版本',
    description: '发生需要业务方迁移的不兼容 API 调整时，递增主版本，例如 1.x → 2.0，并在记录中提供迁移说明。',
  },
  {
    title: '保持当前版本',
    description: '仅调整样式细节、修复实现偏差，或增加一至两个不影响既有 API 的变体。',
  },
  {
    title: '记录方式',
    description: '不升版本的调整继续归入当前版本记录；升版时新建版本条目，并保留所有历史版本。',
  },
]
