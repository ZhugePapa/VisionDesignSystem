<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import type { IconName } from '../icons/generated/registry.generated'
import VisLoading, { type VisLoadingColor } from '../loading'

export type VisButtonSize = 'sm' | 'md' | 'lg'
export type VisButtonVariant = 'primary' | 'secondary' | 'text' | 'link-grey' | 'link-color' | 'link_grey' | 'link_color'
export type VisButtonState = 'default' | 'hover' | 'pressing' | 'focused' | 'disabled' | 'loading'
export type VisButtonNativeType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    variant?: VisButtonVariant
    size?: VisButtonSize
    state?: VisButtonState
    danger?: boolean
    disabled?: boolean
    loading?: boolean
    iconOnly?: boolean
    prefix?: boolean
    suffix?: boolean
    label?: string
    iconName?: IconName
    suffixIconName?: IconName
    htmlType?: VisButtonNativeType
  }>(),
  {
    variant: 'primary',
    size: 'md',
    state: 'default',
    danger: false,
    disabled: false,
    loading: false,
    iconOnly: false,
    prefix: false,
    suffix: false,
    label: undefined,
    iconName: 'plus',
    suffixIconName: 'chevron-down',
    htmlType: 'button',
  },
)

const normalizedVariant = computed(() => props.variant.replace('_', '-') as Exclude<VisButtonVariant, 'link_grey' | 'link_color'>)
const isLoading = computed(() => props.loading || props.state === 'loading')
const isDisabled = computed(() => props.disabled || props.state === 'disabled')
const isNativeDisabled = computed(() => isDisabled.value || isLoading.value)
const supportsDanger = computed(() => normalizedVariant.value !== 'link-grey')
const isDanger = computed(() => props.danger && supportsDanger.value)
const showPrefix = computed(() => !props.iconOnly && props.prefix && !isLoading.value)
const showSuffix = computed(() => !props.iconOnly && props.suffix && !isLoading.value)
const iconSize = computed(() => (props.size === 'lg' ? 20 : 16))
const defaultLabel = computed(() => props.label ?? '按钮')
const loadingColor = computed<VisLoadingColor>(() => {
  if (normalizedVariant.value === 'primary') return 'white'
  if (isDanger.value) return 'danger'
  if (normalizedVariant.value === 'link-color') return 'brand'
  return 'grey'
})
</script>

<template>
  <button
    class="vis-button"
    :class="[
      `variant-${normalizedVariant}`,
      `size-${size}`,
      `state-${state}`,
      {
        'is-danger': isDanger,
        'is-disabled': isDisabled,
        'is-icon-only': iconOnly,
        'is-loading': isLoading,
      },
    ]"
    :type="htmlType"
    :disabled="isNativeDisabled"
    :aria-label="iconOnly ? defaultLabel : undefined"
    :aria-busy="isLoading ? 'true' : undefined"
  >
    <span v-if="isLoading" class="vis-button__loading" aria-hidden="true">
      <slot name="loading">
        <VisLoading :color="loadingColor" size="xs" decorative />
      </slot>
    </span>

    <span v-else-if="iconOnly" class="vis-button__icon" aria-hidden="true">
      <slot name="icon">
        <Icon :name="iconName" :size="iconSize" decorative />
      </slot>
    </span>

    <span v-if="showPrefix" class="vis-button__icon" aria-hidden="true">
      <slot name="prefix">
        <Icon :name="iconName" :size="iconSize" decorative />
      </slot>
    </span>

    <span v-if="!iconOnly" class="vis-button__label">
      <slot>{{ defaultLabel }}</slot>
    </span>

    <span v-if="showSuffix" class="vis-button__icon" aria-hidden="true">
      <slot name="suffix">
        <Icon :name="suffixIconName" :size="iconSize" decorative />
      </slot>
    </span>
  </button>
</template>

