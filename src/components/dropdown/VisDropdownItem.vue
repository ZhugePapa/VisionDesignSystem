<script setup lang="ts">
import { computed } from 'vue'

import { VisAvatarLabel } from '../avatar'
import VisCheckbox from '../checkbox/VisCheckbox.vue'
import Icon from '../icons/Icon.vue'
import type { VisDropdownItemProps } from './dropdown.types'

const props = withDefaults(defineProps<VisDropdownItemProps>(), {
  label: '菜单选项',
  type: 'default',
  active: false,
  arrow: false,
  checkable: false,
  disabled: false,
  iconName: 'settings-01',
  title: '张大山',
  subtitle: 'zhangdashan',
  avatarImageVariant: '09',
  state: 'default',
})

const emit = defineEmits<{
  select: []
}>()

const isDisabled = computed(() => props.disabled || props.state === 'disabled')
const isHoverPreview = computed(() => props.state === 'hover' && !isDisabled.value)
const isAvatar = computed(() => props.type === 'avatar')
const textColor = computed(() => (isDisabled.value ? 'var(--color-text-disabled)' : 'var(--color-text-primary)'))
const rootClasses = computed(() => ({
  [`type-${props.type}`]: true,
  'is-active': props.active,
  'is-hover': isHoverPreview.value,
  'is-checkable': props.checkable,
  'is-disabled': isDisabled.value,
  'has-arrow': props.arrow,
}))

function onSelect(): void {
  if (isDisabled.value) return
  emit('select')
}
</script>

<template>
  <div
    class="vis-dropdown-item"
    :class="rootClasses"
    :role="checkable ? 'menuitemcheckbox' : 'menuitem'"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-checked="checkable ? (active ? 'true' : 'false') : undefined"
    :aria-selected="!checkable && active ? 'true' : undefined"
    :tabindex="isDisabled ? -1 : 0"
    @click="onSelect"
    @keydown.enter.prevent="onSelect"
    @keydown.space.prevent="onSelect"
  >
    <div class="vis-dropdown-item__inner">
      <VisCheckbox
        v-if="checkable"
        class="vis-dropdown-item__checkbox"
        :model-value="active"
        :disabled="isDisabled"
        :label="false"
        aria-label="选中状态"
      />

      <VisAvatarLabel
        v-if="isAvatar"
        class="vis-dropdown-item__avatar-label"
        size="sm"
        :title="title"
        :subtitle="subtitle"
        :avatar-image-variant="avatarImageVariant"
      />

      <template v-else>
        <slot name="icon">
          <Icon v-if="type === 'icon'" class="vis-dropdown-item__icon" :name="iconName" :size="16" decorative />
        </slot>

        <span class="vis-dropdown-item__label">{{ label }}</span>
      </template>

      <Icon
        v-if="active && !checkable && !arrow"
        class="vis-dropdown-item__trailing vis-dropdown-item__trailing--active"
        name="check"
        :size="16"
        decorative
      />

      <Icon v-if="arrow" class="vis-dropdown-item__trailing" name="chevron-right" :size="16" decorative />
    </div>
  </div>
</template>

<style scoped>
.vis-dropdown-item {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 36px;
  padding-block: 2px;
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
  color: v-bind(textColor);
  font-family: var(--font-family-sans);
  cursor: pointer;
  outline: 0;
}

.vis-dropdown-item.type-avatar {
  block-size: 44px;
}

.vis-dropdown-item__inner {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.vis-dropdown-item.type-avatar .vis-dropdown-item__inner {
  block-size: var(--space-40);
}

.vis-dropdown-item:is(:hover, .is-hover):not(.is-disabled) .vis-dropdown-item__inner {
  background: var(--color-bg-secondary);
}

.vis-dropdown-item.is-disabled {
  cursor: not-allowed;
}

.vis-dropdown-item__checkbox {
  flex: 0 0 auto;
  pointer-events: none;
}

.vis-dropdown-item__icon,
.vis-dropdown-item__trailing {
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}

.vis-dropdown-item__trailing--active {
  color: var(--color-fg-brand-primary);
}

.vis-dropdown-item__label {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-dropdown-item__avatar-label {
  min-inline-size: 0;
  flex: 1 1 0;
}

.vis-dropdown-item.is-disabled .vis-dropdown-item__icon,
.vis-dropdown-item.is-disabled .vis-dropdown-item__trailing,
.vis-dropdown-item.is-disabled :deep(.vis-avatar-label__title),
.vis-dropdown-item.is-disabled :deep(.vis-avatar-label__subtitle) {
  color: var(--color-text-disabled);
}
</style>
