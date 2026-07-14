<script setup lang="ts">
import VisButton from '../button/VisButton.vue'
import VisCheckbox from '../checkbox/VisCheckbox.vue'
import Icon from '../icons/Icon.vue'
import VisRadio from '../radio/VisRadio.vue'
import VisTableSortIcon from './VisTableSortIcon.vue'
import type { VisTableHeaderProps } from './table.types'

withDefaults(defineProps<VisTableHeaderProps>(), {
  type: 'default',
  appearance: 'horizontal',
  state: 'default',
  align: 'left',
  label: '标题',
  leftButton: false,
  prefixIcon: undefined,
  sortable: false,
  sortOrder: null,
  checked: false,
  radioChecked: false,
})

const emit = defineEmits<{
  'update:checked': [checked: boolean]
  'update:radioChecked': [checked: boolean]
  shortcut: []
  'left-button-click': []
}>()
</script>

<template>
  <div
    class="vis-table-header"
    :class="[`type-${type}`, `appearance-${appearance}`, `state-${state}`, `align-${align}`]"
  >
    <template v-if="type === 'default'">
      <VisButton
        v-if="leftButton"
        variant="text"
        size="sm"
        icon-only
        icon-name="chevron-selector-vertical"
        label="调整"
        @click.stop="emit('left-button-click')"
      />
      <div class="vis-table-header__content">
        <Icon v-if="prefixIcon" :name="prefixIcon" :size="16" decorative />
        <span class="vis-table-header__label"><slot>{{ label }}</slot></span>
        <VisTableSortIcon
          v-if="sortable"
          :state="sortOrder === 'ascending' ? 'up' : sortOrder === 'descending' ? 'down' : 'default'"
        />
      </div>
      <VisButton
        class="vis-table-header__shortcut"
        variant="text"
        size="sm"
        icon-only
        icon-name="dots-vertical"
        label="更多"
        @click.stop="emit('shortcut')"
      />
    </template>

    <VisCheckbox
      v-else-if="type === 'checkbox'"
      :model-value="checked"
      :label="false"
      aria-label="全选"
      @update:model-value="emit('update:checked', $event)"
    />
    <VisRadio
      v-else-if="type === 'radio'"
      :model-value="radioChecked"
      :label="false"
      aria-label="选择"
      @update:model-value="emit('update:radioChecked', $event)"
    />
    <VisButton
      v-else-if="type === 'shortcuts'"
      variant="text"
      size="sm"
      icon-only
      icon-name="star-01"
      label="快捷操作"
      @click.stop="emit('shortcut')"
    />
  </div>
</template>

<style scoped>
.vis-table-header {
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-48);
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-table-header.appearance-grid {
  border-inline-start: 1px solid var(--color-border-default);
}

.vis-table-header:is(.type-checkbox, .type-radio, .type-shortcuts, .type-empty) {
  inline-size: var(--space-48);
  padding: 0;
  justify-content: center;
  flex: 0 0 var(--space-48);
}

.vis-table-header__content {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 1 1 auto;
}

.vis-table-header__shortcut {
  position: absolute;
  inset-inline-end: var(--space-8);
  inset-block-start: 50%;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 120ms ease;
}

.vis-table-header:is(:hover, .state-hover) .vis-table-header__shortcut,
.vis-table-header__shortcut:focus-visible {
  visibility: visible;
  opacity: 1;
}

.vis-table-header.align-right,
.vis-table-header.align-right .vis-table-header__content {
  justify-content: flex-end;
}

.vis-table-header__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
