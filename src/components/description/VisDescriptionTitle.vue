<script setup lang="ts">
import Icon from '../icons/Icon.vue'
import type { VisDescriptionTitleProps } from './description.types'

defineOptions({ name: 'VisDescriptionTitle' })

withDefaults(defineProps<VisDescriptionTitleProps>(), {
  title: '基本信息',
  foldable: false,
  collapsed: false,
})

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="vis-description-title">
    <span class="vis-description-title__bar" aria-hidden="true" />
    <h3 class="vis-description-title__text">
      <slot>{{ title }}</slot>
    </h3>
    <span class="vis-description-title__spacer" />
    <slot name="extra" />
    <button
      v-if="foldable"
      class="vis-description-title__toggle"
      type="button"
      :aria-label="collapsed ? '展开描述列表' : '收起描述列表'"
      :aria-expanded="!collapsed"
      @click="emit('toggle')"
    >
      <Icon name="chevron-left" :size="16" decorative />
    </button>
  </div>
</template>

<style scoped>
.vis-description-title {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  block-size: var(--space-24);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
}

.vis-description-title__bar {
  inline-size: 3px;
  block-size: var(--space-16);
  border-radius: var(--radius-full);
  background: var(--color-fg-brand-primary);
  flex: 0 0 auto;
}

.vis-description-title__text {
  min-inline-size: 0;
  margin: 0;
  overflow: hidden;
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-description-title__spacer {
  min-inline-size: 0;
  flex: 1 1 0;
}

.vis-description-title__toggle {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-tertiary);
  background: transparent;
  cursor: pointer;
  flex: 0 0 auto;
}

.vis-description-title__toggle:hover {
  color: var(--color-fg-secondary);
  background: var(--color-bg-secondary);
}

.vis-description-title__toggle:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}
</style>
