<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisInputSearchBoxProps } from './input-search-box.types'

const props = withDefaults(defineProps<VisInputSearchBoxProps>(), {
  modelValue: undefined,
  placeholder: '请输入关键字',
  valueText: '关键字',
  filled: false,
  filter: false,
  simple: false,
  disabled: false,
  state: 'default',
  ariaLabel: undefined,
  searchIconName: 'search-lg',
  filterIconName: 'filter-funnel-01',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
  filter: []
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const internalValue = ref(props.filled ? props.valueText : '')
const hasUserInput = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const displayValue = computed(() => props.modelValue ?? internalValue.value)
const hasValue = computed(() => displayValue.value.length > 0)
const isInteractive = computed(() => !props.disabled)
const isFocusPreview = computed(() => props.state === 'focus' && isInteractive.value)
const isHoverPreview = computed(() => props.state === 'hover' && isInteractive.value)
const showClear = computed(() => hasValue.value && isInteractive.value && (isHoverPreview.value || isFocusPreview.value))
const showFilter = computed(() => props.filter && !props.disabled)
const showDisabledFilter = computed(() => props.filter && props.disabled)
const showPreviewCaret = computed(() => isFocusPreview.value)

const rootClasses = computed(() => ({
  'is-simple': props.simple,
  'is-disabled': props.disabled,
  'is-filled': hasValue.value,
  'is-hover': isHoverPreview.value,
  'is-focus': isFocusPreview.value,
}))

function onInput(event: Event): void {
  if (props.disabled) return
  const nextValue = (event.target as HTMLInputElement).value
  hasUserInput.value = true
  if (!isControlled.value) internalValue.value = nextValue
  emit('update:modelValue', nextValue)
}

function onClear(): void {
  if (props.disabled) return
  hasUserInput.value = true
  if (!isControlled.value) internalValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
  focusControl()
}

function onFilter(): void {
  if (props.disabled) return
  emit('filter')
}

function focusControl(): void {
  if (props.disabled) return
  void nextTick(() => {
    inputEl.value?.focus()
  })
}

watch(
  () => [props.filled, props.valueText] as const,
  ([filled, valueText]) => {
    if (isControlled.value || hasUserInput.value) return
    internalValue.value = filled ? valueText : ''
  },
)
</script>

<template>
  <div class="vis-input-search-box" :class="rootClasses" @mousedown="focusControl">
    <Icon class="vis-input-search-box__icon" :name="searchIconName" :size="16" decorative />

    <input
      ref="inputEl"
      class="vis-input-search-box__input"
      type="search"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel ?? placeholder"
      @input="onInput"
    >

    <span v-if="showPreviewCaret" class="vis-input-search-box__caret" aria-hidden="true" />

    <button
      v-if="showClear"
      class="vis-input-search-box__tool"
      type="button"
      aria-label="清除搜索内容"
      @mousedown.prevent.stop="focusControl"
      @click.stop="onClear"
    >
      <Icon name="x-circle" :size="16" decorative />
    </button>

    <button
      v-if="showFilter"
      class="vis-input-search-box__tool"
      type="button"
      aria-label="筛选"
      @mousedown.prevent.stop="focusControl"
      @click.stop="onFilter"
    >
      <Icon :name="filterIconName" :size="16" decorative />
    </button>

    <Icon
      v-else-if="showDisabledFilter"
      class="vis-input-search-box__tool vis-input-search-box__tool--static"
      :name="filterIconName"
      :size="16"
      decorative
    />
  </div>
</template>

<style scoped>
.vis-input-search-box {
  box-sizing: border-box;
  position: relative;
  inline-size: 240px;
  block-size: var(--space-32);
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding-inline: var(--space-12);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-sans);
  vertical-align: middle;
}

.vis-input-search-box.is-simple {
  border-color: transparent;
  background: transparent;
}

.vis-input-search-box:is(:hover, .is-hover):not(.is-disabled) {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
}

.vis-input-search-box.is-simple:is(:hover, .is-hover):not(.is-disabled) {
  border-color: transparent;
}

.vis-input-search-box:focus-within:not(.is-disabled),
.vis-input-search-box.is-focus:not(.is-disabled) {
  border-color: var(--color-border-brand);
  background: var(--color-bg-surface);
}

.vis-input-search-box.is-disabled {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-input-search-box.is-simple.is-disabled {
  border-color: transparent;
  background: transparent;
}

.vis-input-search-box__icon {
  color: currentColor;
  flex: 0 0 auto;
}

.vis-input-search-box__input {
  min-inline-size: 0;
  inline-size: 100%;
  flex: 1 1 0;
  border: 0;
  padding: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
}

.vis-input-search-box__input::placeholder {
  color: var(--color-text-tertiary);
  opacity: 1;
}

.vis-input-search-box.is-disabled .vis-input-search-box__input {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-input-search-box.is-disabled .vis-input-search-box__input::placeholder {
  color: var(--color-text-disabled);
}

.vis-input-search-box__input::-webkit-search-cancel-button {
  appearance: none;
}

.vis-input-search-box__caret {
  position: absolute;
  inset-block-start: 7px;
  inset-inline-start: 34px;
  inline-size: 1px;
  block-size: var(--space-16);
  background: var(--color-fg-primary);
  pointer-events: none;
}

.vis-input-search-box.is-filled .vis-input-search-box__caret {
  inset-inline-start: 79px;
}

.vis-input-search-box__tool {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.vis-input-search-box__tool--static {
  cursor: default;
}
</style>
