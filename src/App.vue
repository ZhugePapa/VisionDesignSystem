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
import { VisDescription, VisDescriptionItem } from './components/description'
import VisDivider from './components/divider/VisDivider.vue'
import VisDrawer from './components/drawer/VisDrawer.vue'
import { VisDropdown, VisDropdownItem } from './components/dropdown'
import { VisFeaturedIcon } from './components/featured-icon'
import { VisForm, VisFormItem } from './components/form'
import Icon from './components/icons/Icon.vue'
import VisInput from './components/input/VisInput.vue'
import VisInputNumber from './components/input-number/VisInputNumber.vue'
import VisInputSearchBox from './components/input-search-box/VisInputSearchBox.vue'
import VisInputTextarea from './components/input-textarea/VisInputTextarea.vue'
import VisLoading from './components/loading/VisLoading.vue'
import { VisMarkdown } from './components/markdown'
import VisMessage from './components/message/VisMessage.vue'
import VisModal from './components/modal/VisModal.vue'
import VisNotification from './components/notification/VisNotification.vue'
import VisPagination from './components/pagination/VisPagination.vue'
import VisPopover from './components/popover/VisPopover.vue'
import { VisProgressBar, VisProgressBarMultiple } from './components/progress-bar'
import { VisProgressCircle } from './components/progress-circle'
import VisRadio from './components/radio/VisRadio.vue'
import VisRadioGroup from './components/radio/VisRadioGroup.vue'
import VisRate from './components/rate/VisRate.vue'
import VisScrollShadow from './components/scroll-shadow/VisScrollShadow.vue'
import VisSegmented from './components/segmented/VisSegmented.vue'
import VisSelect from './components/select/VisSelect.vue'
import { VisSlider } from './components/slider'
import { VisTable, VisTableHeader, VisTableItem } from './components/table'
import VisTabs from './components/tabs/VisTabs.vue'
import VisTag from './components/tag/VisTag.vue'
import VisTimePicker from './components/time-picker/VisTimePicker.vue'
import VisToggle from './components/toggle/VisToggle.vue'
import VisToggleButton from './components/toggle-button/VisToggleButton.vue'
import VisTooltip from './components/tooltip/VisTooltip.vue'
import VisTreeView from './components/tree-view/VisTreeView.vue'
import VisUpload from './components/upload/VisUpload.vue'
import type { VisAccordionItemData, VisAccordionItemKey } from './components/accordion/accordion.types'
import type { VisAlertType } from './components/alert/alert.types'
import type { VisTheme } from './components/config-provider/config-provider.types'
import type { VisDescriptionDirection, VisDescriptionTag } from './components/description/description.types'
import type { VisDividerType } from './components/divider/divider.types'
import type { VisDropdownEntry } from './components/dropdown/dropdown.types'
import type { VisFormRules } from './components/form/form.types'
import type { VisInputNumberPosition, VisInputNumberState } from './components/input-number/input-number.types'
import type { VisInputSearchBoxState } from './components/input-search-box/input-search-box.types'
import type { VisInputTextareaState } from './components/input-textarea/input-textarea.types'
import type { VisMessageType } from './components/message/message.types'
import type { VisNotificationType } from './components/notification/notification.types'
import type { VisPaginationSize } from './components/pagination/pagination.types'
import type { VisPopoverPosition } from './components/popover/popover.types'
import type {
  VisProgressBarLabel,
  VisProgressBarSegment,
} from './components/progress-bar/progress-bar.types'
import type { VisProgressCircleSize } from './components/progress-circle/progress-circle.types'
import type { VisSegmentedOption, VisSegmentedSize } from './components/segmented/segmented.types'
import type { VisSelectOption, VisSelectValue } from './components/select/select.types'
import type { VisSliderType, VisSliderValue } from './components/slider/slider.types'
import type {
  VisTableAppearance,
  VisTableColumn,
  VisTableHeaderType,
  VisTableItemProps,
  VisTableItemType,
  VisTableRowData,
  VisTableRowKey,
} from './components/table/table.types'
import type { VisTabsAlign, VisTabsItem } from './components/tabs/tabs.types'
import type { VisTimePickerRangeValue } from './components/time-picker/time-picker.types'
import type { VisToggleButtonSize, VisToggleButtonState } from './components/toggle-button/toggle-button.types'
import type { VisToggleState } from './components/toggle/toggle.types'
import type { VisTooltipPosition, VisTooltipTrigger } from './components/tooltip/tooltip.types'
import type { VisTreeViewFolderType, VisTreeViewItem, VisTreeViewKey } from './components/tree-view/tree-view.types'
import type { VisUploadFileItem, VisUploadType } from './components/upload/upload.types'

type DemoPageId =
  | 'accordion'
  | 'alert'
  | 'avatar'
  | 'button'
  | 'input'
  | 'input-number'
  | 'input-search-box'
  | 'input-textarea'
  | 'markdown'
  | 'message'
  | 'modal'
  | 'notification'
  | 'pagination'
  | 'popover'
  | 'progress-bar'
  | 'progress-circle'
  | 'badge'
  | 'loading'
  | 'tag'
  | 'breadcrumb'
  | 'radio'
  | 'rate'
  | 'checkbox'
  | 'date-picker'
  | 'description'
  | 'divider'
  | 'drawer'
  | 'dropdown'
  | 'featured-icon'
  | 'form'
  | 'code-block'
  | 'scroll-shadow'
  | 'segmented'
  | 'select'
  | 'slider'
  | 'table'
  | 'tabs'
  | 'time-picker'
  | 'toggle'
  | 'toggle-button'
  | 'tooltip'
  | 'tree-view'
  | 'upload'

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
  component?: string
  visionApi: string
  elementApi: string
  description: string
  type: string
  defaultValue: string
}

interface ElementApiRow {
  component?: string
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
const inputNumberValue = ref(0)
const inputNumberPosition = ref<VisInputNumberPosition>('default')
const inputNumberState = ref<VisInputNumberState>('default')
const inputNumberDisabled = ref(false)
const inputNumberPrefix = ref(false)
const inputNumberSuffix = ref(false)
const inputSearchValue = ref('')
const inputSearchState = ref<VisInputSearchBoxState>('default')
const inputSearchSimple = ref(false)
const inputSearchFilter = ref(false)
const inputSearchDisabled = ref(false)
const inputTextareaValue = ref<string | undefined>(undefined)
const inputTextareaState = ref<VisInputTextareaState>('default')
const inputTextareaDisabled = ref(false)
const inputTextareaFilled = ref(false)
const messageVisible = ref(true)
const messageType = ref<VisMessageType>('info')
const messageAutoClose = ref(false)
const notificationVisible = ref(true)
const notificationType = ref<VisNotificationType>('info')
const notificationActions = ref(true)
const notificationCloseable = ref(true)
const notificationAutoClose = ref(false)
const paginationPage = ref(1)
const paginationSmallPage = ref(1)
const paginationSimplePage = ref(1)
const paginationPageSize = ref(20)
const paginationSize = ref<VisPaginationSize>('md')
const paginationSimple = ref(false)
const popoverPosition = ref<VisPopoverPosition>('top')
const popoverIcon = ref(false)
const popoverActions = ref(false)
const popoverCloseButton = ref(true)
const progressBarValue = ref(75)
const progressBarLabel = ref<VisProgressBarLabel>('right')
const progressBarLoading = ref(true)
const progressCircleSize = ref<VisProgressCircleSize>('md')
const progressCircleValue = ref(75)
const progressCircleLabel = ref(true)
const segmentedValue = ref<string | number>('option-1')
const segmentedSize = ref<VisSegmentedSize>('md')
const segmentedIcon = ref(true)
const segmentedText = ref(true)
const segmentedDisabled = ref(false)
const tabsValue = ref<string | number>('tab-1')
const tabsAlign = ref<VisTabsAlign>('horizontal')
const tabsIcon = ref(false)
const tabsCount = ref(false)
const tabsActions = ref(false)
const tabsNumber = ref(4)
const toggleChecked = ref(true)
const toggleIcon = ref(false)
const toggleText = ref(false)
const toggleDisabled = ref(false)
const toggleState = ref<VisToggleState>('default')
const toggleButtonPressed = ref(true)
const toggleButtonIconPressed = ref(false)
const toggleButtonSize = ref<VisToggleButtonSize>('md')
const toggleButtonState = ref<VisToggleButtonState>('default')
const toggleButtonIconOnly = ref(false)
const tooltipPosition = ref<VisTooltipPosition>('top')
const tooltipTrigger = ref<VisTooltipTrigger>('manual')
const tooltipOpen = ref(true)
const treeExpandedKeys = ref<VisTreeViewKey[]>(['docs', 'guides', 'assets'])
const treeSelectedKey = ref<VisTreeViewKey | null>('tokens')
const treeCheckedKeys = ref<VisTreeViewKey[]>(['tokens'])
const treeFolderType = ref<VisTreeViewFolderType>('default')
const treeCheckable = ref(true)
const treeDraggable = ref(false)
const treeIcon = ref(true)
const treeActions = ref(true)
const uploadType = ref<VisUploadType>('drag')
const uploadFiles = ref<VisUploadFileItem[]>([
  { id: 'file-default', name: 'filename.doc' },
  { id: 'file-loading', name: 'filename.doc', status: 'loading' },
  { id: 'file-danger', name: 'filename.doc', status: 'danger' },
])
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
const rateValue = ref(4)
const rateHalfValue = ref(3.5)
const rateEmptyValue = ref(0)
const checkboxValue = ref<(string | number)[]>(['option-1', 'option-3'])
const datePickerValue = ref<string | null>('2026/07/02')
const datePickerRangeValue = ref<[string, string] | null>(['2026/07/01', '2026/07/07'])
const timePickerValue = ref<string | null>('15:46:32')
const timePickerMinuteValue = ref<string | null>('09:30')
const timePickerRangeValue = ref<VisTimePickerRangeValue>(['08:30:00', '18:00:00'])
const timePickerMinuteRangeValue = ref<VisTimePickerRangeValue>(['09:00', '17:30'])
const formDemoRef = ref<InstanceType<typeof VisForm> | null>(null)
const formDemoStatus = ref('')
const formDemoModel = ref({
  name: '',
  password: '',
  region: '',
  categories: ['online'] as Array<string | number>,
  channel: 'online' as string | number | boolean,
  enabled: true,
  quantity: 0,
  date: null as string | null,
  time: null as string | null,
  description: '',
  score: 0,
  files: [] as VisUploadFileItem[],
})
const formDemoRules: VisFormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度应为 2 到 20 个字符', trigger: 'blur' },
  ],
  region: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
}
const formRegionOptions: VisSelectOption[] = [
  { label: '华东区域', value: 'east' },
  { label: '华南区域', value: 'south' },
  { label: '华北区域', value: 'north' },
]
const formCategoryOptions = [
  { label: '线上', value: 'online' },
  { label: '线下', value: 'offline' },
  { label: '品牌', value: 'brand' },
]
const formChannelOptions = [
  { label: '线上', value: 'online' },
  { label: '线下', value: 'offline' },
  { label: '混合', value: 'hybrid' },
]
const timePickerQuickValue = ref<string | null>('06:00:00')
const dividerType = ref<VisDividerType>('horizontal')
const dividerDashed = ref(false)
const descriptionDirection = ref<VisDescriptionDirection>('horizontal')
const descriptionBorder = ref(false)
const descriptionAlert = ref(false)
const descriptionFoldable = ref(false)
const descriptionCollapsed = ref(false)
const dropdownOpen = ref(true)
const dropdownSearchValue = ref('')
const selectValue = ref<VisSelectValue>('option-1')
const selectMultiValue = ref<VisSelectValue[]>(['option-1', 'option-2'])
const selectAvatarValue = ref<VisSelectValue>('zhangdashan')
const selectOpen = ref(true)
const selectSearchValue = ref('')
const sliderValue = ref<VisSliderValue>(50)
const sliderType = ref<VisSliderType>('single')
const sliderDisabled = ref(false)
const sliderLabel = ref(false)
const tableAppearance = ref<VisTableAppearance>('horizontal')
const tableActiveRowKey = ref<VisTableRowKey | null>(null)
const tableHighlightActiveRow = ref(false)

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
const inputNumberPositions: VisInputNumberPosition[] = ['default', 'right']
const inputNumberStates: VisInputNumberState[] = ['default', 'hover', 'focus', 'danger']
const inputSearchStates: VisInputSearchBoxState[] = ['default', 'hover', 'focus']
const inputTextareaStates: VisInputTextareaState[] = ['default', 'hover', 'focus', 'danger']
const messageTypes: VisMessageType[] = ['info', 'success', 'warning', 'danger', 'loading']
const notificationTypes: VisNotificationType[] = ['info', 'success', 'warning', 'danger', 'avatar', 'icon', 'no_icon']
const paginationSizes: VisPaginationSize[] = ['md', 'sm']
const popoverPositions: VisPopoverPosition[] = ['top', 'tl', 'tr', 'bottom', 'left', 'right']
const progressBarLabels: VisProgressBarLabel[] = ['none', 'right', 'bottom']
const progressCircleSizes: VisProgressCircleSize[] = ['xs', 'sm', 'md', 'lg']
const progressValues = [25, 50, 75, 100]
const segmentedSizes: VisSegmentedSize[] = ['md', 'lg']
const sliderTypes: VisSliderType[] = ['single', 'range']
const dividerTypes: VisDividerType[] = ['horizontal', 'vertical', 'content']
const descriptionDirections: VisDescriptionDirection[] = ['horizontal', 'vertical']
const descriptionTags: VisDescriptionTag[] = [
  { label: '已启用', iconName: 'check-circle' },
]
const tableAppearances: VisTableAppearance[] = ['horizontal', 'grid']
const tableHeaderPreviewTypes: VisTableHeaderType[] = ['default', 'checkbox', 'radio', 'shortcuts', 'empty']
const tableItemPreviews: Array<{
  type: VisTableItemType
  value?: unknown
  props?: Omit<VisTableItemProps, 'appearance' | 'type' | 'value'>
}> = [
  { type: 'tree', value: '树形标题', props: { treeLevel: 2, treeWithFolder: true, prefix: true } },
  { type: 'heading', value: '标题文本', props: { prefix: true, suffix: true } },
  { type: 'text', value: '正文文本' },
  { type: 'checkbox', props: { checked: true } },
  { type: 'radio', props: { radioChecked: true } },
  { type: 'drag' },
  { type: 'shortcuts' },
  { type: 'rate', props: { rateValue: 3.5 } },
  { type: 'actions' },
  { type: 'number', props: { numberValue: 32, trend: 'up' } },
  { type: 'badge', value: '进行中', props: { badgeType: 'status', badgeColorType: 'brand' } },
  { type: 'tag', value: '标签' },
  { type: 'avatar', props: { avatarTitle: '张大山', avatarAddition: false } },
]
const tabsAligns: VisTabsAlign[] = ['horizontal', 'right']
const toggleStates: VisToggleState[] = ['default', 'hover', 'focus', 'loading']
const toggleButtonSizes: VisToggleButtonSize[] = ['sm', 'md', 'lg']
const toggleButtonStates: VisToggleButtonState[] = ['default', 'hover', 'focus', 'active', 'disabled']
const tooltipPositions: VisTooltipPosition[] = ['top', 'tl', 'tr', 'bottom', 'left', 'right']
const tooltipTriggers: VisTooltipTrigger[] = ['hover', 'focus', 'click', 'manual']
const treeFolderTypes: VisTreeViewFolderType[] = ['default', '+/-']
const uploadTypes: VisUploadType[] = ['button', 'trigger', 'drag']

function popoverPositionLabel(position: VisPopoverPosition): string {
  const labels: Record<VisPopoverPosition, string> = {
    top: 'Top',
    tl: 'TL',
    tr: 'TR',
    bottom: 'Bottom',
    left: 'Left',
    right: 'Right',
  }

  return labels[position]
}

function tooltipPositionLabel(position: VisTooltipPosition): string {
  const labels: Record<VisTooltipPosition, string> = {
    top: 'Top',
    tl: 'TL',
    tr: 'TR',
    bottom: 'Bottom',
    left: 'Left',
    right: 'Right',
  }

  return labels[position]
}

function selectSliderType(type: VisSliderType): void {
  sliderType.value = type
  sliderValue.value = type === 'range' ? [25, 75] : 50
}

const tableColumns: VisTableColumn[] = [
  {
    key: 'title',
    label: '标题',
    minWidth: 272,
    cellType: 'heading',
    itemProps: { prefix: true, prefixIcon: 'zap' },
  },
  { key: 'code', label: '编号', width: 160, cellType: 'text' },
  {
    key: 'priority',
    label: '优先级',
    width: 160,
    cellType: 'badge',
    itemProps: { badgeType: 'text', badgeColorType: 'danger', badgeSolid: true },
  },
  {
    key: 'status',
    label: '状态',
    width: 160,
    cellType: 'badge',
    itemProps: { badgeType: 'status', badgeColorType: 'brand' },
  },
  {
    key: 'owner',
    label: '负责人',
    width: 160,
    cellType: 'avatar',
    itemProps: (row) => ({
      avatarTitle: String(row.owner),
      avatarAddition: false,
      avatarImageVariant: row.avatar === '05' ? '05' : '09',
    }),
  },
  { key: 'remaining', label: '剩余工时', width: 160, cellType: 'text' },
  { key: 'createdAt', label: '创建时间', width: 160, cellType: 'text' },
  { key: 'actions', label: '操作', width: 160, cellType: 'actions' },
]

const tableData: VisTableRowData[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: ['支持商家查看已发放优惠券', '优化退款审核工作流', '补充会员等级配置能力'][index % 3],
  code: `FJXH-${18 + index}`,
  priority: index % 3 === 0 ? '最高' : index % 3 === 1 ? '高' : '普通',
  status: index % 2 === 0 ? '进行中' : '待处理',
  owner: index % 2 === 0 ? '张大山' : '李小明',
  avatar: index % 2 === 0 ? '09' : '05',
  remaining: `${index * 2} 小时`,
  createdAt: `2026/07/${String(index + 1).padStart(2, '0')}`,
}))

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

const progressBarSegments: VisProgressBarSegment[] = [
  { label: 'Typescript', value: 30, color: 'blue' },
  { label: 'Java', value: 20, color: 'aqua' },
  { label: 'Python', value: 15, color: 'purple' },
]

const progressBarFullSegments: VisProgressBarSegment[] = [
  { label: 'Typescript', value: 30, color: 'blue' },
  { label: 'Java', value: 20, color: 'aqua' },
  { label: 'Python', value: 15, color: 'purple' },
  { label: 'Vue', value: 10, color: 'yellow' },
  { label: 'CSS', value: 8, color: 'orange' },
  { label: 'Design', value: 5, color: 'green' },
  { label: 'Other', value: 2, color: 'grey' },
]

const segmentedOptions: VisSegmentedOption[] = Array.from({ length: 5 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: '选项',
  iconName: 'settings-01',
}))

const segmentedDisabledOptions: VisSegmentedOption[] = segmentedOptions.map((option, index) => ({
  ...option,
  disabled: index === 2,
}))

const tabsBaseItems: VisTabsItem[] = Array.from({ length: 9 }, (_, index) => ({
  value: `tab-${index + 1}`,
  label: '标签',
  iconName: 'settings-01',
  count: index + 1,
}))

const treeViewItems: VisTreeViewItem[] = [
  {
    key: 'docs',
    label: '文档中心',
    icon: 'folder',
    suffix: 'Tag',
    children: [
      {
        key: 'guides',
        label: '使用指南',
        icon: 'folder',
        children: [
          { key: 'intro', label: '快速开始', icon: 'file-04' },
          { key: 'tokens', label: '设计变量', icon: 'file-04', suffix: 'Tag' },
        ],
      },
      {
        key: 'components',
        label: '组件规范',
        icon: 'folder',
        children: [{ key: 'button-doc', label: 'Button', icon: 'file-04' }],
      },
    ],
  },
  {
    key: 'assets',
    label: '资源文件',
    icon: 'folder',
    children: [
      { key: 'icons-pack', label: '图标资源', icon: 'file-04' },
      { key: 'disabled-file', label: '已归档文件', icon: 'file-04', disabled: true },
    ],
  },
]

const selectedTabsItems = computed(() =>
  tabsBaseItems.slice(0, tabsNumber.value).map((item) => ({
    value: item.value,
    label: item.label,
    iconName: tabsIcon.value ? item.iconName : undefined,
    count: tabsCount.value ? item.count : undefined,
  })),
)

function createTabsItems(count: number, options: { icon?: boolean; count?: boolean } = {}): VisTabsItem[] {
  return tabsBaseItems.slice(0, count).map((item) => ({
    value: item.value,
    label: item.label,
    iconName: options.icon ? item.iconName : undefined,
    count: options.count ? item.count : undefined,
  }))
}

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

const selectOptions: VisSelectOption[] = [
  { label: '选项一', value: 'option-1', iconName: 'user-01' },
  { label: '选项二', value: 'option-2', iconName: 'settings-01' },
  { label: '选项三', value: 'option-3', iconName: 'mail-01' },
  { label: '选项四', value: 'option-4', iconName: 'calendar' },
]

const avatarSelectOptions: VisSelectOption[] = [
  { label: '张大山', value: 'zhangdashan', title: '张大山', subtitle: 'zhangdashan', avatarImageVariant: '09' },
  { label: '李小川', value: 'lixiaochuan', title: '李小川', subtitle: 'lixiaochuan', avatarImageVariant: '01' },
  { label: '王北辰', value: 'wangbeichen', title: '王北辰', subtitle: 'wangbeichen', avatarImageVariant: '04' },
]

const sampleCode = `import { VisButton } from 'vision-design-system'

export default {
  setup() {
    return () => <VisButton>提交</VisButton>
  },
}`

