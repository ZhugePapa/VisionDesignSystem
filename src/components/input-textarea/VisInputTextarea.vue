<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'

import type { VisInputTextareaProps } from './input-textarea.types'

defineOptions({
  name: 'VisInputTextarea',
})

const sampleText =
  '设计系统（Design System） 是一套用于指导产品设计和开发的标准化工具、规则和组件集合。它的核心目标是确保产品在视觉、交互和功能上保持一致性，同时提升团队协作效率。'

const props = withDefaults(defineProps<VisInputTextareaProps>(), {
  modelValue: undefined,
  placeholder: '请输入文字',
  valueText: sampleText,
  state: 'default',
  disabled: false,
  filled: false,
  maxLength: 200,
  textCount: true,
  name: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
}>()

const rootEl = ref<HTMLDivElement | null>(null)
const fieldEl = ref<HTMLDivElement | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)
const isFocused = ref(false)
const internalValue = ref(props.filled ? props.valueText : '')
const hasUserInput = ref(false)
const resizedHeight = ref<number | null>(null)
const dragStartY = ref(0)
const dragStartHeight = ref(0)
const isResizing = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const displayValue = computed(() => props.modelValue ?? internalValue.value)
const hasValue = computed(() => displayValue.value.length > 0)
const minControlHeight = computed(() => (hasValue.value ? 44 : 66))
const minFieldHeight = computed(() => (hasValue.value ? 90 : 90))
const maxLengthValue = computed(() => {
  if (typeof props.maxLength === 'number') return props.maxLength
  return props.maxLength ? 200 : undefined
})
const showCount = computed(() => props.textCount && props.maxLength !== false)
const countText = computed(() => `${displayValue.value.length}/${maxLengthValue.value ?? 200}`)
const isFocusable = computed(() => !props.disabled)
const isFocusPreview = computed(() => (props.state === 'focus' || isFocused.value) && isFocusable.value)
const isHoverPreview = computed(() => props.state === 'hover' && !props.disabled)

const fieldStyle = computed<CSSProperties>(() => {
  if (resizedHeight.value === null) return {}
  return {
    blockSize: `${Math.max(minFieldHeight.value, resizedHeight.value)}px`,
  }
})

const rootClasses = computed(() => ({
  'is-filled': hasValue.value,
  'is-disabled': props.disabled,
  'is-hover': isHoverPreview.value,
  'is-focus': isFocusPreview.value,
  'is-danger': props.state === 'danger' && !props.disabled,
  'is-resizing': isResizing.value,
  'has-count': showCount.value,
}))

function onInput(event: Event): void {
  if (props.disabled) return
  const nextValue = (event.target as HTMLTextAreaElement).value
  hasUserInput.value = true
  if (!isControlled.value) internalValue.value = nextValue
  emit('update:modelValue', nextValue)
}

function focusControl(): void {
  if (!isFocusable.value) return
  void nextTick(() => {
    textareaEl.value?.focus()
  })
}

function onRootMouseDown(event: MouseEvent): void {
  if (!isFocusable.value) return
  if (event.target instanceof HTMLTextAreaElement) return
  if (event.target instanceof HTMLElement && event.target.closest('.vis-input-textarea__resize-handle')) return

  event.preventDefault()
  focusControl()
}

function onRootFocus(event: FocusEvent): void {
  if (isFocused.value) return
  isFocused.value = true
  emit('focus', event)
}

function onRootBlur(event: FocusEvent): void {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && rootEl.value?.contains(nextTarget)) return

  isFocused.value = false
  emit('blur', event)
}

function onResizeMove(event: PointerEvent): void {
  if (!isResizing.value) return
  event.preventDefault()
  const nextHeight = dragStartHeight.value + event.clientY - dragStartY.value
  resizedHeight.value = Math.max(minFieldHeight.value, nextHeight)
}

function stopResize(): void {
  if (!isResizing.value) return
  isResizing.value = false
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', stopResize)
  window.removeEventListener('pointercancel', stopResize)
}

function onResizeStart(event: PointerEvent): void {
  if (props.disabled || !fieldEl.value) return
  event.preventDefault()
  event.stopPropagation()
  dragStartY.value = event.clientY
  dragStartHeight.value = fieldEl.value.getBoundingClientRect().height
  isResizing.value = true
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', stopResize)
  window.addEventListener('pointercancel', stopResize)
}

