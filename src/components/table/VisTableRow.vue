<script setup lang="ts">
import type { VisTableRowProps } from './table.types'

withDefaults(defineProps<VisTableRowProps>(), {
  appearance: 'horizontal',
  state: 'default',
})
</script>

<template>
  <div
    class="vis-table-row"
    :class="[`appearance-${appearance}`, `state-${state}`]"
    role="row"
  >
    <slot />
  </div>
</template>

<style scoped>
.vis-table-row {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-48);
  min-inline-size: 0;
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
}

.vis-table-row:is(:hover, .state-hover) {
  background: var(--color-bg-secondary);
}

.vis-table-row:is(.state-active, .state-active:hover) {
  background: var(--color-fg-brand-subtle);
}

.vis-table-row > :deep(*) {
  background: inherit;
}
</style>
