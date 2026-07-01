<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import Icon from '../icons/Icon.vue'
import type { IconName } from '../icons/generated/registry.generated'

export type VisInputState = 'default' | 'hover' | 'focus' | 'danger'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    valueText?: string
    state?: VisInputState
    disabled?: boolean
    filled?: boolean
    readView?: boolean
    prefix?: boolean
    suffix?: boolean
    prefixIcon?: IconName
    suffixIcon?: IconName
    addonLeft?: boolean
    addonRight?: boolean
    addonLeftText?: string
    addonRightText?: string
    maxLength?: number | boolean
    type?: string
    name?: string
    ariaLabel?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请输入',
    valueText: '已输入内容',
    state: 'default',
    disabled: false,
    filled: false,
    readView: false,
    prefix: false,
    suffix: false,
    prefixIcon: 'user-01',
    suffixIcon: 'copy-03',
    addonLeft: false,
    addonRight: false,
    addonLeftText: 'http://',
    addonRightText: '.com',
    maxLength: false,
    type: 'text',
    name: undefined,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
}>()

const rootEl = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const internalValue = ref(props.filled ? props.valueText : '')
const hasUserInput = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const displayValue = computed(() => props.modelValue ?? internalValue.value)
const hasValue = computed(() => displayValue.value.length > 0)
const maxLengthValue = computed(() => {
  if (typeof props.maxLength === 'number') return props.maxLength
  return props.maxLength ? 10 : undefined
})
const showCount = computed(() => props.maxLength !== false)
const countText = computed(() => `${displayValue.value.length} / ${maxLengthValue.value ?? 10}`)
const isFocusable = computed(() => !props.disabled)
const isFocusPreview = computed(() => (props.state === 'focus' || isFocused.value) && isFocusable.value)
const isHoverPreview = computed(() => props.state === 'hover' && !props.disabled)
const showClear = computed(() => hasValue.value && !props.disabled)
const resolvedPlaceholder = computed(() => (props.readView ? '—' : props.placeholder))

const rootClasses = computed(() => ({
  'is-filled': hasValue.value,
  'is-disabled': props.disabled,
  'is-read-view': props.readView,
  'is-hover': isHoverPreview.value,
  'is-focus': isFocusPreview.value,
  'is-danger': props.state === 'danger' && !props.disabled,
  'has-addon-left': props.addonLeft,
  'has-addon-right': props.addonRight,
}))

function onInput(event: Event): void {
  if (props.disabled) return
  const nextValue = (event.target as HTMLInputElement).value
  hasUserInput.value = true
  if (!isControlled.value) internalValue.value = nextValue
  emit('update:modelValue', nextValue)
}

function onClear(): void {
  if (props.disabled || !hasValue.value) return
  hasUserInput.value = true
  if (!isControlled.value) internalValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
  focusControl()
}

function focusControl(): void {
  if (!isFocusable.value) return
  void nextTick(() => {
    inputEl.value?.focus()
  })
}

