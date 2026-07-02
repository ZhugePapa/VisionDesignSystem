<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import type { VisCheckboxProps } from './checkbox.types'

const props = withDefaults(defineProps<VisCheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false,
  state: 'default',
  label: true,
  id: undefined,
  name: undefined,
  value: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:indeterminate', value: boolean): void
  (
    event: 'change',
    payload: {
      checked: boolean
      indeterminate: boolean
      value?: string | number | boolean
    },
  ): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const isChecked = computed(() => props.modelValue)
const isIndeterminate = computed(() => !isChecked.value && props.indeterminate)
const isHoverPreview = computed(() => !props.disabled && props.state === 'hover')
const computedAriaLabel = computed(() => props.ariaLabel || (props.label ? undefined : 'checkbox'))

const rootClasses = computed(() => ({
  'has-label': props.label,
  'no-label': !props.label,
  'is-disabled': props.disabled,
  'is-hover': isHoverPreview.value,
  'is-checked': isChecked.value,
  'is-indeterminate': isIndeterminate.value,
  'is-unchecked': !isChecked.value && !isIndeterminate.value,
}))

function syncIndeterminate(): void {
  if (!inputRef.value) return
  inputRef.value.indeterminate = isIndeterminate.value
}

function handleChange(event: Event): void {
  if (props.disabled) return

  const target = event.target as HTMLInputElement
  const nextChecked = target.checked

  emit('update:modelValue', nextChecked)
  if (props.indeterminate) {
    emit('update:indeterminate', false)
  }
  emit('change', {
    checked: nextChecked,
    indeterminate: false,
    value: props.value,
  })
}

onMounted(syncIndeterminate)
watch([isChecked, isIndeterminate], syncIndeterminate)
</script>

<template>
  <label class="vis-checkbox" :class="rootClasses">
    <input
      :id="id"
      ref="inputRef"
      class="vis-checkbox__input"
      type="checkbox"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :aria-label="computedAriaLabel"
      @change="handleChange"
    />

    <span class="vis-checkbox__control" aria-hidden="true">
      <span class="vis-checkbox__box">
        <svg
          v-if="isChecked"
          class="vis-checkbox__checked-icon"
          width="8.33333"
          height="6.25"
          viewBox="0 0 8.33333 6.25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 3.125L1.04167 2.08333L3.125 4.16667L7.29167 0L8.33333 1.04167L3.125 6.25L0 3.125Z"
            fill="white"
          />
        </svg>
        <svg
          v-else-if="isIndeterminate"
          class="vis-checkbox__indetermined-icon"
          width="6"
          height="2"
          viewBox="0 0 6 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="6" height="2" fill="white" />
        </svg>
      </span>
    </span>

    <span v-if="label" class="vis-checkbox__label">
      <slot>选项</slot>
    </span>
  </label>
</template>

<style scoped>
.vis-checkbox {
  position: relative;
  min-inline-size: 16px;
  min-block-size: 16px;
  display: inline-flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  user-select: none;
  vertical-align: middle;
}

.vis-checkbox.has-label {
  min-block-size: 20px;
  gap: var(--space-6);
  cursor: pointer;
}

.vis-checkbox.no-label {
  inline-size: 16px;
  block-size: 16px;
  justify-content: center;
  cursor: pointer;
}

.vis-checkbox.is-disabled {
  cursor: not-allowed;
}

.vis-checkbox__input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.vis-checkbox__control {
  position: relative;
  inline-size: 16px;
  block-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.vis-checkbox__box {
  box-sizing: border-box;
  inline-size: 12px;
  block-size: 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.vis-checkbox__checked-icon {
  inline-size: 8.333px;
  block-size: 6.25px;
}

.vis-checkbox__indetermined-icon {
  inline-size: 6px;
  block-size: 2px;
}

.vis-checkbox__checked-icon,
.vis-checkbox__indetermined-icon {
  display: block;
  flex: 0 0 auto;
  pointer-events: none;
}

.vis-checkbox__label {
  max-inline-size: 100%;
  overflow: hidden;
  color: currentColor;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-checkbox:is(.is-checked, .is-indeterminate) .vis-checkbox__box {
  border-color: transparent;
  background: var(--color-border-brand);
}

.vis-checkbox:not(.is-disabled):is(:hover, .is-hover).is-unchecked .vis-checkbox__box {
  border-color: var(--color-border-brand);
}

.vis-checkbox:not(.is-disabled):is(:hover, .is-hover):is(.is-checked, .is-indeterminate) .vis-checkbox__box {
  background:
    linear-gradient(var(--color-component-hover), var(--color-component-hover)),
    var(--color-border-brand);
}

.vis-checkbox__input:focus-visible + .vis-checkbox__control .vis-checkbox__box {
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-checkbox.is-disabled {
  color: var(--color-text-disabled);
}

.vis-checkbox.is-disabled.is-unchecked .vis-checkbox__box {
  border-color: var(--color-border-default);
  background: var(--color-bg-tertiary);
}

.vis-checkbox.is-disabled:is(.is-checked, .is-indeterminate) .vis-checkbox__box {
  border-color: transparent;
  background: var(--color-fg-brand-secondary);
}
</style>
