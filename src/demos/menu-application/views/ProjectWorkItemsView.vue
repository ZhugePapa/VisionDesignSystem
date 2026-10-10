<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisAvatarGroup, VisAvatarLabel } from '../../../components/avatar'
import type { VisBadgeColor } from '../../../components/badge'
import VisButton from '../../../components/button/VisButton.vue'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisInput } from '../../../components/input'
import { VisInputSearchBox } from '../../../components/input-search-box'
import { VisMessage, type VisMessageType } from '../../../components/message'
import { VisModal } from '../../../components/modal'
import { VisPagination } from '../../../components/pagination'
import { VisSegmented, type VisSegmentedOption, type VisSegmentedValue } from '../../../components/segmented'
import { VisSelect, type VisSelectModelValue, type VisSelectOption } from '../../../components/select'
import {
  VisTable,
  type VisTableColumn,
  type VisTableRowData,
  type VisTableSortChange,
} from '../../../components/table'
import { VisTabs, type VisTabsItem } from '../../../components/tabs'
import PlanGanttWorkspace from '../components/PlanGanttWorkspace.vue'
import { useProjectWorkItemStore, refreshParentSchedules } from '../work-item-store'
import { scheduleDays, type GanttSchedule } from '../gantt-calendar'
import issueBug from '../assets/work-items/issue-bug.svg'
import issueEpic from '../assets/work-items/issue-epic.svg'
import issueFeature from '../assets/work-items/issue-feature.svg'
import issueStory from '../assets/work-items/issue-story.svg'
import issueTask from '../assets/work-items/issue-task.svg'
import {
  demoWorkItemPeople,
  type DemoWorkItem,
  type DemoWorkItemPriority,
  type DemoWorkItemStatus,
  type DemoWorkItemType,
} from '../work-items'

type WorkItemScope = 'all' | 'owned' | 'followed'
type WorkItemView = 'tree' | 'list' | 'kanban'
type SortField = 'key' | 'title' | 'status' | 'plannedStart' | 'plannedEnd' | 'assignee' | 'priority' | 'iteration' | 'actualHours' | 'progress'
type SortOrder = 'ascending' | 'descending'

interface WorkItemTableRow extends VisTableRowData {
  id: string
  item: DemoWorkItem
  key: string
  title: string
  status: string
  plannedStart: string
  plannedEnd: string
  assignee: string
  priority: string
  iteration: string
  actualHours: number
  progress: number
  level: number
  hasChildren: boolean
  expanded: boolean
}

const moduleTabs: VisTabsItem[] = [
  { value: 'plan', label: '计划' },
  { value: 'work-items', label: '工作项' },
  { value: 'requirements', label: '需求' },
  { value: 'defects', label: '缺陷' },
  { value: 'iterations', label: '迭代' },
  { value: 'milestones', label: '里程碑' },
  { value: 'burndown', label: '燃尽图' },
  { value: 'releases', label: '发布' },
]

const route = useRoute()
const router = useRouter()
const isPlan = computed(() => route.name === 'project-plan')
const projectStore = computed(() => useProjectWorkItemStore(String(route.params.projectKey ?? 'lighting')))
const ganttRef = ref<InstanceType<typeof PlanGanttWorkspace>>()
const addExistingOpen = ref(false)
const addExistingSearch = ref('')
const addExistingSelection = ref<DemoWorkItem[]>([])

const scopeOptions: VisSegmentedOption[] = [
  { value: 'all', label: '全部' },
  { value: 'owned', label: '我负责的' },
  { value: 'followed', label: '我关注的' },
  { value: 'settings', label: '', iconName: 'settings-01', ariaLabel: '范围设置' },
]

const viewOptions: VisSegmentedOption[] = [
  { value: 'tree', iconName: 'dataflow-02', ariaLabel: '树形视图' },
  { value: 'list', iconName: 'list', ariaLabel: '列表视图' },
  { value: 'kanban', iconName: 'columns-03', ariaLabel: 'Kanban 视图' },
]

const statusMeta: Record<DemoWorkItemStatus, { label: string; color: VisBadgeColor }> = {
  'not-started': { label: '未开始', color: 'grey' },
  planning: { label: '规划中', color: 'cyan' },
  'in-progress': { label: '进行中', color: 'blue' },
  'to-verify': { label: '待验证', color: 'orange' },
  completed: { label: '已完成', color: 'aqua' },
  closed: { label: '已关闭', color: 'grey' },
  blocked: { label: '阻塞', color: 'red' },
}

const priorityMeta: Record<DemoWorkItemPriority, { label: string; color: VisBadgeColor; rank: number }> = {
  low: { label: '低', color: 'aqua', rank: 1 },
  medium: { label: '中', color: 'blue', rank: 2 },
  high: { label: '高', color: 'orange', rank: 3 },
  highest: { label: '最高', color: 'red', rank: 4 },
}

