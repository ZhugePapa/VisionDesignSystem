<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import VisLoading from '../loading/VisLoading.vue'
import type { VisToggleChangePayload, VisToggleProps } from './toggle.types'

const props = withDefaults(defineProps<VisToggleProps>(), {
  modelValue: false,
  disabled: false,
  state: 'default',
  icon: false,
  text: false,
  id: undefined,
  name: undefined,
  value: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', payload: VisToggleChangePayload): void
}>()

const isChecked = computed(() => props.modelValue)
const isLoading = computed(() => props.state === 'loading')
const isHoverPreview = computed(() => !props.disabled && props.state === 'hover')
const isFocusPreview = computed(() => !props.disabled && props.state === 'focus')
const isDisabled = computed(() => props.disabled)
const isInteractive = computed(() => !isDisabled.value && !isLoading.value)
const hasAffix = computed(() => props.text || props.icon)
const computedAriaLabel = computed(() => props.ariaLabel ?? 'toggle')

const rootClasses = computed(() => ({
  'is-checked': isChecked.value,
  'is-unchecked': !isChecked.value,
  'is-disabled': isDisabled.value,
  'is-loading': isLoading.value,
  'is-hover': isHoverPreview.value,
  'is-focus': isFocusPreview.value,
  'has-affix': hasAffix.value,
  'has-icon': props.icon && !props.text,
  'has-text': props.text,
}))

const loadingColor = computed(() => (isChecked.value ? 'brand' : 'grey'))

function handleChange(event: Event): void {
  if (!isInteractive.value) return

  const nextChecked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', nextChecked)
  emit('change', {
    checked: nextChecked,
    value: props.value,
  })
}
</script>

<template>
  <label class="vis-toggle" :class="rootClasses">
    <input
      :id="id"
      class="vis-toggle__input"
      type="checkbox"
      role="switch"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled || isLoading"
      :aria-label="computedAriaLabel"
      :aria-checked="isChecked"
      @change="handleChange"
    />

    <span v-if="isChecked && text" class="vis-toggle__text">ON</span>
    <span v-else-if="isChecked && icon" class="vis-toggle__track-icon" aria-hidden="true">
      <Icon name="check" :size="16" decorative />
    </span>

    <span class="vis-toggle__thumb" aria-hidden="true">
      <VisLoading v-if="isLoading" class="vis-toggle__loading" :color="loadingColor" size="xs" decorative />
    </span>

    <span v-if="!isChecked && text" class="vis-toggle__text">OFF</span>
    <span v-else-if="!isChecked && icon" class="vis-toggle__track-icon" aria-hidden="true">
      <Icon name="x-close" :size="16" decorative />
    </span>
  </label>
</template>

<style scoped>
.vis-toggle {
  box-sizing: border-box;
  min-inline-size: 40px;
  block-size: 20px;
  border-radius: var(--radius-full);
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  color: var(--color-text-white);
  background: var(--color-fg-disabled);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  letter-spacing: 0;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease;
}

.vis-toggle.has-affix {
  gap: 2px;
}

.vis-toggle.has-affix.is-checked {
  padding-inline: 2px 24px;
}

.vis-toggle.has-affix.is-unchecked {
  padding-inline: 24px 2px;
}

.vis-toggle.is-checked {
  background: var(--color-fg-brand-primary);
}

.vis-toggle:not(.is-disabled):not(.is-loading):is(:hover, .is-hover) {
  background:
    linear-gradient(var(--color-component-hover), var(--color-component-hover)),
    var(--color-fg-disabled);
}

.vis-toggle.is-checked:not(.is-disabled):not(.is-loading):is(:hover, .is-hover) {
  background:
    linear-gradient(var(--color-component-hover), var(--color-component-hover)),
    var(--color-fg-brand-primary);
}

.vis-toggle:is(.is-focus, :has(.vis-toggle__input:focus-visible)) {
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-toggle.is-disabled,
.vis-toggle.is-loading {
  cursor: not-allowed;
}

.vis-toggle.is-disabled.is-checked {
  background: var(--color-fg-brand-disabled);
}

.vis-toggle__input {
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

.vis-toggle__thumb {
  inline-size: 20px;
  block-size: 16px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  background: var(--color-fg-white);
  position: absolute;
  inset-block-start: 2px;
  inset-inline-start: 2px;
  z-index: 1;
  transition: inset-inline-start 180ms cubic-bezier(0.2, 0, 0, 1);
}

.vis-toggle.is-checked .vis-toggle__thumb {
  inset-inline-start: calc(100% - 22px);
}

.vis-toggle__text {
  position: relative;
  z-index: 0;
  padding-inline: 2px var(--space-4);
  color: currentColor;
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  white-space: nowrap;
}

.vis-toggle.is-checked .vis-toggle__text {
  padding-inline: var(--space-4) 2px;
}

.vis-toggle__track-icon {
  box-sizing: border-box;
  inline-size: 17px;
  block-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: currentColor;
  position: relative;
  z-index: 0;
}

.vis-toggle.is-checked .vis-toggle__track-icon {
  justify-content: flex-start;
  padding-inline-start: 3px;
}

.vis-toggle.is-unchecked .vis-toggle__track-icon {
  justify-content: flex-end;
  padding-inline-end: 3px;
}

.vis-toggle__loading {
  inline-size: 14px;
  block-size: 14px;
}

.vis-toggle__loading :deep(.vis-loading__indicator) {
  inline-size: 14px;
  block-size: 14px;
}

.vis-toggle__loading :deep(.vis-loading__graphic) {
  inline-size: 12.25px;
  block-size: 12.25px;
}

@media (prefers-reduced-motion: reduce) {
  .vis-toggle,
  .vis-toggle__thumb {
    transition-duration: 1ms;
  }
}
</style>