<style scoped>
.vis-button {
  --vis-button-bg: transparent;
  --vis-button-fg: var(--color-text-secondary);
  --vis-button-border: transparent;
  --vis-button-border-shadow: inset 0 0 0 0 transparent;
  --vis-button-shadow-layer: 0 0 0 0 transparent;
  --vis-button-height: var(--space-32);
  --vis-button-padding-inline: var(--space-12);
  --vis-button-gap: var(--space-8);
  --vis-button-icon-size: var(--space-16);
  --vis-button-loading-size: var(--space-16);
  --vis-button-font-size: var(--font-text-md-size);
  --vis-button-line-height: var(--font-text-md-line-height);
  --vis-button-font-weight: 400;

  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--vis-button-height);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0 var(--vis-button-padding-inline);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vis-button-gap);
  color: var(--vis-button-fg);
  background: var(--vis-button-bg);
  box-shadow: var(--vis-button-border-shadow), var(--vis-button-shadow-layer);
  font-family: var(--font-family-sans);
  font-size: var(--vis-button-font-size);
  font-weight: var(--vis-button-font-weight);
  line-height: var(--vis-button-line-height);
  letter-spacing: 0;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
}

.vis-button.size-sm {
  --vis-button-height: var(--space-24);
  --vis-button-padding-inline: var(--space-8);
  --vis-button-gap: var(--space-4);
  --vis-button-font-size: var(--font-text-sm-size);
  --vis-button-line-height: var(--font-text-sm-line-height);
}

.vis-button.size-lg {
  --vis-button-height: var(--space-40);
  --vis-button-padding-inline: var(--space-16);
  --vis-button-icon-size: var(--space-20);
  --vis-button-font-weight: 500;
}

.vis-button.is-icon-only {
  inline-size: var(--vis-button-height);
  padding-inline: 0;
  gap: 0;
}

.vis-button.variant-link-grey,
.vis-button.variant-link-color {
  --vis-button-height: var(--vis-button-line-height);
  --vis-button-padding-inline: 0px;
  --vis-button-shadow-layer: 0 0 0 0 transparent;
}

.vis-button.variant-primary {
  --vis-button-bg: var(--color-fg-brand-primary);
  --vis-button-fg: var(--color-text-white);
}

.vis-button.variant-secondary {
  --vis-button-bg: var(--color-bg-surface);
  --vis-button-fg: var(--color-text-secondary);
  --vis-button-border: var(--color-border-default);
  --vis-button-border-shadow: inset 0 0 0 1px var(--vis-button-border);
}

.vis-button.variant-text {
  --vis-button-fg: var(--color-text-secondary);
}

.vis-button.variant-link-grey {
  --vis-button-fg: var(--color-text-secondary);
}

.vis-button.variant-link-color {
  --vis-button-link-base: var(--color-text-brand-primary);
  --vis-button-fg: var(--color-text-brand-primary);
}

.vis-button.is-danger.variant-primary {
  --vis-button-bg: var(--color-fg-danger-primary);
}

.vis-button.is-danger.variant-secondary {
  --vis-button-fg: var(--color-text-danger-primary);
  --vis-button-border: var(--color-border-danger-subtle);
}

.vis-button.is-danger.variant-text,
.vis-button.is-danger.variant-link-color {
  --vis-button-link-base: var(--color-text-danger-primary);
  --vis-button-fg: var(--color-text-danger-primary);
}

.vis-button:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-primary {
  background:
    linear-gradient(var(--color-component-hover), var(--color-component-hover)),
    var(--vis-button-bg);
}

.vis-button:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-primary {
  background:
    linear-gradient(var(--color-component-button-pressing), var(--color-component-button-pressing)),
    var(--vis-button-bg);
}

.vis-button:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-secondary,
.vis-button:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-text {
  --vis-button-bg: var(--color-bg-tertiary);
}

.vis-button:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-secondary,
.vis-button:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-text {
  --vis-button-bg: var(--color-bg-quaternary);
}

.vis-button.is-danger:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-secondary,
.vis-button.is-danger:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-text {
  --vis-button-bg: var(--color-fg-danger-subtle);
}

.vis-button.is-danger:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-secondary,
.vis-button.is-danger:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-text {
  --vis-button-bg: var(--color-fg-danger-secondary);
}

.vis-button:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-link-grey {
  --vis-button-fg: var(--color-text-primary);
}