const baseColumns: VisTableColumn[] = [
  { key: 'key', label: '编号', width: 160, sortable: 'custom' },
  { key: 'title', label: '标题', minWidth: 480, sortable: 'custom', headerLeftButton: true, showOverflowTooltip: false },
  {
    key: 'status',
    label: '状态',
    width: 160,
    sortable: 'custom',
    cellType: 'badge',
    showOverflowTooltip: false,
    itemProps: (row) => ({
      badgeType: 'default',
      badgeColor: statusMeta[rowValue(row).item.status].color,
      badgeSize: 'md',
      badgeSolid: false,
    }),
  },
  { key: 'plannedStart', label: '预计开始时间', width: 160, sortable: 'custom' },
  { key: 'plannedEnd', label: '预计结束时间', width: 160, sortable: 'custom' },
  { key: 'assignee', label: '负责人', width: 160, sortable: 'custom', showOverflowTooltip: false },
  {
    key: 'priority',
    label: '优先级',
    width: 160,
    sortable: 'custom',
    cellType: 'text',
    showOverflowTooltip: false,
    itemProps: (row) => ({
      prefix: true,
      prefixColor: priorityMeta[rowValue(row).item.priority].color,
    }),
  },
  { key: 'iteration', label: '所属迭代', width: 200, sortable: 'custom' },
  { key: 'actualHours', label: '实际工时', width: 120, sortable: 'custom', align: 'right', headerAlign: 'left', cellType: 'number' },
  { key: 'progress', label: '完成度', width: 120, sortable: 'custom', align: 'right', headerAlign: 'left', cellType: 'number' },
  { key: 'operations', label: '操作', width: 120, showOverflowTooltip: false },
]

const typeIcon: Record<DemoWorkItemType, string> = {
  epic: issueEpic,
  feature: issueFeature,
  story: issueStory,
  task: issueTask,
  bug: issueBug,
}

const statusItems = computed<VisDropdownEntry[]>(() => [
  { type: 'item', label: '全部状态', active: selectedStatus.value === 'all' },
  ...Object.entries(statusMeta).map(([value, meta]) => ({
    type: 'item' as const,
    label: meta.label,
    active: selectedStatus.value === value,
    descriptionText: value,
  })),
])

const creatorItems = computed<VisDropdownEntry[]>(() => [
  { type: 'item', label: '全部创建人', active: selectedCreator.value === 'all' },
  ...demoWorkItemPeople.map((person) => ({
    type: 'item' as const,
    itemType: 'avatar' as const,
    label: person.name,
    title: person.name,
    subtitle: person.name === '张大山' ? 'zhangdashan' : person.name,
    avatarImageVariant: person.avatar,
    active: selectedCreator.value === person.name,
  })),
])

const priorityItems = computed<VisDropdownEntry[]>(() => [
  { type: 'item', label: '全部优先级', active: selectedPriority.value === 'all' },
  ...Object.entries(priorityMeta).map(([value, meta]) => ({
    type: 'item' as const,
    label: meta.label,
    active: selectedPriority.value === value,
    descriptionText: value,
  })),
])

const overflowItems = computed<VisDropdownEntry[]>(() => {
  const exportItem: VisDropdownEntry = {
    type: 'item',
    itemType: 'icon',
    iconName: 'download-04',
    label: '导出当前视图',
  }
  if (activeView.value !== 'tree') return [exportItem]
  return [
    { type: 'item', itemType: 'icon', iconName: allExpanded.value ? 'chevron-up' : 'chevron-down', label: allExpanded.value ? '全部收起' : '全部展开' },
    exportItem,
  ]
})

const workItems = computed({ get: () => projectStore.value.items.value, set: (value: DemoWorkItem[]) => { projectStore.value.items.value = value } })
const selectedScope = ref<WorkItemScope>('all')
const searchValue = ref('')
const selectedStatus = ref<DemoWorkItemStatus | 'all'>('all')
const selectedCreator = ref('all')
const selectedPriority = ref<DemoWorkItemPriority | 'all'>('all')
const moreFiltersVisible = ref(false)
const activeView = ref<WorkItemView>('tree')
const expandedIds = ref(new Set(['epic-001', 'feature-012', 'story-034']))
const sortField = ref<SortField | null>(null)
const sortOrder = ref<SortOrder>('ascending')
const currentPage = ref(1)
const pageSize = ref(20)
const createOpen = ref(false)
const createTitle = ref('')
const createType = ref<DemoWorkItemType>('task')
const messageVisible = ref(false)
const messageText = ref('')
const messageType = ref<VisMessageType>('success')

const createTypeOptions: VisSelectOption[] = [
  { value: 'epic', label: '史诗', iconName: 'zap' },
  { value: 'feature', label: '特性', iconName: 'pin-02' },
  { value: 'story', label: '用户故事', iconName: 'bookmark' },
  { value: 'task', label: '任务', iconName: 'check-square' },
  { value: 'bug', label: '缺陷', iconName: 'alert-circle' },
]

const childrenByParent = computed(() => {
  const result = new Map<string | undefined, DemoWorkItem[]>()
  workItems.value.forEach((item) => {
    const siblings = result.get(item.parentId) ?? []
    siblings.push(item)
    result.set(item.parentId, siblings)
  })
  return result
})

const parentById = computed(() => new Map(workItems.value.map((item) => [item.id, item.parentId])))

