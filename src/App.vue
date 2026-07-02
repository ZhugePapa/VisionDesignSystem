<script setup lang="ts">
import { computed, ref } from 'vue'

import VisAccordion from './components/accordion/VisAccordion.vue'
import VisAlert from './components/alert/VisAlert.vue'
import { VisAvatar, VisAvatarGroup, VisAvatarLabel } from './components/avatar'
import VisBadge from './components/badge/VisBadge.vue'
import VisBreadcrumb from './components/breadcrumb/VisBreadcrumb.vue'
import VisButton from './components/button/VisButton.vue'
import VisCheckbox from './components/checkbox/VisCheckbox.vue'
import VisCheckboxGroup from './components/checkbox/VisCheckboxGroup.vue'
import VisCodeBlock from './components/code-block/VisCodeBlock.vue'
import VisConfigProvider from './components/config-provider/VisConfigProvider.vue'
import VisDatePicker from './components/date-picker/VisDatePicker.vue'
import VisDivider from './components/divider/VisDivider.vue'
import VisDrawer from './components/drawer/VisDrawer.vue'
import { VisDropdown, VisDropdownItem } from './components/dropdown'
import { VisFeaturedIcon } from './components/featured-icon'
import Icon from './components/icons/Icon.vue'
import VisInput from './components/input/VisInput.vue'
import VisLoading from './components/loading/VisLoading.vue'
import VisModal from './components/modal/VisModal.vue'
import VisRadio from './components/radio/VisRadio.vue'
import VisRadioGroup from './components/radio/VisRadioGroup.vue'
import VisScrollShadow from './components/scroll-shadow/VisScrollShadow.vue'
import VisTag from './components/tag/VisTag.vue'
import type { VisAccordionItemData, VisAccordionItemKey } from './components/accordion/accordion.types'
import type { VisAlertType } from './components/alert/alert.types'
import type { VisTheme } from './components/config-provider/config-provider.types'
import type { VisDropdownEntry } from './components/dropdown/dropdown.types'

type DemoPageId =
  | 'accordion'
  | 'alert'
  | 'avatar'
  | 'button'
  | 'input'
  | 'modal'
  | 'badge'
  | 'loading'
  | 'tag'
  | 'breadcrumb'
  | 'radio'
  | 'checkbox'
  | 'date-picker'
  | 'divider'
  | 'drawer'
  | 'dropdown'
  | 'featured-icon'
  | 'code-block'
  | 'scroll-shadow'
type SidebarPageId = DemoPageId | 'icons'

interface SidebarItem {
  title: string
  subtitle: string
  page?: SidebarPageId
}

interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

interface ApiRow {
  visionApi: string
  elementApi: string
  description: string
  type: string
  defaultValue: string
}

interface ElementApiRow {
  category: string
  api: string
  description: string
  type: string
  defaultValue: string
}

interface ApiDisplayRow {
  api: string
  elementApi?: string
  description: string
  type: string
  defaultValue?: string
}

interface ApiColumn {
  key: keyof ApiDisplayRow
  label: string
}

interface ApiTableSection {
  title: string
  columns: ApiColumn[]
  rows: ApiDisplayRow[]
}

const theme = ref<VisTheme>('light')
const activePage = ref<DemoPageId>('button')
const collapsedGroups = ref<Set<string>>(new Set())
const inputValue = ref('Vision Design')
const modalOpen = ref(true)
const tagChecked = ref(true)
const accordionActiveKey = ref<VisAccordionItemKey | null>('patterns')
const accordionBorderlessKey = ref<VisAccordionItemKey | null>('overview')
const accordionNoIconKey = ref<VisAccordionItemKey | null>('overview')
const alertType = ref<VisAlertType>('info')
const alertDescription = ref(false)
const alertActions = ref(false)
const alertCloseable = ref(false)
const avatarType = ref<'image' | 'icon' | 'text'>('image')
const avatarSize = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>('md')
const avatarBadge = ref<'none' | 'dot' | 'icon' | 'number' | 'state'>('none')
const avatarSquare = ref(false)
const avatarGroupSize = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>('md')
const radioValue = ref<string | number | boolean>('option-1')
const checkboxValue = ref<(string | number)[]>(['option-1', 'option-3'])
const datePickerValue = ref<string | null>('2026/07/02')
const datePickerRangeValue = ref<[string, string] | null>(['2026/07/01', '2026/07/07'])
const dividerOrientation = ref<'horizontal' | 'vertical'>('horizontal')
const dividerDashed = ref(false)
const dropdownOpen = ref(true)
const dropdownSearchValue = ref('')

const accordionContent =
  '设计系统（Design System） 是一套用于指导产品设计和开发的标准化工具、规则和组件集合。它的核心目标是确保产品在视觉、交互和功能上保持一致性，同时提升团队协作效率。以下是设计系统的关键要素和意义。'

const accordionItems: VisAccordionItemData[] = [
  { key: 'overview', title: '折叠面板', content: accordionContent },
  { key: 'principles', title: '折叠面板', content: accordionContent },
  { key: 'tokens', title: '折叠面板', content: accordionContent },
  { key: 'components', title: '折叠面板', content: accordionContent },
  { key: 'patterns', title: '折叠面板', content: accordionContent },
  { key: 'disabled', title: '折叠面板', content: accordionContent, disabled: true },
]

const alertTypes: VisAlertType[] = ['info', 'primary', 'success', 'warning', 'danger']
const avatarTypes = ['image', 'icon', 'text'] as const
const avatarSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
const avatarBadges = ['none', 'dot', 'number', 'state', 'icon'] as const
const avatarImageVariants = ['01', '02', '03', '04', '05', '06', '07', '08', '09'] as const

const breadcrumbItems = [
  { label: '菜单名称', iconName: 'file-06' as const },
  { label: '菜单名称' },
  { label: '菜单名称', optional: true },
  { label: '菜单名称', active: true },
]

const radioOptions = Array.from({ length: 4 }, (_, index) => ({
  label: '选项',
  value: `option-${index + 1}`,
}))

const checkboxOptions = Array.from({ length: 4 }, (_, index) => ({
  label: '选项',
  value: `option-${index + 1}`,
  indeterminate: index === 1,
}))

const dropdownItems: VisDropdownEntry[] = [
  { type: 'search' },
  { type: 'item', itemType: 'icon', iconName: 'settings-01', label: '菜单选项', state: 'hover' },
  { type: 'item', label: '菜单选项', active: true },
  { type: 'item', itemType: 'icon', iconName: 'log-out-01', label: '菜单选项', arrow: true },
  { type: 'divider' },
  {
    type: 'item',
    itemType: 'avatar',
    title: '张大山',
    subtitle: 'zhangdashan',
    avatarImageVariant: '09',
  },
  { type: 'item', label: '菜单选项', disabled: true },
]

const sampleCode = `import { VisButton } from 'vision-design-system'

export default {
  setup() {
    return () => <VisButton>提交</VisButton>
  },
}`

const pages: Array<{ id: DemoPageId; title: string; subtitle: string }> = [
  { id: 'accordion', title: 'Accordion', subtitle: '折叠面板' },
  { id: 'alert', title: 'Alert', subtitle: '警告提示' },
  { id: 'avatar', title: 'Avatar', subtitle: '头像' },
  { id: 'badge', title: 'Badge', subtitle: '徽标' },
  { id: 'breadcrumb', title: 'Breadcrumb', subtitle: '面包屑' },
  { id: 'button', title: 'Button', subtitle: '按钮' },
  { id: 'checkbox', title: 'Checkbox', subtitle: '复选框' },
  { id: 'code-block', title: 'Code Block', subtitle: '代码块' },
  { id: 'date-picker', title: 'Date Picker', subtitle: '日期选择器' },
  { id: 'divider', title: 'Divider', subtitle: '分割线' },
  { id: 'drawer', title: 'Drawer', subtitle: '抽屉' },
  { id: 'dropdown', title: 'Dropdown', subtitle: '下拉菜单' },
  { id: 'featured-icon', title: 'Featured Icon', subtitle: '特征图标' },
  { id: 'input', title: 'Input', subtitle: '输入框' },
  { id: 'loading', title: 'Loading', subtitle: '加载' },
  { id: 'modal', title: 'Modal', subtitle: '弹窗' },
  { id: 'radio', title: 'Radio', subtitle: '单选框' },
  { id: 'scroll-shadow', title: 'Scroll Shadow', subtitle: '滚动阴影' },
  { id: 'tag', title: 'Tag', subtitle: '标签' },
]

