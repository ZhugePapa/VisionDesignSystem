<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import type { VisProgressBarProps } from './progress-bar.types'

const props = withDefaults(defineProps<VisProgressBarProps>(), {
  value: undefined,
  status: 'default',
  label: 'none',
  labelText: undefined,
  loading: false,
  width: 400,
  decorative: false,
  ariaLabel: undefined,
})

const normalizedValue = computed(() => {
  if (props.status === 'success') return 100

  const value = props.value ?? (props.status === 'danger' ? 75 : 25)
  return Math.min(100, Math.max(0, value))
})

const displayLabel = computed(() => {
  if (props.labelText) return props.labelText
  if (props.status === 'success') return '完成'
  if (props.status === 'danger') return '错误'
  return `${Math.round(normalizedValue.value)}%`
})

const progressColor = computed(() => {
  if (props.status === 'success') return 'var(--utility-aqua-500)'
  if (props.status === 'danger') return 'var(--utility-red-500)'
  return 'var(--utility-blue-500)'
})

const barStyle = computed<CSSProperties>(() => ({
  '--vis-progressbar-width': typeof props.width === 'number' ? `${props.width}px` : props.width,
  '--vis-progressbar-value': `${normalizedValue.value}%`,
  '--vis-progressbar-color': progressColor.value,
}))
</script>

<template>
  <div
    class="vis-progressbar"
    :class="[
      `label-${label}`,
      `status-${status}`,
      {
        'is-loading': loading,
        'has-label': label !== 'none',
      },
    ]"
    :style="barStyle"
    :role="decorative ? undefined : 'progressbar'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : ariaLabel || '进度条'"
    :aria-valuenow="decorative ? undefined : normalizedValue"
    :aria-valuemin="decorative ? undefined : 0"
    :aria-valuemax="decorative ? undefined : 100"
    :aria-valuetext="decorative ? undefined : displayLabel"
  >
    <div class="vis-progressbar__track" aria-hidden="true">
      <div class="vis-progressbar__indicator" />
    </div>
    <span v-if="label !== 'none'" class="vis-progressbar__label">
      {{ displayLabel }}
    </span>
  </div>
</template>

<style scoped>
.vis-progressbar {
  inline-size: var(--vis-progressbar-width);
  max-inline-size: 100%;
  display: flex;
  color: var(--color-text-primary);
}

.vis-progressbar.label-none {
  block-size: var(--space-8);
}

.vis-progressbar.label-right {
  min-block-size: var(--space-20);
  align-items: center;
  gap: var(--space-12);
}

.vis-progressbar.label-bottom {
  flex-direction: column;
  gap: var(--space-8);
}

.vis-progressbar__track {
  block-size: var(--space-8);
  overflow: hidden;
  border-radius: var(--radius-full);
  background: var(--color-component-progress-bg);
}

.vis-progressbar.label-none .vis-progressbar__track,
.vis-progressbar.label-bottom .vis-progressbar__track {
  inline-size: 100%;
}

.vis-progressbar.label-right .vis-progressbar__track {
  min-inline-size: 0;
  flex: 1 1 auto;
}

.vis-progressbar__indicator {
  position: relative;
  inline-size: var(--vis-progressbar-value);
  block-size: 100%;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: var(--vis-progressbar-color);
  transition:
    inline-size 160ms ease,
    background-color 160ms ease;
}

.vis-progressbar.is-loading .vis-progressbar__indicator::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--primitive-alpha-white-30) 42%,
    var(--primitive-alpha-white-60) 50%,
    var(--primitive-alpha-white-30) 58%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: vis-progressbar-loading 1.2s ease-in-out infinite;
}

.vis-progressbar__label {
  color: var(--color-text-primary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
}

.vis-progressbar.label-bottom .vis-progressbar__label {
  align-self: flex-end;
}

@keyframes vis-progressbar-loading {
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vis-progressbar.is-loading .vis-progressbar__indicator::after {
    animation-duration: 2.4s;
  }
}
</style>
