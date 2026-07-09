<script setup lang="ts">
import { computed } from 'vue'

import VisButton from '../button/VisButton.vue'
import VisCheckbox from '../checkbox/VisCheckbox.vue'
import { Icon, type IconName } from '../icons'
import VisTag from '../tag/VisTag.vue'
import type { VisTreeViewFolderType, VisTreeViewItem, VisTreeViewKey, VisTreeViewProps } from './tree-view.types'

interface FlatTreeItem {
  item: VisTreeViewItem
  level: number
  indentStates: TreeIndentState[]
}

type TreeIndentState = 'none' | 'through' | 'branch' | 'end'

defineOptions({
  name: 'VisTreeView',
})

const props = withDefaults(defineProps<VisTreeViewProps>(), {
  items: () => [],
  expandedKeys: () => [],
  selectedKey: null,
  checkedKeys: () => [],
  checkable: true,
  draggable: false,
  icon: true,
  actions: true,
  folderType: 'default',
  width: 300,
})

const emit = defineEmits<{
  (event: 'update:expandedKeys', value: VisTreeViewKey[]): void
  (event: 'update:selectedKey', value: VisTreeViewKey | null): void
  (event: 'update:checkedKeys', value: VisTreeViewKey[]): void
  (event: 'expand', payload: { key: VisTreeViewKey; expanded: boolean; item: VisTreeViewItem }): void
  (event: 'select', payload: { key: VisTreeViewKey; item: VisTreeViewItem }): void
  (event: 'check', payload: { key: VisTreeViewKey; checked: boolean; item: VisTreeViewItem }): void
  (event: 'action-click', payload: { key: VisTreeViewKey; item: VisTreeViewItem; nativeEvent: MouseEvent }): void
}>()

const expandedKeySet = computed(() => new Set(props.expandedKeys))
const checkedKeySet = computed(() => new Set(props.checkedKeys))

