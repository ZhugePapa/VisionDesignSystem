<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'

import VisBadge from '../badge/VisBadge.vue'
import type { VisBadgeColorType, VisBadgeType } from '../badge/badge.types'
import Icon from '../icons/Icon.vue'
import type { VisAvatarProps, VisAvatarSize } from './avatar.types'
import { resolveVisAvatarImage } from './defaultImages'

interface DotLikeBadgeMetric {
  top: string
  right: string
  size: string
}

interface NumberBadgeMetric {
  top: string
  right: string
  size: string
  paddingInline: string
}

interface TypographyMetric {
  fontSize: string
  lineHeight: string
}

interface BadgeTypeMetric<T> {
  image: T
  other: T
}

const props = withDefaults(defineProps<VisAvatarProps>(), {
  type: 'image',
  size: 'sm',
  state: 'default',
  shapeSquare: false,
  badge: 'none',
  imageSrc: undefined,
  imageVariant: '09',
  imageAlt: undefined,
  text: '诸葛',
  icon: 'user-03',
  badgeIcon: 'x-close',
  badgeCount: 1,
  badgeColorType: 'danger',
  decorative: true,
  groupOutlined: false,
})

const sizeToPxMap: Record<VisAvatarSize, string> = {
  xs: 'var(--space-20)',
  sm: 'var(--space-24)',
  md: 'var(--space-32)',
  lg: 'var(--space-40)',
  xl: 'var(--space-48)',
  xxl: 'var(--space-56)',
}

const iconSizeMap: Record<VisAvatarSize, number> = {
  xs: 16,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
}

const textTypographyMap: Record<VisAvatarSize, TypographyMetric> = {
  xs: { fontSize: 'var(--font-text-sm-size)', lineHeight: 'var(--font-text-sm-line-height)' },
  sm: { fontSize: 'var(--font-text-sm-size)', lineHeight: 'var(--font-text-sm-line-height)' },
  md: { fontSize: 'var(--font-text-sm-size)', lineHeight: 'var(--font-text-sm-line-height)' },
  lg: { fontSize: 'var(--font-text-md-size)', lineHeight: 'var(--font-text-md-line-height)' },
  xl: { fontSize: 'var(--font-text-lg-size)', lineHeight: 'var(--font-text-lg-line-height)' },
  xxl: { fontSize: 'var(--font-text-lg-size)', lineHeight: 'var(--font-text-lg-line-height)' },
}

const dotBadgeMetricMap: Record<VisAvatarSize, BadgeTypeMetric<DotLikeBadgeMetric>> = {
  xs: {
    image: { top: '-1px', right: '-1px', size: '6px' },
    other: { top: '-2px', right: '0px', size: '6px' },
  },
  sm: {
    image: { top: '-1px', right: '-1px', size: '8px' },
    other: { top: '-2px', right: '0px', size: '8px' },
  },
  md: {
    image: { top: '-1px', right: '-1px', size: '8px' },
    other: { top: '-2px', right: '0px', size: '8px' },
  },
  lg: {
    image: { top: '-1px', right: '-1px', size: '10px' },
    other: { top: '-2px', right: '0px', size: '10px' },
  },
  xl: {
    image: { top: '-1px', right: '-1px', size: '12px' },
    other: { top: '-2px', right: '0px', size: '12px' },
  },
  xxl: {
    image: { top: '-1px', right: '-1px', size: '14px' },
    other: { top: '-2px', right: '0px', size: '14px' },
  },
}

const numberBadgeMetricMap: Record<VisAvatarSize, BadgeTypeMetric<NumberBadgeMetric>> = {
  xs: {
    image: { top: '-10px', right: '-10px', size: '20px', paddingInline: '6px' },
    other: { top: '-11px', right: '-9px', size: '20px', paddingInline: '6px' },
  },
  sm: {
    image: { top: '-10px', right: '-10px', size: '20px', paddingInline: '6px' },
    other: { top: '-11px', right: '-9px', size: '20px', paddingInline: '6px' },
  },
  md: {
    image: { top: '-8px', right: '-8px', size: '20px', paddingInline: '6px' },
    other: { top: '-9px', right: '-7px', size: '20px', paddingInline: '6px' },
  },
  lg: {
    image: { top: '-6px', right: '-6px', size: '20px', paddingInline: '6px' },
    other: { top: '-7px', right: '-5px', size: '20px', paddingInline: '6px' },
  },
  xl: {
    image: { top: '-4px', right: '-4px', size: '20px', paddingInline: '6px' },
    other: { top: '-5px', right: '-3px', size: '20px', paddingInline: '6px' },
  },
  xxl: {
    image: { top: '-2px', right: '-2px', size: '20px', paddingInline: '6px' },
    other: { top: '-3px', right: '-1px', size: '20px', paddingInline: '6px' },
  },
}

