<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import type {
  VisProgressBarColor,
  VisProgressBarMultipleProps,
} from './progress-bar.types'

const props = withDefaults(defineProps<VisProgressBarMultipleProps>(), {
  segments: () => [
    { label: 'Typescript', value: 30, color: 'blue' },
    { label: 'Java', value: 20, color: 'aqua' },
    { label: 'Python', value: 15, color: 'purple' },
  ],
  label: true,
  width: 400,
  decorative: false,
  ariaLabel: undefined,
})

const colorMap: Record<VisProgressBarColor, string> = {
  red: 'var(--utility-red-500)',
  orange: 'var(--utility-orange-500)',
  yellow: 'var(--utility-yellow-500)',
  moss: 'var(--utility-moss-500)',
  green: 'var(--utility-green-500)',
  aqua: 'var(--utility-aqua-500)',
  cyan: 'var(--utility-cyan-500)',
  blue: 'var(--utility-blue-500)',
  purple: 'var(--utility-purple-500)',
  violet: 'var(--utility-violet-500)',
  scarlet: 'var(--utility-scarlet-500)',
  pink: 'var(--utility-pink-500)',
  grey: 'var(--primitive-grey-500)',
}

const fallbackColors: VisProgressBarColor[] = ['blue', 'aqua', 'purple', 'yellow', 'orange', 'green', 'pink']

const normalizedSegments = computed(() =>
  props.segments.slice(0, 7).map((segment, index) => {
    const value = Math.min(100, Math.max(0, segment.value))
    const color = segment.color ?? fallbackColors[index % fallbackColors.length]

    return {
      ...segment,
      value,
      color,
      style: {
        '--vis-progressbar-segment-width': `${value}%`,
        '--vis-progressbar-segment-color': colorMap[color],
      } as CSSProperties,
    }
  }),
)

const totalValue = computed(() =>
  Math.min(100, normalizedSegments.value.reduce((sum, segment) => sum + segment.value, 0)),
)

const rootStyle = computed<CSSProperties>(() => ({
  '--vis-progressbar-width': typeof props.width === 'number' ? `${props.width}px` : props.width,
}))
</script>

<template>
  <div
    class="vis-progressbar-multiple"
    :class="{ 'has-label': label }"
    :style="rootStyle"
    :role="decorative ? undefined : 'progressbar'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : ariaLabel || '多段进度条'"
    :aria-valuenow="decorative ? undefined : totalValue"
    :aria-valuemin="decorative ? undefined : 0"
    :aria-valuemax="decorative ? undefined : 100"
  >
    <div class="vis-progressbar-multiple__track" aria-hidden="true">
      <div
        v-for="(segment, index) in normalizedSegments"
        :key="`${segment.label}-${index}`"
        class="vis-progressbar-multiple__segment"
        :style="segment.style"
      />
    </div>

    <div v-if="label" class="vis-progressbar-multiple__labels">
      <div
        v-for="(segment, index) in normalizedSegments"
        :key="`label-${segment.label}-${index}`"
        class="vis-progressbar-multiple__label"
      >
        <span
          class="vis-progressbar-multiple__dot"
          :style="{ background: colorMap[segment.color] }"
          aria-hidden="true"
        />
        <span class="vis-progressbar-multiple__name">{{ segment.label }}</span>
        <span class="vis-progressbar-multiple__value">{{ Math.round(segment.value) }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-progressbar-multiple {
  inline-size: var(--vis-progressbar-width);
  max-inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.vis-progressbar-multiple__track {
  inline-size: 100%;
  block-size: var(--space-8);
  overflow: hidden;
  border-radius: var(--radius-full);
  display: flex;
  gap: 1px;
  background: var(--color-component-progress-bg);
}

.vis-progressbar-multiple__segment {
  inline-size: var(--vis-progressbar-segment-width);
  block-size: 100%;
  flex: 0 0 var(--vis-progressbar-segment-width);
  background: var(--vis-progressbar-segment-color);
}

.vis-progressbar-multiple__labels {
  min-inline-size: 0;
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--space-16);
  row-gap: var(--space-4);
}

.vis-progressbar-multiple__label {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-primary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.vis-progressbar-multiple__dot {
  box-sizing: border-box;
  inline-size: var(--space-8);
  block-size: var(--space-8);
  border: 1px solid var(--color-border-white);
  border-radius: var(--radius-full);
  flex: 0 0 var(--space-8);
}

.vis-progressbar-multiple__name,
.vis-progressbar-multiple__value {
  white-space: nowrap;
}

.vis-progressbar-multiple__name {
  font-weight: 500;
}

.vis-progressbar-multiple__value {
  color: var(--color-text-tertiary);
  font-weight: 400;
}
</style>
