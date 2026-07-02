<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import type { IconName } from '../icons/generated/registry.generated'
import type { VisBreadcrumbItem, VisBreadcrumbProps } from './breadcrumb.types'

const props = withDefaults(defineProps<VisBreadcrumbProps>(), {
  items: () => [
    { label: '菜单名称' },
    { label: '菜单名称' },
    { label: '菜单名称', active: true },
  ],
  type: 'button',
  size: 'md',
  separator: 'slash',
})

const emit = defineEmits<{
  click: [item: VisBreadcrumbItem, index: number]
}>()

const separatorIconName = computed<IconName>(() =>
  props.separator === 'arrow' ? 'chevron-right' : 'slash-divider',
)
const separatorIconSize = computed(() => (props.separator === 'arrow' ? 14 : 12))
const breadcrumbIconSize = computed(() => (props.size === 'sm' ? 14 : 16))

function handleItemClick(item: VisBreadcrumbItem, index: number, event: Event): void {
  if (item.disabled || item.active) {
    event.preventDefault()
    return
  }

  emit('click', item, index)
}
</script>

<template>
  <nav
    class="vis-breadcrumb"
    :class="[`type-${type}`, `size-${size}`, `separator-${separator}`]"
    aria-label="Breadcrumb"
  >
    <ol class="vis-breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="vis-breadcrumb__item">
        <component
          :is="type === 'link' && item.href ? 'a' : 'button'"
          class="vis-breadcrumb__label"
          :class="{
            'is-active': item.active,
            'is-disabled': item.disabled,
            'has-icon': item.iconName,
            'has-optional': item.optional,
          }"
          :href="type === 'link' && item.href && !item.disabled && !item.active ? item.href : undefined"
          :type="type === 'button' || !item.href ? 'button' : undefined"
          :disabled="type === 'button' && item.disabled ? true : undefined"
          :aria-current="item.active ? 'page' : undefined"
          :aria-disabled="item.disabled || item.active ? 'true' : undefined"
          @click="handleItemClick(item, index, $event)"
        >
          <Icon v-if="item.iconName" :name="item.iconName" :size="breadcrumbIconSize" decorative />
          <span class="vis-breadcrumb__text">{{ item.label }}</span>
          <span v-if="item.optional" class="vis-breadcrumb__optional" aria-hidden="true">
            <Icon name="chevron-down" :size="breadcrumbIconSize" decorative />
          </span>
        </component>

        <span v-if="index < items.length - 1" class="vis-breadcrumb__separator" aria-hidden="true">
          <Icon :name="separatorIconName" :size="separatorIconSize" decorative />
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.vis-breadcrumb {
  --vis-breadcrumb-height: 24px;
  --vis-breadcrumb-font-size: var(--font-text-md-size);
  --vis-breadcrumb-line-height: var(--font-text-md-line-height);
  --vis-breadcrumb-label-padding: var(--space-4);
  --vis-breadcrumb-icon-size: 16px;

  max-inline-size: 100%;
  display: inline-flex;
  color: var(--color-text-tertiary);
  font-family: var(--font-family-sans);
}

.vis-breadcrumb.size-sm {
  --vis-breadcrumb-height: 20px;
  --vis-breadcrumb-font-size: var(--font-text-sm-size);
  --vis-breadcrumb-line-height: var(--font-text-sm-line-height);
  --vis-breadcrumb-icon-size: 14px;
}

.vis-breadcrumb.type-link {
  --vis-breadcrumb-label-padding: 0px;
}

.vis-breadcrumb__list {
  min-width: 0;
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  list-style: none;
}

.vis-breadcrumb__item {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.vis-breadcrumb__label {
  min-width: 0;
  box-sizing: border-box;
  block-size: var(--vis-breadcrumb-height);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0 var(--vis-breadcrumb-label-padding);
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  appearance: none;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: var(--vis-breadcrumb-font-size);
  font-weight: 400;
  line-height: var(--vis-breadcrumb-line-height);
  letter-spacing: 0;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

.vis-breadcrumb__label:hover:not(.is-disabled):not(.is-active) {
  color: var(--color-text-primary);
}

.vis-breadcrumb.type-button .vis-breadcrumb__label:hover:not(.is-disabled):not(.is-active) {
  background: var(--color-bg-tertiary);
}

.vis-breadcrumb__label.is-active {
  color: var(--color-text-primary);
  cursor: default;
}

.vis-breadcrumb__label.is-disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-breadcrumb__label:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

.vis-breadcrumb__text {
  min-width: 0;
  block-size: var(--vis-breadcrumb-line-height);
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  line-height: var(--vis-breadcrumb-line-height);
  text-overflow: ellipsis;
}

.vis-breadcrumb__optional {
  inline-size: var(--vis-breadcrumb-icon-size);
  block-size: var(--vis-breadcrumb-height);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.vis-breadcrumb__separator {
  inline-size: 12px;
  block-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-tertiary);
  overflow: hidden;
  flex: 0 0 auto;
}
</style>
