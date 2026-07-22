<script setup lang="ts">
import type { VisMenuGroupProps } from './menu.types'

defineOptions({ name: 'VisMenuGroup' })

withDefaults(defineProps<VisMenuGroupProps>(), {
  label: '项目',
})
</script>

<template>
  <div class="vis-menu-group">
    <span class="vis-menu-group__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.vis-menu-group {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12) 4px;
  display: flex;
  align-items: flex-end;
  font-family: var(--font-family-sans);
}

.vis-menu-group__label {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