const directMatches = computed(() => {
  const query = searchValue.value.trim().toLocaleLowerCase()
  return workItems.value.filter((item) => {
    if (isPlan.value && !projectStore.value.planIds.value.includes(item.id)) return false
    const matchesScope = selectedScope.value === 'all'
      || (selectedScope.value === 'owned' && item.assignees.some((person) => person.name === '张大山'))
      || (selectedScope.value === 'followed' && item.followed)
    const matchesQuery = !query || `${item.key} ${item.title} ${item.iteration}`.toLocaleLowerCase().includes(query)
    const matchesStatus = selectedStatus.value === 'all' || item.status === selectedStatus.value
    const matchesCreator = selectedCreator.value === 'all' || item.creator === selectedCreator.value
    const matchesPriority = selectedPriority.value === 'all' || item.priority === selectedPriority.value
    return matchesScope && matchesQuery && matchesStatus && matchesCreator && matchesPriority
  })
})

const includedIds = computed(() => {
  if (!hasActiveFilters.value) return new Set(workItems.value.map((item) => item.id))
  const result = new Set(directMatches.value.map((item) => item.id))
  directMatches.value.forEach((item) => {
    let parentId = item.parentId
    while (parentId) {
      result.add(parentId)
      parentId = parentById.value.get(parentId)
    }
  })
  return result
})

const hasActiveFilters = computed(() =>
  selectedScope.value !== 'all'
  || Boolean(searchValue.value.trim())
  || selectedStatus.value !== 'all'
  || selectedCreator.value !== 'all'
  || selectedPriority.value !== 'all',
)

const expandableIds = computed(() => new Set(
  workItems.value
    .filter((item) => (childrenByParent.value.get(item.id) ?? []).some((child) => includedIds.value.has(child.id)))
    .map((item) => item.id),
))

const allExpanded = computed(() => expandableIds.value.size > 0 && [...expandableIds.value].every((id) => expandedIds.value.has(id)))

const columns = computed<VisTableColumn[]>(() => baseColumns.map((column) => {
  if (column.key !== 'title') return column

  if (activeView.value === 'list') {
    return {
      ...column,
      headerLeftButton: false,
      headerLeftButtonIcon: undefined,
      headerLeftButtonLabel: undefined,
      headerLeftButtonTooltip: undefined,
      headerLeftButtonTooltipOpenDelay: undefined,
    }
  }

  const actionLabel = allExpanded.value ? '全部折叠' : '全部展开'
  return {
    ...column,
    headerLeftButtonIcon: allExpanded.value
      ? 'chevron-selector-vertical-opened'
      : 'chevron-selector-vertical',
    headerLeftButtonLabel: actionLabel,
    headerLeftButtonTooltip: actionLabel,
    headerLeftButtonTooltipOpenDelay: 1000,
  }
}))

function compareValues(left: DemoWorkItem, right: DemoWorkItem): number {
  if (!sortField.value) return 0
  const field = sortField.value
  if (field === 'priority') return priorityMeta[left.priority].rank - priorityMeta[right.priority].rank
  const fieldValue = (item: DemoWorkItem): string | number => {
    if (field === 'key' || field === 'title' || field === 'plannedStart' || field === 'plannedEnd' || field === 'iteration') return item[field]
    if (field === 'status') return statusMeta[item.status].label
    if (field === 'assignee') return item.assignees.map((person) => person.name).join('、')
    if (field === 'actualHours') return item.actualHours
    return item.progress
  }
  const leftValue = fieldValue(left)
  const rightValue = fieldValue(right)
  return String(leftValue).localeCompare(String(rightValue), 'zh-CN', { numeric: true })
}

function sortedSiblings(items: DemoWorkItem[]): DemoWorkItem[] {
  if (!sortField.value) return items
  const direction = sortOrder.value === 'ascending' ? 1 : -1
  return [...items].sort((left, right) => compareValues(left, right) * direction)
}

const rootItems = computed(() => sortedSiblings(
  (childrenByParent.value.get(undefined) ?? []).filter((item) => includedIds.value.has(item.id)),
))

const pagedRootItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return rootItems.value.slice(start, start + pageSize.value)
})

const listItems = computed(() => sortedSiblings(directMatches.value))

const pagedListItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return listItems.value.slice(start, start + pageSize.value)
})

function createTableRow(
  item: DemoWorkItem,
  level = 1,
  hasChildren = false,
  expanded = false,
): WorkItemTableRow {
  return {
    id: item.id,
    item,
    key: item.key,
    title: item.title,
    status: statusMeta[item.status].label,
    plannedStart: item.plannedStart,
    plannedEnd: item.plannedEnd,
    assignee: item.assignees.map((person) => person.name).join('、'),
    priority: priorityMeta[item.priority].label,
    iteration: item.iteration,
    actualHours: item.actualHours,
    progress: item.progress,
    level,
    hasChildren,
    expanded,
  }
}

