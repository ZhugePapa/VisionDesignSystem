<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import Icon from '../icons/Icon.vue'
import type { IconName } from '../icons/generated/registry.generated'
import type { VisBadgeColorType, VisBadgeProps, VisBadgeType } from './badge.types'

const props = withDefaults(defineProps<VisBadgeProps>(), {
  colorType: 'danger',
  type: 'status',
  solid: false,
  subtle: false,
  label: undefined,
  count: undefined,
  iconName: undefined,
})

const visualType = computed(() => (props.type === 'number' ? 'text' : props.type))
const normalizedColorType = computed<Exclude<VisBadgeColorType, 'info'>>(() =>
  props.colorType === 'info' ? 'grey' : props.colorType,
)
const isSolid = computed(() => props.solid || props.type === 'dot')
const isSubtle = computed(() => props.subtle && props.type === 'status' && !props.solid)

const defaultStatusLabelMap: Record<VisBadgeColorType, string> = {
  danger: '危险',
  warning: '警告',
  success: '成功',
  brand: '进行中',
  grey: '未开始',
  info: '未开始',
}

const defaultTextLabelMap: Record<VisBadgeColorType, string> = {
  danger: 'Hot!',
  warning: 'Hot!',
  success: 'New',
  brand: 'New',
  grey: 'info',
  info: 'info',
}

const defaultIconMap: Record<VisBadgeColorType, IconName> = {
  danger: 'x-close',
  warning: 'alert',
  success: 'check',
  brand: 'dots-horizontal',
  grey: 'dots-horizontal',
  info: 'dots-horizontal',
}

const contentText = computed(() => {
  if (props.type === 'status') return props.label ?? defaultStatusLabelMap[props.colorType]
  if (props.type === 'number') return props.count ?? 1
  return props.label ?? defaultTextLabelMap[props.colorType]
})

const isCompactText = computed(() => visualType.value === 'text' && String(contentText.value).trim().length <= 1)
const resolvedIconName = computed(() => props.iconName ?? defaultIconMap[props.colorType])

const badgeStyleMap: Record<Exclude<VisBadgeColorType, 'info'>, CSSProperties> = {
  danger: {
    '--vis-badge-solid-bg': 'var(--color-fg-danger-primary)',
    '--vis-badge-soft-bg': 'var(--color-fg-danger-subtle)',
    '--vis-badge-soft-border': 'var(--color-border-danger-subtle)',
    '--vis-badge-soft-text': 'var(--color-text-danger-primary)',
    '--vis-badge-soft-dot': 'var(--color-fg-danger-primary)',
    '--vis-badge-subtle-bg': 'var(--color-bg-surface)',
    '--vis-badge-subtle-border': 'var(--color-border-default)',
    '--vis-badge-subtle-text': 'var(--color-text-secondary)',
    '--vis-badge-subtle-dot': 'var(--color-fg-danger-primary)',
  },
  warning: {
    '--vis-badge-solid-bg': 'var(--color-fg-warning-primary)',
    '--vis-badge-soft-bg': 'var(--color-fg-warning-subtle)',
    '--vis-badge-soft-border': 'var(--color-border-warning-subtle)',
    '--vis-badge-soft-text': 'var(--color-text-warning-primary)',
    '--vis-badge-soft-dot': 'var(--color-fg-warning-primary)',
    '--vis-badge-subtle-bg': 'var(--color-bg-surface)',
    '--vis-badge-subtle-border': 'var(--color-border-default)',
    '--vis-badge-subtle-text': 'var(--color-text-secondary)',
    '--vis-badge-subtle-dot': 'var(--color-fg-warning-primary)',
  },
  success: {
    '--vis-badge-solid-bg': 'var(--color-fg-success-primary)',
    '--vis-badge-soft-bg': 'var(--color-fg-success-subtle)',
    '--vis-badge-soft-border': 'var(--color-border-success-subtle)',
    '--vis-badge-soft-text': 'var(--color-text-success-primary)',
    '--vis-badge-soft-dot': 'var(--color-fg-success-primary)',
    '--vis-badge-subtle-bg': 'var(--color-bg-surface)',
    '--vis-badge-subtle-border': 'var(--color-border-default)',
    '--vis-badge-subtle-text': 'var(--color-text-secondary)',
    '--vis-badge-subtle-dot': 'var(--color-fg-success-primary)',
  },
  brand: {
    '--vis-badge-solid-bg': 'var(--color-fg-brand-primary)',
    '--vis-badge-soft-bg': 'var(--color-fg-brand-subtle)',
    '--vis-badge-soft-border': 'var(--color-border-brand-subtle)',
    '--vis-badge-soft-text': 'var(--color-text-brand-primary)',
    '--vis-badge-soft-dot': 'var(--color-fg-brand-primary)',
    '--vis-badge-subtle-bg': 'var(--color-bg-surface)',
    '--vis-badge-subtle-border': 'var(--color-border-default)',
    '--vis-badge-subtle-text': 'var(--color-text-secondary)',
    '--vis-badge-subtle-dot': 'var(--color-fg-brand-primary)',
  },
  grey: {
    '--vis-badge-solid-bg': 'var(--color-fg-tertiary)',
    '--vis-badge-soft-bg': 'var(--color-bg-secondary)',
    '--vis-badge-soft-border': 'var(--color-border-default)',
    '--vis-badge-soft-text': 'var(--color-text-secondary)',
    '--vis-badge-soft-dot': 'var(--color-fg-tertiary)',
    '--vis-badge-subtle-bg': 'var(--color-bg-surface)',
    '--vis-badge-subtle-border': 'var(--color-border-default)',
    '--vis-badge-subtle-text': 'var(--color-text-secondary)',
    '--vis-badge-subtle-dot': 'var(--color-fg-tertiary)',
  },
}

