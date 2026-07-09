<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisSegmentedOption, VisSegmentedProps, VisSegmentedValue } from './segmented.types'

const props = withDefaults(defineProps<VisSegmentedProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  options: () => [
    { value: 'option-1', label: '选项', iconName: 'settings-01' },
    { value: 'option-2', label: '选项', iconName: 'settings-01' },
    { value: 'option-3', label: '选项', iconName: 'settings-01' },
  ],
  size: 'md',
  icon: true,
  text: true,
  disabled: false,
  ariaLabel: '分段控制器',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisSegmentedValue): void
  (event: 'change', value: VisSegmentedValue, option: VisSegmentedOption): void
}>()

const segmentedRef = ref<HTMLElement>()
const internalValue = ref<VisSegmentedValue | undefined>(props.defaultValue)
const indicator = ref({ x: 0, y: 0, width: 0, height: 0, ready: false })
let resizeObserver: ResizeObserver | undefined

const enabledOptions = computed(() => props.options.filter((option) => !option.disabled))
const selectedValue = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (internalValue.value !== undefined) return internalValue.value
  return enabledOptions.value[0]?.value ?? props.options[0]?.value
})
const selectedIndex = computed(() => props.options.findIndex((option) => option.value === selectedValue.value))
const indicatorStyle = computed<CSSProperties>(() => ({
  inlineSize: `${indicator.value.width}px`,
  blockSize: `${indicator.value.height}px`,
  transform: `translate3d(${indicator.value.x}px, ${indicator.value.y}px, 0)`,
  opacity: indicator.value.ready ? 1 : 0,
}))

function isSelected(option: VisSegmentedOption): boolean {
  return option.value === selectedValue.value
}

function selectOption(option: VisSegmentedOption): void {
  if (props.disabled || option.disabled || isSelected(option)) return

  if (props.modelValue === undefined) {
    internalValue.value = option.value
  }

  emit('update:modelValue', option.value)
  emit('change', option.value, option)
}

function focusOption(index: number): void {
  segmentedRef.value?.querySelector<HTMLButtonElement>(`[data-vis-segmented-index="${index}"]`)?.focus()
}

function updateIndicator(): void {
  const root = segmentedRef.value
  if (!root || selectedIndex.value < 0) {
    indicator.value = { ...indicator.value, ready: false }
    return
  }

  const button = root.querySelector<HTMLButtonElement>(`[data-vis-segmented-index="${selectedIndex.value}"]`)
  if (!button) {
    indicator.value = { ...indicator.value, ready: false }
    return
  }

  indicator.value = {
    x: button.offsetLeft,
    y: button.offsetTop,
    width: button.offsetWidth,
    height: button.offsetHeight,
    ready: true,
  }
}

function scheduleIndicatorUpdate(): void {
  void nextTick(updateIndicator)
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  if (!['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End'].includes(event.key)) return

  event.preventDefault()

  const enabledIndexes = props.options
    .map((item, itemIndex) => (item.disabled ? -1 : itemIndex))
    .filter((itemIndex) => itemIndex >= 0)
  if (!enabledIndexes.length) return

  const currentEnabledIndex = enabledIndexes.indexOf(index)
  const fallbackIndex = enabledIndexes.findIndex((itemIndex) => props.options[itemIndex]?.value === selectedValue.value)
  const currentIndex = currentEnabledIndex >= 0 ? currentEnabledIndex : Math.max(fallbackIndex, 0)
  const lastIndex = enabledIndexes.length - 1
  let nextEnabledIndex = currentIndex

  if (event.key === 'Home') nextEnabledIndex = 0
  if (event.key === 'End') nextEnabledIndex = lastIndex
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextEnabledIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextEnabledIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1

  const nextIndex = enabledIndexes[nextEnabledIndex]
  const nextOption = props.options[nextIndex]
  if (!nextOption) return

  selectOption(nextOption)
  focusOption(nextIndex)
}

onMounted(() => {
  scheduleIndicatorUpdate()

  if (typeof ResizeObserver === 'undefined' || !segmentedRef.value) return
  resizeObserver = new ResizeObserver(updateIndicator)
  resizeObserver.observe(segmentedRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(
  () => [selectedValue.value, props.options, props.size, props.icon, props.text],
  scheduleIndicatorUpdate,
  { deep: true, flush: 'post' },
)
</script>

<template>
  <div
    ref="segmentedRef"
    class="vis-segmented"
    :class="[`size-${size}`, { 'is-disabled': disabled }]"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <span class="vis-segmented__indicator" :style="indicatorStyle" aria-hidden="true" />
    <button
      v-for="(option, index) in options"
      :key="option.value"
      class="vis-segmented__item"
      :class="{ 'is-active': isSelected(option) }"
      type="button"
      role="radio"
      :aria-checked="isSelected(option)"
      :aria-label="!text ? option.ariaLabel ?? option.label : undefined"
      :disabled="disabled || option.disabled"
      :tabindex="isSelected(option) ? 0 : -1"
      :data-vis-segmented-index="index"
      @click="selectOption(option)"
      @keydown="handleKeydown($event, index)"
    >
      <span v-if="icon && option.iconName" class="vis-segmented__icon" aria-hidden="true">
        <Icon :name="option.iconName" :size="16" decorative />
      </span>
      <span v-if="text" class="vis-segmented__label">
        <slot name="label" :option="option">{{ option.label ?? option.value }}</slot>
      </span>
    </button>
  </div>
</template>

<style scoped>
.vis-segmented {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  font-family: var(--font-family-sans);
  vertical-align: middle;
}

.vis-segmented__indicator {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 0;
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-sm);
  pointer-events: none;
  transition:
    transform 180ms cubic-bezier(0.2, 0, 0, 1),
    inline-size 180ms cubic-bezier(0.2, 0, 0, 1),
    block-size 180ms cubic-bezier(0.2, 0, 0, 1),
    opacity 120ms ease;
}

.vis-segmented.size-md {
  block-size: var(--space-32);
  gap: 2px;
  padding: 2px;
}

.vis-segmented.size-lg {
  block-size: var(--space-40);
  gap: 3px;
  padding: 3px;
}

.vis-segmented__item {
  box-sizing: border-box;
  min-inline-size: 0;
  inline-size: max-content;
  block-size: 100%;
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12);
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  background: transparent;
  font-family: inherit;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  white-space: nowrap;
  flex: 0 0 auto;
  cursor: pointer;
  user-select: none;
}

.vis-segmented.size-md .vis-segmented__item {
  gap: 6px;
  padding-inline: var(--space-8);
}

.vis-segmented.size-lg .vis-segmented__item {
  gap: var(--space-8);
}

.vis-segmented__item:not(:has(.vis-segmented__label)),
.vis-segmented__item:not(:has(.vis-segmented__icon)) {
  gap: 0;
}

.vis-segmented__item:hover:not(:disabled):not(.is-active) {
  color: var(--color-text-primary);
}

.vis-segmented__item.is-active {
  color: var(--color-text-primary);
  font-weight: 500;
}

.vis-segmented__item:focus-visible {
  outline: 0;
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-segmented__item:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-segmented__icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: currentColor;
}

.vis-segmented__label {
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
  block-size: var(--font-text-md-line-height);
  overflow: hidden;
  color: currentColor;
  line-height: inherit;
  text-overflow: ellipsis;
}

@media (prefers-reduced-motion: reduce) {
  .vis-segmented__indicator {
    transition: none;
  }
}
</style>
