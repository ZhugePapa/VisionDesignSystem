<script setup lang="ts">
import { computed } from 'vue'

import VisBadge from '../badge/VisBadge.vue'
import VisFeaturedIcon from '../featured-icon/VisFeaturedIcon.vue'
import Icon from '../icons/Icon.vue'
import type { VisMenuItemProps } from './menu.types'
import VisProjectLogo from './VisProjectLogo.vue'

defineOptions({ name: 'VisMenuItem' })

const props = withDefaults(defineProps<VisMenuItemProps>(), {
  active: false,
  open: false,
  collapsed: false,
  subLevel: false,
  state: 'default',
})

const emit = defineEmits<{
  select: [event: MouseEvent | KeyboardEvent]
  'hover-open': [element: HTMLElement]
  'hover-close': []
  'keyboard-open': [element: HTMLElement]
  'keyboard-close': []
}>()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const hasBadge = computed(() => props.item.badgeCount !== undefined && props.item.badgeCount !== null)
const resolvedIcon = computed(() => {
  const icon = props.item.icon ?? 'linear'
  return icon === 'featured' && (props.subLevel || hasChildren.value) ? 'linear' : icon
})
const resolvedIconName = computed(() => props.item.iconName ?? 'bar-chart-square-01')
const classes = computed(() => ({
  'is-active': props.active,
  'is-open': props.open,
  'is-collapsed': props.collapsed,
  'is-sub-level': props.subLevel,
  'is-disabled': props.item.disabled,
  'is-hover-preview': props.state === 'hover' && !props.item.disabled,
  'has-children': hasChildren.value,
  'has-featured-icon': resolvedIcon.value === 'featured',
}))

function onSelect(event: MouseEvent | KeyboardEvent): void {
  if (props.item.disabled) return
  emit('select', event)
}

function onPointerEnter(event: MouseEvent): void {
  if (props.item.disabled || !hasChildren.value || (props.open && !props.collapsed)) return
  emit('hover-open', event.currentTarget as HTMLElement)
}

function onKeydown(event: KeyboardEvent): void {
  if (props.item.disabled) return
  if (event.key === 'ArrowRight' && hasChildren.value && (!props.open || props.collapsed)) {
    event.preventDefault()
    emit('keyboard-open', event.currentTarget as HTMLElement)
  } else if (event.key === 'ArrowLeft' && hasChildren.value) {
    event.preventDefault()
    emit('keyboard-close')
  }
}
</script>

<template>
  <button
    class="vis-menu-item"
    :class="classes"
    type="button"
    :disabled="item.disabled"
    :title="collapsed ? item.label : undefined"
    :aria-current="active && !hasChildren ? 'page' : undefined"
    :aria-expanded="hasChildren ? open : undefined"
    :aria-haspopup="hasChildren ? 'menu' : undefined"
    @click="onSelect"
    @mouseenter="onPointerEnter"
    @mouseleave="emit('hover-close')"
    @keydown="onKeydown"
  >
    <span v-if="resolvedIcon === 'linear'" class="vis-menu-item__icon">
      <VisProjectLogo v-if="item.projectLogo" :variant="item.projectLogo" :size="16" />
      <Icon v-else :name="resolvedIconName" :size="16" decorative />
    </span>

    <VisFeaturedIcon
      v-else-if="resolvedIcon === 'featured'"
      class="vis-menu-item__featured-icon"
      size="sm"
      type="modern"
      color="grey"
      :icon="resolvedIconName"
      decorative
    >
      <template #icon>
        <span class="vis-menu-item__featured-glyph">
          <Icon :name="resolvedIconName" :size="14" decorative />
        </span>
      </template>
    </VisFeaturedIcon>

    <span v-if="!collapsed" class="vis-menu-item__label">{{ item.label }}</span>

    <VisBadge
      v-if="!collapsed && hasBadge"
      class="vis-menu-item__badge"
      type="default"
      size="sm"
      :color="active || open ? 'blue' : 'grey'"
      :label="String(item.badgeCount)"
    />

    <Icon
      v-if="!collapsed && hasChildren"
      class="vis-menu-item__chevron"
      :name="open ? 'chevron-down' : 'chevron-right'"
      :size="16"
      decorative
    />
  </button>
</template>

<style scoped>
.vis-menu-item {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-40);
  min-inline-size: 0;
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  background: transparent;
  font-family: var(--font-family-sans);
  text-align: start;
  cursor: pointer;
  outline: 0;
}

.vis-menu-item.is-sub-level {
  padding-inline: 36px var(--space-12);
}

.vis-menu-item.is-collapsed {
  inline-size: var(--space-40);
  flex: 0 0 var(--space-40);
  justify-content: center;
  padding: 0;
}

.vis-menu-item.has-featured-icon:not(.is-collapsed) {
  padding-inline: var(--space-8) var(--space-12);
}

.vis-menu-item:is(:hover, :focus-visible, .is-hover-preview):not(.is-disabled):not(.is-active) {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
}

.vis-menu-item.is-active:not(.is-disabled) {
  color: var(--color-text-brand-primary);
  background: var(--color-fg-brand-subtle);
}

.vis-menu-item.has-featured-icon.is-active:not(.is-disabled) {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
}

.vis-menu-item:is(.is-active, .is-open).has-children:not(.is-disabled) {
  color: var(--color-text-brand-primary);
  background: transparent;
}

.vis-menu-item:is(.is-active, .is-open).has-children:is(
    :hover,
    :focus-visible,
    .is-hover-preview
  ):not(.is-disabled) {
  background: var(--color-fg-brand-subtle);
}

.vis-menu-item.is-disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-menu-item:focus-visible {
  box-shadow: 0 0 0 2px var(--color-effect-focus-ring-brand);
}

.vis-menu-item__icon,
.vis-menu-item__chevron {
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}

.vis-menu-item__icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vis-menu-item__featured-glyph {
  inline-size: 14px;
  block-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-primary);
}

.vis-menu-item:is(:hover, :focus-visible, .is-hover-preview):not(.is-disabled) .vis-menu-item__icon,
.vis-menu-item:is(:hover, :focus-visible, .is-hover-preview):not(.is-disabled) .vis-menu-item__chevron {
  color: var(--color-fg-secondary);
}

.vis-menu-item:is(.is-active, .is-open):not(.is-disabled) .vis-menu-item__icon,
.vis-menu-item:is(.is-active, .is-open):not(.is-disabled) .vis-menu-item__chevron {
  color: var(--color-fg-brand-primary);
}

.vis-menu-item.is-disabled .vis-menu-item__icon,
.vis-menu-item.is-disabled .vis-menu-item__chevron {
  color: var(--color-fg-disabled);
}

.vis-menu-item__label {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  color: currentColor;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-menu-item.is-active:not(.has-children) .vis-menu-item__label {
  font-weight: 500;
}

.vis-menu-item__badge,
.vis-menu-item__chevron {
  flex: 0 0 auto;
}
</style>