const badgeClass = computed(() => [
  `type-${props.type}`,
  `visual-${visualType.value}`,
  `color-${normalizedColorType.value}`,
  {
    'is-compact-text': isCompactText.value,
    'is-solid': isSolid.value,
    'is-subtle': isSubtle.value,
    'is-soft': !isSolid.value && !isSubtle.value,
  },
])

const badgeStyle = computed(() => badgeStyleMap[normalizedColorType.value])
</script>

<template>
  <span class="vis-badge" :class="badgeClass" :style="badgeStyle">
    <template v-if="type === 'status'">
      <span class="vis-badge__status-dot" aria-hidden="true" />
      <span class="vis-badge__status-label">{{ contentText }}</span>
    </template>

    <template v-else-if="visualType === 'icon'">
      <span class="vis-badge__icon" aria-hidden="true">
        <slot name="icon">
          <Icon :name="resolvedIconName" :size="12" decorative />
        </slot>
      </span>
    </template>

    <template v-else-if="visualType === 'text'">
      <span class="vis-badge__text">{{ contentText }}</span>
    </template>
  </span>
</template>

<style scoped>
.vis-badge {
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  vertical-align: middle;
  overflow: hidden;
  font-family: var(--font-family-sans);
  letter-spacing: 0;
  white-space: nowrap;
  flex: 0 0 auto;
}

.vis-badge.visual-status {
  block-size: var(--space-20);
  gap: 6px;
  padding-inline: var(--space-8);
}

.vis-badge.visual-text {
  min-inline-size: var(--space-20);
  block-size: var(--space-20);
  padding-inline: 6px;
}

.vis-badge.visual-text.is-compact-text {
  inline-size: var(--space-20);
  padding-inline: 0;
}

.vis-badge.visual-icon {
  inline-size: var(--space-20);
  block-size: var(--space-20);
  padding: 2px;
}

.vis-badge.visual-dot {
  inline-size: var(--space-8);
  block-size: var(--space-8);
  border-color: var(--color-border-white);
  background: var(--vis-badge-solid-bg);
}

.vis-badge.is-soft:is(.visual-status, .visual-text, .visual-icon) {
  border-color: var(--vis-badge-soft-border);
  background: var(--vis-badge-soft-bg);
  color: var(--vis-badge-soft-text);
}

.vis-badge.is-subtle.visual-status {
  border-color: var(--vis-badge-subtle-border);
  background: var(--vis-badge-subtle-bg);
  color: var(--vis-badge-subtle-text);
}

.vis-badge.is-solid:is(.visual-text, .visual-icon) {
  border-color: var(--color-border-white);
  background: var(--vis-badge-solid-bg);
  color: var(--color-text-white);
}

.vis-badge.is-solid.visual-status {
  background: var(--vis-badge-solid-bg);
  color: var(--color-text-white);
}

.vis-badge__status-dot {
  inline-size: 6px;
  block-size: 6px;
  border-radius: var(--radius-full);
  background: var(--vis-badge-soft-dot);
  flex: 0 0 auto;
}

.vis-badge.is-solid .vis-badge__status-dot {
  background: var(--color-fg-white);
}

.vis-badge.is-subtle .vis-badge__status-dot {
  background: var(--vis-badge-subtle-dot);
}

.vis-badge__status-label {
  color: currentColor;
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  text-align: center;
}

.vis-badge__text {
  color: currentColor;
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
  text-align: center;
}

.vis-badge__icon {
  inline-size: 12px;
  block-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style>
