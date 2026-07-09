<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisInputNumberProps } from './input-number.types'

defineOptions({
  name: 'VisInputNumber',
})

const props = withDefaults(defineProps<VisInputNumberProps>(), {
  modelValue: 0,
  width: undefined,
  position: 'default',
  state: 'default',
  disabled: false,
  prefixIcon: false,
  suffixIcon: false,
  rightControls: true,
  prefixIconName: 'currency-yen',
  suffixIconName: 'percent-02',
  min: undefined,
  max: undefined,
  step: 1,
  name: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'change', value: number): void
  (event: 'focus', nativeEvent: FocusEvent): void
  (event: 'blur', nativeEvent: FocusEvent): void
}>()

const isHovering = ref(false)
const isFocused = ref(false)
const isIncHovering = ref(false)
const isDecHovering = ref(false)
const inputText = ref(String(props.modelValue))

const isDefaultPosition = computed(() => props.position === 'default')
const isRightPosition = computed(() => props.position === 'right')

watch(
  () => props.modelValue,
  (value) => {
    inputText.value = String(value)
  },
)

function normalizeWidth(value: number | string): string {
  if (typeof value === 'number') return `${value}px`
  const trimmed = value.trim()
  if (/^[\d.]+$/.test(trimmed)) return `${trimmed}px`
  return trimmed
}

const resolvedWidth = computed(() => {
  if (props.width !== undefined) return normalizeWidth(props.width)
  const base = 120
  const prefixExtra = props.prefixIcon ? 40 : 0
  const suffixExtra = props.suffixIcon ? 40 : 0
  return `${base + prefixExtra + suffixExtra}px`
})

const visualState = computed<'default' | 'hover' | 'focus' | 'danger' | 'disabled'>(() => {
  if (props.disabled) return 'disabled'
  if (props.state === 'danger') return 'danger'
  if (props.state === 'focus' || isFocused.value) return 'focus'
  if (props.state === 'hover' || isHovering.value) return 'hover'
  return 'default'
})

const borderColor = computed(() => {
  if (visualState.value === 'focus') return 'var(--color-border-brand)'
  if (visualState.value === 'danger') return 'var(--color-border-danger)'
  return 'var(--color-border-default)'
})

const rootBg = computed(() => {
  if (visualState.value === 'disabled' || visualState.value === 'hover') return 'var(--color-bg-secondary)'
  return 'var(--color-bg-surface)'
})

const textColor = computed(() => (visualState.value === 'disabled' ? 'var(--color-text-disabled)' : 'var(--color-text-primary)'))
const iconColor = computed(() => (visualState.value === 'disabled' ? 'var(--color-fg-disabled)' : 'var(--color-fg-tertiary)'))
const showRightControls = computed(() => {
  if (!isRightPosition.value || !props.rightControls) return false
  if (props.disabled && !props.suffixIcon) return false
  if (props.suffixIcon) return true
  return visualState.value === 'hover' || visualState.value === 'focus' || visualState.value === 'danger'
})

const rootVars = computed(() => ({
  '--vis-input-number-width': resolvedWidth.value,
  '--vis-input-number-border': borderColor.value,
  '--vis-input-number-bg': rootBg.value,
  '--vis-input-number-text': textColor.value,
  '--vis-input-number-icon': iconColor.value,
}))

function buttonBackground(hovering: boolean): string {
  if (props.disabled) return 'var(--color-bg-secondary)'
  if (hovering) return 'var(--color-bg-tertiary)'
  return 'var(--color-bg-secondary)'
}

function clamp(value: number): number {
  let result = value
  if (typeof props.min === 'number') result = Math.max(props.min, result)
  if (typeof props.max === 'number') result = Math.min(props.max, result)
  return result
}

function commitValue(value: number): void {
  const next = clamp(value)
  inputText.value = String(next)
  emit('update:modelValue', next)
  emit('change', next)
}