const pagedRows = computed<WorkItemTableRow[]>(() => {
  if (activeView.value === 'list') {
    return pagedListItems.value.map((item) => createTableRow(item))
  }

  const result: WorkItemTableRow[] = []
  const autoExpanded = hasActiveFilters.value

  const appendItems = (items: DemoWorkItem[], level: number) => {
    sortedSiblings(items).forEach((item) => {
      if (!includedIds.value.has(item.id)) return
      const children = (childrenByParent.value.get(item.id) ?? []).filter((child) => includedIds.value.has(child.id))
      const expanded = autoExpanded || expandedIds.value.has(item.id)
      result.push(createTableRow(item, level, children.length > 0, expanded))
      if (children.length > 0 && expanded) appendItems(children, Math.min(level + 1, 5))
    })
  }

  appendItems(pagedRootItems.value, 1)
  return result
})

const planRows = computed<WorkItemTableRow[]>(() => {
  const rows: WorkItemTableRow[] = []
  const append = (items: DemoWorkItem[], level: number) => {
    sortedSiblings(items).forEach(item => {
      if (!projectStore.value.planIds.value.includes(item.id) || !includedIds.value.has(item.id)) return
      const children = (childrenByParent.value.get(item.id) ?? []).filter(child => projectStore.value.planIds.value.includes(child.id) && includedIds.value.has(child.id))
      const expanded = hasActiveFilters.value || expandedIds.value.has(item.id)
      rows.push(createTableRow(item, level, children.length > 0, expanded))
      if (children.length && expanded) append(children, level + 1)
    })
  }
  append(rootItems.value, 1)
  return rows
})
const planColumns = computed<VisTableColumn[]>(() => {
  const order = ['key', 'title', 'actualHours', 'progress', 'plannedStart', 'plannedEnd', 'status', 'assignee', 'priority', 'iteration']
  return order.map(key => {
    const original = columns.value.find(column => column.key === key)!
    return {
      ...original,
      width: key === 'title' ? 320 : key === 'iteration' ? 200 : ['assignee', 'priority'].includes(key) ? 160 : 120,
      minWidth: undefined,
      headerAlign: ['actualHours', 'progress'].includes(key) ? 'right' as const : 'left' as const,
      headerLeftButton: key === 'title',
      headerLeftButtonIcon: allExpanded.value ? 'chevron-selector-vertical-opened' as const : 'chevron-selector-vertical' as const,
      headerLeftButtonLabel: allExpanded.value ? '全部折叠' : '全部展开',
      headerLeftButtonTooltip: allExpanded.value ? '全部折叠' : '全部展开',
      headerLeftButtonTooltipOpenDelay: 1000,
      label: key === 'plannedStart' ? '开始时间' : key === 'plannedEnd' ? '结束时间' : original.label,
    }
  })
})
const ganttProps = computed(() => isPlan.value ? {
  milestones: projectStore.value.milestones.value,
  schedules: workItems.value.filter(item => projectStore.value.planIds.value.includes(item.id)),
} : {})
const availableWorkItems = computed(() => workItems.value.filter(item =>
  !projectStore.value.planIds.value.includes(item.id)
  && `${item.key} ${item.title}`.toLocaleLowerCase().includes(addExistingSearch.value.trim().toLocaleLowerCase()),
).map(item => ({ ...item } as unknown as VisTableRowData)))

function handleModuleChange(value: string | number): void {
  if (value === 'plan' || value === 'work-items') {
    void router.push({ name: value === 'plan' ? 'project-plan' : 'project-work-items', params: { projectKey: route.params.projectKey } })
  } else setMessage('该模块将在后续版本补充', 'info')
}
function updatePlanItem(id: string, schedule: GanttSchedule): void {
  const item = workItems.value.find(value => value.id === id)
  if (!item) return
  if (!scheduleDays(schedule) || schedule.progress < 0 || schedule.progress > 100 || !Number.isFinite(schedule.progress)) {
    setMessage('日期或完成度无效，未保存修改', 'warning')
    return
  }
  const before = { plannedStart: item.plannedStart, plannedEnd: item.plannedEnd, progress: item.progress }
  if (childrenByParent.value.has(id)) {
    // Pin only the fields the user actually changed; other fields still roll up.
    item.scheduleOverrides = {
      ...item.scheduleOverrides,
      ...(before.plannedStart !== schedule.plannedStart ? { plannedStart: schedule.plannedStart } : {}),
      ...(before.plannedEnd !== schedule.plannedEnd ? { plannedEnd: schedule.plannedEnd } : {}),
      ...(before.progress !== schedule.progress ? { progress: schedule.progress } : {}),
    }
  }
  Object.assign(item, { plannedStart: schedule.plannedStart, plannedEnd: schedule.plannedEnd, progress: schedule.progress })
  refreshParentSchedules(workItems.value)
  projectStore.value.changes.value.push({ workItemId: id, before, after: { ...schedule }, changedAt: new Date().toISOString() })
  setMessage('修改已生效')
}
function confirmAddExisting(): void {
  if (!addExistingSelection.value.length) {
    setMessage('请选择需要添加的工作项', 'warning')
    return
  }
  const next = new Set(projectStore.value.planIds.value)
  const add = (item: DemoWorkItem) => {
    if (next.has(item.id)) return
    next.add(item.id)
    if (item.parentId) {
      const parent = workItems.value.find(value => value.id === item.parentId)
      if (parent) add(parent)
    }
  }
  addExistingSelection.value.forEach(add)
  projectStore.value.planIds.value = [...next]
  addExistingOpen.value = false
  addExistingSelection.value = []
  addExistingSearch.value = ''
  setMessage('已添加到计划')
}

