<script setup lang="ts">
import { computed } from 'vue'

import type { VisDividerProps } from './divider.types'

const props = withDefaults(defineProps<VisDividerProps>(), {
  type: undefined,
  orientation: undefined,
  dashed: false,
  length: undefined,
  content: '内容分割',
  decorative: true,
})

const resolvedType = computed(() => props.type ?? props.orientation ?? 'horizontal')

const dividerLength = computed(() => {
  const value = props.length ?? '100%'

  return typeof value === 'number' ? `${value}px` : value
})

const ariaOrientation = computed(() => (resolvedType.value === 'vertical' ? 'vertical' : 'horizontal'))
</script>

<template>
  <span
    class="vis-divider"
    :class="[`is-${resolvedType}`, { 'is-dashed': dashed }]"
    :style="{ '--vis-divider-length': dividerLength }"
    :role="decorative ? undefined : 'separator'"
    :aria-orientation="decorative ? undefined : ariaOrientation"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <template v-if="resolvedType === 'content'">
      <span class="vis-divider__line" aria-hidden="true" />
      <span class="vis-divider__content"><slot>{{ content }}</slot></span>
      <span class="vis-divider__line" aria-hidden="true" />
    </template>
    <span v-else class="vis-divider__line" aria-hidden="true" />
  </span>
</template>

<style scoped>
.vis-divider {
  --vis-divider-length: 100%;
  --vis-divider-color: var(--color-border-default);

  box-sizing: border-box;
  border-radius: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  vertical-align: middle;
}

.vis-divider__line {
  min-inline-size: 1px;
  display: block;
  background: var(--vis-divider-color);
}

.vis-divider.is-horizontal {
  inline-size: var(--vis-divider-length);
  block-size: 1px;
}

.vis-divider.is-horizontal .vis-divider__line {
  inline-size: 100%;
  block-size: 1px;
}

.vis-divider.is-vertical {
  inline-size: 1px;
  block-size: var(--vis-divider-length);
}

.vis-divider.is-vertical .vis-divider__line {
  inline-size: 1px;
  block-size: 100%;
}

.vis-divider.is-content {
  inline-size: var(--vis-divider-length);
  min-inline-size: 0;
  block-size: var(--space-20);
  gap: var(--space-8);
}

.vis-divider.is-content .vis-divider__line {
  block-size: 1px;
  flex: 1 1 0;
}

.vis-divider__content {
  overflow: hidden;
  color: var(--color-text-secondary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 0 auto;
}

.vis-divider.is-dashed {
  --vis-divider-color: var(--color-border-strong);
}

.vis-divider.is-horizontal.is-dashed .vis-divider__line,
.vis-divider.is-content.is-dashed .vis-divider__line {
  background: repeating-linear-gradient(90deg, var(--vis-divider-color) 0 2px, transparent 2px 6px);
}

.vis-divider.is-vertical.is-dashed .vis-divider__line {
  background: repeating-linear-gradient(180deg, var(--vis-divider-color) 0 2px, transparent 2px 6px);
}
</style>