const stateBadgeMetricMap: Record<VisAvatarSize, BadgeTypeMetric<DotLikeBadgeMetric>> = {
  xs: {
    image: { top: '14px', right: '0px', size: '6px' },
    other: { top: '13px', right: '1px', size: '6px' },
  },
  sm: {
    image: { top: '16px', right: '0px', size: '8px' },
    other: { top: '15px', right: '1px', size: '8px' },
  },
  md: {
    image: { top: '24px', right: '0px', size: '8px' },
    other: { top: '23px', right: '1px', size: '8px' },
  },
  lg: {
    image: { top: '30px', right: '0px', size: '10px' },
    other: { top: '29px', right: '1px', size: '10px' },
  },
  xl: {
    image: { top: '36px', right: '0px', size: '12px' },
    other: { top: '35px', right: '1px', size: '12px' },
  },
  xxl: {
    image: { top: '42px', right: '0px', size: '14px' },
    other: { top: '41px', right: '1px', size: '14px' },
  },
}

const isPointerOver = ref(false)
const isHoverVisualActive = computed(() => props.state === 'hover' || isPointerOver.value)
const badgeMetricType = computed<'image' | 'other'>(() => (props.type === 'image' ? 'image' : 'other'))

const resolvedBadgeType = computed<VisBadgeType | null>(() => {
  if (props.badge === 'none') return null
  if (props.badge === 'state') return 'dot'
  if (props.badge === 'icon') return 'icon'
  return props.badge
})

const resolvedBadgeClassName = computed(() => (props.badge === 'state' ? 'state' : resolvedBadgeType.value))
const resolvedBadgeColorType = computed<VisBadgeColorType>(() => (props.badge === 'state' ? 'success' : props.badgeColorType))
const dotBadgeMetric = computed(() => dotBadgeMetricMap[props.size][badgeMetricType.value])
const numberBadgeMetric = computed(() => numberBadgeMetricMap[props.size][badgeMetricType.value])
const stateBadgeMetric = computed(() => stateBadgeMetricMap[props.size][badgeMetricType.value])

const badgeStyle = computed<CSSProperties | undefined>(() => {
  if (!resolvedBadgeType.value) return undefined

  if (props.badge === 'state') {
    const metric = stateBadgeMetric.value
    return {
      '--vis-avatar-badge-top': metric.top,
      '--vis-avatar-badge-right': metric.right,
      '--vis-avatar-badge-dot-size': metric.size,
    } as CSSProperties
  }

  if (resolvedBadgeType.value === 'dot') {
    const metric = dotBadgeMetric.value
    return {
      '--vis-avatar-badge-top': metric.top,
      '--vis-avatar-badge-right': metric.right,
      '--vis-avatar-badge-dot-size': metric.size,
    } as CSSProperties
  }

  const metric = numberBadgeMetric.value
  return {
    '--vis-avatar-badge-top': metric.top,
    '--vis-avatar-badge-right': metric.right,
    '--vis-avatar-badge-number-size': metric.size,
    '--vis-avatar-badge-number-padding-inline': metric.paddingInline,
  } as CSSProperties
})

const avatarStyle = computed<CSSProperties>(() => {
  const textMetric = textTypographyMap[props.size]
  const isImageType = props.type === 'image'
  const isHoverActive = isHoverVisualActive.value
  return {
    '--vis-avatar-size': sizeToPxMap[props.size],
    '--vis-avatar-radius': props.shapeSquare ? 'var(--radius-md)' : 'var(--radius-full)',
    '--vis-avatar-root-border-width': isImageType ? '0px' : '1px',
    '--vis-avatar-border-color': isImageType ? 'transparent' : 'var(--primitive-alpha-black-5)',
    '--vis-avatar-root-bg': isImageType
      ? 'transparent'
      : isHoverActive
        ? 'var(--color-bg-secondary)'
        : 'var(--color-bg-tertiary)',
    '--vis-avatar-content-color': props.type === 'text' ? 'var(--color-text-secondary)' : 'var(--color-fg-tertiary)',
    '--vis-avatar-body-border-width': isImageType ? (props.groupOutlined ? '2px' : '1px') : '0px',
    '--vis-avatar-body-border-color': isImageType
      ? props.groupOutlined
        ? 'var(--color-border-white)'
        : 'var(--primitive-alpha-black-10)'
      : 'transparent',
    '--vis-avatar-text-size': textMetric.fontSize,
    '--vis-avatar-text-line-height': textMetric.lineHeight,
    '--vis-avatar-overlay-opacity': isImageType && isHoverActive ? '1' : '0',
  } as CSSProperties
})

