<script setup lang="ts">
import Icon from '../icons/Icon.vue'
import type { VisProjectCellProps } from './menu.types'
import VisProjectLogo from './VisProjectLogo.vue'

defineOptions({ name: 'VisProjectCell' })

withDefaults(defineProps<VisProjectCellProps>(), {
  project: () => ({ key: 'project', label: '飞机照明系统', logoVariant: 'logo_003' }),
  collapsed: false,
  active: false,
})

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    class="vis-project-cell"
    :class="{ 'is-collapsed': collapsed, 'is-active': active }"
    type="button"
    :aria-expanded="active"
    aria-haspopup="listbox"
    :title="collapsed ? project.label : undefined"
    @click="emit('toggle')"
  >
    <span class="vis-project-cell__logo" aria-hidden="true">
      <slot name="logo" :project="project">
        <VisProjectLogo v-if="project.logoVariant" :variant="project.logoVariant" :size="24" />
        <Icon v-else :name="project.iconName ?? 'layers-three-01'" :size="24" decorative />
      </slot>
    </span>
    <span v-if="!collapsed" class="vis-project-cell__label">{{ project.label }}</span>
    <Icon
      v-if="!collapsed"
      class="vis-project-cell__chevron"
      :name="active ? 'chevron-up' : 'chevron-down'"
      :size="16"
      decorative
    />
  </button>
</template>

<style scoped>
.vis-project-cell {
  box-sizing: border-box;
  inline-size: 216px;
  block-size: var(--space-56);
  border: 0;
  padding: var(--space-8) var(--space-24) var(--space-8) var(--space-20);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  box-shadow:
    inset -1px 0 0 var(--color-border-default),
    inset 0 -1px 0 var(--color-border-default);
  font-family: var(--font-family-sans);
  text-align: start;
  cursor: pointer;
  outline: 0;
}

.vis-project-cell:is(:hover, :focus-visible, .is-active) {
  background: var(--color-bg-secondary);
}

.vis-project-cell.is-collapsed {
  inline-size: var(--space-64);
  justify-content: center;
  padding: var(--space-8);
}

.vis-project-cell:focus-visible {
  box-shadow:
    inset -1px 0 0 var(--color-border-default),
    inset 0 -1px 0 var(--color-border-default),
    inset 0 0 0 2px var(--color-effect-focus-ring-brand);
}

.vis-project-cell__logo {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-brand-primary);
  flex: 0 0 auto;
}

.vis-project-cell__label {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  font-size: var(--font-text-lg-size);
  font-weight: 600;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-project-cell__chevron {
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}
</style>