const paginationTotal = computed(() =>
  activeView.value === 'list' ? listItems.value.length : rootItems.value.length,
)

const statusButtonLabel = computed(() => selectedStatus.value === 'all' ? '状态' : statusMeta[selectedStatus.value].label)
const creatorButtonLabel = computed(() => selectedCreator.value === 'all' ? '创建人' : selectedCreator.value)
const priorityButtonLabel = computed(() => selectedPriority.value === 'all' ? '优先级' : priorityMeta[selectedPriority.value].label)
const sortButtonLabel = computed(() => !sortField.value ? '排序' : `开始时间${sortOrder.value === 'ascending' ? '升序' : '降序'}`)

function rowValue(row: VisTableRowData): WorkItemTableRow {
  return row as WorkItemTableRow
}

function setMessage(text: string, type: VisMessageType = 'success'): void {
  messageVisible.value = false
  messageText.value = text
  messageType.value = type
  void nextTick(() => { messageVisible.value = true })
}

function handleScopeChange(value: VisSegmentedValue): void {
  if (value === 'settings') {
    setMessage('范围设置将在后续版本补充', 'info')
    return
  }
  selectedScope.value = value as WorkItemScope
}

function handleViewChange(value: VisSegmentedValue): void {
  if (value === 'tree' || value === 'list') {
    activeView.value = value
    return
  }
  setMessage('Kanban 视图将在后续补充', 'info')
}

function handleStatusSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label === '全部状态') selectedStatus.value = 'all'
  else if (payload.item.descriptionText) selectedStatus.value = payload.item.descriptionText as DemoWorkItemStatus
}

function handleCreatorSelect(payload: { item: VisDropdownEntry }): void {
  selectedCreator.value = payload.item.label === '全部创建人' ? 'all' : (payload.item.label ?? 'all')
}

function handlePrioritySelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label === '全部优先级') selectedPriority.value = 'all'
  else if (payload.item.descriptionText) selectedPriority.value = payload.item.descriptionText as DemoWorkItemPriority
}

function handleOverflowSelect(payload: { item: VisDropdownEntry; index: number }): void {
  if (payload.item.label === '全部展开' || payload.item.label === '全部收起') toggleAllRows()
  else setMessage('已准备当前视图的导出任务', 'info')
}

