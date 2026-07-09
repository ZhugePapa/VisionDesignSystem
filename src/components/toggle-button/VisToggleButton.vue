<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisToggleButtonProps } from './toggle-button.types'

const props = withDefaults(defineProps<VisToggleButtonProps>(), {
  modelValue: undefined,
  defaultPressed: false,
  size: 'md',
  state: 'default',
  disabled: false,
  iconOnly: false,
  prefix: true,
  suffix: true,
  label: undefined,
  iconName: 'plus',
  suffixIconName: 'chevron-down',
  htmlType: 'button',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}>()

const internalPressed = ref(props.defaultPressed)

const isControlled = computed(() => props.modelValue !== undefined)
const isDisabled = computed(() => props.disabled || props.state === 'disabled')
const isPressed = computed(() => (isControlled.value ? Boolean(props.modelValue) : internalPressed.value) || props.state === 'active')
const iconSize = computed(() => (props.size === 'lg' ? 20 : 16))
const defaultLabel = computed(() => props.label ?? '按钮')
const showPrefix = computed(() => !props.iconOnly && props.prefix)
const showSuffix = computed(() => !props.iconOnly && props.suffix)

function togglePressed(): void {
  if (isDisabled.value) return

  const nextValue = !isPressed.value
  if (!isControlled.value) {
    internalPressed.value = nextValue
  }

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

watch(
  () => props.defaultPressed,
  (value) => {
    if (!isControlled.value) internalPressed.value = value
  },
)
</script>

<template>
  <button
    class="vis-toggle-button"
    :class="[
      `size-${size}`,
      `state-${state}`,
      {
        'is-active': isPressed,
        'is-disabled': isDisabled,
        'is-icon-only': iconOnly,
      },
    ]"
    :type="htmlType"
    :disabled="isDisabled"
    :aria-pressed="isPressed"
    :aria-label="iconOnly ? defaultLabel : undefined"
    @click="togglePressed"
  >
    <span v-if="iconOnly" class="vis-toggle-button__icon" aria-hidden="true">
      <slot name="icon">
        <Icon :name="iconName" :size="iconSize" decorative />
      </slot>
    </span>

    <span v-if="showPrefix" class="vis-toggle-button__icon" aria-hidden="true">
      <slot name="prefix">
        <Icon :name="iconName" :size="iconSize" decorative />
      </slot>
    </span>

    <span v-if="!iconOnly" class="vis-toggle-button__label">
      <slot>{{ defaultLabel }}</slot>
    </span>

    <span v-if="showSuffix" class="vis-toggle-button__icon" aria-hidden="true">
      <slot name="suffix">
        <Icon :name="suffixIconName" :size="iconSize" decorative />
      </slot>
    </span>
  </button>
</template>

<style scoped>
.vis-toggle-button {
  --vis-toggle-button-bg: transparent;
  --vis-toggle-button-fg: var(--color-text-secondary);
  --vis-toggle-button-icon-fg: var(--color-fg-tertiary);
  --vis-toggle-button-height: var(--space-32);
  --vis-toggle-button-padding-inline: var(--space-12);
  --vis-toggle-button-gap: var(--space-8);
  --vis-toggle-button-icon-size: var(--space-16);
  --vis-toggle-button-font-size: var(--font-text-md-size);
  --vis-toggle-button-line-height: var(--font-text-md-line-height);
  --vis-toggle-button-font-weight: 400;

  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--vis-toggle-button-height);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0 var(--vis-toggle-button-padding-inline);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vis-toggle-button-gap);
  color: var(--vis-toggle-button-fg);
  background: var(--vis-toggle-button-bg);
  box-shadow: none;
  font-family: var(--font-family-sans);
  font-size: var(--vis-toggle-button-font-size);
  font-weight: var(--vis-toggle-button-font-weight);
  line-height: var(--vis-toggle-button-line-height);
  letter-spacing: 0;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
}

.vis-toggle-button.size-sm {
  --vis-toggle-button-height: var(--space-24);
  --vis-toggle-button-padding-inline: var(--space-8);
  --vis-toggle-button-gap: var(--space-4);
  --vis-toggle-button-font-size: var(--font-text-sm-size);
  --vis-toggle-button-line-height: var(--font-text-sm-line-height);
}

.vis-toggle-button.size-lg {
  --vis-toggle-button-height: var(--space-40);
  --vis-toggle-button-padding-inline: var(--space-16);
  --vis-toggle-button-icon-size: var(--space-20);
  --vis-toggle-button-font-weight: 500;
}

.vis-toggle-button.is-icon-only {
  inline-size: var(--vis-toggle-button-height);
  padding-inline: 0;
  gap: 0;
}

.vis-toggle-button:is(:hover, .state-hover):not(.is-disabled) {
  --vis-toggle-button-bg: var(--color-bg-tertiary);
}

.vis-toggle-button:is(.is-active, .state-active):not(.is-disabled) {
  --vis-toggle-button-bg: var(--color-fg-brand-subtle);
  --vis-toggle-button-fg: var(--color-text-brand-primary);
  --vis-toggle-button-icon-fg: currentColor;
}

.vis-toggle-button:is(:focus-visible, .state-focus):not(.is-disabled) {
  outline: 0;
  overflow: clip;
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-toggle-button:is(:focus-visible, .state-focus):not(.is-disabled):not(.is-active):not(.state-active) {
  --vis-toggle-button-bg: var(--color-bg-surface);
}

.vis-toggle-button.is-disabled,
.vis-toggle-button:disabled {
  --vis-toggle-button-bg: transparent;
  --vis-toggle-button-fg: var(--color-text-disabled);
  --vis-toggle-button-icon-fg: var(--color-fg-disabled);
  cursor: not-allowed;
}

.vis-toggle-button__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-toggle-button__icon {
  inline-size: var(--vis-toggle-button-icon-size);
  block-size: var(--vis-toggle-button-icon-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--vis-toggle-button-icon-fg);
}
</style>
