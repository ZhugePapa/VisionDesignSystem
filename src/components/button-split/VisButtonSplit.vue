<script setup lang="ts">
import type { VisButtonSplitProps } from './button-split.types'

defineOptions({ name: 'VisButtonSplit' })

withDefaults(defineProps<VisButtonSplitProps>(), {
  color: 'primary',
  size: 'md',
})
</script>

<template>
  <div class="vis-button-split" :class="[`color-${color}`, `size-${size}`]">
    <slot />
  </div>
</template>

<style scoped>
.vis-button-split {
  --vis-button-split-separator: var(--color-component-button-border-split);

  box-sizing: border-box;
  display: inline-flex;
  align-items: stretch;
  border-radius: var(--radius-sm);
  overflow: hidden;
  vertical-align: middle;
}

.vis-button-split.size-md {
  block-size: var(--space-32);
}

.vis-button-split.size-sm {
  block-size: var(--space-24);
}

.vis-button-split :deep(.vis-button) {
  block-size: 100%;
}

.vis-button-split :deep(.vis-button:first-child) {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

.vis-button-split :deep(.vis-button + .vis-button) {
  border-inline-start: 1px solid var(--vis-button-split-separator);
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}

.vis-button-split.color-grey {
  --vis-button-split-separator: var(--color-border-default);
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
}
</style>
