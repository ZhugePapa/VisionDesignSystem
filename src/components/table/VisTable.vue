<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'
import type { TableInstance } from 'element-plus'
import { computed, ref, useSlots } from 'vue'

import type {
  VisTableAction,
  VisTableColumn,
  VisTableItemProps,
  VisTableProps,
  VisTableRowData,
  VisTableRowKey,
  VisTableSortChange,
} from './table.types'
import VisTableHeader from './VisTableHeader.vue'
import VisTableItem from './VisTableItem.vue'

const props = withDefaults(defineProps<VisTableProps>(), {
  data: () => [],
  columns: () => [],
  appearance: 'horizontal',
  rowKey: 'id',
  selectable: false,
  highlightActiveRow: false,
  activeRowKey: null,
  defaultSort: undefined,
  emptyText: '暂无数据',
  height: undefined,
  maxHeight: undefined,
  showHeader: true,
  ariaLabel: '表格',
})

const emit = defineEmits<{
  'selection-change': [selection: VisTableRowData[]]
  'sort-change': [sort: VisTableSortChange]
  'row-click': [row: VisTableRowData, column: unknown, event: PointerEvent]
  'active-change': [key: VisTableRowKey, row: VisTableRowData]
  'cell-action': [action: VisTableAction, row: VisTableRowData, column: VisTableColumn, actionIndex: number]
  'tree-toggle': [expanded: boolean, row: VisTableRowData, column: VisTableColumn]
  'cell-shortcut': [row: VisTableRowData, column: VisTableColumn]
  'cell-drag': [event: PointerEvent, row: VisTableRowData, column: VisTableColumn]
}>()

const slots = useSlots()
const tableRef = ref<TableInstance>()
const currentSort = ref<VisTableSortChange>({
  column: {} as VisTableSortChange['column'],
  prop: props.defaultSort?.prop ?? null,
  order: props.defaultSort?.order ?? null,
})

const tableClasses = computed(() => [
  `appearance-${props.appearance}`,
  {
    'is-selectable': props.selectable,
  },
])

function resolveRowKey(row: VisTableRowData): VisTableRowKey | undefined {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  const value = props.rowKey.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as VisTableRowData)[segment]
  }, row)
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

function rowClassName({ row }: { row: VisTableRowData }): string {
  const key = resolveRowKey(row)
  return props.highlightActiveRow && key !== undefined && key === props.activeRowKey
    ? 'is-active-row'
    : ''
}

function cellSlotName(column: VisTableColumn): string {
  return `cell-${column.key}`
}

function headerSlotName(column: VisTableColumn): string {
  return `header-${column.key}`
}

function cellValue(row: VisTableRowData, column: VisTableColumn): unknown {
  const path = column.prop ?? column.key
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as VisTableRowData)[segment]
  }, row)
}

function resolveItemProps(
  row: VisTableRowData,
  column: VisTableColumn,
  rowIndex: number,
): Omit<VisTableItemProps, 'appearance' | 'type' | 'value'> {
  const source = column.itemProps
  if (!source) return {}
  return typeof source === 'function' ? source(row, rowIndex) : source
}

function handleSortChange(sort: VisTableSortChange): void {
  currentSort.value = sort
  emit('sort-change', sort)
}

function columnSortOrder(column: VisTableColumn) {
  const prop = column.prop ?? column.key
  return currentSort.value.prop === prop ? currentSort.value.order : null
}

function handleCellAction(
  action: VisTableAction,
  actionIndex: number,
  row: VisTableRowData,
  column: VisTableColumn,
): void {
  emit('cell-action', action, row, column, actionIndex)
}

function handleRowClick(row: VisTableRowData, column: unknown, event: PointerEvent): void {
  emit('row-click', row, column, event)
  const key = resolveRowKey(row)
  if (key !== undefined) emit('active-change', key, row)
}

defineExpose({
  tableRef,
  clearSelection: () => tableRef.value?.clearSelection(),
  getSelectionRows: () => tableRef.value?.getSelectionRows(),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowSelection: (row: VisTableRowData, selected?: boolean) =>
    tableRef.value?.toggleRowSelection(row, selected),
})
</script>

