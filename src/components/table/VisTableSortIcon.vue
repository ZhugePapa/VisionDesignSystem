<script setup lang="ts">
import type { VisTableSortIconProps } from './table.types'

withDefaults(defineProps<VisTableSortIconProps>(), {
  state: 'default',
})
</script>

<template>
  <span class="vis-table-sort-icon" :class="`state-${state}`" aria-hidden="true">
    <span class="vis-table-sort-icon__caret ascending" />
    <span class="vis-table-sort-icon__caret descending" />
  </span>
</template>

<style scoped>
.vis-table-sort-icon {
  position: relative;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-block;
  flex: 0 0 var(--space-16);
}

.vis-table-sort-icon__caret {
  position: absolute;
  inset-inline-start: 4px;
  inline-size: 0;
  block-size: 0;
  border: 4px solid transparent;
}

.vis-table-sort-icon__caret.ascending {
  inset-block-start: -2px;
  border-block-end-color: var(--color-fg-tertiary);
}

.vis-table-sort-icon__caret.descending {
  inset-block-end: -2px;
  border-block-start-color: var(--color-fg-tertiary);
}

.vis-table-sort-icon.state-up .ascending {
  border-block-end-color: var(--color-fg-brand-primary);
}

.vis-table-sort-icon.state-down .descending {
  border-block-start-color: var(--color-fg-brand-primary);
}
</style>
