<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { ElTag } from 'element-plus'

import Icon from '../icons/Icon.vue'
import { resolveElementBadgeProps, resolveVisBadgeColor, resolveVisBadgeType } from './badge.adapter'
import type {
  VisBadgeColor,
  VisBadgeProps,
  VisBadgeSize,
  VisBadgeVariantType,
} from './badge.types'

defineOptions({
  name: 'VisBadge',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<VisBadgeProps>(), {
  color: undefined,
  colorType: undefined,
  size: 'sm',
  type: 'default',
  solid: false,
  dotOnly: false,
  iconOnly: false,
  label: undefined,
  iconName: undefined,
  count: undefined,
  subtle: false,
  elProps: undefined,
})

const colorStyles: Record<VisBadgeColor, CSSProperties> = {
  grey: {
    '--vis-badge-solid-bg': 'var(--color-fg-tertiary)',
    '--vis-badge-soft-bg': 'var(--color-bg-quaternary)',
    '--vis-badge-soft-fg': 'var(--color-text-secondary)',
  },
  red: {
    '--vis-badge-solid-bg': 'var(--utility-red-500)',
    '--vis-badge-soft-bg': 'var(--utility-red-100)',
    '--vis-badge-soft-fg': 'var(--utility-red-500)',
  },
  orange: {
    '--vis-badge-solid-bg': 'var(--utility-orange-500)',
    '--vis-badge-soft-bg': 'var(--utility-orange-100)',
    '--vis-badge-soft-fg': 'var(--utility-orange-500)',
  },
  yellow: {
    '--vis-badge-solid-bg': 'var(--utility-yellow-500)',
    '--vis-badge-soft-bg': 'var(--utility-yellow-100)',
    '--vis-badge-soft-fg': 'var(--utility-yellow-500)',
  },
  moss: {
    '--vis-badge-solid-bg': 'var(--utility-moss-500)',
    '--vis-badge-soft-bg': 'var(--utility-moss-100)',
    '--vis-badge-soft-fg': 'var(--utility-moss-500)',
  },
  green: {
    '--vis-badge-solid-bg': 'var(--utility-green-500)',
    '--vis-badge-soft-bg': 'var(--utility-green-100)',
    '--vis-badge-soft-fg': 'var(--utility-green-500)',
  },
  aqua: {
    '--vis-badge-solid-bg': 'var(--utility-aqua-500)',
    '--vis-badge-soft-bg': 'var(--utility-aqua-100)',
    '--vis-badge-soft-fg': 'var(--utility-aqua-500)',
  },
  cyan: {
    '--vis-badge-solid-bg': 'var(--utility-cyan-500)',
    '--vis-badge-soft-bg': 'var(--utility-cyan-100)',
    '--vis-badge-soft-fg': 'var(--utility-cyan-500)',
  },
  blue: {
    '--vis-badge-solid-bg': 'var(--utility-blue-500)',
    '--vis-badge-soft-bg': 'var(--utility-blue-100)',
    '--vis-badge-soft-fg': 'var(--utility-blue-500)',
  },
  purple: {
    '--vis-badge-solid-bg': 'var(--utility-purple-500)',
    '--vis-badge-soft-bg': 'var(--utility-purple-100)',
    '--vis-badge-soft-fg': 'var(--utility-purple-500)',
  },
  violet: {
    '--vis-badge-solid-bg': 'var(--utility-violet-500)',
    '--vis-badge-soft-bg': 'var(--utility-violet-100)',
    '--vis-badge-soft-fg': 'var(--utility-violet-500)',
  },
  scarlet: {
    '--vis-badge-solid-bg': 'var(--utility-scarlet-500)',
    '--vis-badge-soft-bg': 'var(--utility-scarlet-100)',
    '--vis-badge-soft-fg': 'var(--utility-scarlet-500)',
  },
  pink: {
    '--vis-badge-solid-bg': 'var(--utility-pink-500)',
    '--vis-badge-soft-bg': 'var(--utility-pink-100)',
    '--vis-badge-soft-fg': 'var(--utility-pink-500)',
  },
}

const resolvedColor = computed<VisBadgeColor>(() => resolveVisBadgeColor(props.color, props.colorType))

const resolvedType = computed<VisBadgeVariantType>(() => {
  if (props.dotOnly) return 'dot'
  if (props.iconOnly) return 'default'
  return resolveVisBadgeType(props.type)
})

const isDotOnly = computed(() => props.dotOnly)
const isIconOnly = computed(() => props.iconOnly && !isDotOnly.value)
const resolvedSize = computed<VisBadgeSize>(() => (isDotOnly.value || isIconOnly.value ? 'sm' : props.size))
const resolvedSolid = computed(() => props.solid || isDotOnly.value)
const contentText = computed(() => {
  if (props.type === 'number') return props.count ?? 1
  return props.label ?? 'Badge'
})
const resolvedIconName = computed(() => props.iconName ?? (isIconOnly.value ? 'dots-horizontal' : 'download-03'))
const iconSize = computed(() => (resolvedSize.value === 'sm' ? 12 : 16))
const elementBadgeProps = computed(() => resolveElementBadgeProps(props, resolvedSize.value))
const badgeStyle = computed(() => colorStyles[resolvedColor.value])
const badgeClass = computed(() => [
  `size-${resolvedSize.value}`,
  `type-${resolvedType.value}`,
  `visual-${isIconOnly.value ? 'icon' : resolvedType.value === 'default' ? 'text' : resolvedType.value}`,
  `color-${resolvedColor.value}`,
  {
    'is-solid': resolvedSolid.value,
    'is-soft': !resolvedSolid.value,
    'is-icon-only': isIconOnly.value,
  },
])
</script>

<template>
  <span
    v-if="isDotOnly"
    v-bind="$attrs"
    class="vis-badge vis-badge--dot-only visual-dot"
    :class="`color-${resolvedColor}`"
    :style="badgeStyle"
    :aria-label="label"
  />

  <ElTag
    v-else
    v-bind="{ ...$attrs, ...elementBadgeProps }"
    class="vis-badge"
    :class="badgeClass"
    :style="badgeStyle"
  >
    <span v-if="isIconOnly || resolvedType === 'icon'" class="vis-badge__icon" aria-hidden="true">
      <slot name="icon">
        <Icon :name="resolvedIconName" :size="iconSize" decorative />
      </slot>
    </span>

    <span v-if="resolvedType === 'dot'" class="vis-badge__dot" aria-hidden="true" />

    <span v-if="!isIconOnly" class="vis-badge__label vis-badge__text">
      <slot>{{ contentText }}</slot>
    </span>
  </ElTag>
</template>

<style scoped>
.vis-badge {
  box-sizing: border-box;
  position: relative;
  min-inline-size: 18px;
  border: 0;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: var(--font-family-text);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
  vertical-align: middle;
  flex: 0 0 auto;
  transition: none;
}

.vis-badge.size-sm {
  block-size: var(--space-20);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.vis-badge.size-md {
  block-size: var(--space-24);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.vis-badge.type-default {
  padding-inline: var(--space-6);
}

.vis-badge:is(.type-icon, .type-dot) {
  padding-inline: var(--space-8);
}

.vis-badge.is-soft {
  background: var(--vis-badge-soft-bg);
  color: var(--vis-badge-soft-fg);
}

.vis-badge.is-solid {
  background: var(--vis-badge-solid-bg);
  color: var(--color-text-white);
}

.vis-badge.is-icon-only {
  inline-size: var(--space-20);
  min-inline-size: var(--space-20);
  padding: 2px;
  border-radius: var(--radius-full);
}

.vis-badge :deep(.el-tag__content),
.vis-badge :deep([class$='-tag__content']) {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font: inherit;
  line-height: inherit;
}

.vis-badge.type-icon :deep(.el-tag__content),
.vis-badge.type-icon :deep([class$='-tag__content']) {
  gap: var(--space-4);
}

.vis-badge.type-dot :deep(.el-tag__content),
.vis-badge.type-dot :deep([class$='-tag__content']) {
  gap: var(--space-6);
}

.vis-badge__label {
  min-inline-size: var(--space-8);
  color: currentColor;
  font: inherit;
  line-height: inherit;
  text-align: center;
  word-break: break-word;
}

.vis-badge__icon {
  inline-size: var(--vis-badge-icon-size, 12px);
  block-size: var(--vis-badge-icon-size, 12px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  flex: 0 0 auto;
  overflow: hidden;
}

.vis-badge.size-sm {
  --vis-badge-icon-size: 12px;
}

.vis-badge.size-md {
  --vis-badge-icon-size: 16px;
}

.vis-badge__dot {
  inline-size: var(--space-6);
  block-size: var(--space-6);
  border-radius: var(--radius-full);
  display: block;
  background: var(--vis-badge-solid-bg);
  flex: 0 0 auto;
}

.vis-badge.is-solid .vis-badge__dot {
  background: var(--color-fg-white);
}

.vis-badge--dot-only {
  inline-size: var(--space-8);
  min-inline-size: var(--space-8);
  block-size: var(--space-8);
  border: 1px solid var(--color-border-white);
  border-radius: var(--radius-full);
  padding: 0;
  background: var(--vis-badge-solid-bg);
}
</style>