<template>
  <ElTable
    ref="tableRef"
    class="vis-table"
    :class="tableClasses"
    :data="data"
    :border="appearance === 'grid'"
    :row-key="rowKey"
    :row-class-name="rowClassName"
    :default-sort="defaultSort"
    :empty-text="emptyText"
    :height="height"
    :max-height="maxHeight"
    :show-header="showHeader"
    :aria-label="ariaLabel"
    @selection-change="emit('selection-change', $event)"
    @sort-change="handleSortChange"
    @row-click="handleRowClick"
  >
    <ElTableColumn v-if="selectable" type="selection" width="48" align="center" />

    <ElTableColumn
      v-for="column in columns"
      :key="column.key"
      :prop="column.prop ?? column.key"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :align="column.align ?? 'left'"
      :header-align="column.headerAlign ?? column.align ?? 'left'"
      :fixed="column.fixed"
      :sortable="column.sortable"
      :show-overflow-tooltip="column.showOverflowTooltip ?? true"
      :class-name="column.className"
      :formatter="column.formatter"
    >
      <template #header="scope">
        <VisTableHeader
          :type="column.headerType ?? 'default'"
          :appearance="appearance"
          :label="column.label"
          :align="column.headerAlign ?? column.align ?? 'left'"
          :prefix-icon="column.headerPrefixIcon"
          :left-button="column.headerLeftButton"
          :sortable="Boolean(column.sortable)"
          :sort-order="columnSortOrder(column)"
        >
          <slot
            v-if="slots[headerSlotName(column)]"
            :name="headerSlotName(column)"
            v-bind="scope"
            :column-definition="column"
          />
        </VisTableHeader>
      </template>

      <template #default="scope">
        <VisTableItem
          :type="column.cellType ?? 'text'"
          :appearance="appearance"
          :value="cellValue(scope.row, column)"
          v-bind="resolveItemProps(scope.row, column, scope.$index)"
          @action-click="(action, index) => handleCellAction(action, index, scope.row, column)"
          @tree-toggle="emit('tree-toggle', $event, scope.row, column)"
          @shortcut="emit('cell-shortcut', scope.row, column)"
          @drag="emit('cell-drag', $event, scope.row, column)"
        >
          <slot
            v-if="slots[cellSlotName(column)]"
            :name="cellSlotName(column)"
            v-bind="scope"
            :value="cellValue(scope.row, column)"
            :column-definition="column"
          />
        </VisTableItem>
      </template>
    </ElTableColumn>

    <template #empty>
      <slot name="empty">{{ emptyText }}</slot>
    </template>
  </ElTable>
</template>