function toggleRow(id: string): void {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

function toggleAllRows(): void {
  expandedIds.value = allExpanded.value ? new Set() : new Set(expandableIds.value)
}

function toggleFollowed(row: WorkItemTableRow): void {
  row.item.followed = !row.item.followed
  workItems.value = [...workItems.value]
}

function toggleSort(): void {
  if (sortField.value !== 'plannedStart') {
    sortField.value = 'plannedStart'
    sortOrder.value = 'ascending'
  } else if (sortOrder.value === 'ascending') {
    sortOrder.value = 'descending'
  } else {
    sortField.value = null
    sortOrder.value = 'ascending'
  }
}

function handleTableSort(sort: VisTableSortChange): void {
  if (!sort.prop || !sort.order) {
    sortField.value = null
    return
  }
  sortField.value = sort.prop as SortField
  sortOrder.value = sort.order
}

function resetFilters(): void {
  selectedScope.value = 'all'
  searchValue.value = ''
  selectedStatus.value = 'all'
  selectedCreator.value = 'all'
  selectedPriority.value = 'all'
}

function updateCreateType(value: VisSelectModelValue | undefined): void {
  if (typeof value === 'string') createType.value = value as DemoWorkItemType
}

function confirmCreate(): void {
  const title = createTitle.value.trim()
  if (!title) {
    setMessage('请输入工作项标题', 'warning')
    return
  }
  const index = workItems.value.length + 1
  const prefix = createType.value === 'epic' ? 'EPIC' : createType.value === 'feature' ? 'FEAT' : createType.value === 'story' ? 'US' : createType.value === 'bug' ? 'BUG' : 'TASK'
  workItems.value.push({
    id: `created-${Date.now()}`,
    key: `${prefix}-${String(index).padStart(3, '0')}`,
    title,
    type: createType.value,
    status: 'not-started',
    plannedStart: '2026/09/01',
    plannedEnd: '2026/09/30',
    assignees: [demoWorkItemPeople[0]],
    creator: '张大山',
    priority: 'medium',
    iteration: '待规划',
    actualHours: 0,
    progress: 0,
  })
  workItems.value = [...workItems.value]
  if (isPlan.value) projectStore.value.planIds.value = [...projectStore.value.planIds.value, workItems.value.at(-1)!.id]
  createOpen.value = false
  createTitle.value = ''
  setMessage('已成功新建')
}

watch([selectedScope, searchValue, selectedStatus, selectedCreator, selectedPriority, pageSize, activeView], () => {
  currentPage.value = 1
})

onMounted(() => {
  document.title = `${isPlan.value ? '计划' : '工作项'} - Vision Application`
})
</script>

<template>
  <section class="work-items-page" :class="{ 'is-plan': isPlan }" :aria-label="isPlan ? '项目计划' : '项目工作项'">
    <header class="work-items-page__module-nav">
      <VisTabs :model-value="isPlan ? 'plan' : 'work-items'" :items="moduleTabs" aria-label="项目管理模块" @change="handleModuleChange" />
    </header>

    <div class="work-items-page__workspace">
      <div class="work-items-page__toolbar" aria-label="工作项筛选和操作">
        <div class="work-items-page__filters">
          <VisSegmented
            :model-value="selectedScope"
            :options="scopeOptions"
            aria-label="工作项范围"
            @change="handleScopeChange"
          />
          <VisInputSearchBox
            v-model="searchValue"
            class="work-items-page__search"
            placeholder="请输入标题/编号/描述关键字"
            aria-label="搜索工作项"
          />
          <VisDropdown :items="statusItems" :button-label="statusButtonLabel" @select="handleStatusSelect" />
          <VisDropdown :items="creatorItems" :button-label="creatorButtonLabel" @select="handleCreatorSelect" />
          <VisButton
            variant="secondary"
            size="md"
            prefix
            icon-name="filter-funnel-02"
            label="更多筛选"
            @click="moreFiltersVisible = !moreFiltersVisible"
          >更多筛选</VisButton>
        </div>

        <div class="work-items-page__actions">
          <template v-if="isPlan">
            <VisButton variant="text" size="md" label="定位今天" @click="ganttRef?.locateToday()">今天</VisButton>
            <VisButton variant="text" size="md" label="定位计划" @click="ganttRef?.locatePlan()">定位计划</VisButton>
            <VisButton variant="secondary" size="md" label="添加已有工作项" @click="addExistingSelection = []; addExistingSearch = ''; addExistingOpen = true">添加已有工作项</VisButton>
          </template>
          <VisButton
            v-if="!isPlan"
            variant="text"
            size="md"
            prefix
            icon-name="switch-vertical-02"
            :label="sortButtonLabel"
            @click="toggleSort"
          >{{ sortButtonLabel }}</VisButton>
          <VisDropdown v-if="!isPlan" :items="overflowItems" @select="handleOverflowSelect">
            <template #trigger="{ open, toggle }">
              <VisButton
                variant="text"
                size="md"
                icon-only
                icon-name="dots-horizontal"
                label="更多工作项操作"
                :aria-expanded="open"
                @click="toggle"
              />
            </template>
          </VisDropdown>
          <VisButton size="md" prefix icon-name="plus" label="新建工作项" @click="createOpen = true">新建</VisButton>
          <VisSegmented
            v-if="!isPlan"
            :model-value="activeView"
            :options="viewOptions"
            :text="false"
            aria-label="工作项视图"
            @change="handleViewChange"
          />
        </div>
      </div>

      <div v-if="moreFiltersVisible" class="work-items-page__more-filters">
        <VisDropdown :items="priorityItems" :button-label="priorityButtonLabel" @select="handlePrioritySelect" />
        <span class="work-items-page__result-count">当前条件下 {{ directMatches.length }} 个工作项</span>
        <VisButton v-if="hasActiveFilters" variant="text" size="md" @click="resetFilters">清除全部</VisButton>
      </div>

      <div class="work-items-page__table-shell">
        <component
          :is="isPlan ? PlanGanttWorkspace : VisTable"
          :ref="(value: unknown) => { if (isPlan) ganttRef = value as InstanceType<typeof PlanGanttWorkspace> }"
          :class="isPlan ? 'work-items-page__gantt' : 'work-items-page__table'"
          v-bind="ganttProps"
          :data="isPlan ? planRows : pagedRows"
          :columns="isPlan ? planColumns : columns"
          appearance="grid"
          row-key="id"
          :selectable="!isPlan"
          :fixed-start-columns="isPlan ? 0 : 2"
          :fixed-end-columns="isPlan ? 0 : 1"
          height="100%"
          empty-text="未找到符合条件的工作项"
          :aria-label="activeView === 'list' ? '工作项列表' : '工作项树形列表'"
          @sort-change="handleTableSort"
          @header-left-button="toggleAllRows"
          @update-work-item="updatePlanItem"
          @notice="setMessage($event, 'info')"
        >
          <template #cell-title="{ row }">
            <div
              class="work-item-title-cell"
              :style="isPlan || activeView === 'tree'
                ? { paddingInlineStart: `${(rowValue(row).level - 1) * 24}px` }
                : undefined"
            >
              <VisButton
                v-if="(isPlan || activeView === 'tree') && rowValue(row).hasChildren"
                class="work-item-title-cell__toggle"
                variant="text"
                size="sm"
                icon-only
                icon-name="chevron-right"
                :label="rowValue(row).expanded ? `收起${rowValue(row).title}` : `展开${rowValue(row).title}`"
                :aria-expanded="rowValue(row).expanded"
                @click.stop="toggleRow(rowValue(row).id)"
              />
              <span
                v-else-if="isPlan || activeView === 'tree'"
                class="work-item-title-cell__spacer"
                aria-hidden="true"
              />
              <img
                class="work-item-title-cell__type"
                :src="typeIcon[rowValue(row).item.type]"
                :alt="`${rowValue(row).item.type} 类型`"
              >
              <span class="work-item-title-cell__text">{{ rowValue(row).title }}</span>
            </div>
          </template>

          <template #cell-assignee="{ row }">
            <VisAvatarLabel
              v-if="rowValue(row).item.assignees.length === 1"
              size="xs"
              :addition="false"
              :title="rowValue(row).item.assignees[0]?.name"
              :avatar-image-variant="rowValue(row).item.assignees[0]?.avatar"
              :avatar-image-alt="rowValue(row).item.assignees[0]?.name"
            />
            <VisAvatarGroup
              v-else
              size="xs"
              :items="rowValue(row).item.assignees.map((person) => ({ variant: person.avatar, alt: person.name }))"
              :addition="false"
            />
          </template>

          <template #cell-actualHours="{ row }">{{ rowValue(row).actualHours }}h</template>
          <template #cell-progress="{ row }">{{ rowValue(row).progress }}%</template>

          <template #cell-operations="{ row }">
            <div class="work-item-operation-cell">
              <VisButton
                class="work-item-operation-cell__follow"
                :class="{ 'is-followed': rowValue(row).item.followed }"
                variant="text"
                size="sm"
                icon-only
                icon-name="star-01"
                :label="rowValue(row).item.followed ? '取消关注' : '关注工作项'"
                @click.stop="toggleFollowed(rowValue(row))"
              />
              <VisButton variant="text" size="sm" icon-only icon-name="dots-horizontal" label="更多操作" />
            </div>
          </template>
        </component>
        <div v-if="!isPlan" class="work-items-page__table-settings">
          <VisButton
            variant="text"
            size="sm"
            icon-only
            icon-name="settings-01"
            label="设置表格列"
          />
        </div>
      </div>

      <footer v-if="!isPlan" class="work-items-page__pagination">
        <VisPagination
          v-model="currentPage"
          v-model:page-size="pageSize"
          :total="paginationTotal"
          :page-size-options="[20, 50, 100]"
          count
          quantity
          goto
          aria-label="工作项分页"
        />
      </footer>
    </div>

    <Teleport to="body">
      <div v-if="addExistingOpen" class="work-item-create__mask">
        <VisModal :model-value="addExistingOpen" title="添加已有工作项" :width="680" height="auto" divider footer @close="addExistingOpen = false" @cancel="addExistingOpen = false">
          <div class="work-item-add-existing">
            <VisInputSearchBox v-model="addExistingSearch" placeholder="搜索标题或编号" aria-label="搜索待添加工作项" />
            <VisTable :data="availableWorkItems" :columns="[{ key: 'key', label: '编号', width: 120 }, { key: 'title', label: '标题' }]" selectable height="320" row-key="id" empty-text="没有可添加的工作项" @selection-change="addExistingSelection = $event as unknown as DemoWorkItem[]" />
          </div>
          <template #footer>
            <VisButton variant="secondary" size="md" @click="addExistingOpen = false">取消</VisButton>
            <VisButton size="md" :disabled="!addExistingSelection.length" @click="confirmAddExisting">添加到计划</VisButton>
          </template>
        </VisModal>
      </div>
      <div v-if="createOpen" class="work-item-create__mask">
        <VisModal
          :model-value="createOpen"
          title="新建工作项"
          :width="420"
          height="auto"
          divider
          footer
          confirm-text="新建"
          @close="createOpen = false"
          @cancel="createOpen = false"
          @confirm="confirmCreate"
        >
          <div class="work-item-create__form">
            <label class="work-item-create__field">
              <span>工作项类型</span>
              <VisSelect
                :model-value="createType"
                :options="createTypeOptions"
                width="100%"
                aria-label="选择工作项类型"
                @update:model-value="updateCreateType"
              />
            </label>
            <label class="work-item-create__field">
              <span>标题 <em>*</em></span>
              <VisInput v-model="createTitle" placeholder="请输入工作项标题" aria-label="工作项标题" />
            </label>
          </div>
        </VisModal>
      </div>

      <div class="work-items-page__message-host" aria-live="polite">
        <VisMessage
          v-model="messageVisible"
          :type="messageType"
          :text="messageText"
          auto-close
          :duration="2400"
        />
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.work-items-page {
  block-size: 100%;
  min-block-size: 0;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  overflow: hidden;
}

.work-items-page__module-nav {
  position: relative;
  min-block-size: var(--space-48);
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-20);
  display: flex;
  align-items: flex-end;
  flex: 0 0 var(--space-48);
}

