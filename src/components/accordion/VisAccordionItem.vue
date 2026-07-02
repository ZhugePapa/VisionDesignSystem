<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisAccordionItemProps } from './accordion.types'

const props = withDefaults(defineProps<VisAccordionItemProps>(), {
  title: '折叠面板',
  expanded: false,
  borderless: false,
  disabled: false,
  icon: true,
})

const emit = defineEmits<{
  (event: 'update:expanded', value: boolean): void
  (event: 'toggle', payload: { expanded: boolean }): void
}>()

const isExpanded = computed(() => props.expanded)

function toggle(): void {
  if (props.disabled) return

  const nextExpanded = !isExpanded.value
  emit('update:expanded', nextExpanded)
  emit('toggle', { expanded: nextExpanded })
}
</script>

<template>
  <div
    class="vis-accordion-item"
    :class="{
      'is-expanded': isExpanded,
      'is-borderless': borderless,
      'is-disabled': disabled,
      'has-icon': icon,
    }"
  >
    <button
      type="button"
      class="vis-accordion-item__trigger"
      :disabled="disabled"
      :aria-expanded="isExpanded ? 'true' : 'false'"
      @click="toggle"
    >
      <Icon v-if="icon" class="vis-accordion-item__leading-icon" name="file-06" :size="16" decorative />

      <span class="vis-accordion-item__title">
        <slot name="title">{{ title }}</slot>
      </span>

      <span class="vis-accordion-item__indicator" aria-hidden="true">
        <Icon name="chevron-left" :size="16" decorative />
      </span>
    </button>

    <div
      class="vis-accordion-item__content-region"
      :class="{ 'is-open': isExpanded }"
      :aria-hidden="isExpanded ? undefined : 'true'"
    >
      <div class="vis-accordion-item__content-clip">
        <div class="vis-accordion-item__content">
          <div class="vis-accordion-item__typography">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-accordion-item {
  box-sizing: border-box;
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  color: var(--color-text-primary);
}

.vis-accordion-item__trigger {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  block-size: var(--space-48);
  border: 0;
  border-block-end: 1px solid var(--color-border-default);
  padding: 0 var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-primary);
  background: transparent;
  font: inherit;
  text-align: start;
  cursor: pointer;
  transition: background-color 160ms ease;
}

.vis-accordion-item__trigger:hover:not(:disabled) {
  background: var(--color-bg-secondary);
}

.vis-accordion-item__trigger:focus-visible {
  position: relative;
  z-index: 1;
  outline: none;
  box-shadow:
    inset 0 0 0 2px var(--color-effect-focus-ring-brand),
    inset 0 0 0 4px var(--color-effect-focus-ring-bg);
}

.vis-accordion-item__trigger:disabled {
  cursor: not-allowed;
}

.vis-accordion-item__leading-icon,
.vis-accordion-item__indicator {
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}

.vis-accordion-item__indicator {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: transform 160ms ease;
}

.vis-accordion-item.is-expanded .vis-accordion-item__indicator {
  transform: rotate(-90deg);
}

.vis-accordion-item__title {
  min-inline-size: 0;
  flex: 1 1 auto;
  overflow: hidden;
  color: inherit;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-accordion-item.is-disabled .vis-accordion-item__trigger {
  color: var(--color-text-disabled);
  background: var(--color-bg-surface);
}

.vis-accordion-item.is-disabled .vis-accordion-item__leading-icon,
.vis-accordion-item.is-disabled .vis-accordion-item__indicator {
  color: var(--color-fg-disabled);
}

.vis-accordion-item__content-region {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 180ms ease,
    opacity 140ms ease;
}

.vis-accordion-item__content-region.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.vis-accordion-item__content-clip {
  min-block-size: 0;
  overflow: hidden;
}

.vis-accordion-item__content {
  box-sizing: border-box;
  inline-size: 100%;
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-16);
  display: flex;
  align-items: center;
}

.vis-accordion-item.has-icon .vis-accordion-item__content {
  padding-inline-start: var(--space-40);
}

.vis-accordion-item__typography {
  min-inline-size: 0;
  flex: 1 1 auto;
  color: var(--color-text-secondary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  letter-spacing: 0;
}

@media (prefers-reduced-motion: reduce) {
  .vis-accordion-item__trigger,
  .vis-accordion-item__indicator,
  .vis-accordion-item__content-region {
    transition-duration: 1ms;
  }
}
</style>