function onRootMouseDown(event: MouseEvent): void {
  if (!isFocusable.value) return
  if (event.target instanceof HTMLInputElement) return

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

watch(
  () => [props.filled, props.valueText] as const,
  ([filled, valueText]) => {
    if (isControlled.value || hasUserInput.value) return
    internalValue.value = filled ? valueText : ''
  },
)
</script>

<template>
  <div
    ref="rootEl"
    class="vis-input"
    :class="rootClasses"
    @mousedown="onRootMouseDown"
    @focusin="onRootFocus"
    @focusout="onRootBlur"
  >
    <div v-if="addonLeft" class="vis-input__addon vis-input__addon--left">
      {{ addonLeftText }}
    </div>

    <div class="vis-input__field">
      <Icon v-if="prefix" class="vis-input__icon" :name="prefixIcon" :size="16" decorative />

      <input
        ref="inputEl"
        class="vis-input__control"
        :type="type"
        :name="name"
        :value="displayValue"
        :placeholder="resolvedPlaceholder"
        :disabled="disabled"
        :maxlength="maxLengthValue"
        :aria-label="ariaLabel ?? placeholder"
        @input="onInput"
      />

      <span v-if="showCount" class="vis-input__count">{{ countText }}</span>

      <button
        v-if="showClear"
        class="vis-input__clear"
        type="button"
        aria-label="清空输入内容"
        @mousedown.prevent.stop="focusControl"
        @click.stop="onClear"
      >
        <Icon name="x-circle" :size="16" decorative />
      </button>

      <Icon v-if="suffix" class="vis-input__icon" :name="suffixIcon" :size="16" decorative />
    </div>

    <div v-if="addonRight" class="vis-input__addon vis-input__addon--right">
      {{ addonRightText }}
    </div>
  </div>
</template>

<style scoped>
.vis-input {
  box-sizing: border-box;
  inline-size: 240px;
  block-size: var(--space-32);
  display: inline-flex;
  align-items: center;
  isolation: isolate;
  color: var(--color-text-tertiary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  vertical-align: middle;
}

.vis-input:focus {
  outline: 0;
}

.vis-input.has-addon-left,
.vis-input.has-addon-right {
  inline-size: 280px;
}

.vis-input.has-addon-left.has-addon-right {
  inline-size: 320px;
}

.vis-input__field {
  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--space-32);
  flex: 1 1 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding-inline: var(--space-12);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-tertiary);
}

.vis-input.has-addon-left .vis-input__field {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}

.vis-input.has-addon-right .vis-input__field {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

.vis-input__addon {
  box-sizing: border-box;
  block-size: var(--space-32);
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  padding-inline: var(--space-12);
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.vis-input__addon--left {
  border-inline-end: 0;
  border-start-start-radius: var(--radius-sm);
  border-end-start-radius: var(--radius-sm);
}

.vis-input__addon--right {
  justify-content: flex-end;
  border-inline-start: 0;
  border-start-end-radius: var(--radius-sm);
  border-end-end-radius: var(--radius-sm);
}

.vis-input:is(:hover, .is-hover):not(.is-disabled) .vis-input__field {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
}

.vis-input.is-read-view:is(:hover, .is-hover):not(.is-disabled):not(.is-focus):not(.is-danger) .vis-input__field {
  padding-inline: var(--space-8) var(--space-12);
  border-color: transparent;
  background: var(--color-bg-secondary);
}

.vis-input:is(:focus-within, .is-focus):not(.is-disabled) .vis-input__field {
  border-color: var(--color-border-brand);
  background: var(--color-bg-surface);
}

.vis-input.is-danger:not(.is-disabled) .vis-input__field {
  border-color: var(--color-border-danger);
  background: var(--color-bg-surface);
}

.vis-input.is-disabled .vis-input__field,
.vis-input.is-disabled .vis-input__addon {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-input.is-read-view:not(:hover):not(:focus-within):not(.is-hover):not(.is-focus):not(.is-danger):not(.is-disabled)
  .vis-input__field {
  padding-inline: var(--space-8) var(--space-12);
  border-color: transparent;
  background: var(--color-bg-surface);
}

.vis-input__icon,
.vis-input__clear {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  flex: 0 0 auto;
  color: currentColor;
}

.vis-input__control {
  min-inline-size: 0;
  inline-size: 100%;
  flex: 1 1 0;
  border: 0;
  padding: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text-primary);
  font: inherit;
  letter-spacing: 0;
  text-overflow: ellipsis;
}

.vis-input__control::placeholder {
  color: var(--color-text-tertiary);
  opacity: 1;
}

.vis-input.is-disabled .vis-input__control {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-input.is-disabled .vis-input__control::placeholder {
  color: var(--color-text-disabled);
}

.vis-input__count {
  flex: 0 0 auto;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  white-space: nowrap;
}

.vis-input.is-disabled .vis-input__count {
  color: var(--color-text-disabled);
}

.vis-input__clear {
  display: none;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.vis-input:is(:hover, :focus-within, .is-hover, .is-focus, .is-danger):not(.is-disabled) .vis-input__clear {
  display: inline-flex;
}

.vis-input.is-danger:not(.is-disabled) .vis-input__clear {
  color: var(--color-fg-danger-primary);
}
</style>