.work-items-page__module-nav :deep(.vis-tabs.align-horizontal) {
  box-shadow: none;
}

.work-items-page__workspace {
  min-block-size: 0;
  padding: var(--space-16) var(--space-20) 0;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  overflow: hidden;
}

.is-plan .work-items-page__workspace { padding-block-end: var(--space-20); }
.work-items-page__gantt { flex: 1; min-width: 0; }
.work-item-add-existing { display: flex; flex-direction: column; gap: var(--space-12); padding: var(--space-20); }
@media (max-width: 1400px) {
  .is-plan .work-items-page__toolbar { flex-wrap: wrap; }
  .is-plan .work-items-page__actions { margin-inline-start: auto; }
}

.work-items-page__toolbar {
  min-inline-size: 0;
  min-block-size: var(--space-32);
  margin-block-end: var(--space-12);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.work-items-page__filters,
.work-items-page__actions,
.work-items-page__more-filters {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.work-items-page__filters {
  flex: 1 1 auto;
  flex-wrap: wrap;
}

.work-items-page__actions {
  flex: 0 0 auto;
}

.work-items-page__search {
  inline-size: 240px;
}

.work-items-page__more-filters {
  min-block-size: var(--space-40);
  margin-block: calc(var(--space-4) * -1) var(--space-8);
  padding-inline: var(--space-8);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  flex: 0 0 auto;
}

.work-items-page__result-count {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.work-items-page__table-shell {
  position: relative;
  min-block-size: 0;
  display: flex;
  flex: 1 1 0;
  overflow: hidden;
}

.work-items-page__table-settings {
  position: absolute;
  z-index: 4;
  inset-block-start: 0;
  inset-inline-end: 0;
  box-sizing: border-box;
  inline-size: var(--space-40);
  block-size: var(--space-40);
  border-block-end: 1px solid var(--color-border-default);
  border-inline-start: 1px solid var(--color-border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
}

.work-items-page__table {
  min-block-size: 0;
  block-size: 100%;
  flex: 1 1 0;
}

.work-items-page__table :deep(.vis-el-table__header-wrapper th.vis-el-table__cell),
.work-items-page__table :deep(.vis-table-header) {
  block-size: var(--space-40);
}

.work-items-page__table :deep(.vis-el-table__header-wrapper .cell) {
  block-size: calc(var(--space-40) - 1px);
}

.work-items-page__table :deep(.vis-el-table__header-wrapper th.vis-el-table__cell) {
  background: var(--color-bg-primary);
}

.work-items-page__table :deep(.vis-el-table__body-wrapper td.vis-el-table__cell) {
  block-size: var(--space-48);
}

.work-items-page__table :deep(.vis-el-table__inner-wrapper),
.work-items-page__table :deep(.vis-el-table__body-wrapper),
.work-items-page__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar),
.work-items-page__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar__wrap) {
  min-block-size: 0;
}

.work-items-page__table :deep(.vis-el-table__inner-wrapper) {
  block-size: 100%;
}

.work-items-page__table :deep(.vis-el-table__body-wrapper) {
  block-size: calc(100% - var(--space-40));
}

.work-items-page__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar),
.work-items-page__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar__wrap) {
  block-size: 100%;
}

