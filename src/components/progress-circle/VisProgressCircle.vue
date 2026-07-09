<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import type { VisProgressCircleProps, VisProgressCircleSize } from './progress-circle.types'

const props = withDefaults(defineProps<VisProgressCircleProps>(), {
  size: 'xs',
  value: undefined,
  status: 'default',
  label: false,
  labelText: undefined,
  description: '当前进度',
  decorative: false,
  ariaLabel: undefined,
})

const sizeMap: Record<VisProgressCircleSize, { size: number; stroke: number; gap: string }> = {
  xs: { size: 16, stroke: 2, gap: 'var(--space-8)' },
  sm: { size: 32, stroke: 4, gap: 'var(--space-12)' },
  md: { size: 64, stroke: 6, gap: '0px' },
  lg: { size: 96, stroke: 8, gap: '0px' },
}

const normalizedValue = computed(() => {
  if (props.status === 'success') return 100

  const value = props.value ?? (props.status === 'danger' ? 75 : 25)
  return Math.min(100, Math.max(0, value))
})

const metrics = computed(() => {
  const config = sizeMap[props.size]
  const radius = (config.size - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - normalizedValue.value / 100)

  return {
    ...config,
    radius,
    circumference,
    offset,
    center: config.size / 2,
  }
})

const isOutsideLabel = computed(() => props.label && (props.size === 'xs' || props.size === 'sm'))
const isInsideLabel = computed(() => props.label && !isOutsideLabel.value)

const displayLabel = computed(() => {
  if (props.labelText) return props.labelText
  if (props.status === 'success') return '成功'
  if (props.status === 'danger') return '错误'
  return `${Math.round(normalizedValue.value)}%`
})

const progressColor = computed(() => {
  if (props.status === 'success') return 'var(--color-fg-success-primary)'
  if (props.status === 'danger') return 'var(--color-fg-danger-primary)'
  return 'var(--color-fg-brand-primary)'
})

const progressStyle = computed<CSSProperties>(() => ({
  '--vis-progress-circle-size': `${metrics.value.size}px`,
  '--vis-progress-circle-stroke': `${metrics.value.stroke}px`,
  '--vis-progress-circle-gap': metrics.value.gap,
  '--vis-progress-circle-color': progressColor.value,
  '--vis-progress-circle-track-color': 'var(--color-component-progress-bg)',
}))

const ariaValueText = computed(() => {
  if (props.status === 'success') return '成功'
  if (props.status === 'danger') return '错误'
  return `${Math.round(normalizedValue.value)}%`
})
</script>

<template>
  <span
    class="vis-progress-circle"
    :class="[
      `size-${size}`,
      `status-${status}`,
      {
        'has-label': label,
        'has-outside-label': isOutsideLabel,
        'has-inside-label': isInsideLabel,
      },
    ]"
    :style="progressStyle"
    :role="decorative ? undefined : 'progressbar'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : ariaLabel || '环形进度'"
    :aria-valuenow="decorative ? undefined : normalizedValue"
    :aria-valuemin="decorative ? undefined : 0"
    :aria-valuemax="decorative ? undefined : 100"
    :aria-valuetext="decorative ? undefined : ariaValueText"
  >
    <span class="vis-progress-circle__graphic" aria-hidden="true">
      <svg
        class="vis-progress-circle__svg"
        :width="metrics.size"
        :height="metrics.size"
        :viewBox="`0 0 ${metrics.size} ${metrics.size}`"
        fill="none"
      >
        <circle
          class="vis-progress-circle__track"
          :cx="metrics.center"
          :cy="metrics.center"
          :r="metrics.radius"
        />
        <circle
          class="vis-progress-circle__bar"
          :cx="metrics.center"
          :cy="metrics.center"
          :r="metrics.radius"
          :stroke-dasharray="metrics.circumference"
          :stroke-dashoffset="metrics.offset"
        />
      </svg>

      <span v-if="isInsideLabel" class="vis-progress-circle__inside-label">
        <span class="vis-progress-circle__value">{{ displayLabel }}</span>
        <span v-if="size === 'lg'" class="vis-progress-circle__description">
          {{ description }}
        </span>
      </span>
    </span>

    <span v-if="isOutsideLabel" class="vis-progress-circle__outside-label">
      {{ displayLabel }}
    </span>
  </span>
</template>

<style scoped>
.vis-progress-circle {
  display: inline-flex;
  align-items: center;
  gap: var(--vis-progress-circle-gap);
  color: var(--vis-progress-circle-color);
  vertical-align: middle;
}

.vis-progress-circle__graphic {
  position: relative;
  inline-size: var(--vis-progress-circle-size);
  block-size: var(--vis-progress-circle-size);
  flex: 0 0 auto;
  display: inline-grid;
  place-items: center;
}

.vis-progress-circle__svg {
  inline-size: var(--vis-progress-circle-size);
  block-size: var(--vis-progress-circle-size);
  display: block;
  overflow: visible;
}

.vis-progress-circle__track,
.vis-progress-circle__bar {
  fill: none;
  stroke-width: var(--vis-progress-circle-stroke);
}

.vis-progress-circle__track {
  stroke: var(--vis-progress-circle-track-color);
}

.vis-progress-circle__bar {
  stroke: var(--vis-progress-circle-color);
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition:
    stroke-dashoffset 160ms ease,
    stroke 160ms ease;
}

.vis-progress-circle__inside-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
}

.vis-progress-circle__value,
.vis-progress-circle__description,
.vis-progress-circle__outside-label {
  font-family: var(--font-family-text);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.vis-progress-circle__outside-label {
  font-weight: 500;
  text-align: center;
}

.vis-progress-circle.size-xs .vis-progress-circle__outside-label {
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.vis-progress-circle.size-sm .vis-progress-circle__outside-label {
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.vis-progress-circle.size-md .vis-progress-circle__value {
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
}

.vis-progress-circle.size-lg .vis-progress-circle__value {
  font-family: var(--font-family-heading);
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.vis-progress-circle__description {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
}
</style>