const rootStyle = computed(() => ({
  '--vis-tree-width': typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

const flatItems = computed<FlatTreeItem[]>(() => {
  const result: FlatTreeItem[] = []

  function walk(items: VisTreeViewItem[], level: number, parentIndents: TreeIndentState[]): void {
    items.forEach((item, index) => {
      const isLast = index === items.length - 1
      const currentIndentState: TreeIndentState = isLast ? 'end' : 'branch'
      const indentStates: TreeIndentState[] = level === 1 ? [] : [...parentIndents, currentIndentState]
      result.push({ item, level, indentStates })
      if (hasChildren(item) && expandedKeySet.value.has(item.key)) {
        const nextIndentState: TreeIndentState = isLast ? 'none' : 'through'
        walk(item.children ?? [], level + 1, [...parentIndents, nextIndentState])
      }
    })
  }

  walk(props.items, 1, [])
  return result
})

function hasChildren(item: VisTreeViewItem): boolean {
  return !!item.children?.length
}

function allDescendantKeys(item: VisTreeViewItem): VisTreeViewKey[] {
  const keys: VisTreeViewKey[] = []
  for (const child of item.children ?? []) {
    keys.push(child.key, ...allDescendantKeys(child))
  }
  return keys
}

function checkedState(item: VisTreeViewItem): { checked: boolean; indeterminate: boolean } {
  if (props.selectedKey === item.key) {
    return {
      checked: true,
      indeterminate: false,
    }
  }

  const descendants = allDescendantKeys(item)
  if (!descendants.length) {
    return {
      checked: checkedKeySet.value.has(item.key),
      indeterminate: false,
    }
  }

  const allKeys = [item.key, ...descendants]
  const checkedCount = allKeys.filter((key) => checkedKeySet.value.has(key)).length
  return {
    checked: checkedCount === allKeys.length,
    indeterminate: checkedCount > 0 && checkedCount < allKeys.length,
  }
}

function iconFor(item: VisTreeViewItem): IconName {
  if (item.icon) return item.icon
  return hasChildren(item) ? 'folder' : 'file-04'
}

function folderIcon(item: VisTreeViewItem): IconName {
  const expanded = expandedKeySet.value.has(item.key)
  if (props.folderType === '+/-') return expanded ? 'minus-square' : 'plus-square'
  return expanded ? 'chevron-down' : 'chevron-right'
}

function toggleExpand(item: VisTreeViewItem): void {
  if (!hasChildren(item) || item.disabled) return
  const nextSet = new Set(props.expandedKeys)
  const expanded = nextSet.has(item.key)
  if (expanded) {
    nextSet.delete(item.key)
  } else {
    nextSet.add(item.key)
  }
  const next = Array.from(nextSet)
  emit('update:expandedKeys', next)
  emit('expand', { key: item.key, expanded: !expanded, item })
}

function onSelect(item: VisTreeViewItem): void {
  if (item.disabled) return
  emit('update:selectedKey', item.key)
  emit('select', { key: item.key, item })
}

function onCheck(item: VisTreeViewItem, nextChecked: boolean): void {
  if (item.disabled) return
  const keys = [item.key, ...allDescendantKeys(item)]
  const nextSet = new Set(props.checkedKeys)
  for (const key of keys) {
    if (nextChecked) nextSet.add(key)
    else nextSet.delete(key)
  }
  emit('update:checkedKeys', Array.from(nextSet))
  emit('check', { key: item.key, checked: nextChecked, item })
}

function onActionClick(item: VisTreeViewItem, event: MouseEvent): void {
  event.stopPropagation()
  if (item.disabled) return
  emit('action-click', { key: item.key, item, nativeEvent: event })
}
</script>

<template>
  <div
    class="vis-tree-view"
    :class="{ 'is-folder-type-plus': folderType === '+/-' }"
    :style="rootStyle"
    role="tree"
  >
    <div
      v-for="{ item, level, indentStates } in flatItems"
      :key="String(item.key)"
      class="vis-tree-view__item"
      :class="{
        'is-selected': selectedKey === item.key,
        'is-selection-filled': !checkable && selectedKey === item.key,
        'is-disabled': item.disabled,
      }"
      role="treeitem"
      :aria-level="level"
      :aria-expanded="hasChildren(item) ? expandedKeySet.has(item.key) : undefined"
      :aria-selected="selectedKey === item.key"
      :style="{ '--vis-tree-level': level }"
      @click="onSelect(item)"
    >
      <VisButton
        v-if="draggable"
        class="vis-tree-view__slot vis-tree-view__drag"
        variant="text"
        size="sm"
        icon-only
        icon-name="dots-grid2"
        label="拖拽"
        :disabled="item.disabled"
        @click.stop
      />

      <span
        v-for="(indentState, indentIndex) in indentStates"
        :key="`indent-${item.key}-${indentIndex}`"
        class="vis-tree-view__indent"
        :class="`is-${indentState}`"
        aria-hidden="true"
      />

      <button
        type="button"
        class="vis-tree-view__folder"
        :class="{ 'is-hidden': !hasChildren(item) }"
        :disabled="item.disabled || !hasChildren(item)"
        :aria-label="expandedKeySet.has(item.key) ? '收起' : '展开'"
        @click.stop="toggleExpand(item)"
      >
        <Icon :name="folderIcon(item)" :size="16" decorative />
      </button>

      <span v-if="checkable" class="vis-tree-view__slot">
        <VisCheckbox
          :model-value="checkedState(item).checked"
          :indeterminate="checkedState(item).indeterminate"
          :disabled="item.disabled"
          :label="false"
          @update:model-value="onCheck(item, $event)"
        />
      </span>

      <span v-if="icon" class="vis-tree-view__slot vis-tree-view__node-icon" aria-hidden="true">
        <Icon :name="iconFor(item)" :size="16" decorative />
      </span>

      <span class="vis-tree-view__label">
        {{ item.label }}
      </span>

      <VisTag v-if="item.suffix" class="vis-tree-view__suffix" :label="item.suffix" />

      <VisButton
        v-if="actions"
        class="vis-tree-view__action"
        variant="text"
        size="sm"
        icon-only
        icon-name="dots-horizontal"
        label="更多操作"
        :disabled="item.disabled"
        @click="onActionClick(item, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.vis-tree-view {
  inline-size: min(100%, var(--vis-tree-width));
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.vis-tree-view__item {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-32);
  padding-inline: var(--space-4);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}

.vis-tree-view__item:not(.is-disabled):hover {
  background: var(--color-bg-secondary);
}

.vis-tree-view__item.is-selected:not(.is-disabled) {
  color: var(--color-text-primary);
}

.vis-tree-view__item.is-selection-filled:not(.is-disabled) {
  background: var(--color-bg-secondary);
}

.vis-tree-view__item.is-disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-tree-view__indent {
  position: relative;
  inline-size: var(--space-20);
  block-size: var(--space-20);
  flex: 0 0 auto;
}

.vis-tree-view.is-folder-type-plus .vis-tree-view__indent::before {
  position: absolute;
  inset-inline-start: 50%;
  border-inline-start: 1px solid var(--color-border-default);
  content: '';
}

.vis-tree-view.is-folder-type-plus .vis-tree-view__indent.is-through::before,
.vis-tree-view.is-folder-type-plus .vis-tree-view__indent.is-branch::before {
  inset-block: calc(calc(var(--space-4) + 2px) * -1);
}

.vis-tree-view.is-folder-type-plus .vis-tree-view__indent.is-end::before {
  inset-block-start: calc(calc(var(--space-4) + 2px) * -1);
  inline-size: 50%;
  block-size: calc(50% + var(--space-6));
  border-block-end: 1px solid var(--color-border-default);
  border-end-start-radius: var(--radius-sm);
}

.vis-tree-view.is-folder-type-plus .vis-tree-view__indent.is-branch::after {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 50%;
  border-block-start: 1px solid var(--color-border-default);
  content: '';
}

.vis-tree-view__slot,
.vis-tree-view__folder {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.vis-tree-view__folder {
  inline-size: var(--space-20);
  block-size: var(--space-20);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0;
  background: transparent;
  color: var(--color-fg-tertiary);
  cursor: pointer;
}

.vis-tree-view__folder:not(:disabled):hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.vis-tree-view__folder.is-hidden {
  visibility: hidden;
}

.vis-tree-view__drag {
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 120ms ease,
    color 120ms ease,
    background-color 120ms ease;
}

.vis-tree-view__drag,
.vis-tree-view__action {
  flex: 0 0 auto;
  color: var(--color-fg-tertiary);
}

.vis-tree-view__item:not(.is-disabled):hover .vis-tree-view__drag,
.vis-tree-view__drag:focus-visible {
  opacity: 1;
  pointer-events: auto;
}

.vis-tree-view__action {
  opacity: 0;
}

.vis-tree-view__item:hover .vis-tree-view__action,
.vis-tree-view__action:focus-visible {
  opacity: 1;
}

.vis-tree-view__node-icon {
  color: var(--color-fg-tertiary);
}

.vis-tree-view__label {
  min-inline-size: 0;
  flex: 1 1 auto;
  block-size: var(--space-24);
  padding-inline: var(--space-4);
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  color: inherit;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-tree-view__item.is-selected:not(.is-disabled) .vis-tree-view__label {
  font-weight: 500;
}

.vis-tree-view__suffix {
  flex: 0 0 auto;
  margin-inline-start: var(--space-4);
}

.vis-tree-view__item.is-disabled :is(.vis-tree-view__folder, .vis-tree-view__drag, .vis-tree-view__action, .vis-tree-view__node-icon) {
  color: var(--color-fg-disabled);
}
</style>