function onStep(direction: 1 | -1): void {
  if (props.disabled) return
  const parsed = Number(inputText.value)
  const current = Number.isFinite(parsed) ? parsed : props.modelValue
  commitValue(current + direction * props.step)
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  inputText.value = target.value
  const parsed = Number(target.value)
  if (!Number.isFinite(parsed)) return
  emit('update:modelValue', clamp(parsed))
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  const parsed = Number(inputText.value)
  if (Number.isFinite(parsed)) {
    commitValue(parsed)
  } else {
    inputText.value = String(props.modelValue)
  }
  emit('blur', event)
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onRootMouseEnter(): void {
  if (props.disabled) return
  isHovering.value = true
}

function onRootMouseLeave(): void {
  isHovering.value = false
}
</script>

<template>
  <div
    class="vis-input-number"
    :style="rootVars"
    @mouseenter="onRootMouseEnter"
    @mouseleave="onRootMouseLeave"
  >
    <button
      v-if="isDefaultPosition"
      type="button"
      class="vis-input-number__button vis-input-number__button--side"
      :disabled="disabled"
      :style="{ background: buttonBackground(isDecHovering) }"
      @mouseenter="isDecHovering = true"
      @mouseleave="isDecHovering = false"
      @click="onStep(-1)"
    >
      <Icon name="minus" :size="16" decorative />
    </button>

    <div
      class="vis-input-number__field"
      :class="{ 'is-right-position': isRightPosition }"
    >
      <span v-if="prefixIcon" class="vis-input-number__icon" aria-hidden="true">
        <Icon :name="prefixIconName" :size="16" decorative />
      </span>

      <input
        class="vis-input-number__input"
        :class="{ 'is-right-position': isRightPosition }"
        :value="inputText"
        :disabled="disabled"
        :name="name"
        :aria-label="ariaLabel ?? '数字输入框'"
        inputmode="decimal"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      >

      <span v-if="suffixIcon" class="vis-input-number__icon" aria-hidden="true">
        <Icon :name="suffixIconName" :size="16" decorative />
      </span>
    </div>

    <button
      v-if="isDefaultPosition"
      type="button"
      class="vis-input-number__button vis-input-number__button--side"
      :disabled="disabled"
      :style="{ background: buttonBackground(isIncHovering) }"
      @mouseenter="isIncHovering = true"
      @mouseleave="isIncHovering = false"
      @click="onStep(1)"
    >
      <Icon name="plus" :size="16" decorative />
    </button>

    <div v-if="showRightControls" class="vis-input-number__right-controls">
      <button
        type="button"
        class="vis-input-number__button vis-input-number__button--right-top"
        :disabled="disabled"
        :style="{ background: buttonBackground(isIncHovering) }"
        @mouseenter="isIncHovering = true"
        @mouseleave="isIncHovering = false"
        @click="onStep(1)"
      >
        <Icon name="chevron-up" :size="16" decorative />
      </button>
      <button
        type="button"
        class="vis-input-number__button vis-input-number__button--right-bottom"
        :disabled="disabled"
        :style="{ background: buttonBackground(isDecHovering) }"
        @mouseenter="isDecHovering = true"
        @mouseleave="isDecHovering = false"
        @click="onStep(-1)"
      >
        <Icon name="chevron-down" :size="16" decorative />
      </button>
    </div>
  </div>
</template>

<style scoped>
.vis-input-number {
  box-sizing: border-box;
  inline-size: var(--vis-input-number-width);
  block-size: var(--space-32);
  border: 1px solid var(--vis-input-number-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: inline-flex;
  align-items: stretch;
  background: var(--vis-input-number-bg);
  color: var(--vis-input-number-icon);
  font-family: var(--font-family-sans);
  vertical-align: middle;
}

.vis-input-number__field {
  min-inline-size: 0;
  flex: 1 0 0;
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding-inline: var(--space-8);
}

.vis-input-number__field.is-right-position {
  gap: var(--space-8);
  padding-inline: var(--space-12);
}

.vis-input-number__input {
  min-inline-size: 0;
  flex: 1 0 0;
  border: 0;
  outline: 0;
  margin: 0;
  padding: 0;
  background: transparent;
  color: var(--vis-input-number-text);
  text-align: center;
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  letter-spacing: 0;
}

.vis-input-number__input.is-right-position {
  text-align: left;
}

.vis-input-number__input:disabled {
  cursor: not-allowed;
}

.vis-input-number__icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  flex: 0 0 auto;
  color: var(--vis-input-number-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vis-input-number__button {
  border: 0;
  margin: 0;
  padding: 0;
  color: var(--vis-input-number-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.vis-input-number__button:disabled {
  cursor: not-allowed;
}

.vis-input-number__button--side {
  inline-size: var(--space-32);
  block-size: var(--space-32);
  border-inline-end: 1px solid var(--color-border-default);
}

.vis-input-number__button--side:last-of-type {
  border-inline-start: 1px solid var(--color-border-default);
  border-inline-end: 0;
}

.vis-input-number__right-controls {
  inline-size: 24px;
  block-size: var(--space-32);
  border-inline-start: 1px solid var(--color-border-default);
  display: inline-flex;
  flex-direction: column;
}

.vis-input-number__button--right-top,
.vis-input-number__button--right-bottom {
  inline-size: 24px;
  block-size: 16px;
}

.vis-input-number__button--right-top {
  border-bottom: 1px solid var(--color-border-default);
}
</style>