watch(
  () => [props.filled, props.valueText] as const,
  ([filled, valueText]) => {
    if (isControlled.value || hasUserInput.value) return
    internalValue.value = filled ? valueText : ''
  },
)

watch(minFieldHeight, (height) => {
  if (resizedHeight.value !== null && resizedHeight.value < height) {
    resizedHeight.value = height
  }
})

onBeforeUnmount(() => {
  stopResize()
})
</script>

<template>
  <div
    ref="rootEl"
    class="vis-input-textarea"
    :class="rootClasses"
    @mousedown="onRootMouseDown"
    @focusin="onRootFocus"
    @focusout="onRootBlur"
  >
    <div ref="fieldEl" class="vis-input-textarea__field" :style="fieldStyle">
      <textarea
        ref="textareaEl"
        class="vis-input-textarea__control"
        :name="name"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLengthValue"
        :aria-label="ariaLabel ?? placeholder"
        @input="onInput"
      />

      <button
        class="vis-input-textarea__resize-handle"
        type="button"
        aria-label="调整文本域高度"
        :disabled="disabled"
        @pointerdown="onResizeStart"
      />
    </div>

    <div v-if="showCount" class="vis-input-textarea__count">
      {{ countText }}
    </div>
  </div>
</template>

<style scoped>
.vis-input-textarea {
  box-sizing: border-box;
  inline-size: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
  color: var(--color-text-tertiary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  vertical-align: middle;
}

.vis-input-textarea__field {
  box-sizing: border-box;
  position: relative;
  inline-size: 100%;
  min-block-size: 90px;
  display: flex;
  align-items: stretch;
  gap: var(--space-8);
  padding: var(--space-12);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  overflow: hidden;
  resize: none;
  background: var(--color-bg-surface);
}

.vis-input-textarea__control {
  box-sizing: border-box;
  min-inline-size: 0;
  inline-size: 100%;
  min-block-size: 64px;
  block-size: auto;
  flex: 1 1 auto;
  border: 0;
  padding: 0;
  outline: 0;
  resize: none;
  overflow: hidden;
  color: var(--color-text-primary);
  background: transparent;
  font: inherit;
  letter-spacing: 0;
}

.vis-input-textarea__control::placeholder {
  color: var(--color-text-tertiary);
  opacity: 1;
}

.vis-input-textarea.is-filled .vis-input-textarea__field {
  min-block-size: 104px;
}

.vis-input-textarea.is-filled .vis-input-textarea__control {
  min-block-size: 44px;
}

.vis-input-textarea:is(:hover, .is-hover):not(.is-disabled) .vis-input-textarea__field {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
}

.vis-input-textarea:is(:focus-within, .is-focus):not(.is-disabled) .vis-input-textarea__field {
  border-color: var(--color-border-brand);
  background: var(--color-bg-surface);
}

.vis-input-textarea.is-danger:not(.is-disabled) .vis-input-textarea__field {
  border-color: var(--color-border-danger);
  background: var(--color-bg-surface);
}

.vis-input-textarea.is-disabled .vis-input-textarea__field {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
}

.vis-input-textarea.is-disabled .vis-input-textarea__control {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-input-textarea.is-disabled .vis-input-textarea__control::placeholder {
  color: var(--color-text-disabled);
}

.vis-input-textarea__resize-handle {
  position: absolute;
  right: 2px;
  bottom: 2px;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--primitive-grey-300);
  cursor: ns-resize;
  user-select: none;
  touch-action: none;
}

.vis-input-textarea__resize-handle::before,
.vis-input-textarea__resize-handle::after {
  content: '';
  position: absolute;
  block-size: 1px;
  border-radius: var(--radius-full);
  background: currentColor;
  transform: rotate(-45deg);
  transform-origin: right center;
}

.vis-input-textarea__resize-handle::before {
  right: 2px;
  bottom: 3px;
  inline-size: 4px;
}

.vis-input-textarea__resize-handle::after {
  right: 2px;
  bottom: 7px;
  inline-size: 8px;
}

.vis-input-textarea__resize-handle:disabled {
  cursor: not-allowed;
}

.vis-input-textarea__count {
  block-size: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-align: right;
  white-space: nowrap;
}

.vis-input-textarea.is-filled .vis-input-textarea__count,
.vis-input-textarea.is-disabled .vis-input-textarea__count {
  color: var(--color-text-disabled);
}
</style>