.work-items-page__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar__wrap) {
  overflow: auto;
  overscroll-behavior: contain;
}

.work-items-page__table :deep(.cell) {
  padding: 0;
}

.work-items-page__table :deep(.vis-table-item) {
  border-block-end: 0;
}

.work-items-page__table :deep(.vis-el-table__row:hover td.vis-el-table__cell),
.work-items-page__table :deep(.vis-el-table__row:hover .vis-table-item) {
  background: var(--color-bg-secondary);
}

.work-item-title-cell {
  min-inline-size: 0;
  inline-size: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.work-item-title-cell__toggle,
.work-item-title-cell__spacer {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  flex: 0 0 var(--space-24);
}

.work-item-title-cell__toggle {
  padding: 0;
}

.work-item-title-cell__toggle[aria-expanded='true'] :deep(.vis-icon) {
  transform: rotate(90deg);
}

.work-item-title-cell__type {
  inline-size: var(--space-20);
  block-size: var(--space-20);
  margin-inline: 2px;
  object-fit: contain;
  flex: 0 0 var(--space-20);
}

.work-item-title-cell__text {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 auto;
}

.work-item-operation-cell {
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-8);
}

.work-item-operation-cell__follow.is-followed {
  color: var(--color-fg-brand-primary);
}

.work-items-page__pagination {
  min-block-size: var(--space-48);
  display: flex;
  align-items: center;
  flex: 0 0 var(--space-48);
}

.work-item-create__mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-component-mask);
}

.work-item-create__form {
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.work-item-create__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.work-item-create__field em {
  color: var(--color-text-danger-primary);
  font-style: normal;
}

.work-items-page__message-host {
  position: fixed;
  inset-block-start: var(--space-72);
  inset-inline-start: 50%;
  z-index: 1200;
  transform: translateX(-50%);
  pointer-events: none;
}

@media (max-width: 1280px) {
  .work-items-page__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .work-items-page__actions {
    justify-content: flex-end;
  }

  .work-items-page__search {
    flex: 1 1 220px;
  }
}
</style>