const normalizedText = computed(() => props.text.trim() || '诸葛')
const displayText = computed(() => {
  const chars = Array.from(normalizedText.value)
  if (props.size === 'xs' || props.size === 'sm') return chars[0] ?? ''
  return chars.slice(0, 2).join('')
})

const resolvedImageSrc = computed(() => props.imageSrc ?? resolveVisAvatarImage(props.imageVariant))
const imageAlt = computed(() => (props.decorative ? '' : props.imageAlt ?? 'avatar'))
</script>

<template>
  <div
    class="vis-avatar"
    :class="[`type-${type}`, `size-${size}`, `state-${state}`, { 'shape-square': shapeSquare }]"
    :style="avatarStyle"
    @mouseenter="isPointerOver = true"
    @mouseleave="isPointerOver = false"
  >
    <div class="vis-avatar__body">
      <template v-if="type === 'image'">
        <img v-if="resolvedImageSrc" :src="resolvedImageSrc" :alt="imageAlt" class="vis-avatar__image">
      </template>

      <template v-else-if="type === 'icon'">
        <slot name="icon">
          <Icon :name="icon" :size="iconSizeMap[size]" decorative />
        </slot>
      </template>

      <template v-else>
        <span class="vis-avatar__text">{{ displayText }}</span>
      </template>
    </div>

    <span
      v-if="resolvedBadgeType"
      class="vis-avatar__badge"
      :class="`is-${resolvedBadgeClassName}`"
      :style="badgeStyle"
      aria-hidden="true"
    >
      <slot name="badge">
        <VisBadge
          :type="resolvedBadgeType"
          :color-type="resolvedBadgeColorType"
          solid
          :count="badgeCount"
          :icon-name="badgeIcon"
          class="vis-avatar__badge-content"
        />
      </slot>
    </span>
  </div>
</template>

<style scoped>
.vis-avatar {
  position: relative;
  inline-size: var(--vis-avatar-size);
  block-size: var(--vis-avatar-size);
  box-sizing: border-box;
  border: var(--vis-avatar-root-border-width) solid var(--vis-avatar-border-color);
  border-radius: var(--vis-avatar-radius);
  background: var(--vis-avatar-root-bg);
  overflow: visible;
  flex: 0 0 auto;
}

.vis-avatar__body {
  position: relative;
  inline-size: 100%;
  block-size: 100%;
  box-sizing: border-box;
  border: var(--vis-avatar-body-border-width) solid var(--vis-avatar-body-border-color);
  border-radius: inherit;
  overflow: hidden;
  background: transparent;
  color: var(--vis-avatar-content-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vis-avatar__body::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-component-hover);
  opacity: var(--vis-avatar-overlay-opacity);
  transition: opacity 160ms ease;
  pointer-events: none;
}

.vis-avatar__image {
  position: absolute;
  inset: calc(0px - var(--vis-avatar-body-border-width));
  inline-size: calc(100% + var(--vis-avatar-body-border-width) + var(--vis-avatar-body-border-width));
  block-size: calc(100% + var(--vis-avatar-body-border-width) + var(--vis-avatar-body-border-width));
  border-radius: inherit;
  object-fit: cover;
  display: block;
}

.vis-avatar__text {
  position: relative;
  z-index: 1;
  max-inline-size: 100%;
  padding-inline: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-family: var(--font-family-text);
  font-size: var(--vis-avatar-text-size);
  line-height: var(--vis-avatar-text-line-height);
  font-weight: 500;
}

.vis-avatar.type-icon :deep(.vis-icon) {
  position: relative;
  z-index: 1;
}

.vis-avatar__badge {
  position: absolute;
  inset-block-start: var(--vis-avatar-badge-top);
  inset-inline-end: var(--vis-avatar-badge-right);
  display: inline-flex;
  pointer-events: none;
  z-index: 3;
}

.vis-avatar__badge.is-dot :deep(.vis-badge.visual-dot),
.vis-avatar__badge.is-state :deep(.vis-badge.visual-dot) {
  inline-size: var(--vis-avatar-badge-dot-size);
  block-size: var(--vis-avatar-badge-dot-size);
}

.vis-avatar__badge.is-number :deep(.vis-badge.visual-text),
.vis-avatar__badge.is-icon :deep(.vis-badge.visual-icon) {
  min-inline-size: var(--vis-avatar-badge-number-size);
  min-block-size: var(--vis-avatar-badge-number-size);
  block-size: var(--vis-avatar-badge-number-size);
  padding-inline: var(--vis-avatar-badge-number-padding-inline);
}
</style>