const markdownContent = `# Markdown 标题

这是一段 **强调文本**，包含 [外部链接](https://example.com)、\`inline code\` 和普通段落。

> 这里是引用内容，用于检查边框、背景和文字 token。

- 列表项一
- 列表项二
- 列表项三

| 属性 | 说明 |
| --- | --- |
| content | Markdown 字符串 |
| streaming | 流式输出占位配置 |

~~~ts
import { VisMarkdown } from 'vision-design-system'

const content = '# Vision Markdown'
~~~
`

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
  { id: 'description', title: 'Description', subtitle: '描述列表' },
  { id: 'divider', title: 'Divider', subtitle: '分割线' },
  { id: 'drawer', title: 'Drawer', subtitle: '抽屉' },
  { id: 'dropdown', title: 'Dropdown', subtitle: '下拉菜单' },
  { id: 'featured-icon', title: 'Featured Icon', subtitle: '特征图标' },
  { id: 'form', title: 'Form', subtitle: '表单' },
  { id: 'input', title: 'Input', subtitle: '输入框' },
  { id: 'input-number', title: 'InputNumber', subtitle: '数字输入框' },
  { id: 'input-search-box', title: 'InputSearchBox', subtitle: '搜索输入框' },
  { id: 'input-textarea', title: 'InputTextarea', subtitle: '文本域' },
  { id: 'loading', title: 'Loading', subtitle: '加载' },
  { id: 'markdown', title: 'Markdown', subtitle: '格式渲染' },
  { id: 'message', title: 'Message', subtitle: '全局提示' },
  { id: 'modal', title: 'Modal', subtitle: '弹窗' },
  { id: 'notification', title: 'Notification', subtitle: '通知提醒' },
  { id: 'pagination', title: 'Pagination', subtitle: '分页器' },
  { id: 'popover', title: 'Popover', subtitle: '气泡框' },
  { id: 'progress-bar', title: 'ProgressBar', subtitle: '进度条' },
  { id: 'progress-circle', title: 'ProgressCircle', subtitle: '环形进度条' },
  { id: 'radio', title: 'Radio', subtitle: '单选框' },
  { id: 'rate', title: 'Rate', subtitle: '评分' },
  { id: 'scroll-shadow', title: 'Scroll Shadow', subtitle: '滚动阴影' },
  { id: 'segmented', title: 'Segmented', subtitle: '分段控制器' },
  { id: 'select', title: 'Select', subtitle: '选择器' },
  { id: 'slider', title: 'Slider', subtitle: '滑动输入' },
  { id: 'table', title: 'Table', subtitle: '表格' },
  { id: 'tabs', title: 'Tabs', subtitle: '标签页' },
  { id: 'tag', title: 'Tag', subtitle: '标签' },
  { id: 'time-picker', title: 'Time Picker', subtitle: '时间选择器' },
  { id: 'toggle', title: 'Toggle', subtitle: '开关' },
  { id: 'toggle-button', title: 'ToggleButton', subtitle: '切换按钮' },
  { id: 'tooltip', title: 'Tooltip', subtitle: '文字提示' },
  { id: 'tree-view', title: 'TreeView', subtitle: '树视图' },
  { id: 'upload', title: 'Upload', subtitle: '上传' },
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
      { title: 'Description', subtitle: '描述列表', page: 'description' },
      { title: 'Divider', subtitle: '分割线', page: 'divider' },
      { title: 'Drawer', subtitle: '抽屉', page: 'drawer' },
      { title: 'Dropdown', subtitle: '下拉菜单', page: 'dropdown' },
      { title: 'FeaturedIcon', subtitle: '特征图标', page: 'featured-icon' },
      { title: 'Form', subtitle: '表单', page: 'form' },
      { title: 'Input', subtitle: '输入框', page: 'input' },
      { title: 'InputNumber', subtitle: '数字输入框', page: 'input-number' },
      { title: 'InputSearchBox', subtitle: '搜索输入框', page: 'input-search-box' },
      { title: 'InputTextarea', subtitle: '文本域', page: 'input-textarea' },
      { title: 'Loading', subtitle: '加载', page: 'loading' },
      { title: 'Markdown', subtitle: '格式渲染', page: 'markdown' },
      { title: 'Message', subtitle: '全局提示', page: 'message' },
      { title: 'Modal', subtitle: '对话框', page: 'modal' },
      { title: 'Notification', subtitle: '通知提醒', page: 'notification' },
      { title: 'Pagination', subtitle: '分页器', page: 'pagination' },
      { title: 'Popover', subtitle: '气泡框', page: 'popover' },
      { title: 'ProgressBar', subtitle: '进度条', page: 'progress-bar' },
      { title: 'ProgressCircle', subtitle: '环形进度条', page: 'progress-circle' },
      { title: 'Radio', subtitle: '单选框', page: 'radio' },
      { title: 'Rate', subtitle: '评分', page: 'rate' },
      { title: 'RichTextEditor', subtitle: '富文本编辑器' },
      { title: 'ScrollShadow', subtitle: '滚动阴影', page: 'scroll-shadow' },
      { title: 'Segmented', subtitle: '分段控制器', page: 'segmented' },
      { title: 'Select', subtitle: '选择器', page: 'select' },
      { title: 'Slider', subtitle: '滑动输入', page: 'slider' },
      { title: 'Table', subtitle: '表格', page: 'table' },
      { title: 'Tabs', subtitle: '标签页', page: 'tabs' },
      { title: 'Tag', subtitle: '标签', page: 'tag' },
      { title: 'TimePicker', subtitle: '时间选择器', page: 'time-picker' },
      { title: 'Toggle', subtitle: '开关', page: 'toggle' },
      { title: 'ToggleButton', subtitle: '切换按钮', page: 'toggle-button' },
      { title: 'Tooltip', subtitle: '文字提示', page: 'tooltip' },
      { title: 'TreeView', subtitle: '树视图', page: 'tree-view' },
      { title: 'Upload', subtitle: '上传', page: 'upload' },
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
  'input-search-box': [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '搜索输入框受控值。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '搜索框为空时显示的占位文本。',
      type: 'string',
      defaultValue: "'请输入关键字'",
    },
    {
      visionApi: 'valueText / filled',
      elementApi: 'model-value',
      description: '非受控演示态的默认填充值，兼容旧项目和 Figma filled 变体。',
      type: 'string / boolean',
      defaultValue: "'关键字' / false",
    },
    {
      visionApi: 'state',
      elementApi: 'class / focus',
      description: '用于演示或锁定 default、hover、focus 视觉状态。',
      type: "'default' | 'hover' | 'focus'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'simple',
      elementApi: '无直接对应',
      description: '启用无边框透明背景形态。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'filter',
      elementApi: 'suffix slot',
      description: '显示右侧筛选图标按钮，点击触发 filter 事件。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用输入、清除和筛选交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '覆盖原生搜索输入框可访问标签。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'searchIconName / filterIconName',
      elementApi: 'prefix / suffix slot',
      description: '覆盖默认搜索或筛选图标名称。',
      type: 'IconName',
      defaultValue: "'search-lg' / 'filter-funnel-01'",
    },
  ],
  'input-number': [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '数字输入框受控值。',
      type: 'number',
      defaultValue: '0',
    },
    {
      visionApi: 'position',
      elementApi: 'controls-position',
      description: '控制步进按钮位置；default 为左右按钮，right 为右侧上下按钮结构。',
      type: "'default' | 'right'",
      defaultValue: "'default'",
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
      description: '禁用输入与步进按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'prefixIcon',
      elementApi: 'prefix slot',
      description: '是否显示默认前缀图标，开启后组件默认宽度增加 40px。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'suffixIcon',
      elementApi: 'suffix slot',
      description: '是否显示默认后缀图标，开启后组件默认宽度增加 40px。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'rightControls',
      elementApi: 'controls',
      description: 'position=right 时是否允许显示右侧上下步进器。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'prefixIconName / suffixIconName',
      elementApi: 'prefix-icon / suffix-icon 语义参考',
      description: '指定前缀或后缀图标名称。',
      type: 'IconName',
      defaultValue: "'currency-yen' / 'percent-02'",
    },
    {
      visionApi: 'min / max / step',
      elementApi: 'min / max / step',
      description: '控制最小值、最大值和每次步进增量。',
      type: 'number',
      defaultValue: 'undefined / undefined / 1',
    },
    {
      visionApi: 'width',
      elementApi: 'style',
      description: '覆盖组件宽度；未传时按 Figma 变体自动计算。',
      type: 'number | string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'name / ariaLabel',
      elementApi: 'name / aria-label',
      description: '透传原生 input 名称和可访问标签。',
      type: 'string',
      defaultValue: 'undefined',
    },
  ],
  'input-textarea': [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '文本域受控值。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '文本域为空时显示的占位文本。',
      type: 'string',
      defaultValue: "'请输入文字'",
    },
    {
      visionApi: 'valueText / filled',
      elementApi: 'model-value',
      description: '非受控演示态的默认填充值，兼容旧项目展示逻辑。',
      type: 'string / boolean',
      defaultValue: '内置示例文案 / false',
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
      description: '禁用文本输入和拖拽缩放手柄。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'maxLength',
      elementApi: 'maxlength / show-word-limit',
      description: '限制最大输入长度；boolean true 默认 200，false 时关闭长度限制和计数。',
      type: 'number | boolean',
      defaultValue: '200',
    },
    {
      visionApi: 'textCount',
      elementApi: 'show-word-limit',
      description: '是否显示右下角字数统计。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'name / ariaLabel',
      elementApi: 'name / aria-label',
      description: '透传原生 textarea 名称和可访问标签。',
      type: 'string',
      defaultValue: 'undefined',
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
  notification: [
    {
      visionApi: 'type',
      elementApi: 'type',
      description: '控制通知形态；除 info/success/warning/danger 外，avatar、icon、no_icon 为旧项目和 Figma 扩展形态。',
      type: "'info' | 'success' | 'warning' | 'danger' | 'avatar' | 'icon' | 'no_icon'",
      defaultValue: "'info'",
    },
    {
      visionApi: 'title',
      elementApi: 'title',
      description: '通知标题；不传时按 type 使用旧项目默认中文标题。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'description',
      elementApi: 'message',
      description: '通知正文；不传时按 type 使用旧项目默认中文内容。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'actions',
      elementApi: '无直接对应',
      description: '是否显示默认“查看 / 忽略”操作区，也可通过 actions slot 覆盖。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'closeable',
      elementApi: 'show-close',
      description: '是否显示右上角关闭按钮。旧项目 API 使用 closeable。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'modelValue',
      elementApi: '无直接对应',
      description: '控制自绘 Notification 是否显示，支持 v-model。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'width',
      elementApi: 'custom-class / style',
      description: '通知卡片宽度；数字会转换为 px。',
      type: 'number | string',
      defaultValue: '384',
    },
    {
      visionApi: 'iconName',
      elementApi: 'icon',
      description: 'type=icon 时的特征图标名称。',
      type: 'IconName',
      defaultValue: "'download-cloud-01'",
    },
    {
      visionApi: 'avatarImageVariant',
      elementApi: '无直接对应',
      description: 'type=avatar 时使用的内置头像资源编号。',
      type: 'VisAvatarImageVariant',
      defaultValue: "'09'",
    },
    {
      visionApi: 'avatarName',
      elementApi: 'title',
      description: 'type=avatar 时的头像通知标题。',
      type: 'string',
      defaultValue: "'张大山'",
    },
    {
      visionApi: 'avatarTime',
      elementApi: '无直接对应',
      description: 'type=avatar 时标题右侧时间文案。',
      type: 'string',
      defaultValue: "'2分钟前'",
    },
    {
      visionApi: 'actionPrimaryText',
      elementApi: '无直接对应',
      description: '默认主操作按钮文案。',
      type: 'string',
      defaultValue: "'查看'",
    },
    {
      visionApi: 'actionSecondaryText',
      elementApi: '无直接对应',
      description: '默认次操作按钮文案。',
      type: 'string',
      defaultValue: "'忽略'",
    },
    {
      visionApi: 'autoClose',
      elementApi: 'duration',
      description: '是否 10 秒后自动关闭，鼠标悬停会暂停倒计时。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'actions slot',
      elementApi: 'message / dangerouslyUseHTMLString',
      description: '自定义通知操作区内容。',
      type: 'slot',
      defaultValue: '-',
    },
  ],
  pagination: [
    {
      visionApi: 'modelValue',
      elementApi: 'current-page / v-model:current-page',
      description: '当前页码，支持 v-model。',
      type: 'number',
      defaultValue: '1',
    },
    {
      visionApi: 'total',
      elementApi: 'total',
      description: '数据总条数，用于计算页数和总计文案。',
      type: 'number',
      defaultValue: '196',
    },
    {
      visionApi: 'pageSize',
      elementApi: 'page-size / v-model:page-size',
      description: '每页条数，数量按钮点击时会在 pageSizeOptions 中循环切换。',
      type: 'number',
      defaultValue: '20',
    },
    {
      visionApi: 'pageSizeOptions',
      elementApi: 'page-sizes',
      description: '每页条数候选项。',
      type: 'number[]',
      defaultValue: '[10, 20, 50, 100]',
    },
    {
      visionApi: 'pageCount',
      elementApi: 'page-count',
      description: '直接指定总页数；优先级高于 total/pageSize 计算值。',
      type: 'number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'size',
      elementApi: 'small / size',
      description: '控制标准或小尺寸分页器。',
      type: "'md' | 'sm'",
      defaultValue: "'md'",
    },
    {
      visionApi: 'simple',
      elementApi: 'layout',
      description: '切换为简洁模式，只展示当前页输入、分隔符、总页数与前后翻页。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'count',
      elementApi: 'layout total',
      description: '是否展示左侧“总计 x 条”。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'quantity',
      elementApi: 'layout sizes',
      description: '是否展示每页条数按钮。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'goto',
      elementApi: 'layout jumper',
      description: '是否展示“前往 x 页”跳转入口；simple 模式下不展示外部 goto。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用分页器所有交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '分页器导航区域的可访问名称。',
      type: 'string',
      defaultValue: "'分页器'",
    },
  ],
  popover: [
    {
      visionApi: 'modelValue',
      elementApi: 'visible / virtual-triggering',
      description: '控制气泡框显示隐藏，支持 v-model；未传时组件内部自管理。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'position',
      elementApi: 'placement',
      description: '控制气泡框相对触发元素的位置，兼容 Figma 的 Top、TL、TR、Bottom、Left、Right。',
      type: "'top' | 'tl' | 'tr' | 'bottom' | 'left' | 'right'",
      defaultValue: "'top'",
    },
    {
      visionApi: 'trigger',
      elementApi: 'trigger',
      description: '控制打开方式；manual 模式完全由 modelValue 控制。',
      type: "'hover' | 'focus' | 'click' | 'manual'",
      defaultValue: "'click'",
    },
    {
      visionApi: 'title / content',
      elementApi: 'title / content',
      description: '默认标题和正文内容，也可通过 title、content slot 覆盖。',
      type: 'string / string',
      defaultValue: "'Header' / 'Popover content'",
    },
    {
      visionApi: 'showTitle',
      elementApi: 'title',
      description: '是否展示标题区域。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'icon / iconName',
      elementApi: '无直接对应',
      description: '是否展示左侧 FeaturedIcon 以及图标名称。',
      type: 'boolean / IconName',
      defaultValue: "false / 'info'",
    },
    {
      visionApi: 'actions',
      elementApi: 'default slot',
      description: '是否展示默认取消/确认按钮组，也可通过 actions slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'closeButton',
      elementApi: '无直接对应',
      description: '是否展示右上角关闭按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'arrow',
      elementApi: 'show-arrow',
      description: '是否展示指向触发元素的箭头。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'width',
      elementApi: 'width',
      description: '气泡框宽度，数字会转换为 px。',
      type: 'number | string',
      defaultValue: '256',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用触发交互并在打开时自动关闭。',
      type: 'boolean',
      defaultValue: 'false',
    },
  ],
  'progress-bar': [
    {
      visionApi: 'value',
      elementApi: 'percentage',
      description: '当前进度数值，范围会被限制在 0-100；success 状态固定展示 100。',
      type: 'number',
      defaultValue: "status 为 danger 时 75，否则 25",
    },
    {
      visionApi: 'status',
      elementApi: 'status',
      description: '进度语义状态，控制填充颜色和默认文案。',
      type: "'default' | 'success' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'label',
      elementApi: 'show-text / text-inside',
      description: '控制单段进度条文案不展示、右侧展示或底部展示。',
      type: "'none' | 'right' | 'bottom'",
      defaultValue: "'none'",
    },
    {
      visionApi: 'labelText',
      elementApi: 'format',
      description: '自定义单段进度条文案；不传时按状态或百分比生成。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'loading',
      elementApi: 'indeterminate',
      description: '在当前填充区域叠加加载扫光动画。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'segments',
      elementApi: '无直接对应',
      description: '多段进度条数据源，最多展示 7 段；每段支持 value、label、color。',
      type: 'VisProgressBarSegment[]',
      defaultValue: '内置 3 项示例',
    },
    {
      visionApi: 'width',
      elementApi: 'style',
      description: '进度条宽度，数字按 px 处理。',
      type: 'number | string',
      defaultValue: '400',
    },
    {
      visionApi: 'decorative',
      elementApi: '无直接对应',
      description: '装饰性进度条会移除 progressbar 语义并设置 aria-hidden。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '自定义 progressbar 的可访问名称。',
      type: 'string',
      defaultValue: "'进度条' / '多段进度条'",
    },
  ],
  'progress-circle': [
    {
      visionApi: 'size',
      elementApi: 'type / width / stroke-width',
      description: '环形进度尺寸，对齐 Figma 的 xs、sm、md、lg 四档。',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      defaultValue: "'xs'",
    },
    {
      visionApi: 'value',
      elementApi: 'percentage',
      description: '当前进度数值，范围会被限制在 0-100；success 状态固定展示 100。',
      type: 'number',
      defaultValue: "status 为 danger 时 75，否则 25",
    },
    {
      visionApi: 'status',
      elementApi: 'status',
      description: '环形进度语义状态，控制描边颜色和默认文案。',
      type: "'default' | 'success' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'label',
      elementApi: 'show-text',
      description: '是否显示进度文案；xs/sm 外置，md/lg 内置。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'labelText',
      elementApi: 'format',
      description: '自定义进度文案；不传时按状态或百分比生成。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'description',
      elementApi: '无直接对应',
      description: 'lg 尺寸内置文案下方的辅助描述。',
      type: 'string',
      defaultValue: "'当前进度'",
    },
    {
      visionApi: 'decorative',
      elementApi: '无直接对应',
      description: '装饰性环形进度会移除 progressbar 语义并设置 aria-hidden。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '自定义 progressbar 的可访问名称。',
      type: 'string',
      defaultValue: "'环形进度'",
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
  form: [
    {
      component: 'VisForm',
      visionApi: 'model',
      elementApi: 'model',
      description: '表单数据对象，作为字段校验、重置和取值的数据源。',
      type: 'Record<string, any>',
      defaultValue: '{}',
    },
    {
      component: 'VisForm',
      visionApi: 'rules',
      elementApi: 'rules',
      description: '基于 async-validator 的表单校验规则。',
      type: 'VisFormRules',
      defaultValue: 'undefined',
    },
    {
      component: 'VisForm',
      visionApi: 'alignLeft',
      elementApi: 'label-position="left"',
      description: '按 Figma API 控制标签左置；关闭时标签位于字段上方。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisForm',
      visionApi: 'column',
      elementApi: '无直接对应',
      description: '控制表单为一列或二列布局，对应 Figma Column 变体。',
      type: '1 | 2',
      defaultValue: '1',
    },
    {
      component: 'VisForm',
      visionApi: 'button',
      elementApi: 'default slot',
      description: '展示由 VisButton 构成的默认确认和取消操作组。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisForm',
      visionApi: 'width',
      elementApi: 'style',
      description: '覆盖表单宽度；默认一列 400px、二列 800px。',
      type: 'number | string',
      defaultValue: '按 column 推导',
    },
    {
      component: 'VisForm',
      visionApi: 'labelWidth',
      elementApi: 'label-width',
      description: '左侧标签布局的标签宽度，并向 VisFormItem 继承。',
      type: 'number | string',
      defaultValue: '84',
    },
    {
      component: 'VisForm',
      visionApi: 'submitText',
      elementApi: '无直接对应',
      description: '默认确认按钮文案。',
      type: 'string',
      defaultValue: "'确认'",
    },
    {
      component: 'VisForm',
      visionApi: 'cancelText',
      elementApi: '无直接对应',
      description: '默认取消按钮文案。',
      type: 'string',
      defaultValue: "'取消'",
    },
    {
      component: 'VisForm',
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '将禁用状态传递给 Element Plus 表单上下文。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisForm',
      visionApi: 'showMessage',
      elementApi: 'show-message',
      description: '是否显示 Vision 样式的校验错误信息。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      component: 'VisForm',
      visionApi: 'validateOnRuleChange',
      elementApi: 'validate-on-rule-change',
      description: '校验规则变化时是否立即触发验证。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      component: 'VisForm',
      visionApi: 'scrollToError',
      elementApi: 'scroll-to-error',
      description: '校验失败时是否滚动到首个错误表单项。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisForm',
      visionApi: 'scrollIntoViewOptions',
      elementApi: 'scroll-into-view-options',
      description: '滚动至错误字段时使用的 scrollIntoView 配置。',
      type: 'boolean | ScrollIntoViewOptions',
      defaultValue: 'true',
    },
    {
      component: 'VisFormItem',
      visionApi: 'prop',
      elementApi: 'prop',
      description: 'model 中对应字段的键名或路径。',
      type: 'string | string[]',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'label',
      elementApi: 'label',
      description: '表单项标签文本。',
      type: 'string',
      defaultValue: "'输入框'",
    },
    {
      component: 'VisFormItem',
      visionApi: 'type',
      elementApi: '无直接对应',
      description: '匹配 Figma FormItem 字段类型，并为引用的 Vision 组件应用准确尺寸。',
      type: 'VisFormItemType',
      defaultValue: "'input'",
    },
    {
      component: 'VisFormItem',
      visionApi: 'alignLeft',
      elementApi: 'label-position',
      description: '覆盖当前表单项的标签位置；未设置时继承 VisForm。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'labelWidth',
      elementApi: 'label-width',
      description: '覆盖当前表单项的左侧标签宽度。',
      type: 'number | string',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'span',
      elementApi: '无直接对应',
      description: '在二列表单中占据一列或两列。',
      type: '1 | 2',
      defaultValue: '1',
    },
    {
      component: 'VisFormItem',
      visionApi: 'required',
      elementApi: 'required',
      description: '标记必填并显示危险色星号；未设置时可从规则推导。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'optional',
      elementApi: 'label slot',
      description: '在标签后展示 Figma 定义的“(选填)”文本。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisFormItem',
      visionApi: 'tooltip',
      elementApi: 'label slot',
      description: '使用 VisTooltip 和 Vision help-circle 图标展示标签提示。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisFormItem',
      visionApi: 'tooltipText',
      elementApi: 'label slot',
      description: '标签提示浮层内容。',
      type: 'string',
      defaultValue: "'提示信息'",
    },
    {
      component: 'VisFormItem',
      visionApi: 'description',
      elementApi: '无直接对应',
      description: '字段下方的辅助说明；传 true 时使用 Figma 默认文案。',
      type: 'boolean | string',
      defaultValue: 'false',
    },
    {
      component: 'VisFormItem',
      visionApi: 'rules',
      elementApi: 'rules',
      description: '当前字段独立的校验规则。',
      type: 'VisFormItemRule | VisFormItemRule[]',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'error',
      elementApi: 'error',
      description: '直接设置错误信息并进入危险状态。',
      type: 'string',
      defaultValue: "''",
    },
    {
      component: 'VisFormItem',
      visionApi: 'showMessage',
      elementApi: 'show-message',
      description: '覆盖当前字段是否显示校验错误信息。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'validateStatus',
      elementApi: 'validate-status',
      description: '直接设置字段校验状态。',
      type: 'FormItemValidateState',
      defaultValue: 'undefined',
    },
    {
      component: 'VisFormItem',
      visionApi: 'for',
      elementApi: 'for',
      description: '将标签与指定原生控件 id 关联。',
      type: 'string',
      defaultValue: 'undefined',
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
  markdown: [
    {
      visionApi: 'content',
      elementApi: '无直接对应',
      description: 'Markdown 源文本；不传时读取默认 slot 的文本内容。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'components',
      elementApi: '无直接对应',
      description: '按 HTML tag 名称映射自定义 Vue 组件，并传入 streamStatus。',
      type: 'Record<string, Component | string>',
      defaultValue: '{}',
    },
    {
      visionApi: 'streaming',
      elementApi: '无直接对应',
      description: '流式输出配置，支持 hasNextChunk、enableAnimation、tail 和未完成 Markdown 占位映射。',
      type: 'VisMarkdownStreamingOption',
      defaultValue: '{}',
    },
    {
      visionApi: 'config',
      elementApi: '无直接对应',
      description: '传给 marked 的扩展配置。',
      type: 'MarkedExtension',
      defaultValue: '{ gfm: true }',
    },
    {
      visionApi: 'className',
      elementApi: '无直接对应',
      description: '追加到内容容器的 class。',
      type: 'string',
      defaultValue: "''",
    },
    {
      visionApi: 'rootClassName',
      elementApi: '无直接对应',
      description: '追加到根容器的 class。',
      type: 'string',
      defaultValue: "''",
    },
    {
      visionApi: 'theme',
      elementApi: '无直接对应',
      description: '主题标记，样式仍通过 Vision token 响应当前主题变量。',
      type: "'light' | 'dark'",
      defaultValue: "'light'",
    },
    {
      visionApi: 'openLinksInNewTab',
      elementApi: '无直接对应',
      description: '链接是否添加 target=_blank 与安全 rel。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'dompurifyConfig',
      elementApi: '无直接对应',
      description: '传给 DOMPurify 的净化配置，会和组件默认允许标签/属性合并。',
      type: 'DOMPurifyConfig',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'customTags',
      elementApi: '无直接对应',
      description: '额外允许的自定义标签名。',
      type: 'string[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'escapeRawHtml',
      elementApi: '无直接对应',
      description: '渲染前是否转义原始 HTML。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'debug',
      elementApi: '无直接对应',
      description: '是否输出内部流式预处理调试信息。',
      type: 'boolean',
      defaultValue: 'false',
    },
  ],
  message: [
    {
      visionApi: 'type',
      elementApi: 'type',
      description: '控制提示语义类型和图标；loading 为旧项目扩展形态。',
      type: "'info' | 'success' | 'warning' | 'danger' | 'loading'",
      defaultValue: "'info'",
    },
    {
      visionApi: 'text',
      elementApi: 'message',
      description: '提示文案，也可通过默认 slot 覆盖。',
      type: 'string',
      defaultValue: "'这里是提示内容'",
    },
    {
      visionApi: 'modelValue',
      elementApi: '无直接对应',
      description: '控制自绘 Message 是否显示，支持 v-model。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'autoClose',
      elementApi: 'duration',
      description: '是否自动关闭；loading 类型始终不会自动关闭。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'duration',
      elementApi: 'duration',
      description: '自动关闭延时，单位毫秒；小于等于 0 时不自动关闭。',
      type: 'number',
      defaultValue: '3000',
    },
    {
      visionApi: 'default slot',
      elementApi: 'message',
      description: '自定义提示内容。',
      type: 'slot',
      defaultValue: '-',
    },
  ],
  tabs: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '当前激活标签值，支持受控模式。',
      type: 'string | number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'defaultValue',
      elementApi: 'model-value',
      description: '非受控模式下默认激活的标签值。',
      type: 'string | number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'items',
      elementApi: 'ElTabPane',
      description: '标签页数据，支持 value、label、iconName、count、disabled、ariaLabel。',
      type: 'VisTabsItem[]',
      defaultValue: '内置 3 项示例',
    },
    {
      visionApi: 'align',
      elementApi: 'tab-position',
      description: '控制水平标签或右侧垂直标签布局，兼容旧项目 right 命名。',
      type: "'horizontal' | 'right'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'actions',
      elementApi: 'addable / editable 语义参考',
      description: '水平标签页右侧显示默认设置按钮，也可通过 actions slot 覆盖。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: 'tablist 的可访问名称。',
      type: 'string',
      defaultValue: "'标签页'",
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
  toggle: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '开关选中状态。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用开关交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'state',
      elementApi: 'loading / pseudo states',
      description: '锁定 default、hover、focus、loading 演示状态。',
      type: "'default' | 'hover' | 'focus' | 'loading'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'icon',
      elementApi: 'active-icon / inactive-icon',
      description: '是否在轨道内显示 check / x-close 图标。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'text',
      elementApi: 'active-text / inactive-text',
      description: '是否显示 ON / OFF 文案，开启后宽度随内容扩展。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'id / name / value / ariaLabel',
      elementApi: 'id / name / value / aria-label',
      description: '透传原生 checkbox 表单与可访问属性。',
      type: 'string | number | boolean',
      defaultValue: 'undefined',
    },
  ],
  'toggle-button': [
    {
      visionApi: 'modelValue',
      elementApi: '无直接对应',
      description: '切换按钮受控选中状态，支持 v-model。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'defaultPressed',
      elementApi: '无直接对应',
      description: '非受控模式下的默认选中状态。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'size',
      elementApi: 'size',
      description: '控制按钮高度、padding、gap、图标尺寸和字号。',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
    },
    {
      visionApi: 'state',
      elementApi: 'disabled / pseudo states',
      description: '锁定 default、hover、focus、active、disabled 视觉状态。',
      type: "'default' | 'hover' | 'focus' | 'active' | 'disabled'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用按钮交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'iconOnly',
      elementApi: 'icon / circle 语义参考',
      description: '仅展示图标，尺寸固定为 24、32、40px。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'prefix / suffix',
      elementApi: 'icon / default slot',
      description: '控制默认前后图标，也可通过 prefix、suffix slot 覆盖。',
      type: 'boolean',
      defaultValue: 'true / true',
    },
    {
      visionApi: 'label / iconName / suffixIconName',
      elementApi: 'default slot / icon',
      description: '默认文本和图标名称。',
      type: 'string / IconName',
      defaultValue: "'按钮' / 'plus' / 'chevron-down'",
    },
    {
      visionApi: 'htmlType',
      elementApi: 'native-type',
      description: '按钮原生 type 属性。',
      type: "'button' | 'submit' | 'reset'",
      defaultValue: "'button'",
    },
  ],
  tooltip: [
    {
      visionApi: 'content',
      elementApi: 'content',
      description: '默认浮层文本，也可通过 content slot 覆盖。',
      type: 'string',
      defaultValue: "'Tooltip'",
    },
    {
      visionApi: 'modelValue',
      elementApi: 'visible / v-model:visible 语义参考',
      description: '受控显示状态；不传时由 trigger 管理内部状态。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'position',
      elementApi: 'placement',
      description: '浮层位置，沿用旧项目 top、tl、tr、bottom、left、right 命名。',
      type: "'top' | 'tl' | 'tr' | 'bottom' | 'left' | 'right'",
      defaultValue: "'top'",
    },
    {
      visionApi: 'trigger',
      elementApi: 'trigger',
      description: '触发方式；manual 仅响应外部 modelValue 控制。',
      type: "'hover' | 'focus' | 'click' | 'manual'",
      defaultValue: "'hover'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用 tooltip 显示与触发。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'arrow',
      elementApi: 'show-arrow',
      description: '是否显示箭头。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'default slot',
      elementApi: 'default slot',
      description: '触发元素内容。',
      type: 'slot',
      defaultValue: '-',
    },
    {
      visionApi: 'content slot',
      elementApi: 'content slot',
      description: '自定义 tooltip 浮层内容。',
      type: 'slot',
      defaultValue: '-',
    },
  ],
  'tree-view': [
    {
      visionApi: 'items',
      elementApi: 'data',
      description: '树数据源，支持 key、label、children、disabled、icon、suffix。',
      type: 'VisTreeViewItem[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'expandedKeys',
      elementApi: 'default-expanded-keys / expandedKeys 语义参考',
      description: '当前展开节点 key 数组，支持 v-model:expandedKeys。',
      type: 'VisTreeViewKey[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'selectedKey',
      elementApi: 'current-node-key',
      description: '当前选中节点 key，支持 v-model:selectedKey。',
      type: 'VisTreeViewKey | null',
      defaultValue: 'null',
    },
    {
      visionApi: 'checkedKeys',
      elementApi: 'default-checked-keys / checkedKeys 语义参考',
      description: '当前勾选节点 key 数组，支持 v-model:checkedKeys。',
      type: 'VisTreeViewKey[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'checkable',
      elementApi: 'show-checkbox',
      description: '是否显示 checkbox 勾选列。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'draggable',
      elementApi: 'draggable',
      description: '是否显示拖拽入口；旧项目仅提供入口视觉，不内置排序逻辑。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'icon',
      elementApi: 'render-content / icon slot 语义参考',
      description: '是否显示节点图标。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'actions',
      elementApi: 'render-content 语义参考',
      description: '是否显示右侧更多操作按钮。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'folderType',
      elementApi: 'icon slot 语义参考',
      description: '展开图标样式，支持默认箭头和 +/- 方块。',
      type: "'default' | '+/-'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'width',
      elementApi: 'style',
      description: '树容器宽度，数字按 px 处理。',
      type: 'number | string',
      defaultValue: '300',
    },
  ],
  upload: [
    {
      visionApi: 'modelValue',
      elementApi: 'file-list / v-model:file-list',
      description: '文件列表，支持 v-model。',
      type: 'VisUploadFileItem[]',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'type',
      elementApi: 'drag / trigger slot',
      description: '上传入口形态，兼容旧项目 button、trigger、drag。',
      type: "'button' | 'trigger' | 'drag'",
      defaultValue: "'button'",
    },
    {
      visionApi: 'uploaded',
      elementApi: 'show-file-list 语义参考',
      description: '上传后视觉状态开关；真实文件列表由 modelValue 决定。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'description',
      elementApi: 'tip slot',
      description: '是否显示默认描述文字。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用上传入口与文件操作。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'multiple',
      elementApi: 'multiple',
      description: '是否允许一次选择多个文件。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'accept',
      elementApi: 'accept',
      description: '原生 input accept 属性。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'buttonText',
      elementApi: 'trigger slot',
      description: 'button 类型上传按钮文案。',
      type: 'string',
      defaultValue: "'点击上传'",
    },
    {
      visionApi: 'dragTitle',
      elementApi: 'drag slot',
      description: 'drag 类型主标题文案。',
      type: 'string',
      defaultValue: "'点击或拖拽文件到此处上传'",
    },
    {
      visionApi: 'dragDescription',
      elementApi: 'tip slot',
      description: 'drag 类型说明文案。',
      type: 'string',
      defaultValue: "'Only pdf, png, jpg can be uploaded, and the size does not exceed 100MB'",
    },
    {
      visionApi: 'descriptionText',
      elementApi: 'tip slot',
      description: '入口下方说明文案。',
      type: 'string',
      defaultValue: "'jpg/png files with a size less than 500KB.'",
    },
    {
      visionApi: 'fileIconName',
      elementApi: 'file slot',
      description: '文件行默认图标。',
      type: 'IconName',
      defaultValue: "'file-06'",
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
  rate: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '当前评分值，支持整数或半星值。',
      type: 'number',
      defaultValue: '0',
    },
    {
      visionApi: 'count',
      elementApi: 'max',
      description: '评分项数量，最小会归一为 1。',
      type: 'number',
      defaultValue: '5',
    },
    {
      visionApi: 'allowHalf',
      elementApi: 'allow-half',
      description: '允许通过星形左右半区选择 0.5 分。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用评分交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'readonly',
      elementApi: 'disabled / score-template',
      description: '只读展示评分，不响应 hover 和点击。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '评分组件的可访问名称。',
      type: 'string',
      defaultValue: "'评分'",
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
  'time-picker': [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '时间选择器受控值；单值为时间字符串，范围模式为开始和结束时间元组。',
      type: 'string | [string, string] | null',
      defaultValue: 'null',
    },
    {
      visionApi: 'range',
      elementApi: 'is-range',
      description: '切换单时间或时间范围选择。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'type',
      elementApi: 'format',
      description: '保持旧项目与 Figma 的格式枚举，分别输出时分秒或时分。',
      type: "'HH MM SS' | 'HH MM'",
      defaultValue: "'HH MM SS'",
    },
    {
      visionApi: 'timeSelect',
      elementApi: 'ElTimeSelect',
      description: '切换为整点快捷选择列表；关闭时显示独立的时、分、秒滚动列。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'state',
      elementApi: 'validate-event / class',
      description: '按 Figma 变体呈现 default、hover、focus、danger 视觉状态。',
      type: "'default' | 'hover' | 'focus' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用控制项并阻止面板展开。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'readView',
      elementApi: 'readonly',
      description: '保留旧项目的只读展示样式；无值时显示短横线。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '单时间模式的占位文本。',
      type: 'string',
      defaultValue: "'请选择时间'",
    },
    {
      visionApi: 'startPlaceholder',
      elementApi: 'start-placeholder',
      description: '范围模式的开始时间占位文本。',
      type: 'string',
      defaultValue: "'选择开始时间'",
    },
    {
      visionApi: 'endPlaceholder',
      elementApi: 'end-placeholder',
      description: '范围模式的结束时间占位文本。',
      type: 'string',
      defaultValue: "'选择结束时间'",
    },
    {
      visionApi: 'open',
      elementApi: 'visible-change',
      description: '外部控制面板展开状态；配合 update:open 使用。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
  ],
  description: [
    {
      component: 'VisDescription',
      visionApi: 'border',
      elementApi: 'border',
      description: '切换无边框列表与带网格边框的描述表格，对应 Figma Border 变体。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisDescription',
      visionApi: 'direction',
      elementApi: 'direction',
      description: '控制字段名和值横向排列或纵向堆叠。',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
    },
    {
      component: 'VisDescription',
      visionApi: 'columns',
      elementApi: 'column',
      description: '每行显示的描述项数量，窄屏下自动收敛为一列。',
      type: 'number',
      defaultValue: '3',
    },
    {
      component: 'VisDescription',
      visionApi: 'title',
      elementApi: 'title slot',
      description: '是否显示描述列表标题。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      component: 'VisDescription',
      visionApi: 'titleText',
      elementApi: 'title slot',
      description: '标题默认文案，也可由 title 插槽覆盖。',
      type: 'string',
      defaultValue: "'基本信息'",
    },
    {
      component: 'VisDescription',
      visionApi: 'foldable',
      elementApi: '无直接对应',
      description: '显示设计稿中的标题折叠按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisDescription',
      visionApi: 'collapsed',
      elementApi: '无直接对应',
      description: '受控折叠状态，配合 update:collapsed 使用。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      component: 'VisDescription',
      visionApi: 'alert',
      elementApi: '无直接对应',
      description: '在标题与描述项之间显示 Vision 品牌信息提示。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisDescription',
      visionApi: 'alertText',
      elementApi: '无直接对应',
      description: '默认提示文案，也可由 alert 插槽覆盖。',
      type: 'string',
      defaultValue: "'信息提示'",
    },
    {
      component: 'VisDescription',
      visionApi: 'labelWidth',
      elementApi: 'label-width',
      description: '统一设置字段名区域宽度，数字按 px 处理。',
      type: 'number | string',
      defaultValue: '84 / 120',
    },
    {
      component: 'VisDescription',
      visionApi: 'ariaLabel',
      elementApi: '无直接对应',
      description: '描述列表区域的无障碍名称，默认使用 titleText。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'label',
      elementApi: 'label',
      description: '字段名，可由 label 插槽覆盖。',
      type: 'string',
      defaultValue: "'字段名'",
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'value',
      elementApi: 'default slot',
      description: '文本类型的字段值，可由默认插槽覆盖。',
      type: 'string | number',
      defaultValue: "'字段值'",
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'type',
      elementApi: 'default slot',
      description: '控制字段值为普通文本、标签组或自定义内容。',
      type: "'text' | 'tag' | 'customize'",
      defaultValue: "'text'",
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'tags',
      elementApi: 'default slot',
      description: 'tag 类型的数据源，内部复用 VisTag。',
      type: 'VisDescriptionTag[]',
      defaultValue: '内置 3 项示例',
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'icon',
      elementApi: 'label slot',
      description: '在字段名前显示图标。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'iconName',
      elementApi: 'label slot',
      description: '字段名前的 Vision 图标名称。',
      type: 'IconName',
      defaultValue: "'user-01'",
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'span',
      elementApi: 'span',
      description: '当前描述项占据的列数。',
      type: 'number',
      defaultValue: '1',
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'border',
      elementApi: 'border',
      description: '独立使用条目时覆盖边框模式；放在 VisDescription 中会继承容器样式。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'direction',
      elementApi: 'direction',
      description: '独立使用条目时覆盖排列方向；放在 VisDescription 中会继承容器样式。',
      type: "'horizontal' | 'vertical'",
      defaultValue: 'undefined',
    },
    {
      component: 'VisDescriptionItem',
      visionApi: 'labelWidth',
      elementApi: 'label-width',
      description: '覆盖当前描述项的字段名宽度。',
      type: 'number | string',
      defaultValue: 'undefined',
    },
    {
      component: 'VisDescriptionTitle',
      visionApi: 'title',
      elementApi: 'title slot',
      description: '独立标题组件的显示文案。',
      type: 'string',
      defaultValue: "'基本信息'",
    },
    {
      component: 'VisDescriptionTitle',
      visionApi: 'foldable',
      elementApi: '无直接对应',
      description: '是否显示 24px 折叠控制按钮。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      component: 'VisDescriptionTitle',
      visionApi: 'collapsed',
      elementApi: '无直接对应',
      description: '为折叠按钮提供 aria-expanded 与无障碍文案。',
      type: 'boolean',
      defaultValue: 'false',
    },
  ],
  divider: [
    {
      visionApi: 'type',
      elementApi: 'direction',
      description: '控制分割线变体；content 为设计稿新增的带内容水平分割线。',
      type: "'horizontal' | 'vertical' | 'content'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'orientation',
      elementApi: 'direction',
      description: '旧项目兼容别名；新代码使用 type。type 与 orientation 同时传入时以 type 为准。',
      type: "'horizontal' | 'vertical'",
      defaultValue: 'undefined',
    },
    {
      visionApi: 'dashed',
      elementApi: 'border-style',
      description: '切换虚线样式；实线使用 border-default，虚线使用 border-strong。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'length',
      elementApi: '无直接对应',
      description: '自定义分割线长度，number 会转换为 px；水平/content 控制宽度，垂直控制高度。',
      type: 'number | string',
      defaultValue: "'100%'",
    },
    {
      visionApi: 'content',
      elementApi: 'default slot',
      description: 'content 变体的默认文案，可由默认插槽覆盖。',
      type: 'string',
      defaultValue: "'内容分割'",
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
  segmented: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '当前选中的分段值，支持受控模式。',
      type: 'string | number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'defaultValue',
      elementApi: 'model-value',
      description: '非受控模式下的默认选中值。',
      type: 'string | number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'options',
      elementApi: 'options',
      description: '分段选项数据，支持 value、label、iconName、disabled、ariaLabel。',
      type: 'VisSegmentedOption[]',
      defaultValue: '内置 3 项示例',
    },
    {
      visionApi: 'size',
      elementApi: 'size',
      description: '控制容器高度和选项间距，对齐 Figma 的 md、lg 两种尺寸。',
      type: "'md' | 'lg'",
      defaultValue: "'md'",
    },
    {
      visionApi: 'icon',
      elementApi: 'custom option slot',
      description: '是否显示选项图标。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'text',
      elementApi: 'custom option slot',
      description: '是否显示选项文本；关闭时使用 ariaLabel 或 label 作为可访问名称。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用整个分段控制器。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '根 radiogroup 的可访问名称。',
      type: 'string',
      defaultValue: "'分段控制器'",
    },
  ],
  select: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '当前选中值；单选为 string 或 number，多选时为数组。',
      type: 'VisSelectValue | VisSelectValue[]',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'options',
      elementApi: 'option / options',
      description: '选项数据源，支持 label、value、disabled、iconName、title、subtitle、avatarImageVariant。',
      type: 'VisSelectOption[]',
      defaultValue: '内置 3 项示例',
    },
    {
      visionApi: 'type',
      elementApi: 'default slot / label slot',
      description: '控制默认文本选项或头像选项结构。',
      type: "'default' | 'avatar'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'state',
      elementApi: 'disabled / pseudo states',
      description: '用于演示或受控展示默认、hover、focus、danger 状态。',
      type: "'default' | 'hover' | 'focus' | 'danger'",
      defaultValue: "'default'",
    },
    {
      visionApi: 'placeholder',
      elementApi: 'placeholder',
      description: '未选择且未输入搜索内容时显示的占位文本。',
      type: 'string',
      defaultValue: "'请选择'",
    },
    {
      visionApi: 'prefix',
      elementApi: 'prefix slot',
      description: '是否显示默认前缀图标。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'prefixIcon',
      elementApi: 'prefix slot',
      description: '默认前缀图标名称，来自 Vision icon registry。',
      type: 'IconName',
      defaultValue: "'user-01'",
    },
    {
      visionApi: 'multiSelect',
      elementApi: 'multiple',
      description: '启用多选，选中项在输入框内以 Tag 展示。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'filterable',
      elementApi: 'filterable',
      description: '展开后显示搜索输入，并按 label、title、subtitle 过滤选项。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用选择器交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'loading',
      elementApi: 'loading',
      description: '在控制区右侧显示加载状态。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'open',
      elementApi: 'visible-change 语义参考',
      description: '受控展开状态；未传时由组件内部管理。',
      type: 'boolean',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'searchValue',
      elementApi: 'filter-method / remote-method 语义参考',
      description: '受控搜索输入值，配合 update:searchValue 使用。',
      type: 'string',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'width',
      elementApi: 'style / fit-input-width',
      description: '选择器宽度，数字按 px 处理。',
      type: 'number | string',
      defaultValue: '240',
    },
  ],
  slider: [
    {
      visionApi: 'modelValue',
      elementApi: 'model-value / v-model',
      description: '当前滑块值；single 为数字，range 为 [start, end] 数组。',
      type: 'VisSliderValue',
      defaultValue: '50',
    },
    {
      visionApi: 'type',
      elementApi: 'range',
      description: '控制单滑块或区间滑块，兼容旧项目 single / range。',
      type: "'single' | 'range'",
      defaultValue: "'single'",
    },
    {
      visionApi: 'min',
      elementApi: 'min',
      description: '允许选择的最小值。',
      type: 'number',
      defaultValue: '0',
    },
    {
      visionApi: 'max',
      elementApi: 'max',
      description: '允许选择的最大值。',
      type: 'number',
      defaultValue: '100',
    },
    {
      visionApi: 'step',
      elementApi: 'step',
      description: '拖动和点击轨道时的数值步长。',
      type: 'number',
      defaultValue: '1',
    },
    {
      visionApi: 'label',
      elementApi: 'show-tooltip / format-tooltip 语义参考',
      description: '在 thumb 下方常驻展示当前值；关闭时 hover/pressing 展示 tooltip。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'disabled',
      elementApi: 'disabled',
      description: '禁用拖动、点击轨道和 tooltip 交互。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'width',
      elementApi: 'style',
      description: '滑动输入条宽度，数字按 px 处理。',
      type: 'number | string',
      defaultValue: '240',
    },
  ],
  table: [
    {
      visionApi: 'data',
      elementApi: 'data',
      description: '表格行数据源，每一项为一个对象。',
      type: 'VisTableRowData[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'columns',
      elementApi: 'ElTableColumn props',
      description: '声明式列配置，支持字段、宽度、对齐、固定列、排序、子组件类型和溢出提示。',
      type: 'VisTableColumn[]',
      defaultValue: '[]',
    },
    {
      visionApi: 'columns[].headerType',
      elementApi: 'header slot',
      description: '指定表头子组件类型，对应设计稿中的 default、checkbox、radio、shortcuts 与 empty。',
      type: 'VisTableHeaderType',
      defaultValue: "'default'",
    },
    {
      visionApi: 'columns[].cellType',
      elementApi: 'default slot',
      description: '指定单元格子组件类型，完整覆盖设计稿中的 13 种 Table Item。',
      type: 'VisTableItemType',
      defaultValue: "'text'",
    },
    {
      visionApi: 'columns[].itemProps',
      elementApi: 'default slot scope',
      description: '配置单元格子组件，支持静态对象或基于当前行和行索引返回配置的函数。',
      type: 'VisTableItemProps | ((row, rowIndex) => VisTableItemProps)',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'appearance',
      elementApi: 'border',
      description: 'horizontal 仅显示行分割线；grid 同时显示列分割线。',
      type: "'horizontal' | 'grid'",
      defaultValue: "'horizontal'",
    },
    {
      visionApi: 'rowKey',
      elementApi: 'row-key',
      description: '行数据的唯一标识字段或取值函数。',
      type: 'string | ((row) => string)',
      defaultValue: "'id'",
    },
    {
      visionApi: 'selectable',
      elementApi: 'ElTableColumn type="selection"',
      description: '是否显示 48px 宽的多选列。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'highlightActiveRow',
      elementApi: 'highlight-current-row',
      description: '是否展示当前激活行的品牌浅色背景；关闭时仍可通过 active-change 获取当前行。',
      type: 'boolean',
      defaultValue: 'false',
    },
    {
      visionApi: 'activeRowKey',
      elementApi: 'current-row-key',
      description: '指定当前激活行的 key；仅在 highlightActiveRow 开启时展示品牌浅色背景。',
      type: 'string | number | null',
      defaultValue: 'null',
    },
    {
      visionApi: 'defaultSort',
      elementApi: 'default-sort',
      description: '表格初始排序字段和顺序。',
      type: 'VisTableSort',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'emptyText',
      elementApi: 'empty-text',
      description: '空数据状态的提示文字。',
      type: 'string',
      defaultValue: "'暂无数据'",
    },
    {
      visionApi: 'height',
      elementApi: 'height',
      description: '表格固定高度。',
      type: 'string | number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'maxHeight',
      elementApi: 'max-height',
      description: '表格最大高度，超出后表体滚动。',
      type: 'string | number',
      defaultValue: 'undefined',
    },
    {
      visionApi: 'showHeader',
      elementApi: 'show-header',
      description: '是否显示表头。',
      type: 'boolean',
      defaultValue: 'true',
    },
    {
      visionApi: 'ariaLabel',
      elementApi: 'aria-label',
      description: '表格的无障碍名称。',
      type: 'string',
      defaultValue: "'表格'",
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
  'input-search-box': [
    { category: 'Attribute', api: 'type', description: '输入类型；搜索输入框场景对应 search。', type: "'search'", defaultValue: "'text'" },
    { category: 'Attribute', api: 'model-value', description: '绑定值。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'placeholder', description: '输入框占位文本。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'clearable', description: '是否显示清除按钮，仅在非 textarea 类型下生效。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'clear-icon', description: '自定义清除图标组件。', type: 'string | Component', defaultValue: 'CircleClose' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用输入框。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'prefix-icon', description: '输入框头部图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'suffix-icon', description: '输入框尾部图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'name', description: '等价于原生 input name 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'aria-label', description: '等价于原生 input aria-label 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'input-style', description: 'input 元素的 style。', type: 'string | CSSProperties | CSSProperties[] | string[]', defaultValue: '{}' },
    { category: 'Event', api: 'input', description: '在 Input 值改变时触发。', type: '(value: string | number) => void', defaultValue: '-' },
    { category: 'Event', api: 'clear', description: '点击清除按钮清空输入框时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: '当输入框获得焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'blur', description: '当输入框失去焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
  ],
  'input-number': [
    { category: 'Attribute', api: 'model-value', description: '绑定值。', type: 'number | undefined', defaultValue: 'undefined' },
    { category: 'Attribute', api: 'min', description: '设置计数器允许的最小值。', type: 'number', defaultValue: '-Infinity' },
    { category: 'Attribute', api: 'max', description: '设置计数器允许的最大值。', type: 'number', defaultValue: 'Infinity' },
    { category: 'Attribute', api: 'step', description: '计数器步长。', type: 'number', defaultValue: '1' },
    { category: 'Attribute', api: 'step-strictly', description: '是否只能输入 step 的倍数。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'precision', description: '数值精度。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'size', description: '计数器尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'readonly', description: '原生 readonly 属性，是否只读。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用计数器。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'controls', description: '是否使用控制按钮。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'controls-position', description: '控制按钮位置。', type: "'right' | ''", defaultValue: "''" },
    { category: 'Attribute', api: 'name', description: '等价于原生 input name 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'placeholder', description: '输入框默认占位文本。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'value-on-clear', description: '输入框被清空时使用的值。', type: 'number | null | \"min\" | \"max\"', defaultValue: 'null' },
    { category: 'Attribute', api: 'validate-event', description: '输入时是否触发表单校验。', type: 'boolean', defaultValue: 'true' },
    { category: 'Event', api: 'change', description: '绑定值变化时触发。', type: '(currentValue: number | undefined, oldValue: number | undefined) => void', defaultValue: '-' },
    { category: 'Event', api: 'blur', description: '输入框失去焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: '输入框获得焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
  ],
  'input-textarea': [
    { category: 'Attribute', api: 'type', description: '输入类型；文本域场景固定对应 textarea。', type: "'textarea'", defaultValue: "'text'" },
    { category: 'Attribute', api: 'model-value', description: '绑定值。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'maxlength', description: '同原生 maxlength 属性。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'minlength', description: '同原生 minlength 属性。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'show-word-limit', description: "是否显示统计字数，只在 type 为 'text' 或 'textarea' 时生效。", type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'word-limit-position', description: '字数统计的位置，仅当 show-word-limit 为 true 时生效。', type: "'inside' | 'outside'", defaultValue: "'inside'" },
    { category: 'Attribute', api: 'placeholder', description: '输入框占位文本。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'rows', description: "输入框行数，仅 type 为 'textarea' 时有效。", type: 'number', defaultValue: '2' },
    { category: 'Attribute', api: 'autosize', description: "textarea 高度是否自适应，仅 type 为 'textarea' 时生效。", type: 'boolean | { minRows?: number, maxRows?: number }', defaultValue: 'false' },
    { category: 'Attribute', api: 'name', description: '等价于原生 textarea name 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'readonly', description: '原生 readonly 属性，是否只读。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'resize', description: '控制是否能被用户缩放。', type: "'none' | 'both' | 'horizontal' | 'vertical'", defaultValue: '-' },
    { category: 'Attribute', api: 'aria-label', description: '等价于原生 textarea aria-label 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'validate-event', description: '输入时是否触发表单校验。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'input-style', description: 'textarea 元素的 style。', type: 'string | CSSProperties | CSSProperties[] | string[]', defaultValue: '{}' },
    { category: 'Event', api: 'blur', description: '当输入框失去焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: '当输入框获得焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'change', description: '仅当 modelValue 改变时，在输入框失去焦点或用户按 Enter 时触发。', type: '(value: string | number) => void', defaultValue: '-' },
    { category: 'Event', api: 'input', description: '在 Input 值改变时触发。', type: '(value: string | number) => void', defaultValue: '-' },
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
  markdown: noElementApiRows(),
  message: [
    { category: 'Attribute', api: 'message', description: '消息文字。', type: 'string | VNode | Function', defaultValue: "''" },
    { category: 'Attribute', api: 'type', description: '消息类型。', type: "'success' | 'warning' | 'info' | 'error'", defaultValue: "'info'" },
    { category: 'Attribute', api: 'plain', description: '是否为纯色背景。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'show-close', description: '是否显示关闭按钮。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'grouping', description: '是否合并内容相同的消息。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'duration', description: '显示时间，单位毫秒；设为 0 则不会自动关闭。', type: 'number', defaultValue: '3000' },
    { category: 'Attribute', api: 'offset', description: 'Message 距离窗口顶部的偏移量。', type: 'number', defaultValue: '16' },
    { category: 'Attribute', api: 'append-to', description: '设置 Message 挂载到哪个 DOM 元素。', type: 'CSSSelector | HTMLElement', defaultValue: 'document.body' },
    { category: 'Attribute', api: 'dangerouslyUseHTMLString', description: '是否将 message 属性作为 HTML 片段处理。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'custom-class', description: '自定义类名。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'icon', description: '自定义图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'z-index', description: 'Message 的 z-index。', type: 'number', defaultValue: '-' },
    { category: 'Event', api: 'close', description: '关闭 Message 时触发。', type: '() => void', defaultValue: '-' },
  ],
  notification: [
    { category: 'Attribute', api: 'title', description: '通知标题。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'message', description: '通知正文内容。', type: 'string | VNode | Function', defaultValue: "''" },
    { category: 'Attribute', api: 'type', description: '通知类型。', type: "'success' | 'warning' | 'info' | 'error'", defaultValue: "''" },
    { category: 'Attribute', api: 'position', description: '自定义弹出位置。', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", defaultValue: "'top-right'" },
    { category: 'Attribute', api: 'duration', description: '显示时间，单位毫秒；设为 0 则不会自动关闭。', type: 'number', defaultValue: '4500' },
    { category: 'Attribute', api: 'offset', description: 'Notification 偏移距离。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'show-close', description: '是否显示关闭按钮。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'dangerouslyUseHTMLString', description: '是否将 message 属性作为 HTML 片段处理。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'custom-class', description: '自定义类名。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'icon', description: '自定义图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'z-index', description: 'Notification 的 z-index。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'append-to', description: '设置 Notification 挂载到哪个 DOM 元素。', type: 'CSSSelector | HTMLElement', defaultValue: 'document.body' },
    { category: 'Event', api: 'click', description: '点击 Notification 时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'close', description: '关闭 Notification 时触发。', type: '() => void', defaultValue: '-' },
  ],
  pagination: [
    { category: 'Attribute', api: 'small', description: '是否使用小型分页样式。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'background', description: '是否为分页按钮添加背景色。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'page-size', description: '每页显示条目个数。', type: 'number', defaultValue: '10' },
    { category: 'Attribute', api: 'default-page-size', description: '非受控状态下每页默认条目个数。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'total', description: '总条目数。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'page-count', description: '总页数；total 和 page-count 设置任意一个即可。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'pager-count', description: '页码按钮的数量，当总页数超过该值时会折叠。', type: 'number', defaultValue: '7' },
    { category: 'Attribute', api: 'current-page', description: '当前页数，支持 v-model:current-page。', type: 'number', defaultValue: '1' },
    { category: 'Attribute', api: 'default-current-page', description: '非受控状态下当前默认页数。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'layout', description: '组件布局，子组件名用逗号分隔。', type: 'string', defaultValue: "'prev, pager, next, jumper, ->, total'" },
    { category: 'Attribute', api: 'page-sizes', description: '每页显示个数选择器的选项。', type: 'number[]', defaultValue: '[10, 20, 30, 40, 50, 100]' },
    { category: 'Attribute', api: 'popper-class', description: '每页数量选择器下拉框类名。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'prev-text', description: '替代上一页图标的文字。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'prev-icon', description: '上一页图标组件。', type: 'string | Component', defaultValue: 'ArrowLeft' },
    { category: 'Attribute', api: 'next-text', description: '替代下一页图标的文字。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'next-icon', description: '下一页图标组件。', type: 'string | Component', defaultValue: 'ArrowRight' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用分页。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'hide-on-single-page', description: '只有一页时是否隐藏分页器。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: '分页器尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Event', api: 'size-change', description: 'page-size 改变时触发。', type: '(pageSize: number) => void', defaultValue: '-' },
    { category: 'Event', api: 'current-change', description: 'current-page 改变时触发。', type: '(currentPage: number) => void', defaultValue: '-' },
    { category: 'Event', api: 'change', description: 'current-page 或 page-size 改变时触发。', type: '(currentPage: number, pageSize: number) => void', defaultValue: '-' },
    { category: 'Event', api: 'prev-click', description: '用户点击上一页按钮改变当前页后触发。', type: '(currentPage: number) => void', defaultValue: '-' },
    { category: 'Event', api: 'next-click', description: '用户点击下一页按钮改变当前页后触发。', type: '(currentPage: number) => void', defaultValue: '-' },
  ],
  popover: [
    { category: 'Attribute', api: 'trigger', description: '触发方式。', type: "'click' | 'focus' | 'hover' | 'contextmenu'", defaultValue: "'hover'" },
    { category: 'Attribute', api: 'title', description: '标题。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'effect', description: 'Tooltip 主题，Popover 可参考。', type: "'dark' | 'light'", defaultValue: "'light'" },
    { category: 'Attribute', api: 'content', description: '显示的内容，也可以通过默认 slot 传入。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'width', description: '宽度。', type: 'string | number', defaultValue: '150' },
    { category: 'Attribute', api: 'placement', description: '出现位置。', type: 'top / bottom / left / right 等 Popper placement', defaultValue: "'bottom'" },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'visible', description: 'Popover 是否显示。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'offset', description: '出现位置的偏移量。', type: 'number', defaultValue: '12' },
    { category: 'Attribute', api: 'show-arrow', description: '是否显示箭头。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'popper-class', description: '为 popper 添加类名。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'popper-style', description: '为 popper 添加样式。', type: 'string | CSSProperties', defaultValue: '{}' },
    { category: 'Attribute', api: 'show-after', description: '延迟出现，单位毫秒。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'hide-after', description: '延迟关闭，单位毫秒。', type: 'number', defaultValue: '200' },
    { category: 'Attribute', api: 'auto-close', description: '自动关闭延时，单位毫秒。', type: 'number', defaultValue: '0' },
    { category: 'Event', api: 'show', description: '显示时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'before-enter', description: '显示动画进入前触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'after-enter', description: '显示动画进入后触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'hide', description: '隐藏时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'before-leave', description: '隐藏动画离开前触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'after-leave', description: '隐藏动画离开后触发。', type: '() => void', defaultValue: '-' },
  ],
  'progress-bar': [
    { category: 'Attribute', api: 'percentage', description: '百分比，必填。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'type', description: '进度条类型。', type: "'line' | 'circle' | 'dashboard'", defaultValue: "'line'" },
    { category: 'Attribute', api: 'stroke-width', description: '进度条的宽度，单位 px。', type: 'number', defaultValue: '6' },
    { category: 'Attribute', api: 'text-inside', description: '进度条显示文字内置在进度条内，只在 type 为 line 时可用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'status', description: '进度条当前状态。', type: "'success' | 'exception' | 'warning' | ''", defaultValue: "''" },
    { category: 'Attribute', api: 'indeterminate', description: '是否为动画进度条。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'duration', description: '控制动画进度条速度。', type: 'number', defaultValue: '3' },
    { category: 'Attribute', api: 'color', description: '进度条背景色，会覆盖 status 状态颜色。', type: 'string | function | array', defaultValue: "''" },
    { category: 'Attribute', api: 'width', description: '环形进度条画布宽度，只在 circle / dashboard 类型时生效。', type: 'number', defaultValue: '126' },
    { category: 'Attribute', api: 'show-text', description: '是否显示进度条文字内容。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'format', description: '指定进度条文字内容。', type: '(percentage: number) => string', defaultValue: '-' },
    { category: 'Attribute', api: 'striped', description: '在进度条上增加条纹效果。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'striped-flow', description: '让条纹流动起来。', type: 'boolean', defaultValue: 'false' },
  ],
  'progress-circle': [
    { category: 'Attribute', api: 'percentage', description: '百分比，必填。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'type', description: '进度条类型。', type: "'line' | 'circle' | 'dashboard'", defaultValue: "'line'" },
    { category: 'Attribute', api: 'stroke-width', description: '进度条的宽度，单位 px。', type: 'number', defaultValue: '6' },
    { category: 'Attribute', api: 'text-inside', description: '进度条显示文字内置在进度条内，只在 type 为 line 时可用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'status', description: '进度条当前状态。', type: "'success' | 'exception' | 'warning' | ''", defaultValue: "''" },
    { category: 'Attribute', api: 'indeterminate', description: '是否为动画进度条。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'duration', description: '控制动画进度条速度。', type: 'number', defaultValue: '3' },
    { category: 'Attribute', api: 'color', description: '进度条背景色，会覆盖 status 状态颜色。', type: 'string | function | array', defaultValue: "''" },
    { category: 'Attribute', api: 'width', description: '环形进度条画布宽度，只在 circle / dashboard 类型时生效。', type: 'number', defaultValue: '126' },
    { category: 'Attribute', api: 'show-text', description: '是否显示进度条文字内容。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'format', description: '指定进度条文字内容。', type: '(percentage: number) => string', defaultValue: '-' },
    { category: 'Attribute', api: 'striped', description: '在进度条上增加条纹效果。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'striped-flow', description: '让条纹流动起来。', type: 'boolean', defaultValue: 'false' },
  ],
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
  tabs: [
    { category: 'Attribute', api: 'model-value', description: '绑定值，选中选项卡的 name。', type: 'string | number', defaultValue: '第一个选项卡的 name' },
    { category: 'Attribute', api: 'type', description: '风格类型。', type: "'card' | 'border-card' | ''", defaultValue: "''" },
    { category: 'Attribute', api: 'closable', description: '标签是否可关闭。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'addable', description: '标签是否可增加。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'editable', description: '标签是否同时可增加和关闭。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'tab-position', description: '选项卡所在位置。', type: "'top' | 'right' | 'bottom' | 'left'", defaultValue: "'top'" },
    { category: 'Attribute', api: 'stretch', description: '标签宽度是否自撑开。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'before-leave', description: '切换标签之前的钩子，返回 false 或 Promise reject 可阻止切换。', type: '(activeName, oldActiveName) => boolean | Promise<boolean>', defaultValue: '-' },
    { category: 'Attribute', api: 'name', description: 'Tab Pane 标识，与 Tabs 的 model-value 对应。', type: 'string | number', defaultValue: '当前序号' },
    { category: 'Attribute', api: 'label', description: '选项卡标题。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Event', api: 'tab-click', description: '标签被选中时触发。', type: '(pane, event) => void', defaultValue: '-' },
    { category: 'Event', api: 'tab-change', description: 'activeName 改变时触发。', type: '(name: string | number) => void', defaultValue: '-' },
    { category: 'Event', api: 'edit', description: '点击新增或关闭按钮时触发。', type: '(targetName, action) => void', defaultValue: '-' },
  ],
  toggle: [
    { category: 'Attribute', api: 'model-value', description: '绑定值。', type: 'boolean | string | number', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'loading', description: '是否显示加载中。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: 'Switch 的大小。', type: "'large' | 'default' | 'small'", defaultValue: "''" },
    { category: 'Attribute', api: 'active-text', description: '打开时的文字描述。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'inactive-text', description: '关闭时的文字描述。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'active-value', description: '打开时的值。', type: 'boolean | string | number', defaultValue: 'true' },
    { category: 'Attribute', api: 'inactive-value', description: '关闭时的值。', type: 'boolean | string | number', defaultValue: 'false' },
    { category: 'Attribute', api: 'active-icon', description: '打开时显示的图标。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'inactive-icon', description: '关闭时显示的图标。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'name', description: 'Switch 对应的 name 属性。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'id', description: 'Switch 对应的 id 属性。', type: 'string', defaultValue: '-' },
    { category: 'Event', api: 'change', description: 'switch 状态发生变化时触发。', type: '(value: boolean | string | number) => void', defaultValue: '-' },
  ],
  'toggle-button': [
    { category: 'Attribute', api: 'size', description: '按钮尺寸。', type: "'large' | 'default' | 'small'", defaultValue: '-' },
    { category: 'Attribute', api: 'type', description: '按钮类型。', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'", defaultValue: '-' },
    { category: 'Attribute', api: 'text', description: '是否为文本按钮。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'link', description: '是否为链接按钮。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'circle', description: '是否为圆形按钮，常用于仅图标按钮语义参考。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用按钮。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'icon', description: '图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'native-type', description: '原生 button 的 type 属性。', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'" },
    { category: 'Event', api: 'click', description: '点击按钮时触发。', type: '(event: MouseEvent) => void', defaultValue: '-' },
  ],
  tooltip: [
    { category: 'Attribute', api: 'append-to', description: '指示 Tooltip 的内容将附加在哪一个网页元素上。', type: 'CSSSelector | HTMLElement', defaultValue: '-' },
    { category: 'Attribute', api: 'effect', description: 'Tooltip 主题。', type: "'dark' | 'light'", defaultValue: "'dark'" },
    { category: 'Attribute', api: 'content', description: '显示的内容，也可以通过 content slot 传入 DOM。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'raw-content', description: 'content 中的内容是否作为 HTML 字符串处理。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'placement', description: 'Tooltip 的出现位置。', type: 'top / bottom / left / right 等 Popper placement', defaultValue: "'bottom'" },
    { category: 'Attribute', api: 'visible', description: 'Tooltip 是否可见。', type: 'boolean', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: 'Tooltip 是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'offset', description: '出现位置的偏移量。', type: 'number', defaultValue: '12' },
    { category: 'Attribute', api: 'show-after', description: '延迟出现，单位毫秒。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'hide-after', description: '延迟关闭，单位毫秒。', type: 'number', defaultValue: '200' },
    { category: 'Attribute', api: 'show-arrow', description: '是否显示箭头。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'trigger', description: '触发方式。', type: "'hover' | 'click' | 'focus' | 'contextmenu'", defaultValue: "'hover'" },
    { category: 'Attribute', api: 'popper-class', description: '为 Tooltip 的 popper 添加类名。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'teleported', description: '是否将 tooltip 内容插入至 body 元素。', type: 'boolean', defaultValue: 'true' },
    { category: 'Event', api: 'show', description: 'Tooltip 显示时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'hide', description: 'Tooltip 隐藏时触发。', type: '() => void', defaultValue: '-' },
  ],
  'tree-view': [
    { category: 'Attribute', api: 'data', description: '展示数据。', type: 'array', defaultValue: '-' },
    { category: 'Attribute', api: 'empty-text', description: '内容为空的时候展示的文本。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'node-key', description: '每个树节点用来作为唯一标识的属性，整棵树应该唯一。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'props', description: '配置选项，指定 label、children、disabled 等字段名。', type: 'object', defaultValue: '-' },
    { category: 'Attribute', api: 'render-after-expand', description: '是否在第一次展开某个树节点后才渲染其子节点。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'load', description: '加载子树数据的方法，仅 lazy 属性为 true 时生效。', type: 'Function', defaultValue: '-' },
    { category: 'Attribute', api: 'render-content', description: '树节点内容区的渲染函数。', type: 'Function', defaultValue: '-' },
    { category: 'Attribute', api: 'highlight-current', description: '是否高亮当前选中节点。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'default-expand-all', description: '是否默认展开所有节点。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'expand-on-click-node', description: '是否在点击节点时展开或收缩节点。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'check-on-click-node', description: '是否在点击节点时选中节点复选框。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'auto-expand-parent', description: '展开子节点时是否自动展开父节点。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'default-expanded-keys', description: '默认展开节点的 key 数组。', type: 'array', defaultValue: '-' },
    { category: 'Attribute', api: 'show-checkbox', description: '节点是否可被选择。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'check-strictly', description: '父子节点是否互不关联。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'default-checked-keys', description: '默认勾选节点的 key 数组。', type: 'array', defaultValue: '-' },
    { category: 'Attribute', api: 'current-node-key', description: '当前选中节点的 key。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'filter-node-method', description: '过滤节点的方法。', type: 'Function', defaultValue: '-' },
    { category: 'Attribute', api: 'accordion', description: '是否每次只打开同级树节点中的一个。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'indent', description: '相邻级节点间的水平缩进，单位 px。', type: 'number', defaultValue: '16' },
    { category: 'Attribute', api: 'icon', description: '自定义树节点图标组件。', type: 'string | Component', defaultValue: '-' },
    { category: 'Attribute', api: 'lazy', description: '是否懒加载子节点。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'draggable', description: '是否开启拖拽节点功能。', type: 'boolean', defaultValue: 'false' },
    { category: 'Event', api: 'node-click', description: '节点被点击时触发。', type: '(data, node, component, event) => void', defaultValue: '-' },
    { category: 'Event', api: 'check-change', description: '节点选中状态发生变化时触发。', type: '(data, checked, indeterminate) => void', defaultValue: '-' },
    { category: 'Event', api: 'check', description: '点击复选框后触发。', type: '(data, checkedInfo) => void', defaultValue: '-' },
    { category: 'Event', api: 'node-expand', description: '节点被展开时触发。', type: '(data, node, component) => void', defaultValue: '-' },
    { category: 'Event', api: 'node-collapse', description: '节点被关闭时触发。', type: '(data, node, component) => void', defaultValue: '-' },
  ],
  upload: [
    { category: 'Attribute', api: 'action', description: '请求 URL。', type: 'string', defaultValue: "'#'" },
    { category: 'Attribute', api: 'headers', description: '设置上传的请求头部。', type: 'object', defaultValue: '-' },
    { category: 'Attribute', api: 'method', description: '设置上传请求方法。', type: 'string', defaultValue: "'post'" },
    { category: 'Attribute', api: 'multiple', description: '是否支持多选文件。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'data', description: '上传时附带的额外参数。', type: 'object | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'name', description: '上传的文件字段名。', type: 'string', defaultValue: "'file'" },
    { category: 'Attribute', api: 'with-credentials', description: '支持发送 cookie 凭证信息。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'show-file-list', description: '是否显示已上传文件列表。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'drag', description: '是否启用拖拽上传。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'accept', description: '接受上传的文件类型。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'file-list', description: '默认上传文件列表。', type: 'array', defaultValue: '[]' },
    { category: 'Attribute', api: 'list-type', description: '文件列表的类型。', type: "'text' | 'picture' | 'picture-card'", defaultValue: "'text'" },
    { category: 'Attribute', api: 'auto-upload', description: '是否自动上传文件。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'limit', description: '允许上传文件的最大数量。', type: 'number', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用上传。', type: 'boolean', defaultValue: 'false' },
    { category: 'Event', api: 'on-preview', description: '点击文件列表中已上传的文件时触发。', type: '(uploadFile) => void', defaultValue: '-' },
    { category: 'Event', api: 'on-remove', description: '文件列表移除文件时触发。', type: '(uploadFile, uploadFiles) => void', defaultValue: '-' },
    { category: 'Event', api: 'on-success', description: '文件上传成功时触发。', type: '(response, uploadFile, uploadFiles) => void', defaultValue: '-' },
    { category: 'Event', api: 'on-error', description: '文件上传失败时触发。', type: '(error, uploadFile, uploadFiles) => void', defaultValue: '-' },
    { category: 'Event', api: 'on-progress', description: '文件上传时触发。', type: '(event, uploadFile, uploadFiles) => void', defaultValue: '-' },
    { category: 'Event', api: 'on-change', description: '文件状态改变时触发。', type: '(uploadFile, uploadFiles) => void', defaultValue: '-' },
    { category: 'Event', api: 'before-upload', description: '上传文件之前的钩子。', type: '(rawFile) => boolean | Promise', defaultValue: '-' },
    { category: 'Event', api: 'before-remove', description: '删除文件之前的钩子。', type: '(uploadFile, uploadFiles) => boolean | Promise', defaultValue: '-' },
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
  rate: [
    { category: 'Attribute', api: 'model-value', description: '绑定值。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'max', description: '最大分值。', type: 'number', defaultValue: '5' },
    { category: 'Attribute', api: 'disabled', description: '是否为只读。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'allow-half', description: '是否允许半选。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'low-threshold', description: '低分和中等分数的界限值。', type: 'number', defaultValue: '2' },
    { category: 'Attribute', api: 'high-threshold', description: '高分和中等分数的界限值。', type: 'number', defaultValue: '4' },
    { category: 'Attribute', api: 'colors', description: 'icon 的颜色数组或分段颜色对象。', type: 'string[] | Record<number, string>', defaultValue: "['#F7BA2A', '#F7BA2A', '#F7BA2A']" },
    { category: 'Attribute', api: 'void-color', description: '未选中 icon 的颜色。', type: 'string', defaultValue: "'#C6D1DE'" },
    { category: 'Attribute', api: 'disabled-void-color', description: '只读时未选中 icon 的颜色。', type: 'string', defaultValue: "'#EFF2F7'" },
    { category: 'Attribute', api: 'icons', description: 'icon 组件数组或分段 icon 对象。', type: 'string[] | Component[] | Record<number, string | Component>', defaultValue: '[StarFilled, StarFilled, StarFilled]' },
    { category: 'Attribute', api: 'void-icon', description: '未被选中的 icon 组件。', type: 'string | Component', defaultValue: 'Star' },
    { category: 'Attribute', api: 'disabled-void-icon', description: '禁用状态的未选中 icon 组件。', type: 'string | Component', defaultValue: 'StarFilled' },
    { category: 'Attribute', api: 'show-text', description: '是否显示辅助文字。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'show-score', description: '是否显示当前分数。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'text-color', description: '辅助文字的颜色。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'texts', description: '辅助文字数组。', type: 'string[]', defaultValue: "['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise']" },
    { category: 'Attribute', api: 'score-template', description: '分数显示模板。', type: 'string', defaultValue: "'{value}'" },
    { category: 'Attribute', api: 'clearable', description: '是否允许再次点击后重置。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'aria-label', description: '等价于原生 aria-label 属性。', type: 'string', defaultValue: '-' },
    { category: 'Event', api: 'change', description: '分值改变时触发。', type: '(value: number) => void', defaultValue: '-' },
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
  'time-picker': [
    { category: 'Attribute', api: 'model-value', description: '绑定值；范围模式下为包含两个时间值的数组。', type: 'string | number | Date | [Date, Date]', defaultValue: "''" },
    { category: 'Attribute', api: 'readonly', description: '完全只读。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用时间选择器。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'editable', description: '文本框是否可输入。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'clearable', description: '是否显示清除按钮。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'size', description: '输入框尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'placeholder', description: '非范围选择时的占位内容。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'start-placeholder', description: '范围选择时开始时间的占位内容。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'end-placeholder', description: '范围选择时结束时间的占位内容。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'is-range', description: '是否为时间范围选择。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'arrow-control', description: '是否使用箭头进行时间选择。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'popper-class', description: 'TimePicker 下拉框的自定义类名。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'range-separator', description: '选择范围时的分隔符。', type: 'string', defaultValue: "'-'" },
    { category: 'Attribute', api: 'format', description: '显示在输入框中的时间格式。', type: 'string', defaultValue: "'HH:mm:ss'" },
    { category: 'Attribute', api: 'value-format', description: '绑定值的格式；不指定时绑定值为 Date 对象。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'default-value', description: '选择器打开时默认显示的时间。', type: 'Date | [Date, Date]', defaultValue: '-' },
    { category: 'Attribute', api: 'prefix-icon', description: '自定义前缀图标组件。', type: 'string | Component', defaultValue: "'Clock'" },
    { category: 'Attribute', api: 'clear-icon', description: '自定义清除图标组件。', type: 'string | Component', defaultValue: "'CircleClose'" },
    { category: 'Attribute', api: 'disabled-hours', description: '禁止选择部分小时的回调。', type: '(role: string, comparingDate?: Dayjs) => number[]', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled-minutes', description: '禁止选择部分分钟的回调。', type: '(hour: number, role: string, comparingDate?: Dayjs) => number[]', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled-seconds', description: '禁止选择部分秒的回调。', type: '(hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]', defaultValue: '-' },
    { category: 'Attribute', api: 'teleported', description: '是否将下拉面板插入至 body。', type: 'boolean', defaultValue: 'true' },
    { category: 'Event', api: 'change', description: '用户确认选定的值时触发。', type: '(value) => void', defaultValue: '-' },
    { category: 'Event', api: 'blur', description: '输入框失去焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: '输入框获得焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'clear', description: '点击清除按钮时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'visible-change', description: '下拉面板出现或隐藏时触发。', type: '(visibility: boolean) => void', defaultValue: '-' },
  ],
  form: [
    { component: 'ElForm', category: 'Attribute', api: 'model', description: '表单数据对象。', type: 'object', defaultValue: '-' },
    { component: 'ElForm', category: 'Attribute', api: 'rules', description: '表单验证规则。', type: 'object', defaultValue: '-' },
    { component: 'ElForm', category: 'Attribute', api: 'inline', description: '是否启用行内表单模式。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElForm', category: 'Attribute', api: 'label-position', description: '表单域标签的位置；设为 left 或 right 时还需设置 label-width。', type: "'left' | 'right' | 'top'", defaultValue: "'right'" },
    { component: 'ElForm', category: 'Attribute', api: 'label-width', description: '标签长度，例如 50px；直属 FormItem 会继承，也可以使用 auto。', type: 'string | number', defaultValue: "''" },
    { component: 'ElForm', category: 'Attribute', api: 'label-suffix', description: '表单域标签的后缀。', type: 'string', defaultValue: "''" },
    { component: 'ElForm', category: 'Attribute', api: 'hide-required-asterisk', description: '是否隐藏必填字段标签旁边的红色星号。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElForm', category: 'Attribute', api: 'require-asterisk-position', description: '必填星号的位置。', type: "'left' | 'right'", defaultValue: "'left'" },
    { component: 'ElForm', category: 'Attribute', api: 'show-message', description: '是否显示校验错误信息。', type: 'boolean', defaultValue: 'true' },
    { component: 'ElForm', category: 'Attribute', api: 'inline-message', description: '是否以行内形式展示校验信息。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElForm', category: 'Attribute', api: 'status-icon', description: '是否在输入框中显示校验结果反馈图标。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElForm', category: 'Attribute', api: 'validate-on-rule-change', description: 'rules 改变后是否立即触发验证。', type: 'boolean', defaultValue: 'true' },
    { component: 'ElForm', category: 'Attribute', api: 'size', description: '控制该表单内组件的尺寸。', type: "'large' | 'default' | 'small'", defaultValue: '-' },
    { component: 'ElForm', category: 'Attribute', api: 'disabled', description: '是否禁用该表单内的所有组件。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElForm', category: 'Attribute', api: 'scroll-to-error', description: '校验失败时是否滚动到第一个错误表单项。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElForm', category: 'Attribute', api: 'scroll-into-view-options', description: '滚动到第一个失败表单项时使用的 scrollIntoView 配置。', type: 'object | boolean', defaultValue: 'true' },
    { component: 'ElFormItem', category: 'Attribute', api: 'prop', description: 'model 的键名或属性路径；使用 validate、resetFields 时必填。', type: 'string | string[]', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'label', description: '标签文本。', type: 'string', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'label-position', description: '当前表单域标签的位置，默认继承 Form。', type: "'' | 'left' | 'right' | 'top'", defaultValue: "''" },
    { component: 'ElFormItem', category: 'Attribute', api: 'label-width', description: '标签宽度，例如 50px，也可以使用 auto。', type: 'string | number', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'required', description: '是否为必填项；未设置时根据校验规则确认。', type: 'boolean', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'rules', description: '当前表单项的校验规则。', type: 'object | object[]', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'error', description: '直接设置验证错误提示，并将状态设为 error。', type: 'string', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'show-message', description: '是否显示校验错误信息。', type: 'boolean', defaultValue: 'true' },
    { component: 'ElFormItem', category: 'Attribute', api: 'inline-message', description: '是否在行内显示校验信息。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElFormItem', category: 'Attribute', api: 'size', description: '控制该表单域下组件的默认尺寸。', type: "'large' | 'default' | 'small'", defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'for', description: '与原生 label 的 for 属性具有相同能力。', type: 'string', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Attribute', api: 'validate-status', description: '表单项的校验状态。', type: "'' | 'error' | 'validating' | 'success'", defaultValue: '-' },
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
  segmented: [
    { category: 'Attribute', api: 'model-value', description: '绑定值。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'options', description: '选项列表。', type: 'Array<string | number | object>', defaultValue: '[]' },
    { category: 'Attribute', api: 'props', description: '选项字段映射配置。', type: 'object', defaultValue: '-' },
    { category: 'Attribute', api: 'size', description: '分段控制器尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "''" },
    { category: 'Attribute', api: 'block', description: '是否占满父元素宽度。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'validate-event', description: '输入时是否触发表单校验。', type: 'boolean', defaultValue: 'true' },
    { category: 'Event', api: 'change', description: '绑定值变化时触发。', type: '(value: string | number) => void', defaultValue: '-' },
  ],
  select: [
    { category: 'Attribute', api: 'model-value', description: '选中项绑定值。', type: 'string | number | boolean | object | array', defaultValue: '-' },
    { category: 'Attribute', api: 'multiple', description: '是否多选。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'value-key', description: '作为 value 唯一标识的键名，绑定值为对象类型时必填。', type: 'string', defaultValue: "'value'" },
    { category: 'Attribute', api: 'size', description: '输入框尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'clearable', description: '是否可以清空选项。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'collapse-tags', description: '多选时是否将选中值按文字折叠展示。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'collapse-tags-tooltip', description: '多选折叠后，鼠标悬停是否以 tooltip 展示全部选中值。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'multiple-limit', description: '多选时用户最多可选择的项目数；0 表示不限制。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'name', description: 'Select 输入框的原生 name 属性。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'effect', description: 'Tooltip 主题。', type: "'dark' | 'light'", defaultValue: "'light'" },
    { category: 'Attribute', api: 'autocomplete', description: 'Select 输入框的 autocomplete 属性。', type: 'string', defaultValue: "'off'" },
    { category: 'Attribute', api: 'placeholder', description: '占位文本。', type: 'string', defaultValue: "'Select'" },
    { category: 'Attribute', api: 'filterable', description: '是否可搜索。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'allow-create', description: '是否允许用户创建新条目，需要配合 filterable 使用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'filter-method', description: '自定义搜索方法。', type: '(query: string) => void', defaultValue: '-' },
    { category: 'Attribute', api: 'remote', description: '是否从服务器远程加载选项。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'remote-method', description: '远程搜索方法。', type: '(query: string) => void', defaultValue: '-' },
    { category: 'Attribute', api: 'loading', description: '是否正在从远程获取数据。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'loading-text', description: '远程加载时显示的文字。', type: 'string', defaultValue: "'Loading'" },
    { category: 'Attribute', api: 'no-match-text', description: '搜索条件无匹配时显示的文字。', type: 'string', defaultValue: "'No matching data'" },
    { category: 'Attribute', api: 'no-data-text', description: '选项为空时显示的文字。', type: 'string', defaultValue: "'No data'" },
    { category: 'Attribute', api: 'popper-class', description: 'Select 下拉菜单的自定义类名。', type: 'string', defaultValue: "''" },
    { category: 'Attribute', api: 'reserve-keyword', description: '多选且可搜索时，选中后是否保留当前搜索关键词。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'default-first-option', description: '按下回车时是否选择当前第一个匹配项。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'teleported', description: '是否将下拉层挂载到 body。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'persistent', description: '下拉层不可见时是否保留 DOM。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'automatic-dropdown', description: '输入框获得焦点后是否自动弹出下拉菜单。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'clear-icon', description: '自定义清除图标。', type: 'string | Component', defaultValue: "'CircleClose'" },
    { category: 'Attribute', api: 'suffix-icon', description: '自定义后缀图标。', type: 'string | Component', defaultValue: "'ArrowDown'" },
    { category: 'Attribute', api: 'tag-type', description: '多选标签类型。', type: "'primary' | 'success' | 'info' | 'warning' | 'danger'", defaultValue: "'info'" },
    { category: 'Attribute', api: 'tag-effect', description: '多选标签主题。', type: "'light' | 'dark' | 'plain'", defaultValue: "'light'" },
    { category: 'Attribute', api: 'validate-event', description: '输入时是否触发表单校验。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'placement', description: '下拉菜单出现位置。', type: 'string', defaultValue: "'bottom-start'" },
    { category: 'Attribute', api: 'max-collapse-tags', description: '多选折叠标签时最多显示的标签数量。', type: 'number', defaultValue: '1' },
    { category: 'Attribute', api: 'empty-values', description: '组件的空值配置。', type: 'array', defaultValue: '-' },
    { category: 'Attribute', api: 'value-on-clear', description: '清空选项后的值。', type: 'string | number | boolean | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'offset', description: '下拉面板偏移量。', type: 'number', defaultValue: '12' },
    { category: 'Attribute', api: 'show-arrow', description: '下拉菜单是否显示箭头。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'fit-input-width', description: '下拉框宽度是否与输入框一致。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'label', description: 'Option 的显示文本。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'value', description: 'Option 的值。', type: 'string | number | boolean | object', defaultValue: '-' },
    { category: 'Attribute', api: 'disabled', description: 'Option 是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Event', api: 'change', description: '选中值发生变化时触发。', type: '(value: any) => void', defaultValue: '-' },
    { category: 'Event', api: 'visible-change', description: '下拉框出现或隐藏时触发。', type: '(visible: boolean) => void', defaultValue: '-' },
    { category: 'Event', api: 'remove-tag', description: '多选模式下移除 tag 时触发。', type: '(tagValue: any) => void', defaultValue: '-' },
    { category: 'Event', api: 'clear', description: '点击清空按钮时触发。', type: '() => void', defaultValue: '-' },
    { category: 'Event', api: 'blur', description: '输入框失去焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
    { category: 'Event', api: 'focus', description: '输入框获得焦点时触发。', type: '(event: FocusEvent) => void', defaultValue: '-' },
  ],
  slider: [
    { category: 'Attribute', api: 'model-value', description: '选中项绑定值。', type: 'number | number[]', defaultValue: '0' },
    { category: 'Attribute', api: 'min', description: '最小值。', type: 'number', defaultValue: '0' },
    { category: 'Attribute', api: 'max', description: '最大值。', type: 'number', defaultValue: '100' },
    { category: 'Attribute', api: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'step', description: '步长。', type: 'number', defaultValue: '1' },
    { category: 'Attribute', api: 'show-input', description: '是否显示输入框，仅在非范围选择时有效。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'show-input-controls', description: '在显示输入框的情况下，是否显示输入框的控制按钮。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'size', description: '滑块包装器尺寸，垂直模式下该属性不可用。', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'input-size', description: '输入框尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "'default'" },
    { category: 'Attribute', api: 'show-stops', description: '是否显示间断点。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'show-tooltip', description: '是否显示 tooltip。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'format-tooltip', description: '格式化 tooltip message。', type: '(value: number) => string', defaultValue: '-' },
    { category: 'Attribute', api: 'range', description: '是否开启范围选择。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'vertical', description: '是否竖向模式。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'height', description: 'Slider 高度，竖向模式时必填。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'label', description: '屏幕阅读器标签。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'debounce', description: '输入时的去抖延迟，单位毫秒。', type: 'number', defaultValue: '300' },
    { category: 'Attribute', api: 'tooltip-class', description: 'tooltip 的自定义类名。', type: 'string', defaultValue: '-' },
    { category: 'Attribute', api: 'placement', description: 'tooltip 出现的位置。', type: 'string', defaultValue: "'top'" },
    { category: 'Attribute', api: 'marks', description: '标记，key 的类型必须为 number 且取值在闭区间 [min, max] 内。', type: 'object', defaultValue: '-' },
    { category: 'Attribute', api: 'validate-event', description: '输入时是否触发表单校验。', type: 'boolean', defaultValue: 'true' },
    { category: 'Event', api: 'change', description: '值改变时触发，使用鼠标拖曳时在松开鼠标后触发。', type: '(value: number | number[]) => void', defaultValue: '-' },
    { category: 'Event', api: 'input', description: '数据改变时触发，使用鼠标拖曳时实时触发。', type: '(value: number | number[]) => void', defaultValue: '-' },
  ],
  table: [
    { category: 'Attribute', api: 'data', description: '显示的数据。', type: 'array', defaultValue: '[]' },
    { category: 'Attribute', api: 'height', description: 'Table 的高度，默认为自动高度；设置为数字时单位为 px。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'max-height', description: 'Table 的最大高度，合法值为数字或单位为 px 的高度。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'stripe', description: '是否为斑马纹表格。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'border', description: '是否带有纵向边框。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'size', description: 'Table 的尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "''" },
    { category: 'Attribute', api: 'fit', description: '列的宽度是否自撑开。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'show-header', description: '是否显示表头。', type: 'boolean', defaultValue: 'true' },
    { category: 'Attribute', api: 'highlight-current-row', description: '是否高亮当前行。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'current-row-key', description: '当前行的 key，只写属性。', type: 'string | number', defaultValue: '-' },
    { category: 'Attribute', api: 'row-class-name', description: '行的 className 回调或固定类名。', type: 'string | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'row-style', description: '行的 style 回调或固定样式。', type: 'object | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'cell-class-name', description: '单元格的 className 回调或固定类名。', type: 'string | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'cell-style', description: '单元格的 style 回调或固定样式。', type: 'object | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'header-row-class-name', description: '表头行的 className 回调或固定类名。', type: 'string | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'header-row-style', description: '表头行的 style 回调或固定样式。', type: 'object | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'header-cell-class-name', description: '表头单元格的 className 回调或固定类名。', type: 'string | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'header-cell-style', description: '表头单元格的 style 回调或固定样式。', type: 'object | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'row-key', description: '行数据的 Key，用于优化渲染及树形数据。', type: 'string | Function', defaultValue: '-' },
    { category: 'Attribute', api: 'empty-text', description: '空数据时显示的文本内容，也可以通过 empty 插槽自定义。', type: 'string', defaultValue: "'暂无数据'" },
    { category: 'Attribute', api: 'default-expand-all', description: '是否默认展开所有行。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'expand-row-keys', description: '通过 row-key 控制展开行的 key 数组。', type: 'array', defaultValue: '-' },
    { category: 'Attribute', api: 'default-sort', description: '默认排序列的 prop 和顺序。', type: 'object', defaultValue: '-' },
    { category: 'Attribute', api: 'tooltip-effect', description: '溢出 Tooltip 的主题。', type: "'dark' | 'light'", defaultValue: "'dark'" },
    { category: 'Attribute', api: 'show-summary', description: '是否在表尾显示合计行。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'sum-text', description: '合计行第一列的文本。', type: 'string', defaultValue: "'合计'" },
    { category: 'Attribute', api: 'summary-method', description: '自定义合计计算方法。', type: 'Function', defaultValue: '-' },
    { category: 'Attribute', api: 'span-method', description: '合并行或列的计算方法。', type: 'Function', defaultValue: '-' },
    { category: 'Attribute', api: 'lazy', description: '是否懒加载子节点数据。', type: 'boolean', defaultValue: 'false' },
    { category: 'Attribute', api: 'load', description: '加载子节点数据的方法，lazy 为 true 时生效。', type: 'Function', defaultValue: '-' },
    { category: 'Attribute', api: 'tree-props', description: '渲染嵌套数据的配置项。', type: 'object', defaultValue: "{ hasChildren: 'hasChildren', children: 'children' }" },
    { category: 'Attribute', api: 'show-overflow-tooltip', description: '是否隐藏过长内容，并在悬停时以 Tooltip 显示。', type: 'boolean | object', defaultValue: 'false' },
    { category: 'Event', api: 'select', description: '手动勾选某一行 Checkbox 时触发。', type: '(selection, row) => void', defaultValue: '-' },
    { category: 'Event', api: 'select-all', description: '手动勾选全选 Checkbox 时触发。', type: '(selection) => void', defaultValue: '-' },
    { category: 'Event', api: 'selection-change', description: '表格选择项发生变化时触发。', type: '(selection) => void', defaultValue: '-' },
    { category: 'Event', api: 'cell-click', description: '单元格被点击时触发。', type: '(row, column, cell, event) => void', defaultValue: '-' },
    { category: 'Event', api: 'row-click', description: '某一行被点击时触发。', type: '(row, column, event) => void', defaultValue: '-' },
    { category: 'Event', api: 'sort-change', description: '排序条件发生变化时触发。', type: '({ column, prop, order }) => void', defaultValue: '-' },
    { category: 'Event', api: 'filter-change', description: '筛选条件发生变化时触发。', type: '(filters) => void', defaultValue: '-' },
    { category: 'Event', api: 'current-change', description: '当前行发生变化时触发。', type: '(currentRow, oldCurrentRow) => void', defaultValue: '-' },
    { category: 'Event', api: 'expand-change', description: '展开行状态变化时触发。', type: '(row, expanded) => void', defaultValue: '-' },
    { category: 'Slot', api: 'append', description: '插入至表格最后一行之后的内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'empty', description: '数据为空时显示的内容。', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'clearSelection', description: '清空用户选择。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'getSelectionRows', description: '返回当前选中的行。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'toggleRowSelection', description: '切换某一行的选中状态。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'toggleAllSelection', description: '切换全选状态。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'toggleRowExpansion', description: '切换某一行的展开状态。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setCurrentRow', description: '设置当前高亮行。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'clearSort', description: '清除排序条件。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'clearFilter', description: '清除筛选条件。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'doLayout', description: '重新计算表格布局。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'sort', description: '手动排序表格。', type: 'Function', defaultValue: '-' },
  ],
  description: [
    { component: 'ElDescriptions', category: 'Attribute', api: 'border', description: '是否带有边框。', type: 'boolean', defaultValue: 'false' },
    { component: 'ElDescriptions', category: 'Attribute', api: 'column', description: '一行 Descriptions Item 的数量。', type: 'number', defaultValue: '3' },
    { component: 'ElDescriptions', category: 'Attribute', api: 'direction', description: '排列方向。', type: "'vertical' | 'horizontal'", defaultValue: "'horizontal'" },
    { component: 'ElDescriptions', category: 'Attribute', api: 'size', description: '列表的尺寸。', type: "'large' | 'default' | 'small'", defaultValue: "''" },
    { component: 'ElDescriptions', category: 'Attribute', api: 'title', description: '标题文本，显示在左上方。', type: 'string', defaultValue: "''" },
    { component: 'ElDescriptions', category: 'Attribute', api: 'extra', description: '操作区文本，显示在右上方。', type: 'string', defaultValue: "''" },
    { component: 'ElDescriptions', category: 'Attribute', api: 'label-width', description: '标签宽度，不同列中的同名标签会采用最大值。', type: 'string | number', defaultValue: "''" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'label', description: '标签文本。', type: 'string', defaultValue: "''" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'width', description: '列的宽度。', type: 'string | number', defaultValue: "''" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'min-width', description: '列的最小宽度。', type: 'string | number', defaultValue: "''" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'span', description: '列占据的单元格数量。', type: 'number', defaultValue: '1' },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'rowspan', description: '列占据的行数。', type: 'number', defaultValue: '1' },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'align', description: '列内容的对齐方式。', type: "'left' | 'center' | 'right'", defaultValue: "'left'" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'label-align', description: '列标签的对齐方式。', type: "'left' | 'center' | 'right'", defaultValue: "''" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'class-name', description: '列内容的自定义类名。', type: 'string', defaultValue: "''" },
    { component: 'ElDescriptionsItem', category: 'Attribute', api: 'label-class-name', description: '列标签的自定义类名。', type: 'string', defaultValue: "''" },
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
  'input-number': 'VisInputNumber',
  'input-search-box': 'VisInputSearchBox',
  'input-textarea': 'VisInputTextarea',
  modal: 'VisModal',
  message: 'VisMessage',
  notification: 'VisNotification',
  pagination: 'VisPagination',
  popover: 'VisPopover',
  'progress-bar': 'VisProgressBar / VisProgressBarMultiple',
  'progress-circle': 'VisProgressCircle',
  badge: 'VisBadge',
  loading: 'VisLoading',
  markdown: 'VisMarkdown',
  tag: 'VisTag',
  breadcrumb: 'VisBreadcrumb',
  radio: 'VisRadio',
  rate: 'VisRate',
  checkbox: 'VisCheckbox',
  'date-picker': 'VisDatePicker',
  description: 'VisDescription / VisDescriptionItem / VisDescriptionTitle',
  divider: 'VisDivider',
  drawer: 'VisDrawer',
  dropdown: 'VisDropdown',
  'featured-icon': 'VisFeaturedIcon',
  form: 'VisForm / VisFormItem',
  'code-block': 'VisCodeBlock',
  'scroll-shadow': 'VisScrollShadow',
  segmented: 'VisSegmented',
  select: 'VisSelect',
  slider: 'VisSlider',
  table: 'VisTable',
  tabs: 'VisTabs',
  'time-picker': 'VisTimePicker',
  toggle: 'VisToggle',
  'toggle-button': 'VisToggleButton',
  tooltip: 'VisTooltip',
  'tree-view': 'VisTreeView',
  upload: 'VisUpload',
}

const elementComponentNames: Partial<Record<DemoPageId, string>> = {
  accordion: 'ElCollapse',
  alert: 'ElAlert',
  avatar: 'ElAvatar',
  button: 'ElButton',
  input: 'ElInput',
  'input-number': 'ElInputNumber',
  'input-search-box': 'ElInput',
  'input-textarea': 'ElInput',
  message: 'ElMessage',
  modal: 'ElDialog',
  notification: 'ElNotification',
  pagination: 'ElPagination',
  popover: 'ElPopover',
  'progress-bar': 'ElProgress',
  'progress-circle': 'ElProgress',
  tag: 'ElTag',
  breadcrumb: 'ElBreadcrumb',
  radio: 'ElRadio',
  rate: 'ElRate',
  checkbox: 'ElCheckbox',
  'date-picker': 'ElDatePicker',
  description: 'ElDescriptions / ElDescriptionsItem',
  divider: 'ElDivider',
  drawer: 'ElDrawer',
  dropdown: 'ElDropdown',
  form: 'ElForm / ElFormItem',
  'scroll-shadow': 'ElScrollbar',
  segmented: 'ElSegmented',
  select: 'ElSelect',
  slider: 'ElSlider',
  table: 'ElTable',
  tabs: 'ElTabs',
  'time-picker': 'ElTimePicker / ElTimeSelect',
  toggle: 'ElSwitch',
  'toggle-button': 'ElButton',
  tooltip: 'ElTooltip',
  'tree-view': 'ElTree',
  upload: 'ElUpload',
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
  'input-search-box': [
    {
      api: 'update:modelValue',
      description: '搜索关键字变化时触发，用于 v-model 双向绑定。',
      type: '(value: string) => void',
    },
    {
      api: 'clear',
      description: '点击清除按钮并清空搜索内容时触发。',
      type: '() => void',
    },
    {
      api: 'filter',
      description: '点击筛选图标按钮时触发。',
      type: '() => void',
    },
  ],
  'input-number': [
    {
      api: 'update:modelValue',
      description: '数字值变化时触发，用于 v-model 双向绑定。',
      type: '(value: number) => void',
    },
    {
      api: 'change',
      description: '点击步进按钮或失焦提交数值时触发。',
      type: '(value: number) => void',
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
  'input-textarea': [
    {
      api: 'update:modelValue',
      description: '文本内容变化时触发，用于 v-model 双向绑定。',
      type: '(value: string) => void',
    },
    {
      api: 'focus',
      description: '文本域获得焦点时触发。',
      type: '(event: FocusEvent) => void',
    },
    {
      api: 'blur',
      description: '文本域失去焦点时触发。',
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
  markdown: [],
  message: [
    {
      api: 'update:modelValue',
      description: '显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'close',
      description: '自动关闭或外部关闭时触发。',
      type: '() => void',
    },
    {
      api: 'after-leave',
      description: '离场过渡结束后触发。',
      type: '() => void',
    },
  ],
  notification: [
    {
      api: 'update:modelValue',
      description: '显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'close',
      description: '点击关闭按钮或自动关闭时触发。',
      type: '() => void',
    },
    {
      api: 'action-primary',
      description: '点击默认主操作“查看”时触发。',
      type: '() => void',
    },
    {
      api: 'action-secondary',
      description: '点击默认次操作“忽略”时触发。',
      type: '() => void',
    },
  ],
  pagination: [
    {
      api: 'update:modelValue',
      description: '当前页变化时触发，用于 v-model 双向绑定。',
      type: '(value: number) => void',
    },
    {
      api: 'change',
      description: '当前页变化时触发。',
      type: '(value: number) => void',
    },
    {
      api: 'update:pageSize',
      description: '每页条数变化时触发，用于 v-model:page-size 双向绑定。',
      type: '(value: number) => void',
    },
    {
      api: 'pageSizeChange',
      description: '每页条数变化时触发。',
      type: '(value: number) => void',
    },
  ],
  popover: [
    {
      api: 'update:modelValue',
      description: '显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'show',
      description: '气泡框打开时触发。',
      type: '() => void',
    },
    {
      api: 'hide',
      description: '气泡框关闭时触发。',
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
      api: 'close',
      description: '点击右上角关闭按钮时触发。',
      type: '() => void',
    },
  ],
  'progress-bar': [],
  'progress-circle': [],
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
  rate: [
    {
      api: 'update:modelValue',
      description: '评分值变化时触发，用于 v-model 双向绑定。',
      type: '(value: number) => void',
    },
    {
      api: 'change',
      description: '用户点击评分项后触发。',
      type: '(value: number) => void',
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
  'time-picker': [
    {
      api: 'update:modelValue',
      description: '时间值变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisTimePickerValue) => void',
    },
    {
      api: 'change',
      description: '确认时间、选择快捷时间或清空后触发。',
      type: '(value: VisTimePickerValue) => void',
    },
    {
      api: 'update:open',
      description: '面板展开状态变化时触发，可用于受控 open。',
      type: '(value: boolean) => void',
    },
    {
      api: 'clear',
      description: '用户点击清除按钮时触发。',
      type: '() => void',
    },
  ],
  description: [
    {
      api: 'update:collapsed',
      description: '折叠状态变化时触发，用于 v-model:collapsed。',
      type: '(value: boolean) => void',
    },
    {
      api: 'toggle',
      description: '点击标题折叠按钮后触发，返回最新折叠状态。',
      type: '(value: boolean) => void',
    },
  ],
  divider: [],
  'featured-icon': [],
  form: [
    {
      api: 'submit',
      elementApi: 'native submit',
      description: '默认确认按钮或原生提交行为触发。',
      type: '(event: Event) => void',
    },
    {
      api: 'cancel',
      description: '点击默认取消按钮时触发。',
      type: '() => void',
    },
    {
      api: 'validate',
      elementApi: 'validate',
      description: '任一表单项完成校验后触发。',
      type: '(prop, isValid, message) => void',
    },
  ],
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
  segmented: [
    {
      api: 'update:modelValue',
      description: '选中分段变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisSegmentedValue) => void',
    },
    {
      api: 'change',
      description: '用户选择分段时触发，返回选中值和选项数据。',
      type: '(value: VisSegmentedValue, option: VisSegmentedOption) => void',
    },
  ],
  select: [
    {
      api: 'update:modelValue',
      description: '选中值变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisSelectModelValue | undefined) => void',
    },
    {
      api: 'update:open',
      description: '展开状态变化时触发，用于 v-model:open 受控模式。',
      type: '(value: boolean) => void',
    },
    {
      api: 'update:searchValue',
      description: '搜索输入变化时触发，用于 v-model:searchValue 受控模式。',
      type: '(value: string) => void',
    },
    {
      api: 'change',
      description: '用户选择或取消选择选项后触发。',
      type: '(value: VisSelectModelValue | undefined) => void',
    },
    {
      api: 'focus',
      description: '选择器或内部搜索输入获得焦点时触发。',
      type: '(event: FocusEvent) => void',
    },
    {
      api: 'blur',
      description: '焦点离开整个选择器时触发。',
      type: '(event: FocusEvent) => void',
    },
  ],
  slider: [
    {
      api: 'update:modelValue',
      description: '滑块值变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisSliderValue) => void',
    },
    {
      api: 'change',
      description: '点击轨道或拖动滑块改变数值时触发。',
      type: '(value: VisSliderValue) => void',
    },
  ],
  table: [
    {
      api: 'selection-change',
      description: '选择项变化时触发，返回当前选中的行数据。',
      type: '(selection: VisTableRowData[]) => void',
    },
    {
      api: 'sort-change',
      description: '排序条件变化时触发，返回列、字段和排序方向。',
      type: '(sort: VisTableSortChange) => void',
    },
    {
      api: 'row-click',
      description: '点击数据行时触发。',
      type: '(row, column, event) => void',
    },
    {
      api: 'active-change',
      description: '点击有效数据行后触发，返回行 key 和行数据，可用于控制 activeRowKey。',
      type: '(key: VisTableRowKey, row: VisTableRowData) => void',
    },
  ],
  tabs: [
    {
      api: 'update:modelValue',
      description: '激活标签变化时触发，用于 v-model 双向绑定。',
      type: '(value: VisTabsValue) => void',
    },
    {
      api: 'change',
      description: '用户切换标签时触发，返回激活值和标签数据。',
      type: '(value: VisTabsValue, item: VisTabsItem) => void',
    },
    {
      api: 'action',
      description: '点击默认右侧操作按钮时触发。',
      type: '(event: MouseEvent) => void',
    },
  ],
  toggle: [
    {
      api: 'update:modelValue',
      description: '开关状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'change',
      description: '用户切换开关时触发，返回 checked 和表单 value。',
      type: '(payload: VisToggleChangePayload) => void',
    },
  ],
  'toggle-button': [
    {
      api: 'update:modelValue',
      description: '按钮选中状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'change',
      description: '用户切换按钮状态时触发。',
      type: '(value: boolean) => void',
    },
  ],
  tooltip: [
    {
      api: 'update:modelValue',
      description: '显示状态变化时触发，用于 v-model 双向绑定。',
      type: '(value: boolean) => void',
    },
    {
      api: 'show',
      description: 'tooltip 打开时触发。',
      type: '() => void',
    },
    {
      api: 'hide',
      description: 'tooltip 关闭时触发。',
      type: '() => void',
    },
  ],
  'tree-view': [
    {
      api: 'update:expandedKeys',
      description: '展开节点变化时触发，用于 v-model:expandedKeys。',
      type: '(value: VisTreeViewKey[]) => void',
    },
    {
      api: 'update:selectedKey',
      description: '选中节点变化时触发，用于 v-model:selectedKey。',
      type: '(value: VisTreeViewKey | null) => void',
    },
    {
      api: 'update:checkedKeys',
      description: '勾选节点变化时触发，用于 v-model:checkedKeys。',
      type: '(value: VisTreeViewKey[]) => void',
    },
    {
      api: 'expand',
      description: '节点展开或收起时触发。',
      type: '(payload: { key: VisTreeViewKey; expanded: boolean; item: VisTreeViewItem }) => void',
    },
    {
      api: 'select',
      description: '点击可用节点时触发。',
      type: '(payload: { key: VisTreeViewKey; item: VisTreeViewItem }) => void',
    },
    {
      api: 'check',
      description: '勾选或取消勾选节点时触发。',
      type: '(payload: { key: VisTreeViewKey; checked: boolean; item: VisTreeViewItem }) => void',
    },
    {
      api: 'action-click',
      description: '点击节点右侧更多操作按钮时触发。',
      type: '(payload: { key: VisTreeViewKey; item: VisTreeViewItem; nativeEvent: MouseEvent }) => void',
    },
  ],
  upload: [
    {
      api: 'update:modelValue',
      description: '文件列表变化时触发，用于 v-model 双向绑定。',
      type: '(files: VisUploadFileItem[]) => void',
    },
    {
      api: 'change',
      description: '添加、移除文件后触发。',
      type: '(files: VisUploadFileItem[]) => void',
    },
    {
      api: 'remove',
      description: '点击删除文件按钮时触发。',
      type: '(file: VisUploadFileItem) => void',
    },
    {
      api: 'download',
      description: '点击默认下载按钮时触发。',
      type: '(file: VisUploadFileItem) => void',
    },
    {
      api: 'retry',
      description: '点击危险状态文件的重试按钮时触发。',
      type: '(file: VisUploadFileItem) => void',
    },
  ],
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
  'input-search-box': [
    { category: 'Slot', api: 'prefix', description: 'Element Input 搜索图标可参考 prefix slot 实现。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'suffix', description: 'Element Input 清除或筛选图标可参考 suffix slot 实现。', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'focus', description: '使 input 获取焦点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'blur', description: '使 input 失去焦点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'clear', description: '清除 input 值。', type: 'Function', defaultValue: '-' },
  ],
  'input-number': [
    { category: 'Expose', api: 'focus', description: '使 input 获取焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'blur', description: '使 input 失去焦点', type: 'Function', defaultValue: '-' },
  ],
  'input-textarea': [
    { category: 'Slot', api: 'prefix', description: '输入框头部内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'suffix', description: '输入框尾部内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'prepend', description: '输入框前置内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'append', description: '输入框后置内容，只对非 textarea 有效', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'blur', description: '使 textarea 失去焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'focus', description: '使 textarea 获取焦点', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'ref', description: 'HTML textarea 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'resizeTextarea', description: '改变 textarea 大小', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'textarea', description: 'HTML textarea 元素', type: 'object', defaultValue: '-' },
    { category: 'Expose', api: 'textareaStyle', description: 'textarea 的样式', type: 'object', defaultValue: '-' },
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
  markdown: [
    { category: 'Slot', api: 'default', description: 'Markdown 文本内容；content 未传时作为输入源。', type: 'slot', defaultValue: '-' },
  ],
  message: [
    { category: 'Slot', api: 'default', description: '自定义消息内容。', type: 'slot', defaultValue: '-' },
  ],
  notification: [],
  pagination: [],
  popover: [
    { category: 'Slot', api: 'default', description: 'Popover 触发元素内容', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'reference', description: 'Popover 触发元素内容；Element Plus 原始 slot 名称', type: 'slot', defaultValue: '-' },
  ],
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
  rate: [],
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
  'time-picker': [
    { category: 'Expose', api: 'focus', description: '使输入框获取焦点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'blur', description: '使输入框失去焦点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleOpen', description: '打开时间选择面板。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleClose', description: '关闭时间选择面板。', type: 'Function', defaultValue: '-' },
  ],
  description: [
    { component: 'ElDescriptions', category: 'Slot', api: 'default', description: '自定义描述列表内容，通常放置 Descriptions Item。', type: 'slot', defaultValue: '-' },
    { component: 'ElDescriptions', category: 'Slot', api: 'title', description: '自定义标题内容。', type: 'slot', defaultValue: '-' },
    { component: 'ElDescriptions', category: 'Slot', api: 'extra', description: '自定义操作区内容。', type: 'slot', defaultValue: '-' },
    { component: 'ElDescriptionsItem', category: 'Slot', api: 'default', description: '自定义当前描述项的值。', type: 'slot', defaultValue: '-' },
    { component: 'ElDescriptionsItem', category: 'Slot', api: 'label', description: '自定义当前描述项的标签。', type: 'slot', defaultValue: '-' },
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
  form: [
    { component: 'ElForm', category: 'Event', api: 'validate', description: '任一表单项被校验后触发。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Slot', api: 'default', description: '自定义表单内容，通常放置 FormItem。', type: 'slot', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'validate', description: '验证整个表单；接收回调或返回 Promise。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'validateField', description: '验证指定字段。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'resetFields', description: '重置指定字段并移除校验结果。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'scrollToField', description: '滚动到指定字段。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'clearValidate', description: '清理指定字段的验证信息。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'fields', description: '获取所有字段的 context。', type: 'array', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'getField', description: '获取指定字段的 context。', type: 'Function', defaultValue: '-' },
    { component: 'ElForm', category: 'Expose', api: 'setInitialValues', description: '设置 resetFields 使用的表单初始值。', type: 'Function', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Slot', api: 'default', description: '表单项的字段内容。', type: 'slot', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Slot', api: 'label', description: '自定义标签内容。', type: 'slot', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Slot', api: 'error', description: '自定义验证错误信息内容。', type: 'slot', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'size', description: '表单项大小。', type: 'object', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'validateMessage', description: '当前校验消息。', type: 'object', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'validateState', description: '当前校验状态。', type: 'object', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'validate', description: '验证当前表单项。', type: 'Function', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'resetField', description: '重置当前字段并移除校验结果。', type: 'Function', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'clearValidate', description: '移除当前字段的校验结果。', type: 'Function', defaultValue: '-' },
    { component: 'ElFormItem', category: 'Expose', api: 'setInitialValue', description: '设置当前字段重置时使用的初始值。', type: 'Function', defaultValue: '-' },
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
  segmented: [
    { category: 'Slot', api: 'default', description: 'Segmented 自定义选项内容。', type: 'slot', defaultValue: '-' },
  ],
  'progress-bar': [],
  'progress-circle': [],
  select: [
    { category: 'Slot', api: 'default', description: 'Option 默认内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'header', description: 'Select 下拉列表顶部内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'footer', description: 'Select 下拉列表底部内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'label', description: '自定义 Option 标签内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'loading', description: '自定义远程加载中内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'empty', description: '自定义无选项内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'prefix', description: 'Select 输入框头部内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'tag', description: '多选时自定义标签内容。', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'focus', description: '使 Select 获得焦点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'blur', description: '使 Select 失去焦点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'selectedLabel', description: '当前选中项的文本。', type: 'object', defaultValue: '-' },
  ],
  slider: [],
  table: [],
  tabs: [
    { category: 'Slot', api: 'default', description: 'Tabs 默认内容，通常放置 Tab Pane。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'label', description: 'Tab Pane 自定义标题内容。', type: 'slot', defaultValue: '-' },
  ],
  toggle: [],
  'toggle-button': [
    { category: 'Slot', api: 'default', description: '按钮文本内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'icon', description: '仅图标模式下的图标内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'prefix', description: '前置图标内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'suffix', description: '后置图标内容。', type: 'slot', defaultValue: '-' },
  ],
  tooltip: [
    { category: 'Slot', api: 'default', description: 'Tooltip 触发元素内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'content', description: 'Tooltip 内容。', type: 'slot', defaultValue: '-' },
  ],
  'tree-view': [
    { category: 'Slot', api: 'default', description: 'Tree 节点内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'empty', description: '无数据时的内容。', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'filter', description: '对树节点进行筛选操作。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'updateKeyChildren', description: '通过 keys 设置节点子元素，使用此方法必须设置 node-key。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'getCheckedNodes', description: '返回当前被选中的节点组成的数组。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setCheckedKeys', description: '通过 key 数组设置勾选节点。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'getCurrentKey', description: '返回当前被选中节点的 key。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'setCurrentKey', description: '通过 key 设置当前选中节点。', type: 'Function', defaultValue: '-' },
  ],
  upload: [
    { category: 'Slot', api: 'default', description: '触发上传的内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'trigger', description: '触发文件选择框的内容。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'tip', description: '提示说明文字。', type: 'slot', defaultValue: '-' },
    { category: 'Slot', api: 'file', description: '自定义文件列表内容。', type: 'slot', defaultValue: '-' },
    { category: 'Expose', api: 'abort', description: '取消上传请求。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'submit', description: '手动上传文件列表。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'clearFiles', description: '清空已上传的文件列表。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleStart', description: '手动选择文件。', type: 'Function', defaultValue: '-' },
    { category: 'Expose', api: 'handleRemove', description: '手动移除文件。', type: 'Function', defaultValue: '-' },
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
  if (activePage.value === 'description') {
    const rows = apiTables.description
    return [
      createSection('VisDescription Attributes', visionAttributeColumns, toVisionAttributeRows(rows.filter((row) => row.component === 'VisDescription'))),
      createSection('VisDescriptionItem Attributes', visionAttributeColumns, toVisionAttributeRows(rows.filter((row) => row.component === 'VisDescriptionItem'))),
      createSection('VisDescriptionTitle Attributes', visionAttributeColumns, toVisionAttributeRows(rows.filter((row) => row.component === 'VisDescriptionTitle'))),
      createSection('VisDescription Events', eventColumns, visionEventTables.description),
    ].filter((section): section is ApiTableSection => Boolean(section))
  }

  if (activePage.value === 'form') {
    const rows = apiTables.form
    return [
      createSection('VisForm Attributes', visionAttributeColumns, toVisionAttributeRows(rows.filter((row) => row.component === 'VisForm'))),
      createSection('VisFormItem Attributes', visionAttributeColumns, toVisionAttributeRows(rows.filter((row) => row.component === 'VisFormItem'))),
      createSection('VisForm Events', eventColumns, visionEventTables.form),
    ].filter((section): section is ApiTableSection => Boolean(section))
  }

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
  if (activePage.value === 'description') {
    const descriptionRows = rows.filter((row) => row.component === 'ElDescriptions')
    const itemRows = rows.filter((row) => row.component === 'ElDescriptionsItem')

    return [
      createSection('ElDescriptions Attributes', apiColumns, toElementRows(descriptionRows.filter((row) => row.category === 'Attribute'))),
      createSection('ElDescriptions Slots', slotColumns, toElementRows(descriptionRows.filter((row) => row.category === 'Slot'))),
      createSection('ElDescriptionsItem Attributes', apiColumns, toElementRows(itemRows.filter((row) => row.category === 'Attribute'))),
      createSection('ElDescriptionsItem Slots', slotColumns, toElementRows(itemRows.filter((row) => row.category === 'Slot'))),
    ].filter((section): section is ApiTableSection => Boolean(section))
  }

  if (activePage.value === 'form') {
    const formRows = rows.filter((row) => row.component === 'ElForm')
    const itemRows = rows.filter((row) => row.component === 'ElFormItem')

    return [
      createSection('ElForm Attributes', apiColumns, toElementRows(formRows.filter((row) => row.category === 'Attribute'))),
      createSection('ElForm Events', eventColumns, toElementRows(formRows.filter((row) => row.category === 'Event'))),
      createSection('ElForm Slots', slotColumns, toElementRows(formRows.filter((row) => row.category === 'Slot'))),
      createSection('ElForm Exposes', exposeColumns, toElementRows(formRows.filter((row) => row.category === 'Expose'))),
      createSection('ElFormItem Attributes', apiColumns, toElementRows(itemRows.filter((row) => row.category === 'Attribute'))),
      createSection('ElFormItem Slots', slotColumns, toElementRows(itemRows.filter((row) => row.category === 'Slot'))),
      createSection('ElFormItem Exposes', exposeColumns, toElementRows(itemRows.filter((row) => row.category === 'Expose'))),
    ].filter((section): section is ApiTableSection => Boolean(section))
  }

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

async function submitFormDemo(): Promise<void> {
  try {
    const valid = await formDemoRef.value?.validate()
    formDemoStatus.value = valid ? '表单校验通过' : '请检查表单内容'
  } catch {
    formDemoStatus.value = '请检查表单内容'
  }
}

function resetFormDemo(): void {
  formDemoRef.value?.resetFields()
  formDemoStatus.value = ''
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

              <div v-else-if="activePage === 'form'" class="form-demo">
                <section class="form-demo__section" aria-labelledby="form-columns-title">
                  <h4 id="form-columns-title" class="ld-heading-h4">Two columns</h4>
                  <VisForm
                    ref="formDemoRef"
                    :model="formDemoModel"
                    :rules="formDemoRules"
                    :column="2"
                    button
                    @submit="submitFormDemo"
                    @cancel="resetFormDemo"
                  >
                    <VisFormItem
                      label="项目名称"
                      prop="name"
                      type="input"
                      required
                      tooltip
                      tooltip-text="用于识别该项目的名称"
                    >
                      <VisInput v-model="formDemoModel.name" aria-label="项目名称" />
                    </VisFormItem>

                    <VisFormItem label="访问密码" prop="password" type="password" optional>
                      <VisInput v-model="formDemoModel.password" type="password" placeholder="请输入密码" aria-label="访问密码" />
                    </VisFormItem>

                    <VisFormItem label="所属区域" prop="region" type="select" required>
                      <VisSelect v-model="formDemoModel.region" :options="formRegionOptions" placeholder="请选择" />
                    </VisFormItem>

                    <VisFormItem label="数量" prop="quantity" type="input_number">
                      <VisInputNumber v-model="formDemoModel.quantity" prefix-icon prefix-icon-name="currency-yen-circle" />
                    </VisFormItem>

                    <VisFormItem label="活动类型" prop="categories" type="checkbox">
                      <VisCheckboxGroup v-model="formDemoModel.categories" :options="formCategoryOptions" />
                    </VisFormItem>

                    <VisFormItem label="活动渠道" prop="channel" type="radio">
                      <VisRadioGroup v-model="formDemoModel.channel" :options="formChannelOptions" />
                    </VisFormItem>

                    <VisFormItem label="启用项目" prop="enabled" type="switch">
                      <VisToggle v-model="formDemoModel.enabled" aria-label="启用项目" />
                    </VisFormItem>

                    <VisFormItem label="评分" prop="score" type="rate">
                      <VisRate v-model="formDemoModel.score" />
                    </VisFormItem>

                    <VisFormItem label="开始日期" prop="date" type="date_picker">
                      <VisDatePicker v-model="formDemoModel.date" placeholder="请选择日期" />
                    </VisFormItem>

                    <VisFormItem label="开始时间" prop="time" type="time_picker">
                      <VisTimePicker v-model="formDemoModel.time" placeholder="请选择时间" />
                    </VisFormItem>

                    <VisFormItem label="项目说明" prop="description" type="textarea" optional :span="2">
                      <VisInputTextarea
                        v-model="formDemoModel.description"
                        placeholder="请输入文字"
                        :max-length="200"
                        text-count
                      />
                    </VisFormItem>

                    <VisFormItem label="附件" prop="files" type="upload" :span="2">
                      <VisUpload
                        v-model="formDemoModel.files"
                        type="button"
                        button-text="点击上传"
                        accept=".jpg,.jpeg,.png"
                      />
                    </VisFormItem>
                  </VisForm>
                  <p v-if="formDemoStatus" class="form-demo__status" role="status">{{ formDemoStatus }}</p>
                </section>

                <section class="form-demo__section" aria-labelledby="form-left-title">
                  <h4 id="form-left-title" class="ld-heading-h4">Align left</h4>
                  <VisForm :model="formDemoModel" align-left>
                    <VisFormItem label="输入框" type="input" description>
                      <VisInput v-model="formDemoModel.name" aria-label="输入框" />
                    </VisFormItem>
                    <VisFormItem label="选择器" type="select">
                      <VisSelect v-model="formDemoModel.region" :options="formRegionOptions" placeholder="请选择" />
                    </VisFormItem>
                    <VisFormItem label="复选框" type="checkbox">
                      <VisCheckboxGroup v-model="formDemoModel.categories" :options="formCategoryOptions" />
                    </VisFormItem>
                  </VisForm>
                </section>
              </div>

              <div v-else-if="activePage === 'input'" class="input-demo">
                <VisInput v-model="inputValue" prefix suffix :max-length="20" />
                <VisInput state="danger" placeholder="危险态" :max-length="20" />
                <VisInput
                  :model-value="inputValue"
                  type="password"
                  prefix
                  prefix-icon="lock-01"
                  suffix
                  suffix-icon="eye-off"
                  aria-label="密码输入框"
                />
                <VisInput addon-left addon-right addon-left-text="https://" addon-right-text=".com" />
              </div>

              <div v-else-if="activePage === 'input-number'" class="input-number-demo">
                <div class="input-number-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="InputNumber position">
                    <button
                      v-for="position in inputNumberPositions"
                      :key="position"
                      type="button"
                      :class="{ active: inputNumberPosition === position }"
                      @click="inputNumberPosition = position"
                    >
                      {{ position }}
                    </button>
                  </div>
                  <div class="avatar-demo__control-row" aria-label="InputNumber state">
                    <button
                      v-for="state in inputNumberStates"
                      :key="state"
                      type="button"
                      :class="{ active: inputNumberState === state }"
                      @click="inputNumberState = state"
                    >
                      {{ state }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputNumberDisabled" type="checkbox">
                    <span>Disabled</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputNumberPrefix" type="checkbox">
                    <span>Prefix</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputNumberSuffix" type="checkbox">
                    <span>Suffix</span>
                  </label>
                </div>

                <VisInputNumber
                  v-model="inputNumberValue"
                  :position="inputNumberPosition"
                  :state="inputNumberState"
                  :disabled="inputNumberDisabled"
                  :prefix-icon="inputNumberPrefix"
                  :suffix-icon="inputNumberSuffix"
                />

                <div class="input-number-demo__matrix">
                  <div v-for="position in inputNumberPositions" :key="position" class="input-number-demo__row">
                    <span class="input-number-demo__label">{{ position }}</span>
                    <div class="input-number-demo__items">
                      <VisInputNumber :position="position" :model-value="0" />
                      <VisInputNumber :position="position" prefix-icon :model-value="0" />
                      <VisInputNumber :position="position" suffix-icon :model-value="0" />
                      <VisInputNumber :position="position" prefix-icon suffix-icon :model-value="0" />
                    </div>
                  </div>
                  <div class="input-number-demo__row">
                    <span class="input-number-demo__label">state</span>
                    <div class="input-number-demo__items">
                      <VisInputNumber :model-value="0" state="hover" />
                      <VisInputNumber :model-value="0" state="focus" />
                      <VisInputNumber :model-value="0" state="danger" />
                      <VisInputNumber :model-value="0" disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'input-search-box'" class="input-search-box-demo">
                <div class="input-search-box-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="InputSearchBox state">
                    <button
                      v-for="state in inputSearchStates"
                      :key="state"
                      type="button"
                      :class="{ active: inputSearchState === state }"
                      @click="inputSearchState = state"
                    >
                      {{ state }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputSearchSimple" type="checkbox">
                    <span>Simple</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputSearchFilter" type="checkbox">
                    <span>Filter</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputSearchDisabled" type="checkbox">
                    <span>Disabled</span>
                  </label>
                </div>

                <VisInputSearchBox
                  v-model="inputSearchValue"
                  :state="inputSearchState"
                  :simple="inputSearchSimple"
                  :filter="inputSearchFilter"
                  :disabled="inputSearchDisabled"
                />

                <div class="input-search-box-demo__matrix">
                  <VisInputSearchBox />
                  <VisInputSearchBox filled />
                  <VisInputSearchBox state="hover" />
                  <VisInputSearchBox state="hover" filled />
                  <VisInputSearchBox state="focus" />
                  <VisInputSearchBox state="focus" filled />
                  <VisInputSearchBox disabled />
                  <VisInputSearchBox disabled filled />
                  <VisInputSearchBox simple />
                  <VisInputSearchBox simple filled />
                  <VisInputSearchBox simple state="hover" />
                  <VisInputSearchBox simple state="hover" filled />
                  <VisInputSearchBox simple state="focus" />
                  <VisInputSearchBox simple state="focus" filled />
                  <VisInputSearchBox simple disabled />
                  <VisInputSearchBox simple disabled filled />
                </div>
              </div>

              <div v-else-if="activePage === 'input-textarea'" class="input-textarea-demo">
                <div class="input-textarea-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="InputTextarea state">
                    <button
                      v-for="state in inputTextareaStates"
                      :key="state"
                      type="button"
                      :class="{ active: inputTextareaState === state }"
                      @click="inputTextareaState = state"
                    >
                      {{ state }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputTextareaFilled" type="checkbox">
                    <span>Filled</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="inputTextareaDisabled" type="checkbox">
                    <span>Disabled</span>
                  </label>
                </div>

                <VisInputTextarea
                  v-model="inputTextareaValue"
                  :state="inputTextareaState"
                  :filled="inputTextareaFilled"
                  :disabled="inputTextareaDisabled"
                />

                <div class="input-textarea-demo__matrix">
                  <VisInputTextarea />
                  <VisInputTextarea filled />
                  <VisInputTextarea state="hover" />
                  <VisInputTextarea state="focus" filled />
                  <VisInputTextarea state="danger" />
                  <VisInputTextarea state="danger" filled />
                  <VisInputTextarea disabled />
                  <VisInputTextarea disabled filled />
                </div>
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

              <div v-else-if="activePage === 'markdown'" class="markdown-demo">
                <VisMarkdown :content="markdownContent" open-links-in-new-tab />
              </div>

              <div v-else-if="activePage === 'message'" class="message-demo">
                <div class="message-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Message type">
                    <button
                      v-for="type in messageTypes"
                      :key="type"
                      type="button"
                      :class="{ active: messageType === type }"
                      @click="messageType = type; messageVisible = true"
                    >
                      {{ type }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="messageAutoClose" type="checkbox">
                    <span>Auto close</span>
                  </label>
                </div>

                <VisMessage
                  v-model="messageVisible"
                  :type="messageType"
                  :auto-close="messageAutoClose"
                  text="这里是提示内容"
                />

                <div class="message-demo__row">
                  <VisMessage v-for="type in messageTypes" :key="type" :type="type" text="这里是提示内容" />
                </div>
              </div>

              <div v-else-if="activePage === 'notification'" class="notification-demo">
                <div class="notification-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Notification type">
                    <button
                      v-for="type in notificationTypes"
                      :key="type"
                      type="button"
                      :class="{ active: notificationType === type }"
                      @click="notificationType = type; notificationVisible = true"
                    >
                      {{ type }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="notificationActions" type="checkbox">
                    <span>Actions</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="notificationCloseable" type="checkbox">
                    <span>Closeable</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="notificationAutoClose" type="checkbox">
                    <span>Auto close</span>
                  </label>
                </div>

                <VisNotification
                  v-model="notificationVisible"
                  :type="notificationType"
                  :actions="notificationActions"
                  :closeable="notificationCloseable"
                  :auto-close="notificationAutoClose"
                />

                <div class="notification-demo__grid">
                  <VisNotification
                    v-for="type in notificationTypes"
                    :key="type"
                    :type="type"
                    :auto-close="false"
                  />
                </div>
              </div>

              <div v-else-if="activePage === 'pagination'" class="pagination-demo">
                <div class="pagination-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Pagination size">
                    <button
                      v-for="size in paginationSizes"
                      :key="size"
                      type="button"
                      :class="{ active: paginationSize === size }"
                      @click="paginationSize = size"
                    >
                      {{ size }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="paginationSimple" type="checkbox">
                    <span>Simple</span>
                  </label>
                </div>

                <div class="pagination-demo__showcase">
                  <VisPagination
                    v-model="paginationPage"
                    v-model:page-size="paginationPageSize"
                    :size="paginationSize"
                    :simple="paginationSimple"
                    :total="196"
                    :goto="!paginationSimple"
                  />
                </div>

                <div class="pagination-demo__stack">
                  <VisPagination v-model="paginationPage" v-model:page-size="paginationPageSize" :total="196" />
                  <VisPagination v-model="paginationSmallPage" :total="196" size="sm" />
                  <VisPagination v-model="paginationSimplePage" :total="196" simple :goto="false" />
                  <VisPagination v-model="paginationSmallPage" :total="196" size="sm" simple :goto="false" />
                  <VisPagination v-model="paginationPage" :total="196" :quantity="false" :goto="false" />
                  <VisPagination v-model="paginationPage" :total="196" :count="false" :quantity="false" :goto="false" />
                </div>
              </div>

              <div v-else-if="activePage === 'popover'" class="popover-demo">
                <div class="popover-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Popover position">
                    <button
                      v-for="position in popoverPositions"
                      :key="position"
                      type="button"
                      :class="{ active: popoverPosition === position }"
                      @click="popoverPosition = position"
                    >
                      {{ popoverPositionLabel(position) }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="popoverIcon" type="checkbox">
                    <span>Icon</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="popoverActions" type="checkbox">
                    <span>Actions</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="popoverCloseButton" type="checkbox">
                    <span>Close</span>
                  </label>
                </div>

                <div class="popover-demo__showcase">
                  <VisPopover
                    :position="popoverPosition"
                    :icon="popoverIcon"
                    :actions="popoverActions"
                    :close-button="popoverCloseButton"
                  >
                    <VisButton variant="secondary">Open popover</VisButton>
                  </VisPopover>
                </div>

                <div class="popover-demo__position-grid">
                  <div
                    v-for="position in popoverPositions"
                    :key="position"
                    class="popover-demo__position-item"
                  >
                    <VisPopover
                      :position="position"
                      trigger="manual"
                      :model-value="true"
                      close-button
                    >
                      <VisButton variant="secondary" size="sm">{{ popoverPositionLabel(position) }}</VisButton>
                    </VisPopover>
                  </div>
                </div>

                <div class="popover-demo__variant-grid">
                  <VisPopover trigger="manual" :model-value="true" position="top">
                    <VisButton variant="secondary" size="sm">Basic</VisButton>
                  </VisPopover>
                  <VisPopover trigger="manual" :model-value="true" position="top" icon close-button>
                    <VisButton variant="secondary" size="sm">Icon</VisButton>
                  </VisPopover>
                  <VisPopover trigger="manual" :model-value="true" position="top" actions>
                    <VisButton variant="secondary" size="sm">Actions</VisButton>
                  </VisPopover>
                  <VisPopover trigger="manual" :model-value="true" position="top" :show-title="false" content="Only content">
                    <VisButton variant="secondary" size="sm">No title</VisButton>
                  </VisPopover>
                </div>
              </div>

              <div v-else-if="activePage === 'progress-bar'" class="progress-bar-demo">
                <div class="progress-bar-demo__controls">
                  <label class="progress-demo__range">
                    <span>Value {{ progressBarValue }}%</span>
                    <input v-model.number="progressBarValue" type="range" min="0" max="100" step="1">
                  </label>
                  <div class="avatar-demo__control-row" aria-label="ProgressBar label">
                    <button
                      v-for="label in progressBarLabels"
                      :key="label"
                      type="button"
                      :class="{ active: progressBarLabel === label }"
                      @click="progressBarLabel = label"
                    >
                      {{ label }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="progressBarLoading" type="checkbox">
                    <span>Loading</span>
                  </label>
                </div>

                <div class="progress-bar-demo__panel">
                  <VisProgressBar
                    :value="progressBarValue"
                    :label="progressBarLabel"
                    :loading="progressBarLoading"
                  />
                </div>

                <div class="progress-bar-demo__stack">
                  <VisProgressBar
                    v-for="value in progressValues"
                    :key="`bar-${value}`"
                    :value="value"
                    label="right"
                  />
                  <VisProgressBar status="success" label="right" />
                  <VisProgressBar status="danger" label="right" />
                </div>

                <div class="progress-bar-demo__stack">
                  <VisProgressBar :value="50" label="none" />
                  <VisProgressBar :value="50" label="right" />
                  <VisProgressBar :value="50" label="bottom" />
                </div>

                <div class="progress-bar-demo__stack">
                  <VisProgressBarMultiple :segments="progressBarSegments" />
                  <VisProgressBarMultiple :segments="progressBarFullSegments" />
                </div>
              </div>

              <div v-else-if="activePage === 'progress-circle'" class="progress-circle-demo">
                <div class="progress-circle-demo__controls">
                  <label class="progress-demo__range">
                    <span>Value {{ progressCircleValue }}%</span>
                    <input v-model.number="progressCircleValue" type="range" min="0" max="100" step="1">
                  </label>
                  <div class="avatar-demo__control-row" aria-label="ProgressCircle size">
                    <button
                      v-for="size in progressCircleSizes"
                      :key="size"
                      type="button"
                      :class="{ active: progressCircleSize === size }"
                      @click="progressCircleSize = size"
                    >
                      {{ size }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="progressCircleLabel" type="checkbox">
                    <span>Label</span>
                  </label>
                </div>

                <div class="progress-circle-demo__panel">
                  <VisProgressCircle
                    :value="progressCircleValue"
                    :size="progressCircleSize"
                    :label="progressCircleLabel"
                  />
                </div>

                <div class="progress-circle-demo__row">
                  <VisProgressCircle
                    v-for="value in progressValues"
                    :key="`circle-${value}`"
                    :value="value"
                    size="md"
                    label
                  />
                  <VisProgressCircle status="success" size="md" label />
                  <VisProgressCircle status="danger" size="md" label />
                </div>

                <div class="progress-circle-demo__row">
                  <VisProgressCircle
                    v-for="size in progressCircleSizes"
                    :key="`circle-size-${size}`"
                    :size="size"
                    :value="75"
                    label
                  />
                </div>

                <div class="progress-circle-demo__row">
                  <VisProgressCircle size="lg" :value="25" label />
                  <VisProgressCircle size="lg" :value="50" label />
                  <VisProgressCircle size="lg" status="success" label />
                  <VisProgressCircle size="lg" status="danger" label />
                </div>
              </div>

              <div v-else-if="activePage === 'table'" class="table-demo">
                <div class="table-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Table appearance">
                    <button
                      v-for="appearance in tableAppearances"
                      :key="appearance"
                      type="button"
                      :class="{ active: tableAppearance === appearance }"
                      @click="tableAppearance = appearance"
                    >
                      {{ appearance }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="tableHighlightActiveRow" type="checkbox">
                    Highlight active row
                  </label>
                </div>

                <VisTable
                  :data="tableData"
                  :columns="tableColumns"
                  :appearance="tableAppearance"
                  selectable
                  :highlight-active-row="tableHighlightActiveRow"
                  :active-row-key="tableActiveRowKey"
                  aria-label="任务列表"
                  @active-change="tableActiveRowKey = $event"
                />

                <section class="table-demo__variants" aria-labelledby="table-header-preview-title">
                  <h4 id="table-header-preview-title" class="ld-heading-h4">Table Header</h4>
                  <div class="table-demo__variant-grid table-demo__variant-grid--header">
                    <div v-for="type in tableHeaderPreviewTypes" :key="type" class="table-demo__variant-cell">
                      <VisTableHeader :type="type" :appearance="tableAppearance" :label="type" />
                    </div>
                  </div>
                </section>

                <section class="table-demo__variants" aria-labelledby="table-item-preview-title">
                  <h4 id="table-item-preview-title" class="ld-heading-h4">Table Item</h4>
                  <div class="table-demo__variant-grid">
                    <div v-for="item in tableItemPreviews" :key="item.type" class="table-demo__variant-cell">
                      <VisTableItem
                        :type="item.type"
                        :appearance="tableAppearance"
                        :value="item.value"
                        v-bind="item.props"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div v-else-if="activePage === 'tabs'" class="tabs-demo">
                <div class="tabs-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Tabs align">
                    <button
                      v-for="align in tabsAligns"
                      :key="align"
                      type="button"
                      :class="{ active: tabsAlign === align }"
                      @click="tabsAlign = align"
                    >
                      {{ align }}
                    </button>
                  </div>
                  <div class="avatar-demo__control-row" aria-label="Tabs number">
                    <button
                      v-for="count in [2, 3, 4, 5, 6, 7, 8, 9]"
                      :key="count"
                      type="button"
                      :class="{ active: tabsNumber === count }"
                      @click="tabsNumber = count"
                    >
                      {{ count }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="tabsIcon" type="checkbox">
                    <span>Icon</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="tabsCount" type="checkbox">
                    <span>Count</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="tabsActions" type="checkbox">
                    <span>Actions</span>
                  </label>
                </div>

                <VisTabs
                  v-model="tabsValue"
                  :items="selectedTabsItems"
                  :align="tabsAlign"
                  :actions="tabsActions"
                />

                <div class="tabs-demo__matrix">
                  <div v-for="count in [2, 3, 4, 5, 6, 7, 8, 9]" :key="`horizontal-${count}`" class="tabs-demo__row">
                    <span class="tabs-demo__label">horizontal {{ count }}</span>
                    <VisTabs :items="createTabsItems(count)" model-value="tab-1" />
                  </div>
                  <div class="tabs-demo__row">
                    <span class="tabs-demo__label">variants</span>
                    <VisTabs :items="createTabsItems(4, { icon: true })" model-value="tab-1" />
                    <VisTabs :items="createTabsItems(4, { count: true })" model-value="tab-1" />
                    <VisTabs :items="createTabsItems(4, { icon: true, count: true })" model-value="tab-1" actions />
                  </div>
                  <div class="tabs-demo__right-grid">
                    <VisTabs
                      v-for="count in [3, 4, 5, 6, 7, 8, 9]"
                      :key="`right-${count}`"
                      :items="createTabsItems(count)"
                      align="right"
                      model-value="tab-1"
                    />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'toggle'" class="toggle-demo">
                <div class="toggle-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Toggle state">
                    <button
                      v-for="state in toggleStates"
                      :key="state"
                      type="button"
                      :class="{ active: toggleState === state }"
                      @click="toggleState = state"
                    >
                      {{ state }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="toggleIcon" type="checkbox">
                    <span>Icon</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="toggleText" type="checkbox">
                    <span>Text</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="toggleDisabled" type="checkbox">
                    <span>Disabled</span>
                  </label>
                </div>

                <VisToggle
                  v-model="toggleChecked"
                  :state="toggleState"
                  :icon="toggleIcon"
                  :text="toggleText"
                  :disabled="toggleDisabled"
                />

                <div class="toggle-demo__matrix">
                  <div class="toggle-demo__row">
                    <span class="toggle-demo__label">default</span>
                    <VisToggle :model-value="true" />
                    <VisToggle :model-value="false" />
                    <VisToggle :model-value="true" text />
                    <VisToggle :model-value="false" text />
                    <VisToggle :model-value="true" icon />
                    <VisToggle :model-value="false" icon />
                  </div>
                  <div class="toggle-demo__row">
                    <span class="toggle-demo__label">hover</span>
                    <VisToggle :model-value="true" state="hover" />
                    <VisToggle :model-value="false" state="hover" />
                    <VisToggle :model-value="true" text state="hover" />
                    <VisToggle :model-value="false" text state="hover" />
                    <VisToggle :model-value="true" icon state="hover" />
                    <VisToggle :model-value="false" icon state="hover" />
                  </div>
                  <div class="toggle-demo__row">
                    <span class="toggle-demo__label">loading</span>
                    <VisToggle :model-value="true" state="loading" />
                    <VisToggle :model-value="false" state="loading" />
                    <VisToggle :model-value="true" text state="loading" />
                    <VisToggle :model-value="false" text state="loading" />
                    <VisToggle :model-value="true" icon state="loading" />
                    <VisToggle :model-value="false" icon state="loading" />
                  </div>
                  <div class="toggle-demo__row">
                    <span class="toggle-demo__label">disabled</span>
                    <VisToggle :model-value="true" disabled />
                    <VisToggle :model-value="false" disabled />
                    <VisToggle :model-value="true" text disabled />
                    <VisToggle :model-value="false" text disabled />
                    <VisToggle :model-value="true" icon disabled />
                    <VisToggle :model-value="false" icon disabled />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'toggle-button'" class="toggle-button-demo">
                <div class="toggle-button-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="ToggleButton size">
                    <button
                      v-for="size in toggleButtonSizes"
                      :key="size"
                      type="button"
                      :class="{ active: toggleButtonSize === size }"
                      @click="toggleButtonSize = size"
                    >
                      {{ size }}
                    </button>
                  </div>
                  <div class="avatar-demo__control-row" aria-label="ToggleButton state">
                    <button
                      v-for="state in toggleButtonStates"
                      :key="state"
                      type="button"
                      :class="{ active: toggleButtonState === state }"
                      @click="toggleButtonState = state"
                    >
                      {{ state }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="toggleButtonIconOnly" type="checkbox">
                    <span>Icon only</span>
                  </label>
                </div>

                <VisToggleButton
                  v-model="toggleButtonPressed"
                  :size="toggleButtonSize"
                  :state="toggleButtonState"
                  :icon-only="toggleButtonIconOnly"
                />

                <div class="toggle-button-demo__matrix">
                  <div v-for="size in toggleButtonSizes" :key="size" class="toggle-button-demo__row">
                    <span class="toggle-button-demo__label">{{ size }}</span>
                    <VisToggleButton :size="size" />
                    <VisToggleButton :size="size" state="hover" />
                    <VisToggleButton :size="size" state="focus" />
                    <VisToggleButton :size="size" state="active" />
                    <VisToggleButton :size="size" state="disabled" />
                  </div>
                  <div v-for="size in toggleButtonSizes" :key="`${size}-icon`" class="toggle-button-demo__row">
                    <span class="toggle-button-demo__label">{{ size }} icon</span>
                    <VisToggleButton v-model="toggleButtonIconPressed" :size="size" icon-only />
                    <VisToggleButton :size="size" icon-only state="hover" />
                    <VisToggleButton :size="size" icon-only state="focus" />
                    <VisToggleButton :size="size" icon-only state="active" />
                    <VisToggleButton :size="size" icon-only state="disabled" />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'tooltip'" class="tooltip-demo">
                <div class="tooltip-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Tooltip position">
                    <button
                      v-for="position in tooltipPositions"
                      :key="position"
                      type="button"
                      :class="{ active: tooltipPosition === position }"
                      @click="tooltipPosition = position"
                    >
                      {{ tooltipPositionLabel(position) }}
                    </button>
                  </div>
                  <div class="avatar-demo__control-row" aria-label="Tooltip trigger">
                    <button
                      v-for="trigger in tooltipTriggers"
                      :key="trigger"
                      type="button"
                      :class="{ active: tooltipTrigger === trigger }"
                      @click="tooltipTrigger = trigger"
                    >
                      {{ trigger }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="tooltipOpen" type="checkbox">
                    <span>Open</span>
                  </label>
                </div>

                <div class="tooltip-demo__showcase">
                  <VisTooltip
                    v-model="tooltipOpen"
                    content="Tooltip"
                    :position="tooltipPosition"
                    :trigger="tooltipTrigger"
                  >
                    <VisButton variant="secondary" label="Tooltip" />
                  </VisTooltip>
                </div>

                <div class="tooltip-demo__position-grid">
                  <div v-for="position in tooltipPositions" :key="position" class="tooltip-demo__position-item">
                    <VisTooltip content="Tooltip" :position="position" trigger="manual" :model-value="true">
                      <VisButton variant="secondary" size="sm" :label="tooltipPositionLabel(position)" />
                    </VisTooltip>
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'tree-view'" class="tree-view-demo">
                <div class="tree-view-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="TreeView folder type">
                    <button
                      v-for="type in treeFolderTypes"
                      :key="type"
                      type="button"
                      :class="{ active: treeFolderType === type }"
                      @click="treeFolderType = type"
                    >
                      {{ type }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="treeCheckable" type="checkbox">
                    <span>Checkable</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="treeDraggable" type="checkbox">
                    <span>Draggable</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="treeIcon" type="checkbox">
                    <span>Icon</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="treeActions" type="checkbox">
                    <span>Actions</span>
                  </label>
                </div>

                <div class="tree-view-demo__showcase">
                  <VisTreeView
                    v-model:expanded-keys="treeExpandedKeys"
                    v-model:selected-key="treeSelectedKey"
                    v-model:checked-keys="treeCheckedKeys"
                    :items="treeViewItems"
                    :folder-type="treeFolderType"
                    :checkable="treeCheckable"
                    :draggable="treeDraggable"
                    :icon="treeIcon"
                    :actions="treeActions"
                  />
                </div>

                <div class="tree-view-demo__matrix">
                  <div class="tree-view-demo__sample">
                    <span>Default</span>
                    <VisTreeView
                      :items="treeViewItems"
                      :expanded-keys="['docs', 'guides', 'assets']"
                      selected-key="tokens"
                      :checked-keys="['tokens']"
                    />
                  </div>
                  <div class="tree-view-demo__sample">
                    <span>+/- Folder</span>
                    <VisTreeView
                      :items="treeViewItems"
                      folder-type="+/-"
                      :expanded-keys="['docs', 'guides', 'assets']"
                      selected-key="tokens"
                      :checked-keys="['tokens']"
                    />
                  </div>
                  <div class="tree-view-demo__sample">
                    <span>No Check</span>
                    <VisTreeView
                      :items="treeViewItems"
                      :expanded-keys="['docs', 'guides', 'assets']"
                      selected-key="tokens"
                      :checkable="false"
                    />
                  </div>
                  <div class="tree-view-demo__sample">
                    <span>Draggable</span>
                    <VisTreeView
                      :items="treeViewItems"
                      :expanded-keys="['docs', 'guides', 'assets']"
                      selected-key="tokens"
                      :checked-keys="['tokens']"
                      draggable
                    />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'upload'" class="upload-demo">
                <div class="upload-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Upload type">
                    <button
                      v-for="type in uploadTypes"
                      :key="type"
                      type="button"
                      :class="{ active: uploadType === type }"
                      @click="uploadType = type"
                    >
                      {{ type }}
                    </button>
                  </div>
                </div>

                <div class="upload-demo__showcase">
                  <VisUpload v-model="uploadFiles" :type="uploadType" uploaded multiple />
                </div>

                <div class="upload-demo__matrix">
                  <VisUpload type="button" />
                  <VisUpload type="button" uploaded :model-value="uploadFiles" />
                  <VisUpload type="trigger" />
                  <VisUpload type="trigger" uploaded :model-value="uploadFiles" />
                  <VisUpload type="drag" />
                  <VisUpload type="drag" uploaded :model-value="uploadFiles" />
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

              <div v-else-if="activePage === 'rate'" class="rate-demo">
                <div class="rate-demo__showcase">
                  <VisRate v-model="rateValue" />
                  <VisRate v-model="rateHalfValue" allow-half />
                </div>

                <div class="rate-demo__state-grid">
                  <div class="rate-demo__state-item">
                    <VisRate :model-value="0" readonly />
                    <span>Default</span>
                  </div>
                  <div class="rate-demo__state-item">
                    <VisRate :model-value="4" readonly />
                    <span>Selected</span>
                  </div>
                  <div class="rate-demo__state-item">
                    <VisRate :model-value="3.5" allow-half readonly />
                    <span>Half selected</span>
                  </div>
                  <div class="rate-demo__state-item">
                    <VisRate v-model="rateEmptyValue" disabled />
                    <span>Disabled</span>
                  </div>
                </div>
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

              <div v-else-if="activePage === 'description'" class="description-demo">
                <div class="description-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Description direction">
                    <button
                      v-for="direction in descriptionDirections"
                      :key="direction"
                      type="button"
                      :class="{ active: descriptionDirection === direction }"
                      @click="descriptionDirection = direction"
                    >
                      {{ direction }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="descriptionBorder" type="checkbox">
                    <span>Border</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="descriptionAlert" type="checkbox">
                    <span>Alert</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="descriptionFoldable" type="checkbox">
                    <span>Foldable</span>
                  </label>
                </div>

                <VisDescription
                  v-model:collapsed="descriptionCollapsed"
                  :border="descriptionBorder"
                  :direction="descriptionDirection"
                  :alert="descriptionAlert"
                  :foldable="descriptionFoldable"
                  title-text="基本信息"
                >
                  <VisDescriptionItem label="项目名称" value="Vision Design System" icon icon-name="layers-three-01" />
                  <VisDescriptionItem label="项目编号" value="VIS-2026" />
                  <VisDescriptionItem label="状态" type="tag" :tags="descriptionTags" />
                  <VisDescriptionItem label="创建人" value="张大山" icon />
                  <VisDescriptionItem label="所属团队" value="Design Platform" />
                  <VisDescriptionItem label="更新时间" value="2026-07-13" />
                  <VisDescriptionItem
                    label="项目说明"
                    value="用于统一产品视觉、交互与前端实现规范的企业级设计系统。"
                    :span="2"
                  />
                  <VisDescriptionItem label="操作" type="customize">
                    <VisButton variant="link-color" size="sm">查看详情</VisButton>
                  </VisDescriptionItem>
                </VisDescription>
              </div>

              <div v-else-if="activePage === 'time-picker'" class="time-picker-demo">
                <section class="time-picker-demo__section" aria-labelledby="time-picker-basic-title">
                  <h4 id="time-picker-basic-title" class="ld-heading-h4">Basic</h4>
                  <div class="time-picker-demo__row">
                    <VisTimePicker v-model="timePickerValue" />
                    <VisTimePicker v-model="timePickerMinuteValue" type="HH MM" />
                    <VisTimePicker v-model="timePickerRangeValue" range />
                    <VisTimePicker v-model="timePickerMinuteRangeValue" range type="HH MM" />
                  </div>
                </section>

                <section class="time-picker-demo__section" aria-labelledby="time-picker-states-title">
                  <h4 id="time-picker-states-title" class="ld-heading-h4">States</h4>
                  <div class="time-picker-demo__row">
                    <VisTimePicker state="hover" placeholder="Hover" />
                    <VisTimePicker state="focus" placeholder="Focus" />
                    <VisTimePicker state="danger" placeholder="Danger" />
                    <VisTimePicker model-value="12:00:00" disabled />
                    <VisTimePicker model-value="12:00:00" read-view />
                  </div>
                </section>

                <section class="time-picker-demo__section" aria-labelledby="time-picker-panels-title">
                  <h4 id="time-picker-panels-title" class="ld-heading-h4">Panels</h4>
                  <div class="time-picker-demo__panel-row">
                    <div class="time-picker-demo__panel-cell">
                      <VisTimePicker v-model="timePickerValue" open />
                    </div>
                    <div class="time-picker-demo__panel-cell">
                      <VisTimePicker v-model="timePickerRangeValue" range open />
                    </div>
                    <div class="time-picker-demo__panel-cell is-shortcut">
                      <VisTimePicker v-model="timePickerQuickValue" time-select open />
                    </div>
                  </div>
                </section>
              </div>

              <div v-else-if="activePage === 'divider'" class="divider-demo">
                <div class="divider-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Divider type">
                    <button
                      v-for="type in dividerTypes"
                      :key="type"
                      type="button"
                      :class="{ active: dividerType === type }"
                      @click="dividerType = type"
                    >
                      {{ type }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="dividerDashed" type="checkbox">
                    <span>Dashed</span>
                  </label>
                </div>

                <div class="divider-demo__preview" :class="`is-${dividerType}`">
                  <VisDivider
                    :type="dividerType"
                    :dashed="dividerDashed"
                    :length="dividerType === 'vertical' ? '120px' : '100%'"
                  />
                </div>

                <div class="divider-demo__matrix">
                  <div class="divider-demo__sample">
                    <span>horizontal</span>
                    <VisDivider type="horizontal" />
                  </div>
                  <div class="divider-demo__sample">
                    <span>horizontal dashed</span>
                    <VisDivider type="horizontal" dashed />
                  </div>
                  <div class="divider-demo__sample divider-demo__sample--vertical">
                    <span>vertical</span>
                    <VisDivider type="vertical" length="48px" />
                  </div>
                  <div class="divider-demo__sample divider-demo__sample--vertical">
                    <span>vertical dashed</span>
                    <VisDivider type="vertical" dashed length="48px" />
                  </div>
                  <div class="divider-demo__sample">
                    <span>content</span>
                    <VisDivider type="content" />
                  </div>
                  <div class="divider-demo__sample">
                    <span>content dashed</span>
                    <VisDivider type="content" dashed />
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

              <div v-else-if="activePage === 'segmented'" class="segmented-demo">
                <div class="segmented-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Segmented size">
                    <button
                      v-for="size in segmentedSizes"
                      :key="size"
                      type="button"
                      :class="{ active: segmentedSize === size }"
                      @click="segmentedSize = size"
                    >
                      {{ size }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="segmentedIcon" type="checkbox">
                    <span>Icon</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="segmentedText" type="checkbox">
                    <span>Text</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="segmentedDisabled" type="checkbox">
                    <span>Disabled</span>
                  </label>
                </div>

                <VisSegmented
                  v-model="segmentedValue"
                  :options="segmentedOptions"
                  :size="segmentedSize"
                  :icon="segmentedIcon"
                  :text="segmentedText"
                  :disabled="segmentedDisabled"
                />

                <div class="segmented-demo__matrix">
                  <div v-for="size in segmentedSizes" :key="size" class="segmented-demo__row">
                    <span class="segmented-demo__label">{{ size }} icon + text</span>
                    <VisSegmented :options="segmentedOptions.slice(0, 5)" :size="size" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 4)" :size="size" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 3)" :size="size" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 2)" :size="size" model-value="option-1" />
                  </div>
                  <div v-for="size in segmentedSizes" :key="`${size}-text`" class="segmented-demo__row">
                    <span class="segmented-demo__label">{{ size }} text</span>
                    <VisSegmented :options="segmentedOptions.slice(0, 5)" :size="size" :icon="false" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 4)" :size="size" :icon="false" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 3)" :size="size" :icon="false" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 2)" :size="size" :icon="false" model-value="option-1" />
                  </div>
                  <div v-for="size in segmentedSizes" :key="`${size}-icon`" class="segmented-demo__row">
                    <span class="segmented-demo__label">{{ size }} icon</span>
                    <VisSegmented :options="segmentedOptions.slice(0, 5)" :size="size" :text="false" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 4)" :size="size" :text="false" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 3)" :size="size" :text="false" model-value="option-1" />
                    <VisSegmented :options="segmentedOptions.slice(0, 2)" :size="size" :text="false" model-value="option-1" />
                  </div>
                  <div class="segmented-demo__row">
                    <span class="segmented-demo__label">disabled item</span>
                    <VisSegmented :options="segmentedDisabledOptions" model-value="option-1" />
                    <VisSegmented :options="segmentedDisabledOptions" model-value="option-3" disabled />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'select'" class="select-demo">
                <div class="select-demo__showcase">
                  <div class="select-demo__cell select-demo__cell--open">
                    <VisSelect
                      v-model="selectValue"
                      v-model:open="selectOpen"
                      v-model:search-value="selectSearchValue"
                      :options="selectOptions"
                      filterable
                    />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="selectOptions" :model-value="undefined" />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="selectOptions" model-value="option-1" state="hover" />
                  </div>
                  <div class="select-demo__cell select-demo__cell--open">
                    <VisSelect :options="selectOptions" model-value="option-1" state="focus" open />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="selectOptions" model-value="option-1" state="danger" />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="selectOptions" model-value="option-1" disabled />
                  </div>
                  <div class="select-demo__cell select-demo__cell--open">
                    <VisSelect :options="selectOptions" :model-value="selectMultiValue" multi-select open />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="selectOptions" :model-value="selectMultiValue" multi-select filterable />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="avatarSelectOptions" type="avatar" :model-value="selectAvatarValue" />
                  </div>
                  <div class="select-demo__cell select-demo__cell--open">
                    <VisSelect :options="avatarSelectOptions" type="avatar" :model-value="selectAvatarValue" open />
                  </div>
                  <div class="select-demo__cell">
                    <VisSelect :options="selectOptions" model-value="option-1" loading />
                  </div>
                </div>
              </div>

              <div v-else-if="activePage === 'slider'" class="slider-demo">
                <div class="slider-demo__controls">
                  <div class="avatar-demo__control-row" aria-label="Slider type">
                    <button
                      v-for="type in sliderTypes"
                      :key="type"
                      type="button"
                      :class="{ active: sliderType === type }"
                      @click="selectSliderType(type)"
                    >
                      {{ type }}
                    </button>
                  </div>
                  <label class="avatar-demo__toggle">
                    <input v-model="sliderLabel" type="checkbox">
                    <span>Label</span>
                  </label>
                  <label class="avatar-demo__toggle">
                    <input v-model="sliderDisabled" type="checkbox">
                    <span>Disabled</span>
                  </label>
                </div>

                <div class="slider-demo__panel">
                  <VisSlider
                    v-model="sliderValue"
                    :type="sliderType"
                    :label="sliderLabel"
                    :disabled="sliderDisabled"
                  />
                </div>

                <div class="slider-demo__matrix">
                  <div class="slider-demo__row">
                    <span>Single / Label=false</span>
                    <div class="slider-demo__items">
                      <VisSlider :model-value="50" />
                      <VisSlider :model-value="50" disabled />
                    </div>
                  </div>
                  <div class="slider-demo__row">
                    <span>Single / Label=true</span>
                    <div class="slider-demo__items">
                      <VisSlider :model-value="50" label />
                      <VisSlider :model-value="50" label disabled />
                    </div>
                  </div>
                  <div class="slider-demo__row">
                    <span>Range / Label=false</span>
                    <div class="slider-demo__items">
                      <VisSlider :model-value="[25, 75]" type="range" />
                      <VisSlider :model-value="[25, 75]" type="range" disabled />
                    </div>
                  </div>
                  <div class="slider-demo__row">
                    <span>Range / Label=true</span>
                    <div class="slider-demo__items">
                      <VisSlider :model-value="[25, 75]" type="range" label />
                      <VisSlider :model-value="[25, 75]" type="range" label disabled />
                    </div>
                  </div>
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

.demo-panel:has(.time-picker-demo) {
  max-inline-size: 1120px;
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

.demo-panel:has(.select-demo) {
  max-inline-size: 1120px;
  min-block-size: 560px;
  inline-size: 100%;
}

.demo-panel:has(.slider-demo) {
  max-inline-size: 760px;
  inline-size: 100%;
}

.demo-panel:has(.input-number-demo),
.demo-panel:has(.input-search-box-demo),
.demo-panel:has(.input-textarea-demo) {
  max-inline-size: 760px;
  inline-size: 100%;
}

.demo-panel:has(.markdown-demo) {
  max-inline-size: 880px;
  inline-size: 100%;
}

.demo-panel:has(.message-demo) {
  max-inline-size: 960px;
  inline-size: 100%;
}

.demo-panel:has(.notification-demo) {
  max-inline-size: 1260px;
  inline-size: 100%;
}

.demo-panel:has(.pagination-demo) {
  max-inline-size: 1120px;
  inline-size: 100%;
}

.demo-panel:has(.popover-demo) {
  max-inline-size: 995px;
  min-block-size: 640px;
  inline-size: 100%;
  overflow: visible;
}

.demo-panel:has(.progress-bar-demo),
.demo-panel:has(.progress-circle-demo) {
  max-inline-size: 1120px;
  inline-size: 100%;
}

.demo-panel:has(.segmented-demo),
.demo-panel:has(.table-demo),
.demo-panel:has(.tabs-demo),
.demo-panel:has(.toggle-demo),
.demo-panel:has(.toggle-button-demo),
.demo-panel:has(.tree-view-demo),
.demo-panel:has(.upload-demo) {
  max-inline-size: 1120px;
  inline-size: 100%;
}

.demo-panel:has(.tooltip-demo) {
  max-inline-size: 995px;
  min-block-size: 560px;
  inline-size: 100%;
  overflow: visible;
}

.demo-panel:has(.table-demo) {
  max-inline-size: 1440px;
}

.demo-panel:has(.rate-demo) {
  max-inline-size: 760px;
  inline-size: 100%;
}

.demo-panel:has(.description-demo) {
  max-inline-size: 1120px;
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
.time-picker-demo__row,
.divider-demo__controls,
.divider-demo__preview,
.badge-demo__row,
  .loading-demo__row,
  .input-search-box-demo__controls,
  .pagination-demo__controls,
  .popover-demo__controls,
  .progress-bar-demo__controls,
  .progress-circle-demo__controls,
  .segmented-demo__controls,
  .slider-demo__controls,
  .table-demo__controls,
  .tabs-demo__controls,
  .toggle-demo__controls,
  .toggle-button-demo__controls,
  .tooltip-demo__controls,
  .tree-view-demo__controls,
  .upload-demo__controls,
  .rate-demo__showcase {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.badge-demo,
.avatar-demo,
.loading-demo,
.markdown-demo,
.message-demo,
  .notification-demo,
  .pagination-demo,
  .popover-demo,
  .progress-bar-demo,
  .progress-circle-demo,
  .segmented-demo,
  .slider-demo,
  .table-demo,
  .tabs-demo,
  .toggle-demo,
  .toggle-button-demo,
  .tooltip-demo,
  .tree-view-demo,
  .upload-demo,
  .rate-demo,
  .tag-demo,
.breadcrumb-demo,
.accordion-demo,
.alert-demo,
.input-number-demo,
.input-search-box-demo,
.input-textarea-demo,
.radio-demo,
.checkbox-demo,
.date-picker-demo,
.description-demo,
.time-picker-demo,
.form-demo,
.divider-demo,
.drawer-demo,
.select-demo {
  display: grid;
  gap: var(--space-20);
}

.description-demo {
  inline-size: 100%;
  max-inline-size: 1120px;
  gap: var(--space-24);
}

.description-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.description-demo > :deep(.vis-description) {
  max-inline-size: 800px;
}

.form-demo {
  inline-size: 100%;
  max-inline-size: 1120px;
  gap: var(--space-32);
}

.form-demo__section {
  min-inline-size: 0;
  display: grid;
  justify-items: start;
  gap: var(--space-12);
}

.form-demo__section h4 {
  margin: 0;
  color: var(--color-text-primary);
}

.form-demo__status {
  min-block-size: var(--space-20);
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.time-picker-demo {
  inline-size: 100%;
}

.time-picker-demo__section {
  min-inline-size: 0;
  display: grid;
  gap: var(--space-12);
}

.time-picker-demo__section h4 {
  margin: 0;
  color: var(--color-text-primary);
}

.time-picker-demo__panel-row {
  min-inline-size: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-16);
}

.time-picker-demo__panel-cell {
  min-block-size: 444px;
}

.time-picker-demo__panel-cell.is-shortcut {
  min-block-size: 280px;
}

.dropdown-demo {
  display: grid;
  gap: var(--space-24);
}

.pagination-demo {
  inline-size: 100%;
  max-inline-size: 1120px;
}

.pagination-demo__showcase,
.pagination-demo__stack {
  box-sizing: border-box;
  inline-size: 996px;
  max-inline-size: 100%;
  border-radius: var(--radius-sm);
  padding: var(--space-20);
  background: var(--color-bg-secondary);
}

.pagination-demo__showcase {
  min-block-size: 72px;
  display: flex;
  align-items: center;
}

.pagination-demo__stack {
  display: grid;
  gap: var(--space-20);
}

.popover-demo {
  inline-size: 100%;
  max-inline-size: 995px;
  gap: var(--space-32);
  overflow: visible;
}

.popover-demo__controls {
  gap: var(--space-16);
}

.popover-demo__showcase {
  min-block-size: 136px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popover-demo__position-grid {
  min-block-size: 300px;
  display: grid;
  grid-template-columns: repeat(3, minmax(256px, 1fr));
  gap: var(--space-56) var(--space-40);
  align-items: center;
  justify-items: center;
  overflow: visible;
}

.popover-demo__position-item {
  inline-size: 256px;
  min-block-size: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popover-demo__variant-grid {
  min-block-size: 150px;
  display: grid;
  grid-template-columns: repeat(4, minmax(128px, 1fr));
  gap: var(--space-24);
  align-items: center;
  justify-items: center;
  overflow: visible;
}

.progress-bar-demo,
.progress-circle-demo {
  inline-size: 100%;
  max-inline-size: 1120px;
}

.progress-bar-demo__controls,
.progress-circle-demo__controls {
  gap: var(--space-16);
}

.progress-demo__range {
  min-inline-size: 240px;
  display: inline-grid;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.progress-demo__range input {
  inline-size: 240px;
  accent-color: var(--color-fg-brand-primary);
}

.progress-bar-demo__panel,
.progress-circle-demo__panel,
.progress-bar-demo__stack,
.progress-circle-demo__row {
  box-sizing: border-box;
  inline-size: 100%;
  border-radius: var(--radius-sm);
  padding: var(--space-24);
  background: var(--color-bg-secondary);
}

.progress-bar-demo__panel {
  min-block-size: 96px;
  display: flex;
  align-items: center;
}

.progress-bar-demo__stack {
  display: grid;
  gap: var(--space-20);
}

.progress-circle-demo__panel {
  min-block-size: 136px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle-demo__row {
  min-block-size: 136px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-32);
}

.segmented-demo,
.table-demo,
.tabs-demo,
.toggle-demo,
.toggle-button-demo,
.tooltip-demo,
.tree-view-demo,
.upload-demo {
  inline-size: 100%;
  max-inline-size: 1120px;
}

.table-demo {
  inline-size: 100%;
  max-inline-size: 1440px;
  display: grid;
  gap: var(--space-20);
}

.table-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.table-demo__variants {
  min-inline-size: 0;
  display: grid;
  gap: var(--space-12);
}

.table-demo__variants h4 {
  margin: 0;
  color: var(--color-text-primary);
}

.table-demo__variant-grid {
  overflow: hidden;
  border-radius: var(--radius-sm);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: var(--color-bg-surface);
  box-shadow: inset 0 0 0 1px var(--color-border-default);
}

.table-demo__variant-grid--header {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.table-demo__variant-cell {
  min-inline-size: 0;
}

.table-demo__variant-cell > :deep(*) {
  border-inline-start: 0;
}

@media (max-width: 720px) {
  .table-demo__variant-grid,
  .table-demo__variant-grid--header {
    grid-template-columns: minmax(160px, 1fr);
    overflow-x: auto;
  }
}

.table-demo__title-cell,
.table-demo__owner-cell,
.table-demo__actions {
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.table-demo__title-cell {
  gap: var(--space-4);
  color: var(--color-text-primary);
}

.table-demo__title-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-demo__owner-cell,
.table-demo__actions {
  gap: var(--space-8);
}

.table-demo__owner-cell {
  color: var(--color-text-primary);
}

.tooltip-demo {
  gap: var(--space-32);
  overflow: visible;
}

.tooltip-demo__showcase {
  min-block-size: 136px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip-demo__position-grid {
  min-block-size: 300px;
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: var(--space-56) var(--space-40);
  align-items: center;
  justify-items: center;
  overflow: visible;
}

.tooltip-demo__position-item {
  inline-size: 180px;
  min-block-size: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tree-view-demo__showcase,
.upload-demo__showcase {
  box-sizing: border-box;
  border-radius: var(--radius-sm);
  padding: var(--space-24);
  background: var(--color-bg-secondary);
}

.tree-view-demo__showcase {
  inline-size: 360px;
}

.tree-view-demo__matrix {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: var(--space-20);
}

.tree-view-demo__sample {
  box-sizing: border-box;
  min-inline-size: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-20);
  display: grid;
  gap: var(--space-12);
  background: var(--color-bg-secondary);
}

.tree-view-demo__sample > span {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.upload-demo__showcase {
  inline-size: min(100%, 700px);
}

.upload-demo__matrix {
  display: grid;
  grid-template-columns: 234px 400px;
  gap: var(--space-20) var(--space-40);
  align-items: start;
}

.segmented-demo__matrix,
.tabs-demo__matrix,
.toggle-demo__matrix,
.toggle-button-demo__matrix {
  display: grid;
  gap: var(--space-20);
}

.segmented-demo__row,
.tabs-demo__row,
.toggle-demo__row,
.toggle-button-demo__row {
  box-sizing: border-box;
  inline-size: 100%;
  border-radius: var(--radius-sm);
  padding: var(--space-20);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-16);
  background: var(--color-bg-secondary);
}

.segmented-demo__label,
.tabs-demo__label,
.toggle-demo__label,
.toggle-button-demo__label {
  inline-size: 116px;
  flex: 0 0 116px;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.tabs-demo__row {
  align-items: flex-start;
}

.tabs-demo__row > .vis-tabs {
  flex: 1 1 720px;
  min-inline-size: 0;
}

.tabs-demo__right-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  gap: var(--space-20);
}

.toggle-demo__row,
.toggle-button-demo__row {
  min-block-size: 76px;
}

.rate-demo {
  inline-size: 100%;
  max-inline-size: 760px;
}

.rate-demo__showcase {
  min-block-size: 96px;
  border-radius: var(--radius-sm);
  padding: var(--space-24);
  background: var(--color-bg-secondary);
}

.rate-demo__state-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-16);
}

.rate-demo__state-item {
  min-block-size: 112px;
  border-radius: var(--radius-sm);
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  background: var(--color-bg-secondary);
}

.rate-demo__state-item span {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
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
  display: grid;
  align-content: center;
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  background: var(--color-bg-surface);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.divider-demo__sample--vertical {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
}

.divider-demo__sample--vertical .vis-divider {
  justify-self: start;
}

.dropdown-demo {
  inline-size: 100%;
  max-inline-size: 880px;
}

.select-demo {
  inline-size: 100%;
  max-inline-size: 1120px;
}

.select-demo__showcase {
  display: grid;
  grid-template-columns: repeat(4, minmax(240px, 1fr));
  align-items: start;
  gap: var(--space-24) var(--space-20);
}

.select-demo__cell {
  min-inline-size: 0;
  min-block-size: var(--space-40);
  display: flex;
  align-items: flex-start;
}

.select-demo__cell--open {
  min-block-size: 180px;
}

.slider-demo {
  inline-size: 100%;
  max-inline-size: 760px;
}

.slider-demo__controls {
  gap: var(--space-16);
}

.slider-demo__panel,
.slider-demo__matrix {
  box-sizing: border-box;
  inline-size: 100%;
  border-radius: var(--radius-sm);
  padding: var(--space-24);
  background: var(--color-bg-secondary);
}

.slider-demo__panel {
  min-block-size: 116px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-demo__matrix {
  display: grid;
  gap: var(--space-24);
}

.slider-demo__row {
  display: grid;
  gap: var(--space-12);
}

.slider-demo__row > span {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.slider-demo__items {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-32) var(--space-20);
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

.input-number-demo,
.input-search-box-demo,
.input-textarea-demo {
  inline-size: 100%;
  max-inline-size: 760px;
  align-items: start;
}

.input-number-demo__controls,
.input-search-box-demo__controls,
.input-textarea-demo__controls {
  display: grid;
  gap: var(--space-8);
}

.input-search-box-demo__matrix {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 240px);
  gap: var(--space-20);
  inline-size: 540px;
  max-inline-size: 100%;
  padding: var(--space-20);
  align-items: start;
}

.input-number-demo__matrix {
  display: grid;
  gap: var(--space-16);
}

.input-number-demo__row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-16);
}

.input-number-demo__label {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
}

.input-number-demo__items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-16);
}

.input-textarea-demo__matrix {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  align-items: start;
  gap: var(--space-24) var(--space-20);
}

.loading-demo__row {
  align-items: flex-end;
}

.message-demo {
  inline-size: 100%;
  max-inline-size: 960px;
}

.message-demo__controls,
.notification-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-12);
}

.message-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-24);
}

.notification-demo {
  inline-size: 100%;
  max-inline-size: 1260px;
}

.notification-demo__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 384px));
  align-items: start;
  gap: var(--space-40) var(--space-20);
}

.markdown-demo {
  inline-size: 100%;
  max-inline-size: 880px;
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
