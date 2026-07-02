<script setup lang="ts">
import { computed, type CSSProperties, useId } from 'vue'

import type { VisLoadingColor, VisLoadingProps, VisLoadingSize } from './loading.types'

const props = withDefaults(defineProps<VisLoadingProps>(), {
  size: 'xs',
  color: 'brand',
  text: false,
  label: 'loading...',
  decorative: false,
})

const sizeMap: Record<VisLoadingSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
}

const colorMap: Record<VisLoadingColor, { indicator: string; indicatorTransparent: string; text: string }> = {
  grey: {
    indicator: 'var(--color-fg-secondary)',
    indicatorTransparent: 'rgba(96, 98, 103, 0)',
    text: 'var(--color-text-secondary)',
  },
  brand: {
    indicator: 'var(--color-fg-brand-primary)',
    indicatorTransparent: 'rgba(53, 107, 229, 0)',
    text: 'var(--color-text-brand-primary)',
  },
  white: {
    indicator: 'var(--color-fg-white)',
    indicatorTransparent: 'rgba(255, 255, 255, 0)',
    text: 'var(--color-text-white)',
  },
  danger: {
    indicator: 'var(--color-fg-danger-primary)',
    indicatorTransparent: 'rgba(222, 76, 86, 0)',
    text: 'var(--color-text-danger-primary)',
  },
}

const spinnerPath =
  'M21 6C22.6569 6 24 4.65685 24 3C24 1.34315 22.6569 -8.59228e-07 21 -7.86805e-07L21 3L21 6ZM10.4199 6.43769L12.1832 8.86475L10.4199 6.43769ZM3.88098 15.4377L6.73415 16.3647L3.88098 15.4377ZM10.4199 35.5623L12.1832 33.1353L10.4199 35.5623ZM31.5801 35.5623L29.8168 33.1353L31.5801 35.5623ZM38.119 26.5623L35.2658 25.6353L38.119 26.5623ZM40.9722 14.5106C40.4602 12.9349 38.7677 12.0725 37.192 12.5845C35.6162 13.0965 34.7538 14.789 35.2658 16.3647L38.119 15.4377L40.9722 14.5106ZM21 3L21 -7.86805e-07C16.5652 -5.92955e-07 12.2443 1.40395 8.65651 4.01064L10.4199 6.43769L12.1832 8.86475C14.7459 7.00282 17.8323 6 21 6L21 3ZM10.4199 6.43769L8.65651 4.01064C5.06871 6.61733 2.39823 10.2929 1.02781 14.5106L3.88098 15.4377L6.73415 16.3647C7.71302 13.3521 9.62051 10.7267 12.1832 8.86475L10.4199 6.43769ZM3.88098 15.4377L1.02781 14.5106C-0.342605 18.7284 -0.342605 23.2716 1.02781 27.4894L3.88098 26.5623L6.73415 25.6353C5.75528 22.6226 5.75528 19.3774 6.73415 16.3647L3.88098 15.4377ZM3.88098 26.5623L1.02781 27.4894C2.39823 31.7071 5.06871 35.3827 8.65651 37.9894L10.4199 35.5623L12.1832 33.1353C9.62051 31.2733 7.71302 28.6479 6.73415 25.6353L3.88098 26.5623ZM10.4199 35.5623L8.65651 37.9894C12.2443 40.596 16.5652 42 21 42L21 39L21 36C17.8323 36 14.7459 34.9972 12.1832 33.1353L10.4199 35.5623ZM21 39L21 42C25.4348 42 29.7557 40.596 33.3435 37.9894L31.5801 35.5623L29.8168 33.1353C27.2541 34.9972 24.1677 36 21 36L21 39ZM31.5801 35.5623L33.3435 37.9894C36.9313 35.3827 39.6018 31.7071 40.9722 27.4894L38.119 26.5623L35.2658 25.6353C34.287 28.6479 32.3795 31.2733 29.8168 33.1353L31.5801 35.5623ZM38.119 26.5623L40.9722 27.4894C42.3426 23.2716 42.3426 18.7283 40.9722 14.5106L38.119 15.4377L35.2658 16.3647C36.2447 19.3774 36.2447 22.6226 35.2658 25.6353L38.119 26.5623Z'

const clipPathId = `vis-loading-clip-${useId().replace(/:/g, '-')}`
const isLargeText = computed(() => ['md', 'lg', 'xl'].includes(props.size))

const loadingStyle = computed<CSSProperties>(() => {
  const size = sizeMap[props.size]
  const palette = colorMap[props.color]

  return {
    '--vis-loading-size': `${size}px`,
    '--vis-loading-graphic-size': `${size * 0.875}px`,
    '--vis-loading-indicator-color': palette.indicator,
    '--vis-loading-indicator-transparent': palette.indicatorTransparent,
    '--vis-loading-text-color': palette.text,
    '--vis-loading-text-size': isLargeText.value ? 'var(--font-text-md-size)' : 'var(--font-text-sm-size)',
    '--vis-loading-text-line-height': isLargeText.value
      ? 'var(--font-text-md-line-height)'
      : 'var(--font-text-sm-line-height)',
  }
})

const ariaHidden = computed(() => (props.decorative ? 'true' : undefined))
const ariaLabel = computed(() => (props.decorative ? undefined : props.text ? undefined : props.label))
const role = computed(() => (props.decorative ? undefined : 'status'))
</script>

<template>
  <span
    class="vis-loading"
    :class="[`size-${size}`, `color-${color}`, { 'has-text': text }]"
    :style="loadingStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
  >
    <span class="vis-loading__indicator" aria-hidden="true">
      <svg class="vis-loading__graphic" width="42" height="42" viewBox="0 0 42 42" fill="none">
        <g :clip-path="`url(#${clipPathId})`">
          <g transform="matrix(0.002625 -0.018 0.018 0.002625 21 21)">
            <foreignObject x="-1495.96" y="-1495.96" width="2991.93" height="2991.93">
              <div xmlns="http://www.w3.org/1999/xhtml" class="vis-loading__gradient" />
            </foreignObject>
          </g>
        </g>
        <defs>
          <clipPath :id="clipPathId">
            <path :d="spinnerPath" />
          </clipPath>
        </defs>
      </svg>
    </span>
    <span v-if="text" class="vis-loading__text">{{ label }}</span>
  </span>
</template>

<style scoped>
.vis-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vis-loading-indicator-color);
  vertical-align: middle;
}

.vis-loading.has-text {
  flex-direction: column;
  gap: var(--space-8);
}

.vis-loading__indicator {
  inline-size: var(--vis-loading-size);
  block-size: var(--vis-loading-size);
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--vis-loading-indicator-color);
}

.vis-loading__graphic {
  display: block;
  inline-size: var(--vis-loading-graphic-size);
  block-size: var(--vis-loading-graphic-size);
  transform-origin: 50% 50%;
  animation: vis-loading-spin 1s linear infinite;
}

.vis-loading__gradient {
  width: 100%;
  height: 100%;
  background: conic-gradient(
    from 90deg,
    var(--vis-loading-indicator-color) 0deg,
    var(--vis-loading-indicator-transparent) 54deg,
    var(--vis-loading-indicator-color) 360deg
  );
}

.vis-loading__text {
  color: var(--vis-loading-text-color);
  font-family: var(--font-family-sans);
  font-size: var(--vis-loading-text-size);
  font-weight: 400;
  line-height: var(--vis-loading-text-line-height);
  white-space: nowrap;
}

@keyframes vis-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vis-loading__graphic {
    animation-duration: 1.8s;
  }
}
</style>