const logoSvg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.17624 12.0999C1.08208 11.3108 1.70042 10.6252 2.49503 10.6252H20.6269C21.3112 10.6252 21.8872 11.1395 21.9715 11.8186C22.1291 13.0887 22.4174 15.2891 22.8363 18.0123C23.1958 20.349 23.6515 22.3009 23.9974 23.6103C24.2316 24.4966 23.5685 25.3993 22.6517 25.3993H4.69643C4.10331 25.3993 3.58189 25.0115 3.42711 24.4389C3.08143 23.1602 2.47289 20.7401 2.01825 18.0123C1.61875 15.6153 1.33808 13.456 1.17624 12.0999Z" fill="#14C9C9"/>
<path d="M26.8326 3.92544C26.8552 3.17666 26.2525 2.56665 25.5034 2.56665H8.72388C7.98591 2.56665 7.38456 3.16037 7.36697 3.89813C7.3174 5.97618 7.16675 10.1505 6.71893 13.983C6.29265 17.6312 5.51629 21.5891 5.06188 23.7538C4.88457 24.5984 5.52744 25.3993 6.39049 25.3993H23.1359C23.7498 25.3993 24.2839 24.9849 24.4224 24.387C24.8547 22.5209 25.7527 18.3303 26.1939 13.983C26.6096 9.88697 26.7724 5.93002 26.8326 3.92544Z" fill="#1C63FC"/>
<path d="M20.6266 10.6252C21.3107 10.6252 21.8864 11.1392 21.971 11.8181C22.1286 13.0882 22.4168 15.2895 22.8357 18.0126C23.1952 20.3491 23.6508 22.3008 23.9967 23.6101C24.2308 24.4964 23.5679 25.3988 22.6511 25.3988H6.39073C5.52768 25.3988 4.88497 24.5983 5.06227 23.7537C5.51669 21.589 6.29258 17.6309 6.71885 13.9828C6.84857 12.8726 6.95097 11.7335 7.03558 10.6252H20.6266Z" fill="#0021B7"/>
</svg>`

const sidebarGroups: SidebarGroup[] = [
  {
    title: 'Documentation',
    items: [
      { title: 'Introduction', subtitle: '介绍' },
      { title: 'Changelog', subtitle: '更新记录' },
    ],
  },
  {
    title: 'Primitives',
    items: [
      { title: 'Global Variables', subtitle: '全局变量' },
      { title: 'Icons', subtitle: '图标', page: 'icons' },
      { title: 'Logo', subtitle: '标识' },
    ],
  },
  {
    title: 'Shared Components',
    items: [
      { title: 'Accordion', subtitle: '折叠面板', page: 'accordion' },
      { title: 'Alert', subtitle: '警告提示', page: 'alert' },
      { title: 'Avatar', subtitle: '头像', page: 'avatar' },
      { title: 'Badge', subtitle: '徽标', page: 'badge' },
      { title: 'Breadcrumb', subtitle: '面包屑', page: 'breadcrumb' },
      { title: 'Button', subtitle: '按钮', page: 'button' },
      { title: 'Checkbox', subtitle: '复选框', page: 'checkbox' },
      { title: 'CodeBlock', subtitle: '代码块', page: 'code-block' },
      { title: 'DatePicker', subtitle: '日期选择器', page: 'date-picker' },
      { title: 'Divider', subtitle: '分割线', page: 'divider' },
      { title: 'Drawer', subtitle: '抽屉', page: 'drawer' },
      { title: 'Dropdown', subtitle: '下拉菜单', page: 'dropdown' },
      { title: 'FeaturedIcon', subtitle: '特征图标', page: 'featured-icon' },
      { title: 'Input', subtitle: '输入框', page: 'input' },
      { title: 'Loading', subtitle: '加载', page: 'loading' },
      { title: 'Markdown', subtitle: '格式渲染' },
      { title: 'Modal', subtitle: '对话框', page: 'modal' },
      { title: 'Radio', subtitle: '单选框', page: 'radio' },
      { title: 'RichTextEditor', subtitle: '富文本编辑器' },
      { title: 'ScrollShadow', subtitle: '滚动阴影', page: 'scroll-shadow' },
      { title: 'Select', subtitle: '选择器' },
      { title: 'Tabs', subtitle: '标签页' },
      { title: 'Tag', subtitle: '标签', page: 'tag' },
      { title: 'Tooltip', subtitle: '文字提示' },
      { title: 'Upload', subtitle: '上传' },
    ],
  },
]

const currentPage = computed(() => pages.find((page) => page.id === activePage.value) ?? pages[0])
const themeToggleIcon = computed(() => (theme.value === 'light' ? 'sun' : 'moon-star'))
const themeToggleLabel = computed(() => (theme.value === 'light' ? '切换到暗色模式' : '切换到亮色模式'))

const apiTables: Record<DemoPageId, ApiRow[]> = {
  accordion: [
    {
      visionApi: 'items',
      elementApi: 'ElCollapseItem',
      description: '折叠面板数据源，支持 key、title、content、disabled。',
      type: 'VisAccordionItemData[]',
      defaultValue: '内置 6 项示例',
    },
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '当前展开项 key；只支持单项展开，收起后为 null。',
      type: 'string | number | null',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'defaultValue',
      elementApi: 'model-value',
      description: '非受控模式下的默认展开项。',
      type: 'string | number | null',
      defaultValue: 'null',
    },
    {
      visionApi: 'borderless',
      elementApi: '无直接对应',
      description: '移除外层边框和圆角，适合嵌入已有容器。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'icon',
      elementApi: 'icon',
      description: '控制左侧文件图标显示；右侧展开图标始终保留。',
      type: 'boolean',
      defaultValue: 'true',
    },
  ],
  alert: [
    {
      visionApi: 'type',
      elementApi: 'type',
      description: '控制提示语义色和默认图标。',
      type: "'info' | 'primary' | 'success' | 'warning' | 'danger'",
      defaultValue: "'info'",
    },
    {
      visionApi: 'title',
      elementApi: 'title',
      description: '提示标题，不传时按 type 使用默认中文标题。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'description',
      elementApi: 'description',
      description: '切换为带描述结构，标题字号和 actions 布局会跟随变化。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'descriptionText',
      elementApi: 'description',
      description: '默认描述文案，也可用 description slot 覆盖。',
      type: 'string',
      defaultValue: "'这里是提示的描述内容'",
    },
    {
      visionApi: 'actions',
      elementApi: '无直接对应',
      description: '是否显示默认忽略/查看详情操作区，也可用 actions slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closeable',
      elementApi: 'closable',
      description: '是否显示关闭按钮。旧项目 API 使用 closeable。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'detailLabel',
      elementApi: '无直接对应',
      description: '默认详情操作文案。',
      type: 'string',
      defaultValue: "'查看详情'",
    },
    {
      visionApi: 'ignoreLabel',
      elementApi: '无直接对应',
      description: '默认忽略操作文案。',
      type: 'string',
      defaultValue: "'忽略'",
    },
  ],
  avatar: [
    {
      visionApi: 'type',
      elementApi: 'icon / src / default slot',
      description: '头像内容类型，兼容旧项目和 Figma 的 image、icon、text 三种形态。',
      type: "'image' | 'icon' | 'text'",
      defaultValue: "'image'",
    },
    {
      visionApi: 'size',
      elementApi: 'size',
      description: '头像尺寸，按 Figma 固定为 20、24、32、40、48、56px。',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'",
      defaultValue: "'sm'",
    },
    {
      visionApi: 'state',
      elementApi: '无直接对应',
      description: '锁定默认态或 hover 态；真实悬停也会触发 hover overlay。',
      type: "'default' | 'hover'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'shapeSquare',
      elementApi: 'shape',
      description: '切换圆形或圆角方形头像。旧项目 API 使用 shapeSquare。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'badge',
      elementApi: '无直接对应',
      description: '头像角标类型，复用 Vision Badge 视觉并按头像尺寸校准定位。',
      type: "'none' | 'dot' | 'icon' | 'number' | 'state'",
      defaultValue: "'none'",
    },
    {
      visionApi: 'imageSrc',
      elementApi: 'src',
      description: '自定义头像图片地址；优先级高于内置 imageVariant。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'imageVariant',
      elementApi: 'src',
      description: '旧项目内置头像资源编号，00 表示不使用内置图片。',
      type: "'00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'",
      defaultValue: "'09'",
    },
    {
      visionApi: 'imageAlt',
      elementApi: 'alt',
      description: '图片替代文本；decorative=true 时输出空 alt。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'text',
      elementApi: 'default slot',
      description: '文本头像内容，xs/sm 显示首字，其余尺寸显示前两个字符。',
      type: 'string',
      defaultValue: "'诸葛'",
    },
    {
      visionApi: 'icon',
      elementApi: 'icon',
      description: '图标头像使用的 Vision icon 名称，也可用 icon slot 覆盖。',
      type: 'IconName',
      defaultValue: "'user-03'",
    },
    {
      visionApi: 'badgeIcon',
      elementApi: '无直接对应',
      description: 'icon 类型角标的图标名称。',
      type: 'IconName',
      defaultValue: "'x-close'",
    },
    {
      visionApi: 'badgeCount',
      elementApi: '无直接对应',
      description: 'number 类型角标显示的数量。',
      type: 'string | number',
      defaultValue: '1',
    },
    {
      visionApi: 'badgeColorType',
      elementApi: '无直接对应',
      description: '角标语义色；state 角标固定使用 success。',
      type: "'danger' | 'warning' | 'success' | 'brand' | 'grey' | 'info'",
      defaultValue: "'danger'",
    },
    {
      visionApi: 'decorative',
      elementApi: 'alt',
      description: '控制图片头像是否作为装饰图处理。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'groupOutlined',
      elementApi: '无直接对应',
      description: '头像组内部使用的 2px 白色描边开关。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'items',
      elementApi: 'ElAvatarGroup children',
      description: 'AvatarGroup 成员数据，支持 src、alt、variant。',
      type: 'VisAvatarGroupItem[]',
      defaultValue: '内置 3 项示例',
    },
    {
      visionApi: 'addition / additionLabel',
      elementApi: 'max-collapse-avatars / collapse slot',
      description: '控制头像组或头像标签的附加内容；头像组默认显示 +2。',
      type: 'boolean / string',
      defaultValue: 'true / \'+2\'',
    },
    {
      visionApi: 'align',
      elementApi: '无直接对应',
      description: 'AvatarLabel 排布方向，lg 及以上尺寸会自动堆叠文本。',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'title / subtitle',
      elementApi: 'default slot',
      description: 'AvatarLabel 主标题和副标题。',
      type: 'string / string',
      defaultValue: "'张大山' / 'zhangdashan'",
    },
  ],
  button: [
    {
      visionApi: 'variant',
      elementApi: 'type / plain / text / link',
      description: '控制按钮视觉层级。当前实现按旧项目自绘，Element API 作为语义参考。',
      type: "'primary' | 'secondary' | 'text' | 'link-grey' | 'link-color'",
      defaultValue: "'primary'",
    },
    {
      visionApi: 'size',
      elementApi: 'size',
      description: '控制按钮高度、横向 padding、图标尺寸和文字字号。',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
    },
    {
      visionApi: 'state',
      elementApi: 'disabled / loading / pseudo states',
      description: '用于演示或锁定 hover、pressing、focused、disabled、loading 状态。',
      type: "'default' | 'hover' | 'pressing' | 'focused' | 'disabled' | 'loading'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'danger',
      elementApi: 'type=\"danger\"',
      description: '切换危险语义色，支持 primary、secondary、text、link-color。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用按钮交互，并应用旧项目 disabled 视觉。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'loading',
      elementApi: 'loading',
      description: '展示加载状态，按钮原生 disabled，支持 loading slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'iconOnly',
      elementApi: 'icon / circle',
      description: '仅展示图标，并使用 label 作为可访问名称。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'prefix / suffix',
      elementApi: 'icon slot',
      description: '控制默认前缀或后缀图标，也可用 prefix/suffix slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'iconName / suffixIconName',
      elementApi: 'icon',
      description: '指定默认前缀、仅图标或后缀图标名称。',
      type: 'IconName',
      defaultValue: "'plus' / 'chevron-down'",
    },
    {
      visionApi: 'htmlType',
      elementApi: 'native-type',
      description: '按钮原生 type 属性。',
      type: "'button' | 'submit' | 'reset'",
      defaultValue: "'button'",
    },
  ],
  input: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '输入框受控值。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '输入为空时显示的占位文本。',
      type: 'string',
      defaultValue: "'请输入'",
    },
    {
      visionApi: 'valueText / filled',
      elementApi: 'model-value',
      description: '非受控演示态的默认填充值，兼容旧项目展示逻辑。',
      type: 'string / boolean',
      defaultValue: "'已输入内容' / false",
    },
    {
      visionApi: 'state',
      elementApi: 'validate-event / class',
      description: '控制默认、hover、focus、danger 预览状态。',
      type: "'default' | 'hover' | 'focus' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用输入框和清除按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'readView',
      elementApi: 'readonly',
      description: '旧项目只读展示态，视觉上弱化边框和背景。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'prefix / suffix',
      elementApi: 'prefix / suffix slot',
      description: '显示前缀或后缀图标，可由对应 slot 替代。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'addonLeft / addonRight',
      elementApi: 'prepend / append slot',
      description: '显示输入框左右附加块。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'maxLength',
      elementApi: 'maxlength / show-word-limit',
      description: '限制最大输入长度并显示计数；boolean true 默认 10。',
      type: 'number | boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'type / name / ariaLabel',
      elementApi: 'type / name / aria-label',
      description: '透传原生 input 类型、名称和可访问标签。',
      type: 'string',
      defaultValue: "'text' / undefined",
    },
  ],
  modal: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '控制弹窗显示隐藏。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'title',
      elementApi: 'title / header slot',
      description: '弹窗主标题。',
      type: 'string',
      defaultValue: "'对话框标题'",
    },
    {
      visionApi: 'menuTitle',
      elementApi: 'header slot',
      description: '带菜单弹窗右侧标题覆盖值。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'divider',
      elementApi: 'header/footer custom class',
      description: '控制普通弹窗头尾分割线。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'footer',
      elementApi: 'footer slot',
      description: '是否展示默认底部操作区。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'icon',
      elementApi: 'header slot',
      description: '是否显示 FeaturedIcon。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'twoLevel',
      elementApi: 'header slot',
      description: '展示二级返回入口。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'withMenu',
      elementApi: '自定义内容 / aside',
      description: '启用左侧菜单型弹窗布局。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closeable',
      elementApi: 'show-close',
      description: '是否显示右上角关闭按钮。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'width / height',
      elementApi: 'width / style',
      description: '覆盖弹窗尺寸，数字会转换为 px。',
      type: 'number | string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'menuItems / activeMenuKey',
      elementApi: '无直接对应',
      description: '菜单型弹窗的菜单数据和选中项。',
      type: 'VisModalMenuItem[] / string',
      defaultValue: '内置示例菜单 / overview',
    },
    {
      visionApi: 'cancelText / confirmText / backText',
      elementApi: 'footer/header slot',
      description: '默认按钮和返回入口文案。',
      type: 'string',
      defaultValue: "'取消' / '确认' / '返回'",
    },
  ],
  drawer: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '控制抽屉显示隐藏。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'title',
      elementApi: 'title / header slot',
      description: '抽屉主标题。',
      type: 'string',
      defaultValue: "'对话框标题'",
    },
    {
      visionApi: 'position',
      elementApi: 'direction',
      description: '抽屉出现方向；当前按旧项目和设计稿支持 right 与 bottom。',
      type: "'right' | 'bottom'",
      defaultValue: "'right'",
    },
    {
      visionApi: 'divider',
      elementApi: 'header/footer custom class',
      description: '控制头部和右侧抽屉底部操作区分割线。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'actions',
      elementApi: 'footer slot',
      description: '是否展示默认操作按钮；右侧抽屉在底部展示，底部抽屉在头部右侧展示。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'icon / iconName',
      elementApi: 'header slot',
      description: '是否显示标题前图标以及图标名称，可由 icon slot 覆盖。',
      type: 'boolean / IconName',
      defaultValue: "false / 'file-06'",
    },
    {
      visionApi: 'twoLevel',
      elementApi: 'header slot',
      description: '展示二级返回入口。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closeable',
      elementApi: 'show-close',
      description: '是否显示关闭按钮。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'handle',
      elementApi: '无直接对应',
      description: '底部抽屉是否显示顶部拖拽提示柄。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'width / height',
      elementApi: 'size / style',
      description: '覆盖抽屉尺寸，数字会转换为 px。',
      type: 'number | string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'cancelText / confirmText / backText',
      elementApi: 'footer/header slot',
      description: '默认按钮和返回入口文案。',
      type: 'string',
      defaultValue: "'按钮' / '按钮' / '返回'",
    },
  ],
  badge: [
    {
      visionApi: 'colorType',
      elementApi: '无直接对应',
      description: '控制徽标语义色；info 会按旧项目兼容为 grey。',
      type: "'danger' | 'warning' | 'success' | 'brand' | 'grey' | 'info'",
      defaultValue: "'danger'",
    },
    {
      visionApi: 'type',
      elementApi: '无直接对应',
      description: '控制状态、文本、图标、圆点和数字徽标形态；number 复用文本视觉。',
      type: "'status' | 'text' | 'icon' | 'dot' | 'number'",
      defaultValue: "'status'",
    },
    {
      visionApi: 'solid',
      elementApi: '无直接对应',
      description: '启用实心样式；dot 类型始终为实心。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'subtle',
      elementApi: '无直接对应',
      description: '启用 status 类型的轻量边框样式，solid 为 true 时不生效。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'label',
      elementApi: '无直接对应',
      description: '覆盖 status/text 类型默认文案。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'count',
      elementApi: 'value',
      description: 'number 类型展示的数字或文本值。',
      type: 'string | number',
      defaultValue: '1',
    },
    {
      visionApi: 'iconName',
      elementApi: '无直接对应',
      description: 'icon 类型默认图标名称，也可通过 icon slot 覆盖。',
      type: 'IconName',
      defaultValue: '按 colorType 推导',
    },
    {
      visionApi: 'icon slot',
      elementApi: '无直接对应',
      description: '自定义 icon 类型内部内容。',
      type: 'slot',
      defaultValue: '-',
    },
  ],
  loading: [
    {
      visionApi: 'size',
      elementApi: '无直接对应',
      description: '控制加载图形外框尺寸，内部图形按旧项目 87.5% 比例绘制。',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      defaultValue: "'xs'",
    },
    {
      visionApi: 'color',
      elementApi: '无直接对应',
      description: '控制加载图形和文本颜色。',
      type: "'grey' | 'brand' | 'white' | 'danger'",
      defaultValue: "'brand'",
    },
    {
      visionApi: 'text',
      elementApi: '无直接对应',
      description: '是否在加载图形下方显示文案。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'label',
      elementApi: 'aria-label',
      description: '加载文案；无文本模式下作为可访问名称。',
      type: 'string',
      defaultValue: "'loading...'",
    },
    {
      visionApi: 'decorative',
      elementApi: 'aria-hidden',
      description: '标记为装饰性加载图形，隐藏给辅助技术。',
      type: 'boolean',
      defaultValue: 'false',
    },
  ],
  tag: [
    {
      visionApi: 'type',
      elementApi: 'type',
      description: '控制标签前导内容形态，兼容旧项目 default、icon、avatar、dot。',
      type: "'default' | 'icon' | 'avatar' | 'dot'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'checkable',
      elementApi: 'checkable',
      description: '标签是否可勾选，启用后按 checkbox 语义交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'checked',
      elementApi: 'checked',
      description: '可勾选标签的受控选中状态，支持 v-model:checked。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closable',
      elementApi: 'closable',
      description: '是否显示关闭按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closeState',
      elementApi: '无直接对应',
      description: '预览关闭按钮默认或 hover 状态。',
      type: "'default' | 'hover'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'label',
      elementApi: 'slot',
      description: '默认标签文本，可由默认 slot 覆盖。',
      type: 'string',
      defaultValue: "'标签'",
    },
    {
      visionApi: 'iconName / avatarSrc / avatarVariant / avatarAlt',
      elementApi: 'slot / icon',
      description: 'icon 与 avatar 类型的前导内容配置。',
      type: 'IconName / string',
      defaultValue: "'archive' / '09'",
    },
  ],
  breadcrumb: [
    {
      visionApi: 'items',
      elementApi: 'ElBreadcrumbItem',
      description: '面包屑数据，支持 label、href、iconName、optional、active、disabled。',
      type: 'VisBreadcrumbItem[]',
      defaultValue: '内置 3 项示例',
    },
    {
      visionApi: 'type',
      elementApi: 'to / href',
      description: '控制条目渲染为 button 行为或 link 行为。',
      type: "'button' | 'link'",
      defaultValue: "'button'",
    },
    {
      visionApi: 'size',
      elementApi: '无直接对应',
      description: '控制高度、字号和图标尺寸。',
      type: "'md' | 'sm'",
      defaultValue: "'md'",
    },
    {
      visionApi: 'separator',
      elementApi: 'separator / separator-icon',
      description: '控制分隔符为斜线或箭头图标。',
      type: "'slash' | 'arrow'",
      defaultValue: "'slash'",
    },
    {
      visionApi: 'click event',
      elementApi: 'click',
      description: '非禁用、非 active 条目点击时触发。',
      type: '(item: VisBreadcrumbItem, index: number) => void',
      defaultValue: '-',
    },
  ],
  radio: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '单个 Radio 为 boolean；RadioGroup 为当前选中值。',
      type: 'boolean | string | number',
      defaultValue: 'false / null',
    },
    {
      visionApi: 'options',
      elementApi: 'ElRadio',
      description: 'RadioGroup 选项数据，支持 label、value、disabled、state。',
      type: 'VisRadioOption[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'align',
      elementApi: '无直接对应',
      description: 'RadioGroup 排列方向。',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用单个 Radio 或整个 RadioGroup。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'state',
      elementApi: 'pseudo states',
      description: '用于展示 default 或 hover 视觉状态。',
      type: "'default' | 'hover'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'radioButton',
      elementApi: 'ElRadioButton',
      description: '切换为旧项目分段按钮式单选组。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'label / name / value / ariaLabel',
      elementApi: 'label / name / value / aria-label',
      description: '控制文案显示、表单名称、原生值和可访问名称。',
      type: 'boolean / string | number | boolean',
      defaultValue: 'true / undefined',
    },
  ],
  checkbox: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '单个 Checkbox 为 boolean；CheckboxGroup 为选中值数组。',
      type: 'boolean | Array<string | number>',
      defaultValue: 'false / []',
    },
    {
      visionApi: 'indeterminate',
      elementApi: 'indeterminate',
      description: '半选状态，选中后会清除 indeterminate。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'options',
      elementApi: 'ElCheckbox',
      description: 'CheckboxGroup 选项数据，支持 label、value、disabled、indeterminate、state。',
      type: 'VisCheckboxOption[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'align',
      elementApi: '无直接对应',
      description: 'CheckboxGroup 排列方向。',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用单个 Checkbox 或整个 CheckboxGroup。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'state',
      elementApi: 'pseudo states',
      description: '用于展示 default 或 hover 视觉状态。',
      type: "'default' | 'hover'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'label / name / value / ariaLabel',
      elementApi: 'label / name / value / aria-label',
      description: '控制文案显示、表单名称、原生值和可访问名称。',
      type: 'boolean / string | number | boolean',
      defaultValue: 'true / undefined',
    },
  ],
  'date-picker': [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '日期选择器受控值；单选为日期字符串，范围为开始和结束日期元组。',
      type: 'string | [string, string] | null',
      defaultValue: 'null',
    },
    {
      visionApi: 'range',
      elementApi: 'type',
      description: '切换单日期或日期范围选择；true 时对应 Element Plus daterange 语义。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'state',
      elementApi: 'validate-event / class',
      description: '按 Figma 变体锁定 default、hover、focus、danger 视觉状态。',
      type: "'default' | 'hover' | 'focus' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用日期选择器控制项和面板交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '单日期模式的占位文本。',
      type: 'string',
      defaultValue: "'请选择日期'",
    },
    {
      visionApi: 'startPlaceholder',
      elementApi: 'start-placeholder',
      description: '范围模式的开始日期占位文本。',
      type: 'string',
      defaultValue: "'选择开始日期'",
    },
    {
      visionApi: 'endPlaceholder',
      elementApi: 'end-placeholder',
      description: '范围模式的结束日期占位文本。',
      type: 'string',
      defaultValue: "'选择结束日期'",
    },
    {
      visionApi: 'open',
      elementApi: 'visible-change',
      description: '外部控制日期面板展开状态；配合 update:open 使用。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'prefix',
      elementApi: 'prefix-icon',
      description: '是否显示默认前缀图标。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'prefixIcon',
      elementApi: 'prefix-icon',
      description: '控制前缀图标名称，来自 Vision icon registry。',
      type: 'IconName',
      defaultValue: "'calendar'",
    },
    {
      visionApi: 'showFooterShortcuts',
      elementApi: 'shortcuts',
      description: '是否显示底部“今天”或范围快捷项。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'shortcuts',
      elementApi: 'shortcuts',
      description: '范围选择快捷项数据，days 表示从今天向前包含的天数。',
      type: 'VisDatePickerShortcut[]',
      defaultValue: '最近 3/7/30 天',
    },
    {
      visionApi: 'disabledDate',
      elementApi: 'disabled-date',
      description: '禁用指定日期的回调函数。',
      type: '(date: Date) => boolean',
      defaultValue: 'undefined',
    },
  ],
  divider: [
    {
      visionApi: 'orientation',
      elementApi: 'direction',
      description: '控制分割线方向，保持旧项目 horizontal/vertical 命名。',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'dashed',
      elementApi: 'border-style',
      description: '切换旧项目虚线样式，水平虚线默认长度为 27px。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'length',
      elementApi: '无直接对应',
      description: '自定义分割线长度，number 会转换为 px。',
      type: 'number | string',
      defaultValue: 'horizontal dashed 为 27，其余为 16',
    },
    {
      visionApi: 'decorative',
      elementApi: '无直接对应',
      description: '装饰性分割线默认对辅助技术隐藏；false 时输出 separator 语义。',
      type: 'boolean',
      defaultValue: 'true',
    },
  ],
  dropdown: [
    {
      visionApi: 'items',
      elementApi: 'ElDropdownMenu / ElDropdownItem',
      description: '下拉菜单数据源，支持 item、divider、search 三类条目。',
      type: 'VisDropdownEntry[]',
      defaultValue: '内置 4 项示例',
    },
    {
      visionApi: 'open',
      elementApi: 'visible-change',
      description: '控制菜单展开状态，配合 update:open 使用。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'trigger',
      elementApi: 'trigger / split-button',
      description: '控制触发器为按钮或头像。',
      type: "'button' | 'avatar'",
      defaultValue: "'button'",
    },
    {
      visionApi: 'header / headerType',
      elementApi: 'dropdown slot',
      description: '显示分组标题或头像标题区。',
      type: "boolean / 'group' | 'avatar'",
      defaultValue: "false / 'group'",
    },
    {
      visionApi: 'buttonLabel',
      elementApi: 'default slot',
      description: '按钮触发器显示文本。',
      type: 'string',
      defaultValue: "'触发'",
    },
    {
      visionApi: 'searchValue / searchPlaceholder',
      elementApi: '无直接对应',
      description: '搜索条目的受控值和占位文本。',
      type: 'string / string',
      defaultValue: "'' / '请输入关键字'",
    },
    {
      visionApi: 'itemType',
      elementApi: 'icon / default slot',
      description: '菜单项内容类型，兼容旧项目 default、icon、avatar 变体。',
      type: "'default' | 'icon' | 'avatar'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'active / checkable / arrow / disabled / state',
      elementApi: 'command / disabled / pseudo states',
      description: '控制选中、勾选、右箭头、禁用与 hover 演示态。',
      type: 'boolean / VisDropdownItemState',
      defaultValue: 'false / default',
    },
  ],
  'featured-icon': [
    {
      visionApi: 'size',
      elementApi: '无直接对应',
      description: '控制容器和内部图标尺寸。',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'",
      defaultValue: "'xs'",
    },
    {
      visionApi: 'color',
      elementApi: '无直接对应',
      description: '控制品牌、灰度、危险、警告、成功语义色。',
      type: "'brand' | 'grey' | 'danger' | 'warning' | 'success'",
      defaultValue: "'brand'",
    },
    {
      visionApi: 'type',
      elementApi: '无直接对应',
      description: '控制 light/solid/modern 与 round/square 组合外观。',
      type: "'light-round' | 'light-square' | 'solid-round' | 'solid-square' | 'modern'",
      defaultValue: "'solid-round'",
    },
    {
      visionApi: 'icon',
      elementApi: '无直接对应',
      description: '内部图标名称，来自 Vision icon registry。',
      type: 'IconName',
      defaultValue: "'download-cloud-02'",
    },
    {
      visionApi: 'label / decorative',
      elementApi: 'aria-label / aria-hidden',
      description: '控制可访问名称；装饰性图标默认隐藏给辅助技术。',
      type: 'string / boolean',
      defaultValue: 'undefined / true',
    },
  ],
  'code-block': [
    {
      visionApi: 'type',
      elementApi: '无直接对应',
      description: '控制普通代码块或 show_more 可展开代码块。',
      type: "'default' | 'show_more'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'collapsed',
      elementApi: '无直接对应',
      description: 'show_more 模式下的初始收起状态。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'heading',
      elementApi: '无直接对应',
      description: '是否显示语言标题栏。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'copy',
      elementApi: '无直接对应',
      description: '是否显示复制按钮，并调用 Clipboard API。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'language',
      elementApi: '无直接对应',
      description: '标题栏语言名称。',
      type: 'string',
      defaultValue: "'Javascript'",
    },
    {
      visionApi: 'code',
      elementApi: '无直接对应',
      description: '代码文本内容，组件内部做轻量语法 token 渲染。',
      type: 'string',
      defaultValue: "''",
    },
  ],
  'scroll-shadow': [
    {
      visionApi: 'variant',
      elementApi: '无直接对应',
      description: '控制渐隐边缘使用 surface 或 secondary 背景色。',
      type: "'surface' | 'secondary'",
      defaultValue: "'surface'",
    },
    {
      visionApi: 'orientation',
      elementApi: 'ElScrollbar direction 语义参考',
      description: '控制垂直或水平滚动阴影。',
      type: "'vertical' | 'horizontal'",
      defaultValue: "'vertical'",
    },
    {
      visionApi: 'size',
      elementApi: '无直接对应',
      description: '渐隐覆盖区域尺寸，单位 px。',
      type: 'number',
      defaultValue: '80',
    },
    {
      visionApi: 'hideScrollBar',
      elementApi: 'native scrollbar style',
      description: '是否隐藏原生滚动条。',
      type: 'boolean',
      defaultValue: 'true',
    },
  ],
}

const noElementApiRows = (): ElementApiRow[] => []

const elementApiTables: Record<DemoPageId, ElementApiRow[]> = {
  accordion: [
    { category: 'Attribute', api: 'model-value', description: '当前激活的面板；手风琴模式时为 string，非手风琴模式时为 array', type: 'string | array', defaultValue: '-' },
    { category: 'Attribute', api: 'accordion', description: '是否启用手风琴模式', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'value', description: '当前激活的面板；model-value 的别名', type: 'string | array', defaultValue: '-' },
    { category: 'Attribute', api: 'name', description: 'Collapse Item 的唯一标识', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'title', description: 'Collapse Item 的标题', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用 Collapse Item', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'icon', description: '自定义展开图标组件', type: 'string | Component', defaultValue: 'ArrowRight' },
    { category: 'Event', api: 'change', description: '当前激活面板改变时触发', type: '(activeNames: string | array) => void', defaultValue: '-' },
  ],
  alert: [
    { category: 'Attribute', api: 'title', description: 'Alert 标题', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'type', description: 'Alert 类型', type: "'success' | 'warning' | 'info' | 'error'", defaultValue: "'info'" },
    { category: 'Attribute', api: 'description', description: '描述性文本，也可以通过默认 slot 传入', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'closable', description: '是否可以关闭', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'center', description: '文字是否居中', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'close-text', description: '自定义关闭按钮文本', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'show-icon', description: '是否显示类型图标', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'effect', description: '选择提供的主题', type: "'light' | 'dark'", defaultValue: "'light'" },
    { category: 'Event', api: 'close', description: '关闭 Alert 时触发', type: '() => void', defaultValue: '-' },
  ],
  avatar: [
    { category: 'Attribute', api: 'icon', description: '设置头像图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'size', description: 'Avatar 大小。', type: 'number | \"large\" | \"default\" | \"small\"', defaultValue: "'default'" },
    { category: 'Attribute', api: 'shape', description: 'Avatar 形状。', type: "'circle' | 'square'", defaultValue: "'circle'" },
    { category: 'Attribute', api: 'src', description: '图片头像的资源地址。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'src-set', description: '原生 img 的 srcset 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'alt', description: '图片头像无法显示时的替代文本。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'fit', description: '图片如何适应容器，等同 object-fit。', type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'", defaultValue: "'cover'" },
    { category: 'Attribute', api: 'collapse-avatars', description: 'AvatarGroup 折叠后显示的头像数量。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'collapse-avatars-tooltip', description: '是否为折叠头像显示 Tooltip。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'max-collapse-avatars', description: 'AvatarGroup 最多折叠头像数量。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'effect', description: 'Tooltip 主题。', type: "'dark' | 'light'", defaultValue: "'dark'" },
    { category: 'Attribute', api: 'placement', description: 'Tooltip 出现位置。', type: 'string', defaultValue: "'top'" },
    { category: 'Attribute', api: 'popper-class', description: 'Tooltip 下拉层类名。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'popper-style', description: 'Tooltip 下拉层样式。', type: 'string | object', defaultValue: '-' },
    { category: 'Attribute', api: 'collapse-class', description: '折叠头像类名。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'collapse-style', description: '折叠头像样式。', type: 'string | object', defaultValue: '-' },
    { category: 'Event', api: 'error', description: '图片加载失败时触发；返回 false 可阻止默认 fallback 行为。', type: '(event: Event) => boolean | void', defaultValue: '-' },
    { category: 'Slot', api: 'default', description: '自定义头像内容，常用于文字头像或 AvatarGroup 子项。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'icon', description: '自定义图标内容。', type: 'slot', defaultValue: '-' },
  ],
  button: [
    {
      category: 'Attribute',
      api: 'size',
      description: 'button size',
      type: "'large' | 'default' | 'small'",
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'type',
      description: 'button type, when setting `color`, the latter prevails',
      type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | '' | 'text'",
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'plain',
      description: "determine whether it's a plain button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'text',
      description: "determine whether it's a text button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'bg',
      description: 'determine whether the text button background color is always on',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'link',
      description: "determine whether it's a link button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'round',
      description: "determine whether it's a round button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'circle',
      description: "determine whether it's a circle button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'dashed',
      description: "determine whether it's a dashed button",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'loading',
      description: "determine whether it's loading",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'loading-icon',
      description: 'customize loading icon component',
      type: 'string | Component',
      defaultValue: 'Loading',
    },
    {
      category: 'Attribute',
      api: 'disabled',
      description: 'disable the button',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'icon',
      description: 'icon component',
      type: 'string | Component',
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'autofocus',
      description: "same as native button's `autofocus`",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'native-type',
      description: "same as native button's `type`",
      type: "'button' | 'submit' | 'reset'",
      defaultValue: 'button',
    },
    {
      category: 'Attribute',
      api: 'auto-insert-space',
      description:
        'automatically insert a space between two chinese characters(this will only take effect when the text length is 2 and all characters are in Chinese.)',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'color',
      description: 'custom button color, automatically calculate `hover` and `active` color',
      type: 'string',
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'dark',
      description: 'dark mode, which automatically converts `color` to dark mode colors',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'tag',
      description: 'custom element tag',
      type: 'string | Component',
      defaultValue: 'button',
    },
  ],
  input: [
    {
      category: 'Attribute',
      api: 'type',
      description: 'type of input, see more in MDN input types',
      type: "'text' | 'textarea' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url'",
      defaultValue: 'text',
    },
    { category: 'Attribute', api: 'model-value', description: 'binding value', type: 'string | number', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'model-modifiers',
      description: 'v-model modifiers, reference Vue modifiers',
      type: '{ lazy?: true, number?: true, trim?: true }',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'maxlength', description: 'same as `maxlength` in native input', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'minlength', description: 'same as `minlength` in native input', type: 'string | number', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'show-word-limit',
      description: "whether show word count, only works when `type` is 'text' or 'textarea'",
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      category: 'Attribute',
      api: 'word-limit-position',
      description: 'word count position, valid when `show-word-limit` is true',
      type: "'inside' | 'outside'",
      defaultValue: 'inside',
    },
    { category: 'Attribute', api: 'placeholder', description: 'placeholder of Input', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'clearable',
      description: "whether to show clear button, only works when `type` is not 'textarea'",
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'clear-icon', description: 'custom clear icon component', type: 'string | Component', defaultValue: 'CircleClose' },
    {
      category: 'Attribute',
      api: 'formatter',
      description: "specifies the format of the value presented input.(only works when `type` is 'text')",
      type: '(value: string | number) => string',
      defaultValue: '-',
    },
    {
      category: 'Attribute',
      api: 'parser',
      description: "specifies the value extracted from formatter input.(only works when `type` is 'text')",
      type: '(value: string) => string',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'show-password', description: 'whether to show toggleable password input', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: 'whether Input is disabled', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: "size of Input, works when `type` is not 'textarea'", type: "'large' | 'default' | 'small'", defaultValue: '-' },
    { category: 'Attribute', api: 'prefix-icon', description: 'prefix icon component', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'suffix-icon', description: 'suffix icon component', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'rows', description: "number of rows of textarea, only works when `type` is 'textarea'", type: 'number', defaultValue: '2' },
    {
      category: 'Attribute',
      api: 'autosize',
      description: "whether textarea has an adaptive height, only works when `type` is 'textarea'",
      type: 'boolean | { minRows?: number, maxRows?: number }',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'autocomplete', description: 'same as `autocomplete` in native input', type: 'string', defaultValue: 'off' },
    { category: 'Attribute', api: 'name', description: 'same as `name` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'readonly', description: 'same as `readonly` in native input', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'max', description: 'same as `max` in native input', type: '-', defaultValue: '-' },
    { category: 'Attribute', api: 'min', description: 'same as `min` in native input', type: '-', defaultValue: '-' },
    { category: 'Attribute', api: 'step', description: 'same as `step` in native input', type: '-', defaultValue: '-' },
    { category: 'Attribute', api: 'resize', description: 'control the resizability', type: "'none' | 'both' | 'horizontal' | 'vertical'", defaultValue: '-' },
    { category: 'Attribute', api: 'autofocus', description: 'same as `autofocus` in native input', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'form', description: 'same as `form` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-label', description: 'same as `aria-label` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'tabindex', description: 'input tabindex', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'validate-event', description: 'whether to trigger form validation', type: 'boolean', defaultValue: 'true' },
    {
      category: 'Attribute',
      api: 'input-style',
      description: 'the style of the input element or textarea element',
      type: 'string | CSSProperties | CSSProperties[] | string[]',
      defaultValue: '{}',
    },
    { category: 'Attribute', api: 'label', description: 'same as `aria-label` in native input', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'inputmode', description: 'same as `inputmode` in native input', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'count-graphemes',
      description: 'custom function to count graphemes; when set, native `maxlength`/`minlength` constraints are bypassed',
      type: '(value: string) => number',
      defaultValue: '-',
    },
    { category: 'Event', api: 'blur', description: 'triggers when Input blurs', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: 'triggers when Input focuses', type: 'event', defaultValue: '-' },
    {
      category: 'Event',
      api: 'change',
      description: 'triggers when the input box loses focus or the user presses Enter, only if the modelValue has changed',
      type: 'event',
      defaultValue: '-',
    },
    { category: 'Event', api: 'input', description: 'triggers when the Input value change', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'clear', description: 'triggers when the Input is cleared by clicking the clear button', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'keydown', description: 'triggers when a key is pressed down', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'mouseleave', description: 'triggers when the mouse leaves the Input element', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'mouseenter', description: 'triggers when the mouse enters the Input element', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'compositionstart', description: 'triggers when the composition starts', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'compositionupdate', description: 'triggers when the composition is updated', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'compositionend', description: 'triggers when the composition ends', type: 'event', defaultValue: '-' },
  ],
  modal: [
    { category: 'Attribute', api: 'model-value', description: 'visibility of Dialog', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'title', description: 'title of Dialog. Can also be passed with a named slot', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'width', description: 'width of Dialog, default is 50%', type: 'string | number', defaultValue: "''" },
    { category: 'Attribute', api: 'fullscreen', description: 'whether the Dialog takes up full screen', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'top', description: 'value for `margin-top` of Dialog CSS, default is 15vh', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'modal', description: 'whether a mask is displayed', type: 'boolean', defaultValue: 'true' },
    {
      category: 'Attribute',
      api: 'modal-penetrable',
      description: 'whether the mask is penetrable. The modal attribute must be `false`',
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'modal-class', description: 'custom class names for mask', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'header-class', description: 'custom class names for header wrapper', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'body-class', description: 'custom class names for body wrapper', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'footer-class', description: 'custom class names for footer wrapper', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'append-to-body',
      description: 'whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true`',
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'append-to', description: 'which element the Dialog appends to. Will override `append-to-body`', type: 'CSSSelector | HTMLElement', defaultValue: 'body' },
    { category: 'Attribute', api: 'lock-scroll', description: 'whether scroll of body is disabled while Dialog is displayed', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'open-delay', description: 'the Time(milliseconds) before open', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'close-delay', description: 'the Time(milliseconds) before close', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'close-on-click-modal', description: 'whether the Dialog can be closed by clicking the mask', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'close-on-press-escape', description: 'whether the Dialog can be closed by pressing ESC', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'show-close', description: 'whether to show a close button', type: 'boolean', defaultValue: 'true' },
    {
      category: 'Attribute',
      api: 'before-close',
      description: 'callback before Dialog closes, and it will prevent Dialog from closing, use done to close the dialog',
      type: '(done: DoneFn) => void',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'draggable', description: 'enable dragging feature for Dialog', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'overflow', description: 'draggable Dialog can overflow the viewport', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'center', description: 'whether to align the header and footer in center', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'align-center', description: 'whether to align the dialog both horizontally and vertically', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'destroy-on-close', description: 'destroy elements in Dialog when closed', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'close-icon', description: 'custom close icon, default is Close', type: 'string | Component', defaultValue: 'Close' },
    { category: 'Attribute', api: 'z-index', description: 'same as z-index in native CSS, z-order of dialog', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'header-aria-level', description: "header's `aria-level` attribute", type: 'string', defaultValue: '2' },
    {
      category: 'Attribute',
      api: 'transition',
      description: 'custom transition configuration for dialog animation. Can be a string or an object with Vue transition props',
      type: 'string | TransitionProps',
      defaultValue: 'dialog-fade',
    },
    { category: 'Attribute', api: 'custom-class', description: 'custom class names for Dialog', type: 'string', defaultValue: "''" },
    { category: 'Event', api: 'open', description: 'triggers when the Dialog opens', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'opened', description: 'triggers when the Dialog opening animation ends', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'close', description: 'triggers when the Dialog closes', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'closed', description: 'triggers when the Dialog closing animation ends', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'open-auto-focus', description: 'triggers after Dialog opens and content focused', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'close-auto-focus', description: 'triggers after Dialog closed and content focused', type: 'event', defaultValue: '-' },
  ],
  drawer: [
    { category: 'Attribute', api: 'model-value', description: '是否显示 Drawer', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'append-to-body', description: 'Drawer 自身是否插入至 body 元素上', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'append-to', description: 'Drawer 挂载到哪个 DOM 元素', type: 'CSSSelector | HTMLElement', defaultValue: 'body' },
    { category: 'Attribute', api: 'lock-scroll', description: 'Drawer 出现时是否锁定 body 滚动', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'before-close', description: '关闭前回调；执行 done 参数方法时才真正关闭', type: '(done: DoneFn) => void', defaultValue: '-' },
    { category: 'Attribute', api: 'close-on-click-modal', description: '是否可以通过点击遮罩关闭 Drawer', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'close-on-press-escape', description: '是否可以通过按下 ESC 关闭 Drawer', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'open-delay', description: '打开延时时间，单位毫秒', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'close-delay', description: '关闭延时时间，单位毫秒', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'destroy-on-close', description: '关闭时是否销毁 Drawer 中的元素', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'modal', description: '是否需要遮罩层', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'direction', description: 'Drawer 打开的方向', type: "'rtl' | 'ltr' | 'ttb' | 'btt'", defaultValue: "'rtl'" },
    { category: 'Attribute', api: 'show-close', description: '是否显示关闭按钮', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'size', description: 'Drawer 窗体尺寸；垂直方向控制高度，水平方向控制宽度', type: 'string | number', defaultValue: "'30%'" },
    { category: 'Attribute', api: 'title', description: 'Drawer 标题，也可通过具名 slot 传入', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'with-header', description: '控制是否显示 header 栏', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'modal-class', description: '遮罩的自定义类名', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'header-class', description: 'header 部分的自定义 class 名', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'body-class', description: 'body 部分的自定义 class 名', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'footer-class', description: 'footer 部分的自定义 class 名', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'z-index', description: '和原生 CSS z-index 相同，用于改变 z 轴顺序', type: 'number', defaultValue: '-' },
    { category: 'Event', api: 'open', description: 'Drawer 打开时触发', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'opened', description: 'Drawer 打开动画结束时触发', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'close', description: 'Drawer 关闭时触发', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'closed', description: 'Drawer 关闭动画结束时触发', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'open-auto-focus', description: 'Drawer 打开且内容获得焦点后触发', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'close-auto-focus', description: 'Drawer 关闭且焦点返回后触发', type: '() => void', defaultValue: '-' },
  ],
  badge: noElementApiRows(),
  loading: noElementApiRows(),
  tag: [
    { category: 'Attribute', api: 'type', description: 'Tag 的类型', type: "'primary' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: "'primary'" },
    { category: 'Attribute', api: 'closable', description: '是否可关闭', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disable-transitions', description: '是否禁用渐变动画', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'hit', description: '是否有边框描边', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'color', description: '背景色', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'size', description: 'Tag 尺寸', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'effect', description: '主题效果', type: "'dark' | 'light' | 'plain'", defaultValue: "'light'" },
    { category: 'Attribute', api: 'round', description: '是否为圆角标签', type: 'boolean', defaultValue: 'false' },
    { category: 'Event', api: 'click', description: '点击 Tag 时触发', type: '(event: MouseEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'close', description: '关闭 Tag 时触发', type: '(event: MouseEvent) => void', defaultValue: '-' },
  ],
  breadcrumb: [
    { category: 'Attribute', api: 'separator', description: '分隔符字符', type: 'string', defaultValue: "'/'" },
    { category: 'Attribute', api: 'separator-icon', description: '图标分隔符组件', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'to', description: '路由跳转目标，同 vue-router 的 to', type: 'string | RouteLocationRaw', defaultValue: '-' },
    { category: 'Attribute', api: 'replace', description: '使用 replace 跳转而不是 push', type: 'boolean', defaultValue: 'false' },
  ],
  radio: [
    { category: 'Attribute', api: 'model-value', description: '绑定值', type: 'string | number | boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'value', description: '单选框的值', type: 'string | number | boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'label', description: '单选框显示内容', type: 'string | number | boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'border', description: '是否显示边框', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: '单选框尺寸', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'model-value', description: 'RadioGroup 绑定值', type: 'string | number | boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用整个组', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: '组内单选框尺寸', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'fill', description: '按钮形式激活时的填充色', type: 'string', defaultValue: "'#409eff'" },
    { category: 'Attribute', api: 'text-color', description: '按钮形式激活时的文本色', type: 'string', defaultValue: "'#ffffff'" },
    { category: 'Event', api: 'change', description: '绑定值变化时触发', type: '(value: string | number | boolean) => void', defaultValue: '-' },
  ],
  checkbox: [
    { category: 'Attribute', api: 'model-value', description: '绑定值', type: 'string | number | boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'value', description: '复选框的值', type: 'string | number | boolean | object', defaultValue: '-' },
    { category: 'Attribute', api: 'label', description: '复选框显示内容', type: 'string | number | boolean | object', defaultValue: '-' },
    { category: 'Attribute', api: 'true-value', description: '选中时的值', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'false-value', description: '未选中时的值', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'border', description: '是否显示边框', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: '复选框尺寸', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'indeterminate', description: '是否为半选状态', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'model-value', description: 'CheckboxGroup 绑定值', type: 'array', defaultValue: '[]' },
    { category: 'Attribute', api: 'min / max', description: '可勾选数量的最小值和最大值', type: 'number', defaultValue: '-' },
    { category: 'Event', api: 'change', description: '绑定值变化时触发', type: '(value: string | number | boolean | object) => void', defaultValue: '-' },
  ],
  'date-picker': [
    { category: 'Attribute', api: 'model-value', description: '绑定值，如果它是数组，长度应该是 2', type: 'number | string | Date | array', defaultValue: "''" },
    { category: 'Attribute', api: 'readonly', description: '完全只读', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '禁用', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: '输入框尺寸', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'editable', description: '文本框可输入', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'clearable', description: '是否显示清除按钮', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'placeholder', description: '非范围选择时的占位内容', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'start-placeholder', description: '范围选择时开始日期的占位内容', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'end-placeholder', description: '范围选择时结束日期的占位内容', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'type', description: '显示类型', type: "'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'", defaultValue: "'date'" },
    { category: 'Attribute', api: 'format', description: '显示在输入框中的格式', type: 'string', defaultValue: 'YYYY-MM-DD' },
    { category: 'Attribute', api: 'value-format', description: '绑定值的格式，不指定则绑定值为 Date 对象', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'popper-class', description: 'DatePicker 下拉框的类名', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'popper-options', description: '自定义 popper 选项', type: 'object', defaultValue: '{}' },
    { category: 'Attribute', api: 'range-separator', description: '选择范围时的分隔符', type: 'string', defaultValue: "'-'" },
    { category: 'Attribute', api: 'default-value', description: '选择器打开时默认显示的时间', type: 'Date | [Date, Date]', defaultValue: '-' },
    { category: 'Attribute', api: 'default-time', description: '范围选择时选中日期所使用的默认具体时刻', type: 'Date | [Date, Date]', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled-date', description: '设置禁用状态，参数为当前日期，要求返回 boolean', type: '(date: Date) => boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'shortcuts', description: '设置快捷选项，需要传入数组对象', type: 'array', defaultValue: '[]' },
    { category: 'Attribute', api: 'cell-class-name', description: '设置自定义类名', type: '(date: Date) => string', defaultValue: '-' },
    { category: 'Attribute', api: 'teleported', description: '是否将 date-picker 的下拉列表插入至 body 元素', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'prefix-icon', description: '自定义前缀图标组件', type: 'string | Component', defaultValue: "'Date'" },
    { category: 'Attribute', api: 'clear-icon', description: '自定义清除图标组件', type: 'string | Component', defaultValue: "'CircleClose'" },
    { category: 'Attribute', api: 'validate-event', description: '输入时是否触发表单校验', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'unlink-panels', description: '在范围选择器里取消两个日期面板之间的联动', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'placement', description: '下拉框出现的位置', type: 'string', defaultValue: "'bottom'" },
    { category: 'Attribute', api: 'empty-values', description: '组件的空值配置', type: 'array', defaultValue: '-' },
    { category: 'Attribute', api: 'value-on-clear', description: '清空选项的值', type: 'string | number | boolean | Function', defaultValue: '-' },
    { category: 'Event', api: 'change', description: '用户确认选定的值时触发', type: '(value: Date | string | array) => void', defaultValue: '-' },
    { category: 'Event', api: 'blur', description: '当输入框失去焦点时触发', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: '当输入框获得焦点时触发', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'clear', description: '点击清除按钮时触发', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'calendar-change', description: '日历所选日期更改时触发；只在 daterange 模式下可用', type: '(value: [Date, Date]) => void', defaultValue: '-' },
    { category: 'Event', api: 'panel-change', description: '日期面板改变时触发', type: '(date, mode, view) => void', defaultValue: '-' },
    { category: 'Event', api: 'visible-change', description: '当 DatePicker 的下拉列表出现或消失时触发', type: '(visibility: boolean) => void', defaultValue: '-' },
  ],
  'featured-icon': noElementApiRows(),
  'code-block': noElementApiRows(),
  'scroll-shadow': [
    { category: 'Attribute', api: 'height', description: 'height of scrollbar', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'max-height', description: 'max height of scrollbar', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'native', description: 'whether to use the native scrollbar style', type: 'boolean', defaultValue: 'false' },
    {
      category: 'Attribute',
      api: 'wrap-style',
      description: 'style of wrap container',
      type: 'string | CSSProperties | CSSProperties[] | string[]',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'wrap-class', description: 'class of wrap container', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'view-style',
      description: 'style of view',
      type: 'string | CSSProperties | CSSProperties[] | string[]',
      defaultValue: '-',
    },
    { category: 'Attribute', api: 'view-class', description: 'class of view', type: 'string', defaultValue: '-' },
    {
      category: 'Attribute',
      api: 'noresize',
      description: 'do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance',
      type: 'boolean',
      defaultValue: 'false',
    },
    { category: 'Attribute', api: 'tag', description: 'element tag of the view', type: 'string', defaultValue: 'div' },
    { category: 'Attribute', api: 'always', description: 'always show scrollbar', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'min-size', description: 'minimum size of scrollbar', type: 'number', defaultValue: '20' },
    { category: 'Attribute', api: 'id', description: 'id of view', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'role', description: 'role of view', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-label', description: 'aria-label of view', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-orientation', description: 'aria-orientation of view', type: "'horizontal' | 'vertical'", defaultValue: '-' },
    { category: 'Attribute', api: 'tabindex', description: 'tabindex of wrap container', type: 'number | string', defaultValue: '-' },
    { category: 'Attribute', api: 'distance', description: 'trigger end-reached event distance(px)', type: 'number', defaultValue: '0' },
    { category: 'Event', api: 'scroll', description: 'triggers when scrolling, return distance of scrolling', type: 'event', defaultValue: '-' },
    { category: 'Event', api: 'end-reached', description: 'triggers when the end of a scroll is triggered', type: 'event', defaultValue: '-' },
  ],
  divider: [
    { category: 'Attribute', api: 'direction', description: '设置分割线方向', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'" },
    { category: 'Attribute', api: 'content-position', description: '自定义内容的位置', type: "'left' | 'right' | 'center'", defaultValue: "'center'" },
    { category: 'Attribute', api: 'border-style', description: '设置分割线样式', type: 'CSS border-style', defaultValue: "'solid'" },
  ],
  dropdown: [
    { category: 'Attribute', api: 'type', description: '菜单按钮类型，同 Button 组件', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'size', description: '菜单按钮尺寸，同 Button 组件', type: "'large' | 'default' | 'small'", defaultValue: "''" },
    { category: 'Attribute', api: 'max-height', description: '菜单最大高度', type: 'string | number', defaultValue: "''" },
    { category: 'Attribute', api: 'split-button', description: '是否展示为按钮组', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'placement', description: '菜单弹出位置', type: 'string', defaultValue: "'bottom'" },
    { category: 'Attribute', api: 'trigger', description: '触发下拉的行为', type: "'hover' | 'click' | 'contextmenu'", defaultValue: "'hover'" },
    { category: 'Attribute', api: 'hide-on-click', description: '是否在点击菜单项后隐藏菜单', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'show-timeout', description: '展开下拉菜单的延时，仅在 hover 触发时有效', type: 'number', defaultValue: '150' },
    { category: 'Attribute', api: 'hide-timeout', description: '收起下拉菜单的延时，仅在 hover 触发时有效', type: 'number', defaultValue: '150' },
    { category: 'Attribute', api: 'popper-class', description: 'Dropdown 下拉层的自定义类名', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'teleported', description: '是否将下拉列表插入至 body 元素', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'persistent', description: 'Dropdown 下拉列表不可见时是否保留 DOM', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'show-arrow', description: '下拉菜单是否显示箭头', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'offset', description: '下拉菜单偏移量', type: 'number', defaultValue: '12' },
    { category: 'Attribute', api: 'command', description: 'Dropdown Item 派发到 command 事件的指令', type: 'string | number | object', defaultValue: '-' },
    { category: 'Attribute', api: 'divided', description: 'Dropdown Item 是否显示分割线', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'icon', description: 'Dropdown Item 自定义图标', type: 'string | Component', defaultValue: '-' },
    { category: 'Event', api: 'click', description: 'split-button 为 true 时点击左侧按钮触发', type: '(event: MouseEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'command', description: '点击菜单项时触发', type: '(command: string | number | object) => void', defaultValue: '-' },
    { category: 'Event', api: 'visible-change', description: '下拉框出现或隐藏时触发', type: '(visible: boolean) => void', defaultValue: '-' },
  ],
}

const visionComponentNames: Record<DemoPageId, string> = {
  accordion: 'VisAccordion',
  alert: 'VisAlert',
  avatar: 'VisAvatar',
  button: 'VisButton',
  input: 'VisInput',
  modal: 'VisModal',
  badge: 'VisBadge',
  loading: 'VisLoading',
  tag: 'VisTag',
  breadcrumb: 'VisBreadcrumb',
  radio: 'VisRadio',
  checkbox: 'VisCheckbox',
  'date-picker': 'VisDatePicker',
  divider: 'VisDivider',
  drawer: 'VisDrawer',
  dropdown: 'VisDropdown',
  'featured-icon': 'VisFeaturedIcon',
  'code-block': 'VisCodeBlock',
  'scroll-shadow': 'VisScrollShadow',
}

const elementComponentNames: Partial<Record<DemoPageId, string>> = {
  accordion: 'ElCollapse',
  alert: 'ElAlert',
  avatar: 'ElAvatar',
  button: 'ElButton',
  input: 'ElInput',
  modal: 'ElDialog',
  tag: 'ElTag',
  breadcrumb: 'ElBreadcrumb',
  radio: 'ElRadio',
  checkbox: 'ElCheckbox',
  'date-picker': 'ElDatePicker',
  divider: 'ElDivider',
  drawer: 'ElDrawer',
  dropdown: 'ElDropdown',
  'scroll-shadow': 'ElScrollbar',
}

const visionAttributeColumns: ApiColumn[] = [
  { key: 'api', label: 'Vision API' },
  { key: 'elementApi', label: 'Element API' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
  { key: 'defaultValue', label: '默认值' },
]

const apiColumns: ApiColumn[] = [
  { key: 'api', label: 'API' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
  { key: 'defaultValue', label: '默认值' },
]

const eventColumns: ApiColumn[] = [
  { key: 'api', label: '事件名' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
]

const slotColumns: ApiColumn[] = [
  { key: 'api', label: '插槽名' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
]

const exposeColumns: ApiColumn[] = [
  { key: 'api', label: '名称' },
  { key: 'description', label: '说明' },
  { key: 'type', label: '类型' },
]

const visionEventTables: Record<DemoPageId, ApiDisplayRow[]> = {
  accordion: [
    {
      api: 'update:modelValue',
      description: '展开项变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisAccordionItemKey | null) => void',
    },
    {
      api: 'toggle',
      description: '任一面板展开或收起时触发，返回 key、expanded 和 item 数据。',
      type: '(payload: { key: VisAccordionItemKey; expanded: boolean; item: VisAccordionItemData }) => void',
    },
  ],
  alert: [
    {
      api: 'close',
      description: '点击默认关闭按钮时触发。',
      type: '(event: MouseEvent) => void',
    },
    {
      api: 'ignore',
      description: '点击默认忽略操作时触发。',
      type: '(event: MouseEvent) => void',
    },
    {
      api: 'detail',
      description: '点击默认查看详情操作时触发。',
      type: '(event: MouseEvent) => void',
    },
  ],
  avatar: [],
  button: [
    {
      api: 'click',
      description: '点击按钮时触发，透传原生 button click 事件。',
      type: '(event: MouseEvent) => void',
    },
  ],
  input: [
    {
      api: 'update:modelValue',
      description: '输入值变化时触发，用于 v-model 双向绑定。',
      type: '(value: string) => void',
    },
    {
      api: 'clear',
      description: '点击清除按钮并清空内容时触发。',
      type: '() => void',
    },
    {
      api: 'focus',
      description: '输入框获得焦点时触发。',
      type: '(event: FocusEvent) => void',
    },
    {
      api: 'blur',
      description: '输入框失去焦点时触发。',
      type: '(event: FocusEvent) => void',
    },
  ],
  modal: [
    {
      api: 'update:modelValue',
      description: '弹窗显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'close',
      description: '点击关闭按钮关闭弹窗时触发。',
      type: '() => void',
    },
    {
      api: 'cancel',
      description: '点击默认取消按钮时触发。',
      type: '() => void',
    },
    {
      api: 'confirm',
      description: '点击默认确认按钮时触发。',
      type: '() => void',
    },
    {
      api: 'back',
      description: '点击二级弹窗返回入口时触发。',
      type: '() => void',
    },
    {
      api: 'menu-select',
      description: '菜单型弹窗选择菜单项时触发。',
      type: '(item: VisModalMenuItem) => void',
    },
  ],
  drawer: [
    {
      api: 'update:modelValue',
      description: '抽屉显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'close',
      description: '点击关闭按钮关闭抽屉时触发。',
      type: '() => void',
    },
    {
      api: 'cancel',
      description: '点击默认取消按钮时触发。',
      type: '() => void',
    },
    {
      api: 'confirm',
      description: '点击默认确认按钮时触发。',
      type: '() => void',
    },
    {
      api: 'back',
      description: '点击二级抽屉返回入口时触发。',
      type: '() => void',
    },
  ],
  badge: [],
  loading: [],
  tag: [
    {
      api: 'update:checked',
      description: '可勾选标签选中状态变化时触发，用于 v-model:checked。',
      type: '(value: boolean) => void',
    },
    {
      api: 'change',
      description: '可勾选标签变化时触发，返回 checked 和 nativeEvent。',
      type: '(payload: { checked: boolean; nativeEvent?: Event | MouseEvent }) => void',
    },
    {
      api: 'close',
      description: '点击关闭按钮时触发。',
      type: '(event: MouseEvent) => void',
    },
  ],
  breadcrumb: [
    {
      api: 'click',
      description: '点击非禁用、非 active 面包屑项时触发。',
      type: '(item: VisBreadcrumbItem, index: number) => void',
    },
  ],
  radio: [
    {
      api: 'update:modelValue',
      description: '选中状态或 RadioGroup 选中值变化时触发。',
      type: '(value: boolean | VisRadioValue) => void',
    },
    {
      api: 'change',
      description: '单个 Radio 返回 checked/value；RadioGroup 返回当前选中值。',
      type: '(payload: object | VisRadioValue) => void',
    },
  ],
  checkbox: [
    {
      api: 'update:modelValue',
      description: '勾选状态或 CheckboxGroup 选中数组变化时触发。',
      type: '(value: boolean | VisCheckboxValue[]) => void',
    },
    {
      api: 'update:indeterminate',
      description: '半选状态被用户操作清除时触发。',
      type: '(value: boolean) => void',
    },
    {
      api: 'change',
      description: '单个 Checkbox 返回 checked/indeterminate/value；CheckboxGroup 返回选中数组。',
      type: '(payload: object | VisCheckboxValue[]) => void',
    },
  ],
  'date-picker': [
    {
      api: 'update:modelValue',
      description: '日期值变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisDatePickerValue) => void',
    },
    {
      api: 'change',
      description: '用户选择、快捷项选择或清空日期后触发。',
      type: '(value: VisDatePickerValue) => void',
    },
    {
      api: 'update:open',
      description: '面板展开状态变化时触发，可用于受控 open。',
      type: '(value: boolean) => void',
    },
  ],
  divider: [],
  'featured-icon': [],
  dropdown: [
    {
      api: 'update:open',
      description: '菜单展开状态变化时触发，用于 v-model:open。',
      type: '(value: boolean) => void',
    },
    {
      api: 'select',
      description: '点击可用菜单项时触发，返回条目数据和索引。',
      type: '(payload: { item: VisDropdownEntry; index: number }) => void',
    },
    {
      api: 'update:searchValue',
      description: '搜索条目输入值变化时触发。',
      type: '(value: string) => void',
    },
  ],
  'code-block': [],
  'scroll-shadow': [],
}

const elementExtraApiRows: Record<DemoPageId, ElementApiRow[]> = {
  accordion: [
    { category: 'Slot', api: 'default', description: 'Collapse 默认内容，通常放置 Collapse Item', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'title', description: 'Collapse Item 标题内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'icon', description: 'Collapse Item 自定义图标', type: 'slot', defaultValue: '-' },
  ],
  alert: [
    { category: 'Slot', api: 'default', description: 'Alert 描述内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'title', description: 'Alert 标题内容', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'visible', description: 'Alert 当前显示状态', type: 'object', defaultValue: '-' },
  ],
  avatar: [],
  button: [
    { category: 'Slot', api: 'default', description: '自定义默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'loading', description: '自定义加载中组件', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'icon', description: '自定义图标组件', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'ref', description: '按钮 HTML 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'size', description: '按钮尺寸', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'type', description: '按钮类型', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'disabled', description: '按钮禁用状态', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'shouldAddSpace', description: '是否在两个中文字符之间插入空格', type: 'object', defaultValue: '-' },
  ],
  input: [
    { category: 'Slot', api: 'prefix', description: '输入框头部内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'suffix', description: '输入框尾部内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'prepend', description: '输入框前置内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'append', description: '输入框后置内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    {
      category: 'Slot',
      api: 'password-icon',
      description: '作为输入密码图标的内容，仅在 show-password 为 true 时生效',
      type: 'slot',
      defaultValue: '-',
    },
    { category: 'Expose', api: 'blur', description: '使 input 失去焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'clear', description: '清除 input 值', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'focus', description: '使 input 获取焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'input', description: 'Input HTML 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'ref', description: 'HTML input 或 textarea 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'resizeTextarea', description: '改变 textarea 大小', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'select', description: '选中 input 中的文字', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'textarea', description: 'HTML textarea 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'textareaStyle', description: 'textarea 的样式', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'isComposing', description: '是否处于输入法 composing 状态', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'passwordVisible', description: '密码是否可见', type: 'object', defaultValue: '-' },
  ],
  modal: [
    { category: 'Slot', api: 'default', description: '对话框的默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'header', description: '对话框标题内容；会替换标题部分，但不会移除关闭按钮', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'footer', description: 'Dialog 按钮操作区的内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'title', description: '已废弃，与 header 作用相同', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'resetPosition', description: '重置位置', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleClose', description: '关闭对话框', type: 'Function', defaultValue: '-' },
  ],
  drawer: [
    { category: 'Slot', api: 'default', description: '抽屉的默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'icon', description: 'Vision 扩展：标题前图标内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'actions', description: 'Vision 扩展：覆盖默认操作按钮区域', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'header', description: 'Element Drawer 标题区域内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'footer', description: 'Element Drawer 底部区域内容', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'handleClose', description: '关闭抽屉', type: 'Function', defaultValue: '-' },
  ],
  badge: [],
  loading: [],
  tag: [
    { category: 'Slot', api: 'default', description: 'Tag 默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'leading', description: 'Vision 扩展：覆盖前导图标、头像或圆点', type: 'slot', defaultValue: '-' },
  ],
  breadcrumb: [
    { category: 'Slot', api: 'default', description: '自定义面包屑内容', type: 'slot', defaultValue: '-' },
  ],
  radio: [
    { category: 'Slot', api: 'default', description: 'Radio 默认内容', type: 'slot', defaultValue: '-' },
  ],
  checkbox: [
    { category: 'Slot', api: 'default', description: 'Checkbox 默认内容', type: 'slot', defaultValue: '-' },
  ],
  'date-picker': [
    { category: 'Slot', api: 'default', description: '自定义单元格内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'range-separator', description: '自定义范围分隔符内容', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'focus', description: '使输入框获取焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'blur', description: '使输入框失去焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleOpen', description: '打开日期选择面板', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleClose', description: '关闭日期选择面板', type: 'Function', defaultValue: '-' },
  ],
  divider: [
    { category: 'Slot', api: 'default', description: 'Element Divider 中间内容', type: 'slot', defaultValue: '-' },
  ],
  dropdown: [
    { category: 'Slot', api: 'default', description: 'Dropdown 触发元素内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'dropdown', description: 'Dropdown 下拉菜单内容，通常放置 Dropdown Menu', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'handleOpen', description: '打开下拉菜单', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleClose', description: '关闭下拉菜单', type: 'Function', defaultValue: '-' },
  ],
  'featured-icon': [],
  'code-block': [],
  'scroll-shadow': [
    { category: 'Slot', api: 'default', description: '滚动区域的默认内容', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'handleScroll', description: '处理滚动事件并更新滚动条位置', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'scrollTo', description: '滚动到指定位置', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setScrollTop', description: '设置垂直滚动距离', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setScrollLeft', description: '设置水平滚动距离', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'update', description: '手动更新滚动条状态', type: 'Function', defaultValue: '-' },
  ],
}

const elementApiDescriptionsZh: Partial<Record<DemoPageId, Record<string, string>>> = {
  button: {
    size: '尺寸',
    type: '按钮类型；设置 color 时，color 优先。',
    plain: '是否为朴素按钮',
    text: '是否为文字按钮',
    bg: '是否显示文字按钮背景颜色',
    link: '是否为链接按钮',
    round: '是否为圆角按钮',
    circle: '是否为圆形按钮',
    dashed: '是否为虚线按钮',
    loading: '是否为加载中状态',
    'loading-icon': '自定义加载中状态图标组件',
    disabled: '按钮是否为禁用状态',
    icon: '图标组件',
    autofocus: '原生 autofocus 属性',
    'native-type': '原生 type 属性',
    'auto-insert-space': '两个中文字符之间自动插入空格，仅当文本长度为 2 且所有字符均为中文时生效',
    color: '自定义按钮颜色，并自动计算 hover 和 active 触发后的颜色',
    dark: 'dark 模式，自动将 color 转换为暗色模式颜色',
    tag: '自定义元素标签',
  },
  input: {
    type: '输入类型，更多信息可参考 MDN input 类型',
    'model-value': '绑定值',
    'model-modifiers': 'v-model 修饰符',
    maxlength: '同原生 maxlength 属性',
    minlength: '原生属性，最小输入长度',
    'show-word-limit': "是否显示统计字数，只在 type 为 'text' 或 'textarea' 时生效",
    'word-limit-position': '字数统计的位置，仅当 show-word-limit 为 true 时生效',
    placeholder: '输入框占位文本',
    clearable: '是否显示清除按钮，只有当 type 不是 textarea 时生效',
    'clear-icon': '自定义清除图标',
    formatter: '指定输入值的格式，仅当 type 是 text 时生效',
    parser: '指定从格式化器输入中提取的值，仅当 type 是 text 时生效',
    'show-password': '是否显示切换密码图标',
    disabled: '是否禁用',
    size: "输入框尺寸，只在 type 不为 'textarea' 时有效",
    'prefix-icon': '自定义前缀图标',
    'suffix-icon': '自定义后缀图标',
    rows: "输入框行数，仅 type 为 'textarea' 时有效",
    autosize: "textarea 高度是否自适应，仅 type 为 'textarea' 时生效",
    autocomplete: '原生 autocomplete 属性',
    name: '等价于原生 input name 属性',
    readonly: '原生 readonly 属性，是否只读',
    max: '原生 max 属性，设置最大值',
    min: '原生 min 属性，设置最小值',
    step: '原生 step 属性，设置输入字段的合法数字间隔',
    resize: '控制是否能被用户缩放',
    autofocus: '原生 autofocus 属性，自动获取焦点',
    form: '原生 form 属性',
    'aria-label': '等价于原生 input aria-label 属性',
    tabindex: '输入框的 tabindex',
    'validate-event': '输入时是否触发表单校验',
    'input-style': 'input 元素或 textarea 元素的 style',
    label: '已废弃，等价于原生 input aria-label 属性',
    inputmode: '等价于原生 inputmode 属性',
    'count-graphemes': '自定义函数用于计算字形；设置后会绕过原生 maxlength/minlength 约束',
    blur: '当输入框失去焦点时触发',
    focus: '当输入框获得焦点时触发',
    change: '仅当 modelValue 改变时，在输入框失去焦点或用户按 Enter 时触发',
    input: '在 Input 值改变时触发',
    clear: '在点击由 clearable 属性生成的清空按钮时触发',
    keydown: '按下键时触发',
    mouseleave: '当鼠标离开输入元素时触发',
    mouseenter: '当鼠标进入输入元素时触发',
    compositionstart: '输入法输入开始时触发',
    compositionupdate: '输入法输入改变时触发',
    compositionend: '输入法输入完成时触发',
  },
  modal: {
    'model-value': '是否显示 Dialog',
    title: 'Dialog 的标题，也可通过具名 slot 传入',
    width: '对话框的宽度，默认值为 50%',
    fullscreen: '是否为全屏 Dialog',
    top: 'Dialog CSS 中的 margin-top 值，默认为 15vh',
    modal: '是否需要遮罩层',
    'modal-penetrable': '是否允许穿透遮罩层，modal 属性必须为 false',
    'modal-class': '遮罩的自定义类名',
    'header-class': 'header 部分的自定义 class 名',
    'body-class': 'body 部分的自定义 class 名',
    'footer-class': 'footer 部分的自定义 class 名',
    'append-to-body': 'Dialog 自身是否插入至 body 元素上；嵌套 Dialog 必须指定为 true',
    'append-to': 'Dialog 挂载到哪个 DOM 元素，会覆盖 append-to-body',
    'lock-scroll': '是否在 Dialog 出现时将 body 滚动锁定',
    'open-delay': 'Dialog 打开的延时时间，单位毫秒',
    'close-delay': 'Dialog 关闭的延时时间，单位毫秒',
    'close-on-click-modal': '是否可以通过点击 modal 关闭 Dialog',
    'close-on-press-escape': '是否可以通过按下 ESC 关闭 Dialog',
    'show-close': '是否显示关闭按钮',
    'before-close': '关闭前的回调，会暂停 Dialog 的关闭；执行 done 参数方法时才真正关闭',
    draggable: '为 Dialog 启用可拖拽功能',
    overflow: '拖动范围是否可以超出可视区',
    center: '是否让 Dialog 的 header 和 footer 部分居中排列',
    'align-center': '是否水平垂直对齐对话框',
    'destroy-on-close': '关闭 Dialog 时是否销毁其中的元素',
    'close-icon': '自定义关闭图标',
    'z-index': '和原生 CSS z-index 相同，用于改变 z 轴顺序',
    'header-aria-level': 'header 的 aria-level 属性',
    transition: '对话框动画的自定义过渡配置，可以是字符串或 Vue 过渡属性对象',
    'custom-class': '已废弃，Dialog 的自定义类名',
    open: 'Dialog 打开的回调',
    opened: 'Dialog 打开动画结束时的回调',
    close: 'Dialog 关闭的回调',
    closed: 'Dialog 关闭动画结束时的回调',
    'open-auto-focus': '输入焦点聚焦在 Dialog 内容时的回调',
    'close-auto-focus': '输入焦点从 Dialog 内容失焦时的回调',
  },
  'scroll-shadow': {
    height: '滚动条高度',
    'max-height': '滚动条最大高度',
    native: '是否使用原生滚动条样式',
    'wrap-style': '包裹容器的自定义样式',
    'wrap-class': '包裹容器的自定义类名',
    'view-style': '视图容器的自定义样式',
    'view-class': '视图容器的自定义类名',
    noresize: '不响应容器尺寸变化；容器尺寸不变化时可设置以优化性能',
    tag: '视图容器的元素标签',
    always: '是否始终显示滚动条',
    'min-size': '滚动条最小尺寸',
    id: '视图容器 id',
    role: '视图容器 role',
    'aria-label': '视图容器 aria-label',
    'aria-orientation': '视图容器 aria-orientation',
    tabindex: '包裹容器 tabindex',
    distance: '触发 end-reached 事件的距离，单位 px',
    scroll: '滚动时触发，返回滚动距离',
    'end-reached': '滚动到末端时触发',
  },
}

function toVisionAttributeRows(rows: ApiRow[]): ApiDisplayRow[] {
  return rows.flatMap((row) =>
    splitMergedApiRow({
      api: row.visionApi,
      elementApi: row.elementApi,
      description: row.description,
      type: row.type,
      defaultValue: row.defaultValue,
    }),
  )
}

function getElementRows(page: DemoPageId): ElementApiRow[] {
  const zhMap = elementApiDescriptionsZh[page] ?? {}
  return [...elementApiTables[page], ...elementExtraApiRows[page]].map((row) => ({
    ...row,
    description: zhMap[row.api] ?? row.description,
  }))
}

function toElementRows(rows: ElementApiRow[]): ApiDisplayRow[] {
  return rows.flatMap((row) =>
    splitMergedApiRow({
      api: row.api,
      description: row.description,
      type: row.type,
      defaultValue: row.defaultValue,
    }),
  )
}

function splitMergedValue(value: string | undefined): string[] {
  return value?.split(/\s+\/\s+/).map((part) => part.trim()).filter(Boolean) ?? []
}

function getAlignedPart(value: string | undefined, index: number, expectedLength: number) {
  const parts = splitMergedValue(value)
  return parts.length === expectedLength ? parts[index] : value
}

function splitMergedApiRow(row: ApiDisplayRow): ApiDisplayRow[] {
  const apiParts = splitMergedValue(row.api)
  if (apiParts.length <= 1) return [row]

  return apiParts.map((api, index) => ({
    ...row,
    api,
    elementApi: getAlignedPart(row.elementApi, index, apiParts.length),
    type: getAlignedPart(row.type, index, apiParts.length) ?? row.type,
    defaultValue: getAlignedPart(row.defaultValue, index, apiParts.length),
  }))
}

function createSection(title: string, columns: ApiColumn[], rows: ApiDisplayRow[]): ApiTableSection | undefined {
  if (rows.length === 0) return undefined
  return { title, columns, rows }
}

const currentVisionApiSections = computed(() => {
  const componentName = visionComponentNames[activePage.value]
  return [
    createSection(`${componentName} Attributes`, visionAttributeColumns, toVisionAttributeRows(apiTables[activePage.value])),
    createSection(`${componentName} Events`, eventColumns, visionEventTables[activePage.value]),
  ].filter((section): section is ApiTableSection => Boolean(section))
})

const currentElementApiSections = computed(() => {
  const componentName = elementComponentNames[activePage.value]
  if (!componentName) return []

  const rows = getElementRows(activePage.value)
  const rowsByCategory = {
    Attribute: rows.filter((row) => row.category === 'Attribute'),
    Event: rows.filter((row) => row.category === 'Event'),
    Slot: rows.filter((row) => row.category === 'Slot'),
    Expose: rows.filter((row) => row.category === 'Expose'),
  }

  return [
    createSection(`${componentName} Attributes`, apiColumns, toElementRows(rowsByCategory.Attribute)),
    createSection(`${componentName} Events`, eventColumns, toElementRows(rowsByCategory.Event)),
    createSection(`${componentName} Slots`, slotColumns, toElementRows(rowsByCategory.Slot)),
    createSection(`${componentName} Exposes`, exposeColumns, toElementRows(rowsByCategory.Expose)),
  ].filter((section): section is ApiTableSection => Boolean(section))
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function isGroupCollapsed(title: string) {
  return collapsedGroups.value.has(title)
}

function toggleGroup(title: string) {
  const next = new Set(collapsedGroups.value)
  if (next.has(title)) next.delete(title)
  else next.add(title)
  collapsedGroups.value = next
}

function selectPage(page: SidebarPageId | undefined) {
  if (!page || page === 'icons') return
  activePage.value = page
}
</script>

<template>
  <VisConfigProvider :theme="theme" namespace="vis-el" :z-index="3200">
    <div class="docs-shell" :data-theme="theme">
      <header class="docs-topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true" v-html="logoSvg" />
          <div>
            <strong>Vision Design</strong>
            <small>Design System</small>
          </div>
        </div>

        <VisButton
          class="docs-theme-button"
          variant="secondary"
          icon-only
          :icon-name="themeToggleIcon"
          :label="themeToggleLabel"
          @click="toggleTheme"
        />
      </header>

      <div class="docs-body">
        <aside class="docs-sidebar" aria-label="Design system navigation">
          <section v-for="(group, groupIndex) in sidebarGroups" :key="group.title" class="sidebar-section">
            <button
              type="button"
              class="menu-group"
              :aria-expanded="!isGroupCollapsed(group.title)"
              @click="toggleGroup(group.title)"
            >
              <span>{{ group.title }}</span>
              <Icon v-if="isGroupCollapsed(group.title)" name="chevron-left" :size="16" decorative />
              <Icon v-else name="chevron-down" :size="16" decorative />
            </button>

            <template v-if="!isGroupCollapsed(group.title)">
              <button
                v-for="item in group.items"
                :key="group.title + '-' + item.title"
                class="menu-item"
                :class="{ active: item.page === activePage, 'is-disabled': !item.page || item.page === 'icons' }"
                :disabled="!item.page || item.page === 'icons'"
                type="button"
                @click="selectPage(item.page)"
              >
                <span>{{ item.title }}</span>
                <small>{{ item.subtitle }}</small>
              </button>
            </template>

            <div v-if="groupIndex < sidebarGroups.length - 1" class="menu-divider" aria-hidden="true">
              <span class="menu-divider__line" />
            </div>
          </section>
        </aside>

        <main class="docs-main">
          <article class="content">
            <div class="content-heading">
              <h2 class="content-title">{{ currentPage.title }}</h2>
              <p>{{ currentPage.subtitle }}</p>
            </div>

            <section class="demo-panel">
              <div v-if="activePage === 'accordion'" class="accordion-demo">
                <VisAccordion v-model="accordionActiveKey" :items="accordionItems" />
                <VisAccordion v-model="accordionBorderlessKey" :items="accordionItems.slice(0, 4)" borderless />
                <VisAccordion v-model="accordionNoIconKey" :items="accordionItems.slice(0, 4)" :icon="false" />
              </div>

              <div v-else-if="activePage === 'alert'" class="alert-demo">
                <div class="alert-demo__controls" aria-label="Alert type">
                  <button
                    v-for="type in alertTypes"
                    :key="type"
                    type="button"
                    :class="{ active: alertType === type }"
                    @click="alertType = type"
                  >
                    {{ type }}
                  </button>
                </div>
                <div class="alert-demo__toggles">
                  <label><input v-model="alertDescription" type="checkbox" /> Description</label>
                  <label><input v-model="alertActions" type="checkbox" /> Actions</label>
                  <label><input v-model="alertCloseable" type="checkbox" /> Closeable</label>
                </div>
                <VisAlert
                  :type="alertType"
                  :description="alertDescription"
                  :actions="alertActions"
                  :closeable="alertCloseable"
                />
                <div class="alert-demo__grid">
                  <VisAlert
                    v-for="type in alertTypes"
                    :key="`${type}-plain`"
                    :type="type"
                    :actions="false"
                    :closeable="false"
                  />
                </div>
                <div class="alert-demo__grid">
                  <VisAlert
                    v-for="type in alertTypes"
                    :key="`${type}-description`"
                    :type="type"
                    description
                    :closeable="false"
                  />
                </div>
              </div>

              <div v-else-if="activePage === 'button'" class="button-demo">
                <VisButton>主要按钮</VisButton>
                <VisButton variant="secondary">次要按钮</VisButton>
                <VisButton variant="text">文本按钮</VisButton>
                <VisButton variant="link-color">彩色链接</VisButton>
                <VisButton danger>危险按钮</VisButton>
                <VisButton loading>加载中</VisButton>
                <VisButton icon-only icon-name="plus" label="新增" />
              </div>

              <div v-else-if="activePage === 'input'" class="input-demo">
                <VisInput v-model="inputValue" prefix suffix :max-length="20" />
                <VisInput state="danger" placeholder="危险态" :max-length="20" />
                <VisInput read-view :model-value="inputValue" />
                <VisInput addon-left addon-right addon-left-text="https://" addon-right-text=".com" />
              </div>

              <div v-else-if="activePage === 'modal'" class="modal-demo">
                <VisButton variant="secondary" @click="modalOpen = true">重新打开</VisButton>
                <VisModal
                  v-model="modalOpen"
                  title="对话框标题"
                  icon
                  footer
                  @cancel="modalOpen = false"
                  @confirm="modalOpen = false"
                >
                  <div class="modal-content">这里是 Modal 的正确结构迁移预览。</div>
                </VisModal>
              </div>

              <div v-else-if="activePage === 'avatar'" class="avatar-demo">
                <div class="avatar-demo__preview">
                  <VisAvatar
                    :type="avatarType"
                    :size="avatarSize"
                    :badge="avatarBadge"
                    :shape-square="avatarSquare"
                    text="张大山"
                  />
                  <div class="avatar-demo__controls">
                    <div class="avatar-demo__control-row" aria-label="Avatar type">
                      <button
                        v-for="type in avatarTypes"
                        :key="type"
                        type="button"
                        :class="{ active: avatarType === type }"
                        @click="avatarType = type"
                      >
                        {{ type }}
                      </button>
                    </div>
                    <div class="avatar-demo__control-row" aria-label="Avatar size">
                      <button
                        v-for="size in avatarSizes"
                        :key="size"
                        type="button"
                        :class="{ active: avatarSize === size }"
                        @click="avatarSize = size"
                      >
                        {{ size }}
                      </button>
                    </div>
                    <div class="avatar-demo__control-row" aria-label="Avatar badge">
                      <button
                        v-for="badge in avatarBadges"
                        :key="badge"
                        type="button"
                        :class="{ active: avatarBadge === badge }"
                        @click="avatarBadge = badge"
                      >
                        {{ badge }}
                      </button>
                    </div>
                    <label class="avatar-demo__toggle">
                      <input v-model="avatarSquare" type="checkbox">
                      <span>Square</span>
                    </label>
                  </div>
                </div>

                <div class="avatar-demo__matrix">
                  <div v-for="type in avatarTypes" :key="type" class="avatar-demo__row">
                    <span class="avatar-demo__label">{{ type }}</span>
                    <div class="avatar-demo__items">
                      <VisAvatar
                        v-for="(size, index) in avatarSizes"
                        :key="`${type}-${size}`"
                        :type="type"
                        :size="size"
                        :image-variant="type === 'image' ? avatarImageVariants[index] : '09'"
                        :text="type === 'text' ? '张大山' : '诸葛'"
                      />
                    </div>
                  </div>
                </div>

                <div class="avatar-demo__badge-grid">
                  <div v-for="(badge, index) in avatarBadges" :key="badge" class="avatar-demo__badge-item">
                    <span>{{ badge }}</span>
                    <VisAvatar type="image" size="lg" :badge="badge" :image-variant="avatarImageVariants[index]" />
                    <VisAvatar type="icon" size="lg" :badge="badge" />
                    <VisAvatar type="text" size="lg" :badge="badge" text="诸葛" />
                  </div>
                </div>

                <div class="avatar-demo__composition">
                  <div class="avatar-demo__composition-panel">
                    <div class="avatar-demo__control-row" aria-label="Avatar group size">
                      <button
                        v-for="size in avatarSizes"
                        :key="`group-${size}`"
                        type="button"
                        :class="{ active: avatarGroupSize === size }"
                        @click="avatarGroupSize = size"
                      >
                        {{ size }}
                      </button>
                    </div>
                    <VisAvatarGroup :size="avatarGroupSize" />
                  </div>

                  <div class="avatar-demo__composition-panel">
                    <VisAvatarLabel
                      v-for="(size, index) in avatarSizes"
                      :key="`label-${size}`"
                      :size="size"
                      :avatar-image-variant="avatarImageVariants[(index + 4) % avatarImageVariants.length]"
                      title="张大山"
                      subtitle="zhangdashan"
                    />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'badge'" class="badge-demo">
                <div class="badge-demo__row">
                  <VisBadge color-type="danger" />
                  <VisBadge color-type="warning" />
                  <VisBadge color-type="success" />
                  <VisBadge color-type="brand" />
                  <VisBadge color-type="grey" />
                </div>
                <div class="badge-demo__row">
                  <VisBadge type="text" color-type="danger" label="Hot!" />
                  <VisBadge type="text" color-type="success" label="New" />
                  <VisBadge type="number" color-type="brand" :count="8" />
                  <VisBadge type="icon" color-type="warning" icon-name="alert-triangle" />
                  <VisBadge type="dot" color-type="success" />
                </div>
                <div class="badge-demo__row">
                  <VisBadge color-type="brand" solid label="实心" />
                  <VisBadge color-type="brand" subtle label="轻量" />
                  <VisBadge type="text" color-type="grey" label="Info" />
                  <VisBadge type="icon" color-type="danger" solid icon-name="x-close" />
                </div>
              </div>

              <div v-else-if="activePage === 'loading'" class="loading-demo">
                <div class="loading-demo__row">
                  <VisLoading size="xs" />
                  <VisLoading size="sm" />
                  <VisLoading size="md" />
                  <VisLoading size="lg" />
                  <VisLoading size="xl" />
                </div>
                <div class="loading-demo__row">
                  <VisLoading color="brand" text label="加载中" />
                  <VisLoading color="grey" text label="处理中" />
                  <VisLoading color="danger" text label="重试中" />
                  <span class="loading-demo__inverse">
                    <VisLoading color="white" text label="同步中" />
                  </span>
                </div>
              </div>

              <div v-else-if="activePage === 'tag'" class="tag-demo">
                <div class="tag-demo__row">
                  <VisTag label="默认标签" />
                  <VisTag type="icon" icon-name="archive" label="图标标签" />
                  <VisTag type="avatar" label="头像标签" />
                  <VisTag type="dot" label="状态标签" />
                </div>
                <div class="tag-demo__row">
                  <VisTag v-model:checked="tagChecked" checkable label="可勾选" />
                  <VisTag checkable checked type="icon" icon-name="check" label="已选中" />
                  <VisTag closable label="可关闭" />
                  <VisTag closable close-state="hover" type="dot" label="关闭 hover" />
                </div>
              </div>

              <div v-else-if="activePage === 'breadcrumb'" class="breadcrumb-demo">
                <VisBreadcrumb :items="breadcrumbItems" />
                <VisBreadcrumb type="link" separator="arrow" size="sm" :items="breadcrumbItems" />
                <VisBreadcrumb
                  :items="[
                    { label: '菜单名称' },
                    { label: '菜单名称', disabled: true },
                    { label: '菜单名称', active: true },
                  ]"
                />
              </div>

              <div v-else-if="activePage === 'radio'" class="radio-demo">
                <div class="radio-demo__row">
                  <VisRadio :model-value="true" value="single">选项</VisRadio>
                  <VisRadio state="hover" value="hover">Hover</VisRadio>
                  <VisRadio disabled :model-value="true" value="disabled">禁用</VisRadio>
                  <VisRadio :label="false" aria-label="无标签单选" />
                </div>
                <VisRadioGroup v-model="radioValue" :options="radioOptions" />
                <VisRadioGroup v-model="radioValue" :options="radioOptions" radio-button />
              </div>

              <div v-else-if="activePage === 'checkbox'" class="checkbox-demo">
                <div class="checkbox-demo__row">
                  <VisCheckbox :model-value="true" value="single">选项</VisCheckbox>
                  <VisCheckbox indeterminate value="mixed">半选</VisCheckbox>
                  <VisCheckbox state="hover" value="hover">Hover</VisCheckbox>
                  <VisCheckbox disabled :model-value="true" value="disabled">禁用</VisCheckbox>
                  <VisCheckbox :label="false" aria-label="无标签复选" />
                </div>
                <VisCheckboxGroup v-model="checkboxValue" :options="checkboxOptions" />
                <VisCheckboxGroup v-model="checkboxValue" align="vertical" :options="checkboxOptions" />
              </div>

              <div v-else-if="activePage === 'date-picker'" class="date-picker-demo">
                <div class="date-picker-demo__row">
                  <VisDatePicker v-model="datePickerValue" />
                  <VisDatePicker state="hover" placeholder="Hover" />
                  <VisDatePicker state="focus" placeholder="Focus" />
                  <VisDatePicker state="danger" placeholder="Danger" />
                  <VisDatePicker disabled placeholder="Disabled" />
                </div>

                <div class="date-picker-demo__row">
                  <VisDatePicker v-model="datePickerRangeValue" range />
                  <VisDatePicker range state="danger" />
                  <VisDatePicker range disabled />
                </div>

                <div class="date-picker-demo__panel-row">
                  <VisDatePicker v-model="datePickerValue" open />
                  <VisDatePicker v-model="datePickerRangeValue" range open />
                </div>
              </div>

              <div v-else-if="activePage === 'divider'" class="divider-demo">
                <div class="divider-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Divider orientation">
                    <button
                      type="button"
                      :class="{ active: dividerOrientation === 'horizontal' }"
                      @click="dividerOrientation = 'horizontal'"
                    >
                      horizontal
                    </button>
                    <button
                      type="button"
                      :class="{ active: dividerOrientation === 'vertical' }"
                      @click="dividerOrientation = 'vertical'"
                    >
                      vertical
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="dividerDashed" type="checkbox">
                    <span>Dashed</span>
                  </label>
                </div>

                <div class="divider-demo__preview">
                  <span>菜单名称</span>
                  <VisDivider :orientation="dividerOrientation" :dashed="dividerDashed" />
                  <span>菜单名称</span>
                </div>

                <div class="divider-demo__matrix">
                  <div class="divider-demo__sample">
                    <span>horizontal</span>
                    <VisDivider />
                  </div>
                  <div class="divider-demo__sample">
                    <span>horizontal dashed</span>
                    <VisDivider dashed />
                  </div>
                  <div class="divider-demo__sample divider-demo__sample--vertical">
                    <span>vertical</span>
                    <VisDivider orientation="vertical" />
                  </div>
                  <div class="divider-demo__sample divider-demo__sample--vertical">
                    <span>vertical dashed</span>
                    <VisDivider orientation="vertical" dashed length="32px" />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'drawer'" class="drawer-demo">
                <div class="drawer-demo__right-row">
                  <VisDrawer title="对话框标题">
                    <div class="drawer-demo__blank" />
                  </VisDrawer>
                  <VisDrawer title="对话框标题" :divider="false">
                    <div class="drawer-demo__blank" />
                  </VisDrawer>
                </div>

                <VisDrawer title="对话框标题" position="bottom">
                  <div class="drawer-demo__blank" />
                </VisDrawer>

                <VisDrawer title="对话框标题" position="bottom" :divider="false">
                  <div class="drawer-demo__blank" />
                </VisDrawer>
              </div>

              <div v-else-if="activePage === 'dropdown'" class="dropdown-demo">
                <div class="dropdown-demo__showcase">
                  <VisDropdown
                    v-model:open="dropdownOpen"
                    v-model:search-value="dropdownSearchValue"
                    :items="dropdownItems"
                    header
                    button-label="触发"
                  />
                  <VisDropdown
                    :items="dropdownItems"
                    open
                    trigger="avatar"
                    header
                    header-type="avatar"
                  />
                </div>

                <div class="dropdown-demo__items">
                  <VisDropdownItem type="icon" icon-name="settings-01" state="hover" />
                  <VisDropdownItem label="菜单选项" active />
                  <VisDropdownItem type="icon" icon-name="log-out-01" label="菜单选项" arrow />
                  <VisDropdownItem type="avatar" title="张大山" subtitle="zhangdashan" />
                  <VisDropdownItem label="菜单选项" disabled />
                  <VisDropdownItem label="菜单选项" checkable active />
                </div>
              </div>

              <div v-else-if="activePage === 'featured-icon'" class="featured-icon-demo">
                <VisFeaturedIcon size="xs" color="brand" type="solid-round" icon="download-cloud-02" />
                <VisFeaturedIcon size="md" color="success" type="light-round" icon="check" />
                <VisFeaturedIcon size="lg" color="warning" type="solid-square" icon="alert-triangle" />
                <VisFeaturedIcon size="xl" color="danger" type="light-square" icon="x-close" />
                <VisFeaturedIcon size="xxl" color="grey" type="modern" icon="settings-01" />
              </div>

              <VisCodeBlock
                v-else-if="activePage === 'code-block'"
                heading
                copy
                language="TypeScript"
                :code="sampleCode"
              />

              <VisScrollShadow v-else class="scroll-demo" variant="surface" :size="64">
                <div class="scroll-demo__content">
                  <p v-for="index in 18" :key="index">
                    滚动内容 {{ index }}：用于验证 ScrollShadow 的顶部和底部渐隐。
                  </p>
                </div>
              </VisScrollShadow>
            </section>

            <section class="api-section" aria-label="组件 API">
              <div v-if="currentVisionApiSections.length > 0" class="api-section__major">
                <h3 class="api-section__title ld-heading-h3">Vision API</h3>

                <div v-for="section in currentVisionApiSections" :key="section.title" class="api-section__group">
                  <h4 class="api-section__subtitle ld-heading-h4">{{ section.title }}</h4>
                  <div class="api-table-wrap">
                    <table class="api-table">
                      <colgroup>
                        <col
                          v-for="column in section.columns"
                          :key="column.key"
                          class="api-table__col"
                          :class="`api-table__col--${column.key}`"
                        >
                      </colgroup>
                      <thead>
                        <tr>
                          <th v-for="column in section.columns" :key="column.key">{{ column.label }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in section.rows" :key="`${section.title}-${row.api}`">
                          <td
                            v-for="column in section.columns"
                            :key="column.key"
                            class="api-table__cell"
                            :class="`api-table__cell--${column.key}`"
                          >
                            <code v-if="column.key !== 'description'">{{ row[column.key] ?? '-' }}</code>
                            <template v-else>{{ row.description }}</template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div v-if="currentElementApiSections.length > 0" class="api-section__major">
                <h3 class="api-section__title ld-heading-h3">Element API</h3>

                <div v-for="section in currentElementApiSections" :key="section.title" class="api-section__group">
                  <h4 class="api-section__subtitle ld-heading-h4">{{ section.title }}</h4>
                  <div class="api-table-wrap">
                    <table class="api-table">
                      <colgroup>
                        <col
                          v-for="column in section.columns"
                          :key="column.key"
                          class="api-table__col"
                          :class="`api-table__col--${column.key}`"
                        >
                      </colgroup>
                      <thead>
                        <tr>
                          <th v-for="column in section.columns" :key="column.key">{{ column.label }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in section.rows" :key="`${section.title}-${row.api}`">
                          <td
                            v-for="column in section.columns"
                            :key="column.key"
                            class="api-table__cell"
                            :class="`api-table__cell--${column.key}`"
                          >
                            <code v-if="column.key !== 'description'">{{ row[column.key] ?? '-' }}</code>
                            <template v-else>{{ row.description }}</template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </main>
      </div>
    </div>
  </VisConfigProvider>
</template>

<style scoped>
.docs-shell {
  --shell-border: var(--color-border-default);
  --shell-text-primary: var(--color-text-primary);
  --shell-text-secondary: var(--color-text-secondary);
  --shell-text-tertiary: var(--color-text-tertiary);
  --shell-active-bg: var(--color-bg-secondary);
  --shell-scrollbar-track: transparent;
  --shell-scrollbar-thumb: var(--primitive-grey-200);
  --shell-scrollbar-thumb-hover: var(--primitive-grey-300);
  --shell-scrollbar-gutter: var(--space-4);
  --vis-content-width: 1440px;

  width: 100%;
  height: 100dvh;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-sans);
}

.docs-shell[data-theme="dark"] {
  --shell-scrollbar-thumb: var(--primitive-grey-700);
  --shell-scrollbar-thumb-hover: var(--primitive-grey-600);
}

.docs-shell,
.docs-shell * {
  scrollbar-width: thin;
  scrollbar-color: var(--shell-scrollbar-thumb) var(--shell-scrollbar-track);
}

.docs-shell::-webkit-scrollbar,
.docs-shell *::-webkit-scrollbar {
  inline-size: 12px;
  block-size: 8px;
}

.docs-shell::-webkit-scrollbar-track,
.docs-shell *::-webkit-scrollbar-track {
  background: var(--shell-scrollbar-track);
}

.docs-shell::-webkit-scrollbar-thumb,
.docs-shell *::-webkit-scrollbar-thumb {
  min-block-size: var(--space-16);
  border-inline-end: var(--shell-scrollbar-gutter) solid transparent;
  border-radius: var(--radius-full);
  background: var(--shell-scrollbar-thumb);
  background-clip: padding-box;
}

.docs-shell::-webkit-scrollbar-thumb:hover,
.docs-shell *::-webkit-scrollbar-thumb:hover {
  background: var(--shell-scrollbar-thumb-hover);
  background-clip: padding-box;
}

.docs-topbar {
  block-size: var(--space-64);
  min-block-size: var(--space-64);
  padding: 0 var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  background: var(--color-bg-surface);
  box-shadow: inset 0 -1px var(--shell-border);
}

.brand {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.brand > div {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
}

.brand strong {
  color: var(--shell-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
}

.brand small {
  overflow: hidden;
  color: var(--shell-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-mark {
  inline-size: 28px;
  block-size: 28px;
  display: inline-flex;
  flex: 0 0 auto;
}

.brand-mark :deep(svg) {
  display: block;
  inline-size: 28px;
  block-size: 28px;
}

.docs-theme-button {
  flex: 0 0 auto;
}

.docs-body {
  min-block-size: 0;
  block-size: calc(100% - var(--space-64));
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  overflow: hidden;
}

.docs-sidebar {
  inline-size: 256px;
  min-block-size: 0;
  block-size: 100%;
  border-inline-end: 1px solid var(--shell-border);
  padding: var(--space-12);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  background: var(--color-bg-surface);
}

.docs-sidebar::-webkit-scrollbar {
  display: none;
  inline-size: 0;
  block-size: 0;
}

.sidebar-section {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.menu-group {
  inline-size: 232px;
  block-size: 36px;
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-8) var(--space-12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  color: var(--shell-text-tertiary);
  background: var(--color-bg-surface);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.menu-group:hover {
  background: var(--shell-active-bg);
}

.menu-group span {
  min-inline-size: 0;
  overflow: hidden;
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-divider {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-16);
  padding: 0 var(--space-12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-divider__line {
  inline-size: 100%;
  block-size: 1px;
  background-image: linear-gradient(to right, var(--color-border-default) 50%, transparent 50%);
  background-position: left center;
  background-repeat: repeat-x;
  background-size: 6px 1px;
}

.menu-item {
  inline-size: 232px;
  block-size: 58px;
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-8) var(--space-12);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: inherit;
  background: var(--color-bg-surface);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover:not(:disabled),
.menu-item.active {
  background: var(--shell-active-bg);
}

.menu-item:disabled {
  cursor: default;
}

.menu-item.is-disabled {
  opacity: 0.56;
}

.menu-item span {
  inline-size: 208px;
  overflow: hidden;
  color: var(--shell-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 600;
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item small {
  margin-block-start: 0;
  inline-size: 208px;
  overflow: hidden;
  color: var(--shell-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item:focus-visible,
.menu-group:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

.docs-main {
  min-inline-size: 0;
  min-block-size: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--vis-content-width)) minmax(0, 1fr);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.content {
  grid-column: 2;
  inline-size: min(100%, var(--vis-content-width));
  min-inline-size: 0;
  padding: var(--space-40) 0;
}

.content-heading {
  margin-block-end: var(--space-16);
}

.content-title {
  margin: 0;
  color: var(--shell-text-primary);
  font-size: var(--font-heading-h2-size);
  font-weight: 600;
  line-height: var(--font-heading-h2-line-height);
}

.content-heading > p:last-child {
  margin: 0;
  color: var(--shell-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.demo-panel {
  max-inline-size: 760px;
  min-block-size: 360px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.demo-panel:has(.vis-code-block) {
  max-inline-size: 900px;
  inline-size: 100%;
}

.demo-panel:has(.date-picker-demo) {
  max-inline-size: 960px;
  inline-size: 100%;
}

.demo-panel:has(.divider-demo) {
  max-inline-size: 760px;
  inline-size: 100%;
}

.demo-panel:has(.drawer-demo) {
  max-inline-size: 1400px;
  inline-size: 100%;
}

.demo-panel:has(.dropdown-demo) {
  max-inline-size: 880px;
  min-block-size: 520px;
  inline-size: 100%;
}

.api-section {
  margin-block-start: var(--space-32);
  min-inline-size: 0;
}

.api-section__title {
  margin: 0 0 var(--space-20);
  color: var(--color-text-primary);
}

.api-section__major {
  min-inline-size: 0;
}

.api-section__major + .api-section__major {
  margin-block-start: var(--space-32);
}

.api-section__group {
  min-inline-size: 0;
}

.api-section__group + .api-section__group {
  margin-block-start: var(--space-24);
}

.api-section__subtitle {
  margin: 0 0 var(--space-12);
  color: var(--color-text-primary);
}

.api-table-wrap {
  min-inline-size: 0;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-xs);
  overflow: hidden;
}

.api-table {
  inline-size: 100%;
  min-inline-size: 0;
  border-collapse: collapse;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  table-layout: fixed;
}

.api-table__col--api {
  inline-size: 168px;
}

.api-table__col--elementApi {
  inline-size: 220px;
}

.api-table__col--description {
  inline-size: auto;
}

.api-table__col--type {
  inline-size: 240px;
}

.api-table__col--defaultValue {
  inline-size: 128px;
}

.api-table th,
.api-table td {
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-12) var(--space-16);
  text-align: start;
  vertical-align: top;
}

.api-table tr:last-child td {
  border-block-end: 0;
}

.api-table th {
  color: var(--color-text-tertiary);
  background: var(--color-bg-secondary);
  font-weight: 600;
  white-space: normal;
}

.api-table__cell {
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
}

.api-table code {
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.button-demo,
.input-demo,
.alert-demo__controls,
.alert-demo__toggles,
.avatar-demo__control-row,
.featured-icon-demo,
.tag-demo__row,
.radio-demo__row,
.checkbox-demo__row,
.date-picker-demo__row,
.date-picker-demo__panel-row,
.divider-demo__controls,
.divider-demo__preview,
.badge-demo__row,
.loading-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.badge-demo,
.avatar-demo,
.loading-demo,
.tag-demo,
.breadcrumb-demo,
.accordion-demo,
.alert-demo,
.radio-demo,
.checkbox-demo,
.date-picker-demo,
.divider-demo,
.drawer-demo {
  display: grid;
  gap: var(--space-20);
}

.dropdown-demo {
  display: grid;
  gap: var(--space-24);
}

.date-picker-demo {
  inline-size: 100%;
  max-inline-size: 960px;
}

.drawer-demo {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 1400px;
  border-radius: var(--radius-sm);
  padding: var(--space-20);
  background: var(--color-bg-secondary);
}

.drawer-demo__right-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-32);
}

.drawer-demo__right-row .vis-drawer {
  flex: 0 0 auto;
}

.drawer-demo__blank {
  inline-size: 100%;
  block-size: 100%;
}

.divider-demo {
  inline-size: 100%;
  max-inline-size: 760px;
}

.divider-demo__controls {
  gap: var(--space-16);
}

.divider-demo__preview {
  min-block-size: var(--space-80);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: var(--space-20);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.divider-demo__matrix {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-12);
}

.divider-demo__sample {
  min-block-size: var(--space-64);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  background: var(--color-bg-surface);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.divider-demo__sample--vertical {
  align-items: stretch;
}

.divider-demo__sample--vertical .vis-divider {
  align-self: center;
}

.dropdown-demo {
  inline-size: 100%;
  max-inline-size: 880px;
}

.dropdown-demo__showcase {
  min-block-size: 360px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-56);
}

.dropdown-demo__items {
  inline-size: 256px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding-block: var(--space-8);
  background: var(--color-bg-surface);
  box-shadow:
    0 0 3px 0 var(--color-effect-shadow-grey),
    0 8px 20px -1px var(--color-effect-shadow-grey);
}

.date-picker-demo__panel-row {
  column-gap: 88px;
  align-items: flex-start;
  min-block-size: 452px;
}

.accordion-demo {
  align-items: start;
}

.accordion-demo :deep(.vis-accordion) {
  max-inline-size: 100%;
}

.alert-demo {
  inline-size: 100%;
  max-inline-size: 690px;
}

.avatar-demo {
  inline-size: 100%;
  max-inline-size: 760px;
  gap: var(--space-24);
}

.avatar-demo__preview {
  min-block-size: 112px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-24);
}

.avatar-demo__controls {
  display: grid;
  gap: var(--space-8);
}

.avatar-demo__control-row {
  gap: var(--space-8);
}

.avatar-demo__control-row button {
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12);
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  font: inherit;
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  cursor: pointer;
}

.avatar-demo__control-row button:hover,
.avatar-demo__control-row button.active {
  border-color: var(--color-border-brand);
  color: var(--color-text-brand-primary);
  background: var(--color-bg-secondary);
}

.avatar-demo__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.avatar-demo__matrix {
  display: grid;
  gap: var(--space-16);
}

.avatar-demo__row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-16);
}

.avatar-demo__label,
.avatar-demo__badge-item > span {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
}

.avatar-demo__items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-24);
}

.avatar-demo__badge-grid,
.avatar-demo__composition {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-16);
}

.avatar-demo__badge-item,
.avatar-demo__composition-panel {
  min-inline-size: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.avatar-demo__badge-item {
  min-block-size: var(--space-64);
}

.avatar-demo__composition-panel:last-child {
  display: grid;
  justify-items: start;
  gap: var(--space-12);
}

.alert-demo__controls,
.alert-demo__toggles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.alert-demo__controls button {
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12);
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  font: inherit;
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  cursor: pointer;
}

.alert-demo__controls button:hover,
.alert-demo__controls button.active {
  border-color: var(--color-border-brand);
  color: var(--color-text-brand-primary);
  background: var(--color-bg-secondary);
}

.alert-demo__toggles label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.alert-demo__grid {
  display: grid;
  gap: var(--space-12);
}

.input-demo {
  align-items: flex-start;
  flex-direction: column;
}

.loading-demo__row {
  align-items: flex-end;
}

.loading-demo__inverse {
  min-inline-size: 96px;
  min-block-size: 96px;
  border-radius: var(--radius-lg);
  padding: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primitive-grey-950);
}

.modal-demo {
  display: grid;
  gap: var(--space-20);
  justify-items: start;
}

.modal-content {
  padding: 0 var(--space-20) var(--space-20);
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.scroll-demo {
  inline-size: 420px;
  block-size: 320px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
}

.scroll-demo__content {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-16);
}

.scroll-demo__content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}
</style>