.vis-button:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-link-grey {
  --vis-button-fg: var(--color-text-tertiary);
}

.vis-button:is(:hover, .state-hover):not(.is-disabled):not(.is-loading).variant-link-color {
  --vis-button-fg: color-mix(in srgb, var(--vis-button-link-base) 90%, var(--primitive-grey-975));
}

.vis-button:is(:active, .state-pressing):not(.is-disabled):not(.is-loading).variant-link-color {
  --vis-button-fg: color-mix(in srgb, var(--vis-button-link-base) 90%, var(--primitive-grey-0));
}

.vis-button:is(:focus-visible, .state-focused):not(.is-disabled):not(.is-loading) {
  outline: 0;
  box-shadow:
    var(--vis-button-border-shadow),
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-button:is(:focus-visible, .state-focused):not(.is-disabled):not(.is-loading).variant-text,
.vis-button:is(:focus-visible, .state-focused):not(.is-disabled):not(.is-loading).variant-link-grey,
.vis-button:is(:focus-visible, .state-focused):not(.is-disabled):not(.is-loading).variant-link-color {
  --vis-button-bg: var(--color-bg-surface);
}

.vis-button.is-danger:is(:focus-visible, .state-focused):not(.is-disabled):not(.is-loading) {
  box-shadow:
    var(--vis-button-border-shadow),
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-danger);
}

.vis-button.is-disabled,
.vis-button:disabled {
  cursor: not-allowed;
}

.vis-button.is-disabled.variant-primary {
  --vis-button-bg: var(--color-fg-brand-disabled);
  --vis-button-fg: var(--color-component-button-fg-disabled);
}

.vis-button.is-danger.is-disabled.variant-primary {
  --vis-button-bg: var(--color-fg-danger-disabled);
}

.vis-button.is-disabled.variant-secondary {
  --vis-button-fg: var(--color-text-disabled);
}

.vis-button.is-danger.is-disabled.variant-secondary {
  --vis-button-fg: var(--color-text-danger-disabled);
  --vis-button-border: var(--color-border-danger-subtle);
}

.vis-button.is-disabled.variant-text,
.vis-button.is-disabled.variant-link-grey {
  --vis-button-fg: var(--color-text-disabled);
}

.vis-button.is-disabled.variant-link-color {
  --vis-button-fg: var(--color-text-brand-disabled);
}

.vis-button.is-danger.is-disabled.variant-text,
.vis-button.is-danger.is-disabled.variant-link-color {
  --vis-button-fg: var(--color-text-danger-disabled);
}

.vis-button__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  text-decoration-skip-ink: auto;
  text-underline-position: from-font;
}

.vis-button:is(:hover, :active, .state-hover, .state-pressing):not(.is-disabled):not(.is-loading):is(.variant-link-grey, .variant-link-color)
  .vis-button__label {
  text-decoration: underline;
}

.vis-button__icon,
.vis-button__loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: currentColor;
}

.vis-button__icon {
  inline-size: var(--vis-button-icon-size);
  block-size: var(--vis-button-icon-size);
}

.vis-button:is(.variant-secondary, .variant-text, .variant-link-grey) .vis-button__icon {
  color: var(--color-fg-tertiary);
}

.vis-button:is(.variant-secondary, .variant-text):is(:hover, :active, .state-hover, .state-pressing):not(.is-disabled):not(.is-loading)
  .vis-button__icon,
.vis-button.variant-link-grey:is(:hover, :active, .state-hover, .state-pressing):not(.is-disabled):not(.is-loading)
  .vis-button__icon,
.vis-button.is-danger:is(.variant-secondary, .variant-text, .variant-link-color) .vis-button__icon {
  color: currentColor;
}

.vis-button.is-disabled:is(.variant-secondary, .variant-text, .variant-link-grey) .vis-button__icon {
  color: var(--color-fg-disabled);
}

.vis-button.is-danger.is-disabled:is(.variant-secondary, .variant-text, .variant-link-color) .vis-button__icon {
  color: currentColor;
}

.vis-button__loading {
  inline-size: var(--vis-button-loading-size);
  block-size: var(--vis-button-loading-size);
}

</style>
