<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisLoadingTextProps } from './loading.types'

const props = withDefaults(defineProps<VisLoadingTextProps>(), {
  label: '正在思考...',
  decorative: false,
})

const ariaHidden = computed(() => (props.decorative ? 'true' : undefined))
const role = computed(() => (props.decorative ? undefined : 'status'))
</script>

<template>
  <span
    class="vis-loading-text"
    :aria-hidden="ariaHidden"
    :aria-live="decorative ? undefined : 'polite'"
    :role="role"
  >
    <Icon class="vis-loading-text__icon" name="atom-02" :size="16" decorative />
    <span class="vis-loading-text__label">
      <slot>{{ label }}</slot>
    </span>
    <span class="vis-loading-text__shine" aria-hidden="true" />
  </span>
</template>

<style scoped>
.vis-loading-text {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  max-inline-size: 100%;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  vertical-align: middle;
  white-space: nowrap;
}

.vis-loading-text__icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}

.vis-loading-text__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-loading-text__shine {
  position: absolute;
  inset-block-start: -30px;
  inset-inline-start: -66px;
  inline-size: var(--space-40);
  block-size: 80px;
  background: linear-gradient(
    90deg,
    var(--primitive-alpha-white-0) 0%,
    var(--primitive-alpha-white-60) 50%,
    var(--primitive-alpha-white-0) 100%
  );
  pointer-events: none;
  transform: rotate(-30deg);
  animation: vis-loading-text-shine 1.6s ease-in-out infinite;
}

@keyframes vis-loading-text-shine {
  to {
    inset-inline-start: 94px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vis-loading-text__shine {
    display: none;
  }
}
</style>
