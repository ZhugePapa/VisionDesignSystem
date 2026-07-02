<script setup lang="ts">
import { computed } from 'vue'

import type { VisRadioProps } from './radio.types'

const props = withDefaults(defineProps<VisRadioProps>(), {
  modelValue: false,
  disabled: false,
  state: 'default',
  radioButton: false,
  label: true,
  id: undefined,
  name: undefined,
  value: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (
    event: 'change',
    payload: {
      checked: boolean
      value?: string | number | boolean
    },
  ): void
}>()

const isChecked = computed(() => props.modelValue)
const isHoverPreview = computed(() => !props.disabled && props.state === 'hover')
const isPlain = computed(() => !props.radioButton)
const computedAriaLabel = computed(() => props.ariaLabel || (props.label || props.radioButton ? undefined : 'radio'))

function handleChange(event: Event): void {
  if (props.disabled) return

  const target = event.target as HTMLInputElement
  const nextChecked = target.checked

  emit('update:modelValue', nextChecked)
  emit('change', {
    checked: nextChecked,
    value: props.value,
  })
}
</script>

<template>
  <label
    class="vis-radio"
    :class="[
      {
        'is-checked': isChecked,
        'is-unchecked': !isChecked,
        'is-disabled': disabled,
        'is-hover': isHoverPreview,
        'is-button': radioButton,
        'is-plain': isPlain,
        'has-label': isPlain && label,
        'no-label': isPlain && !label,
      },
    ]"
  >
    <input
      :id="id"
      class="vis-radio__input"
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :aria-label="computedAriaLabel"
      @change="handleChange"
    />

    <template v-if="isPlain">
      <span class="vis-radio__control" aria-hidden="true">
        <svg class="vis-radio__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            v-if="isChecked && !disabled"
            class="vis-radio__checked-ring"
            d="M8 3.5C10.4853 3.5 12.5 5.51472 12.5 8C12.5 10.4853 10.4853 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8C3.5 5.51472 5.51472 3.5 8 3.5Z"
            stroke="currentColor"
            stroke-width="5"
          />
          <template v-else>
            <path
              class="vis-radio__outer"
              d="M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5Z"
              :fill="disabled ? 'var(--color-bg-tertiary)' : 'transparent'"
              stroke="currentColor"
            />
            <circle v-if="isChecked" class="vis-radio__disabled-dot" cx="8" cy="8" r="4" fill="currentColor" />
          </template>
        </svg>
      </span>
      <span v-if="label" class="vis-radio__label">
        <slot>选项</slot>
      </span>
    </template>

    <template v-else>
      <span class="vis-radio__button-text">
        <slot>选项</slot>
      </span>
    </template>
  </label>
</template>

<style scoped>
.vis-radio {
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

.vis-radio.is-disabled {
  cursor: not-allowed;
}

.vis-radio__input {
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

.vis-radio.is-plain.has-label {
  min-block-size: 22px;
  gap: 6px;
  cursor: pointer;
}

.vis-radio.is-plain.no-label {
  inline-size: 16px;
  block-size: 16px;
  justify-content: center;
  cursor: pointer;
}

.vis-radio__control {
  inline-size: 16px;
  block-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--color-border-strong);
}

.vis-radio__svg {
  inline-size: 16px;
  block-size: 16px;
  display: block;
  overflow: visible;
}

.vis-radio__label,
.vis-radio__button-text {
  overflow: hidden;
  color: currentColor;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-radio.is-checked:not(.is-disabled) .vis-radio__control {
  color: var(--color-border-brand);
}

.vis-radio:not(.is-disabled):is(:hover, .is-hover) .vis-radio__control {
  color: color-mix(in srgb, var(--color-border-brand) 90%, var(--primitive-grey-975));
}

.vis-radio__input:focus-visible + .vis-radio__control {
  border-radius: var(--radius-full);
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-radio.is-disabled {
  color: var(--color-text-disabled);
}

.vis-radio.is-disabled .vis-radio__control {
  color: var(--color-border-default);
}

.vis-radio.is-disabled .vis-radio__disabled-dot {
  color: var(--color-border-strong);
}

.vis-radio.is-button {
  block-size: 28px;
  border-radius: var(--radius-sm);
  padding-inline: var(--space-12);
  justify-content: center;
  cursor: pointer;
}

.vis-radio.is-button.is-unchecked {
  color: var(--color-text-tertiary);
}

.vis-radio.is-button:not(.is-disabled):is(:hover, .is-hover).is-unchecked {
  color: var(--color-text-primary);
}

.vis-radio.is-button.is-checked {
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-sm);
  font-weight: 500;
}

.vis-radio.is-button.is-disabled {
  color: var(--color-text-disabled);
}
</style>
