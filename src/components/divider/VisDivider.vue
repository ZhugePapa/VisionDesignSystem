<script setup lang="ts">
import { computed } from 'vue'

import type { VisDividerProps } from './divider.types'

const props = withDefaults(defineProps<VisDividerProps>(), {
  orientation: 'horizontal',
  dashed: false,
  length: undefined,
  decorative: true,
})

const dividerLength = computed(() => {
  const fallback = props.orientation === 'horizontal' && props.dashed ? 27 : 16
  const value = props.length ?? fallback

  return typeof value === 'number' ? `${value}px` : value
})
</script>

<template>
  <span
    class="vis-divider"
    :class="[`is-${orientation}`, { 'is-dashed': dashed }]"
    :style="{ '--vis-divider-length': dividerLength }"
    :role="decorative ? undefined : 'separator'"
    :aria-orientation="decorative ? undefined : orientation"
    :aria-hidden="decorative ? 'true' : undefined"
  />
</template>

<style scoped>
.vis-divider {
  --vis-divider-length: 16px;
  --vis-divider-color: var(--color-border-default);

  box-sizing: border-box;
  border-radius: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  vertical-align: middle;
}

.vis-divider::before {
  content: '';
  display: block;
  background: var(--vis-divider-color);
}

.vis-divider.is-horizontal {
  inline-size: var(--vis-divider-length);
  block-size: 1px;
}

.vis-divider.is-horizontal::before {
  inline-size: 100%;
  block-size: 1px;
}

.vis-divider.is-vertical {
  inline-size: 1px;
  block-size: var(--vis-divider-length);
}

.vis-divider.is-vertical::before {
  inline-size: 1px;
  block-size: 100%;
}

.vis-divider.is-dashed {
  --vis-divider-color: var(--color-border-strong);
}

.vis-divider.is-horizontal.is-dashed::before {
  background: repeating-linear-gradient(90deg, var(--vis-divider-color) 0 2px, transparent 2px 6px);
}

.vis-divider.is-vertical.is-dashed::before {
  background: repeating-linear-gradient(180deg, var(--vis-divider-color) 0 2px, transparent 2px 6px);
}
</style>
