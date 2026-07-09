<script setup lang="ts">
import { computed, ref } from 'vue'

import VisBadge from '../badge/VisBadge.vue'
import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import type { VisTabsItem, VisTabsProps, VisTabsValue } from './tabs.types'

const props = withDefaults(defineProps<VisTabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  items: () => [
    { value: 'tab-1', label: '标签' },
    { value: 'tab-2', label: '标签' },
    { value: 'tab-3', label: '标签' },
  ],
  align: 'horizontal',
  actions: false,
  ariaLabel: '标签页',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisTabsValue): void
  (event: 'change', value: VisTabsValue, item: VisTabsItem): void
  (event: 'action', value: MouseEvent): void
}>()

const tabsRef = ref<HTMLElement>()
const internalValue = ref<VisTabsValue | undefined>(props.defaultValue)
const enabledItems = computed(() => props.items.filter((item) => !item.disabled))
const selectedValue = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (internalValue.value !== undefined) return internalValue.value
  return enabledItems.value[0]?.value ?? props.items[0]?.value
})

function isSelected(item: VisTabsItem): boolean {
  return item.value === selectedValue.value
}

function selectItem(item: VisTabsItem): void {
  if (item.disabled || isSelected(item)) return

  if (props.modelValue === undefined) {
    internalValue.value = item.value
  }

  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}

function focusItem(index: number): void {
  tabsRef.value?.querySelector<HTMLButtonElement>(`[data-vis-tabs-index="${index}"]`)?.focus()
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  const horizontalKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  const verticalKeys = ['ArrowUp', 'ArrowDown', 'Home', 'End']
  const allowedKeys = props.align === 'right' ? verticalKeys : horizontalKeys
  if (!allowedKeys.includes(event.key)) return

  event.preventDefault()

  const enabledIndexes = props.items
    .map((item, itemIndex) => (item.disabled ? -1 : itemIndex))
    .filter((itemIndex) => itemIndex >= 0)
  if (!enabledIndexes.length) return

  const currentEnabledIndex = enabledIndexes.indexOf(index)
  const fallbackIndex = enabledIndexes.findIndex((itemIndex) => props.items[itemIndex]?.value === selectedValue.value)
  const currentIndex = currentEnabledIndex >= 0 ? currentEnabledIndex : Math.max(fallbackIndex, 0)
  const lastIndex = enabledIndexes.length - 1
  let nextEnabledIndex = currentIndex

  if (event.key === 'Home') nextEnabledIndex = 0
  if (event.key === 'End') nextEnabledIndex = lastIndex
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextEnabledIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextEnabledIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1

  const nextIndex = enabledIndexes[nextEnabledIndex]
  const nextItem = props.items[nextIndex]
  if (!nextItem) return

  selectItem(nextItem)
  focusItem(nextIndex)
}

function handleAction(event: MouseEvent): void {
  emit('action', event)
}
</script>

<template>
  <div
    ref="tabsRef"
    class="vis-tabs"
    :class="[`align-${align}`, { 'has-actions': actions }]"
    role="tablist"
    :aria-label="ariaLabel"
    :aria-orientation="align === 'right' ? 'vertical' : 'horizontal'"
  >
    <button
      v-for="(item, index) in items"
      :key="item.value"
      class="vis-tabs__item"
      :class="{ 'is-active': isSelected(item), 'has-icon': Boolean(item.iconName), 'has-count': item.count !== undefined }"
      type="button"
      role="tab"
      :aria-selected="isSelected(item)"
      :aria-label="item.ariaLabel ?? item.label"
      :disabled="item.disabled"
      :tabindex="isSelected(item) ? 0 : -1"
      :data-vis-tabs-index="index"
      @click="selectItem(item)"
      @keydown="handleKeydown($event, index)"
    >
      <span class="vis-tabs__body">
        <span v-if="item.iconName" class="vis-tabs__icon" aria-hidden="true">
          <Icon :name="item.iconName" :size="16" decorative />
        </span>
        <span class="vis-tabs__label">
          <slot name="label" :item="item">{{ item.label ?? item.value }}</slot>
        </span>
        <VisBadge v-if="item.count !== undefined" class="vis-tabs__count" type="number" color-type="info" :count="item.count" />
      </span>
      <span v-if="isSelected(item)" class="vis-tabs__bar" aria-hidden="true" />
    </button>

    <slot name="actions">
      <VisButton
        v-if="actions && align === 'horizontal'"
        class="vis-tabs__action"
        variant="text"
        size="md"
        icon-only
        icon-name="settings-01"
        label="标签页设置"
        @click="handleAction"
      />
    </slot>
  </div>
</template>

<style scoped>
.vis-tabs {
  box-sizing: border-box;
  position: relative;
  display: flex;
  font-family: var(--font-family-text);
}

.vis-tabs.align-horizontal {
  inline-size: 100%;
  block-size: var(--space-48);
  border-block-end: 1px solid var(--color-border-default);
  align-items: center;
  gap: var(--space-8);
}

.vis-tabs.align-right {
  inline-size: var(--space-128);
  border-inline-start: 1px solid var(--color-border-default);
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.vis-tabs__item {
  box-sizing: border-box;
  position: relative;
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  color: var(--color-text-tertiary);
  background: transparent;
  font-family: inherit;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.vis-tabs.align-horizontal .vis-tabs__item {
  inline-size: auto;
  block-size: 100%;
  justify-content: center;
  flex: 0 0 auto;
}

.vis-tabs.align-right .vis-tabs__item {
  inline-size: 100%;
  block-size: var(--space-32);
  padding-block: 0;
  padding-inline: var(--space-8) 0;
}

.vis-tabs__body {
  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  color: currentColor;
}

.vis-tabs.align-horizontal .vis-tabs__body {
  padding-inline: var(--space-8);
  justify-content: center;
}

.vis-tabs.align-right .vis-tabs__body {
  inline-size: 100%;
  padding-inline: var(--space-8);
}

.vis-tabs__item:is(.has-icon, .has-count) .vis-tabs__body {
  gap: var(--space-6);
}

.vis-tabs__item:is(:hover, .state-hover):not(:disabled) {
  color: var(--color-text-primary);
}

.vis-tabs__item:is(:hover, .state-hover):not(:disabled) .vis-tabs__body {
  background: var(--color-bg-secondary);
}

.vis-tabs__item.is-active {
  color: var(--color-text-primary);
  font-weight: 500;
}

.vis-tabs__item:focus-visible {
  outline: 0;
}

.vis-tabs__item:focus-visible .vis-tabs__body {
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-tabs__item:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-tabs__icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: currentColor;
}

.vis-tabs__label {
  min-inline-size: 0;
  overflow: hidden;
  color: currentColor;
  line-height: inherit;
  text-overflow: ellipsis;
}

.vis-tabs__bar {
  position: absolute;
  border-radius: var(--radius-full);
  background: var(--color-fg-brand-primary);
  pointer-events: none;
}

.vis-tabs.align-horizontal .vis-tabs__bar {
  inset-block-end: 0;
  inset-inline-start: 50%;
  inline-size: var(--space-24);
  block-size: 3px;
  transform: translateX(-50%);
}

.vis-tabs.align-right .vis-tabs__bar {
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: 3px;
  block-size: var(--space-16);
  transform: translateY(-50%);
}

.vis-tabs__count {
  flex: 0 0 auto;
}

.vis-tabs__action {
  position: absolute;
  inset-inline-end: 0;
  inset-block-start: 50%;
  transform: translateY(-50%);
}

@media (prefers-reduced-motion: reduce) {
  .vis-tabs__item,
  .vis-tabs__body {
    transition: none;
  }
}
</style>
