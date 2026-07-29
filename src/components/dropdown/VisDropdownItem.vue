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
  danger: false,
  arrow: false,
  checkable: false,
  disabled: false,
  iconName: 'settings-01',
  title: '张大山',
  subtitle: 'zhangdashan',
  avatarImageVariant: '09',
  state: 'default',
  description: false,
  descriptionText: '这里是描述文字',
  suffix: false,
})

const emit = defineEmits<{
  select: []
}>()

const isDisabled = computed(() => props.disabled || props.state === 'disabled')
const isHoverPreview = computed(() => props.state === 'hover' && !isDisabled.value)
const isAvatar = computed(() => props.type === 'avatar')
const hasDescription = computed(() => props.description && !isAvatar.value)
const hasSuffix = computed(() => props.suffix && !isAvatar.value && !hasDescription.value)
const isActiveSelection = computed(() => props.active && !props.checkable)
const textColor = computed(() => {
  if (props.danger) {
    return isDisabled.value ? 'var(--color-text-danger-disabled)' : 'var(--color-text-danger-primary)'
  }

  if (isDisabled.value) {
    return isActiveSelection.value ? 'var(--color-text-brand-disabled)' : 'var(--color-text-disabled)'
  }

  return isActiveSelection.value ? 'var(--color-text-brand-primary)' : 'var(--color-text-primary)'
})
const descriptionColor = computed(() => {
  if (props.danger) {
    return isDisabled.value ? 'var(--color-text-danger-disabled)' : 'var(--color-text-danger-primary)'
  }

  if (isDisabled.value) {
    return isActiveSelection.value ? 'var(--color-text-brand-disabled)' : 'var(--color-text-disabled)'
  }

  return isActiveSelection.value ? 'var(--color-text-brand-primary)' : 'var(--color-text-tertiary)'
})
const rootClasses = computed(() => ({
  [`type-${props.type}`]: true,
  'is-active': props.active,
  'is-danger': props.danger,
  'is-hover': isHoverPreview.value,
  'is-checkable': props.checkable,
  'is-disabled': isDisabled.value,
  'has-arrow': props.arrow,
  'has-description': hasDescription.value,
  'has-suffix': hasSuffix.value,
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

        <span class="vis-dropdown-item__content">
          <span class="vis-dropdown-item__label">{{ label }}</span>
          <span v-if="hasDescription" class="vis-dropdown-item__description">
            <slot name="description">{{ descriptionText }}</slot>
          </span>
        </span>
      </template>

      <span v-if="hasSuffix" class="vis-dropdown-item__suffix">
        <slot name="suffix">速度</slot>
      </span>

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

.vis-dropdown-item.has-description {
  block-size: 58px;
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

.vis-dropdown-item.has-description .vis-dropdown-item__inner {
  block-size: 54px;
  padding-block: var(--space-6);
  align-items: flex-start;
}

.vis-dropdown-item.has-description .vis-dropdown-item__checkbox,
.vis-dropdown-item.has-description .vis-dropdown-item__icon,
.vis-dropdown-item.has-description .vis-dropdown-item__trailing {
  margin-block-start: 2px;
}

.vis-dropdown-item:is(:hover, .is-hover):not(.is-disabled) .vis-dropdown-item__inner {
  background: var(--color-bg-secondary);
}

.vis-dropdown-item.is-danger:is(:hover, .is-hover):not(.is-disabled) .vis-dropdown-item__inner {
  background: var(--color-fg-danger-subtle);
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

.vis-dropdown-item.is-danger:not(.is-disabled) .vis-dropdown-item__icon {
  color: var(--color-fg-danger-primary);
}

.vis-dropdown-item.is-active:not(.is-checkable):not(.is-disabled) .vis-dropdown-item__icon,
.vis-dropdown-item.is-active:not(.is-checkable):not(.is-disabled) .vis-dropdown-item__trailing--active {
  color: var(--color-fg-brand-primary);
}

.vis-dropdown-item__content {
  min-inline-size: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}

.vis-dropdown-item.has-description .vis-dropdown-item__content {
  gap: var(--space-4);
}

.vis-dropdown-item__label,
.vis-dropdown-item__description {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-dropdown-item__label {
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-dropdown-item__suffix {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-dropdown-item__description {
  color: v-bind(descriptionColor);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  letter-spacing: 0;
}

.vis-dropdown-item__avatar-label {
  min-inline-size: 0;
  flex: 1 1 0;
}

.vis-dropdown-item.is-disabled .vis-dropdown-item__icon,
.vis-dropdown-item.is-disabled .vis-dropdown-item__trailing {
  color: var(--color-fg-disabled);
}

.vis-dropdown-item.is-disabled .vis-dropdown-item__suffix {
  color: var(--color-text-disabled);
}

.vis-dropdown-item.is-danger.is-disabled .vis-dropdown-item__icon {
  color: var(--color-fg-danger-disabled);
}

.vis-dropdown-item.is-disabled :deep(.vis-avatar-label__title),
.vis-dropdown-item.is-disabled :deep(.vis-avatar-label__subtitle) {
  color: var(--color-text-disabled);
}

.vis-dropdown-item.is-active:not(.is-checkable).is-disabled .vis-dropdown-item__icon,
.vis-dropdown-item.is-active:not(.is-checkable).is-disabled .vis-dropdown-item__trailing--active {
  color: var(--color-fg-brand-disabled);
}
</style>
