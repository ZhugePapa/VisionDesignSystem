<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import Icon from '../icons/Icon.vue'
import type { IconName } from '../icons/generated/registry.generated'

export type VisFeaturedIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type VisFeaturedIconColor = 'brand' | 'grey' | 'danger' | 'warning' | 'success'
export type VisFeaturedIconType = 'light-round' | 'light-square' | 'solid-round' | 'solid-square' | 'modern'

const props = withDefaults(
  defineProps<{
    size?: VisFeaturedIconSize
    color?: VisFeaturedIconColor
    type?: VisFeaturedIconType
    icon?: IconName
    label?: string
    decorative?: boolean
  }>(),
  {
    size: 'xs',
    color: 'brand',
    type: 'solid-round',
    icon: 'download-cloud-02',
    label: undefined,
    decorative: true,
  },
)

const sizeMap: Record<VisFeaturedIconSize, { box: string; icon: number; radius: string; strokeWidth: number }> = {
  xs: { box: '20px', icon: 12, radius: 'var(--radius-sm)', strokeWidth: 1.33333 },
  sm: { box: 'var(--space-24)', icon: 12, radius: 'var(--radius-sm)', strokeWidth: 1.33333 },
  md: { box: 'var(--space-32)', icon: 16, radius: 'var(--radius-md)', strokeWidth: 1.33333 },
  lg: { box: 'var(--space-40)', icon: 20, radius: '10px', strokeWidth: 1.33333 },
  xl: { box: 'var(--space-48)', icon: 24, radius: 'var(--radius-lg)', strokeWidth: 1.33333 },
  xxl: { box: 'var(--space-56)', icon: 28, radius: '14px', strokeWidth: 1.33333 },
}

const colorMap: Record<
  VisFeaturedIconColor,
  { solidBg: string; lightBg: string; icon: string }
> = {
  brand: {
    solidBg: 'var(--color-fg-brand-primary)',
    lightBg: 'var(--color-fg-brand-secondary)',
    icon: 'var(--color-fg-brand-primary)',
  },
  grey: {
    solidBg: 'var(--color-fg-secondary)',
    lightBg: 'var(--color-bg-quaternary)',
    icon: 'var(--color-fg-secondary)',
  },
  danger: {
    solidBg: 'var(--color-fg-danger-primary)',
    lightBg: 'var(--color-fg-danger-secondary)',
    icon: 'var(--color-fg-danger-primary)',
  },
  warning: {
    solidBg: 'var(--color-fg-warning-primary)',
    lightBg: 'var(--color-fg-warning-secondary)',
    icon: 'var(--color-fg-warning-primary)',
  },
  success: {
    solidBg: 'var(--color-fg-success-primary)',
    lightBg: 'var(--color-fg-success-secondary)',
    icon: 'var(--color-fg-success-primary)',
  },
}

const isRound = computed(() => props.type.endsWith('round'))
const isSolid = computed(() => props.type.startsWith('solid'))
const isModern = computed(() => props.type === 'modern')
const metric = computed(() => sizeMap[props.size])
const palette = computed(() => colorMap[props.color])

const iconStyle = computed<CSSProperties>(() => {
  const radius = isRound.value ? 'var(--radius-full)' : metric.value.radius

  if (isModern.value) {
    return {
      '--vis-featured-icon-size': metric.value.box,
      '--vis-featured-icon-radius': radius,
      '--vis-featured-icon-bg': 'var(--color-bg-surface)',
      '--vis-featured-icon-border': 'var(--color-border-default)',
      '--vis-featured-icon-color': 'var(--color-fg-secondary)',
      '--vis-featured-icon-shadow': 'var(--shadow-default-xs)',
    }
  }

  return {
    '--vis-featured-icon-size': metric.value.box,
    '--vis-featured-icon-radius': radius,
    '--vis-featured-icon-bg': isSolid.value ? palette.value.solidBg : palette.value.lightBg,
    '--vis-featured-icon-border': 'transparent',
    '--vis-featured-icon-color': isSolid.value ? 'var(--color-fg-white)' : palette.value.icon,
    '--vis-featured-icon-shadow': '0 0 0 0 transparent',
  }
})
</script>

<template>
  <span
    class="vis-featured-icon"
    :class="[`size-${size}`, `color-${color}`, `type-${type}`]"
    :style="iconStyle"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : label"
    :role="decorative ? undefined : 'img'"
  >
    <slot name="icon">
      <Icon :name="icon" :size="metric.icon" :stroke-width="metric.strokeWidth" decorative />
    </slot>
  </span>
</template>

<style scoped>
.vis-featured-icon {
  box-sizing: border-box;
  inline-size: var(--vis-featured-icon-size);
  block-size: var(--vis-featured-icon-size);
  border: 1px solid var(--vis-featured-icon-border);
  border-radius: var(--vis-featured-icon-radius);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  overflow: hidden;
  color: var(--vis-featured-icon-color);
  background: var(--vis-featured-icon-bg);
  box-shadow: var(--vis-featured-icon-shadow);
  vertical-align: middle;
}
</style>