<style scoped>
.vis-table {
  --el-table-border-color: var(--color-border-default);
  --el-table-border: 1px solid var(--color-border-default);
  --el-table-header-bg-color: var(--color-bg-secondary);
  --el-table-tr-bg-color: var(--color-bg-surface);
  --el-table-row-hover-bg-color: var(--color-bg-secondary);
  --el-table-current-row-bg-color: var(--color-fg-brand-subtle);
  --el-table-header-text-color: var(--color-text-secondary);
  --el-table-text-color: var(--color-text-secondary);
  --el-fill-color-lighter: var(--color-bg-secondary);
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  border: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-table::after {
  position: absolute;
  inset: 0;
  z-index: 10;
  box-sizing: border-box;
  inline-size: auto;
  block-size: auto;
  border: 1px solid var(--color-border-default);
  border-radius: inherit;
  display: block;
  content: '';
  pointer-events: none;
  background: transparent;
}

.vis-table :deep(.vis-el-table__inner-wrapper) {
  position: relative;
  inline-size: 100%;
  overflow: hidden;
}

.vis-table :deep(.hidden-columns) {
  position: absolute;
  z-index: -1;
  visibility: hidden;
}

.vis-table :deep(.vis-el-table__header-wrapper),
.vis-table :deep(.vis-el-table__body-wrapper) {
  inline-size: 100%;
}

.vis-table :deep(.vis-el-table__body-wrapper) {
  overflow-x: auto;
  overflow-y: hidden;
}

.vis-table :deep(.vis-el-table__header),
.vis-table :deep(.vis-el-table__body) {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.vis-table :deep(.vis-el-table__inner-wrapper::before),
.vis-table :deep(.vis-el-table--border::after),
.vis-table :deep(.vis-el-table--border::before) {
  display: none;
}

.vis-table :deep(.vis-el-table__header-wrapper th.vis-el-table__cell),
.vis-table :deep(.vis-el-table__body-wrapper td.vis-el-table__cell) {
  box-sizing: border-box;
  block-size: var(--space-48);
  border: 0;
  border-block-end: 1px solid var(--color-border-default);
  padding: 0;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-table :deep(.vis-el-table__header-wrapper th.vis-el-table__cell) {
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
}

.vis-table :deep(.vis-el-table__cell .cell) {
  box-sizing: border-box;
  block-size: calc(var(--space-48) - 1px);
  min-inline-size: 0;
  inline-size: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  line-height: var(--font-text-md-line-height);
}

.vis-table :deep(.vis-table-header),
.vis-table :deep(.vis-table-item) {
  block-size: 100%;
  border-block-end: 0;
  background: inherit;
}

.vis-table.appearance-grid :deep(.vis-el-table__header tr > th + th),
.vis-table.appearance-grid :deep(.vis-el-table__body tr > td + td) {
  border-inline-start: 1px solid var(--color-border-default);
}

.vis-table.appearance-grid :deep(.vis-table-header),
.vis-table.appearance-grid :deep(.vis-table-item) {
  border-inline-start: 0;
}

.vis-table :deep(.vis-el-table-column--selection .cell) {
  padding: 0;
  justify-content: center;
}

.vis-table :deep(.vis-el-table__row > td.vis-el-table__cell) {
  background: var(--color-bg-surface);
  transition: background-color 0.16s ease;
}

.vis-table :deep(.vis-el-table__body tr:hover > td.vis-el-table__cell) {
  background: var(--color-bg-secondary);
}

.vis-table.appearance-grid :deep(.vis-el-table__body tr:hover > td.vis-el-table__cell:hover) {
  background: var(--color-bg-tertiary);
}

.vis-table :deep(.vis-el-table__body tr.is-active-row > td.vis-el-table__cell) {
  background: var(--color-fg-brand-subtle);
}

.vis-table :deep(.vis-el-table__body tr.is-active-row:hover > td.vis-el-table__cell) {
  background: var(--color-fg-brand-subtle);
}

.vis-table.appearance-grid :deep(
  .vis-el-table__body tr.is-active-row:hover > td.vis-el-table__cell:hover
) {
  background: var(--color-fg-brand-subtle);
}

.vis-table :deep(.vis-el-checkbox) {
  position: relative;
  display: inline-flex;
  align-items: center;
  block-size: var(--space-16);
}

.vis-table :deep(.vis-el-checkbox__input) {
  display: inline-flex;
  align-items: center;
}

.vis-table :deep(.vis-el-checkbox__original) {
  position: absolute;
  opacity: 0;
}

.vis-table :deep(.vis-el-checkbox__inner) {
  position: relative;
  box-sizing: border-box;
  inline-size: 12px;
  block-size: 12px;
  border: 1px solid var(--color-border-strong);
  border-color: var(--color-border-strong);
  border-radius: 3px;
  display: inline-block;
  background: transparent;
}

.vis-table :deep(.vis-el-checkbox__inner::after) {
  position: absolute;
  inset-inline-start: 3px;
  inset-block-start: 0;
  inline-size: 3px;
  block-size: 6px;
  border: 1px solid var(--color-text-white);
  border-block-start: 0;
  border-inline-start: 0;
  content: '';
  opacity: 0;
  transform: rotate(45deg) scaleY(0);
  transform-origin: center;
}

.vis-table :deep(.vis-el-checkbox__input.is-indeterminate .vis-el-checkbox__inner::before) {
  position: absolute;
  inset-inline-start: 2px;
  inset-block-start: 4px;
  inline-size: 6px;
  block-size: 2px;
  background: var(--color-text-white);
  content: '';
}

.vis-table :deep(.vis-el-checkbox__input.is-checked .vis-el-checkbox__inner),
.vis-table :deep(.vis-el-checkbox__input.is-indeterminate .vis-el-checkbox__inner) {
  border-color: var(--color-border-brand);
  background: var(--color-border-brand);
}

.vis-table :deep(.vis-el-checkbox__input.is-checked .vis-el-checkbox__inner::after) {
  opacity: 1;
  transform: rotate(45deg) scaleY(1);
}

.vis-table :deep(.caret-wrapper) {
  display: none;
}

.vis-table__header-label,
.vis-table__cell-text {
  display: block;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-table :deep(.vis-el-table__empty-block) {
  min-block-size: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}
</style>
