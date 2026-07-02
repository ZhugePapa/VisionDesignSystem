<script setup lang="ts">
import { VisAvatar } from '../avatar'
import type { VisDropdownHeaderProps } from './dropdown.types'

withDefaults(defineProps<VisDropdownHeaderProps>(), {
  type: 'group',
  label: '菜单组',
  title: '张大山',
  subtitle: 'zhangdashan',
  avatarImageVariant: '09',
})
</script>

<template>
  <div class="vis-dropdown-header" :class="`type-${type}`">
    <template v-if="type === 'avatar'">
      <VisAvatar size="lg" type="image" badge="state" :image-variant="avatarImageVariant" decorative />
      <div class="vis-dropdown-header__profile">
        <p class="vis-dropdown-header__title">{{ title }}</p>
        <p class="vis-dropdown-header__subtitle">{{ subtitle }}</p>
      </div>
    </template>

    <span v-else class="vis-dropdown-header__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.vis-dropdown-header {
  box-sizing: border-box;
  inline-size: 100%;
  border-block-end: 1px solid var(--color-border-default);
  display: flex;
  background: var(--color-bg-surface);
  font-family: var(--font-family-sans);
}

.vis-dropdown-header.type-group {
  block-size: 44px;
  padding-block: var(--space-12);
  padding-inline: var(--space-16);
  align-items: center;
}

.vis-dropdown-header.type-avatar {
  block-size: var(--space-64);
  padding: var(--space-12);
  align-items: center;
  gap: var(--space-8);
}

.vis-dropdown-header__label {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-dropdown-header__profile {
  min-inline-size: 0;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 0;
}

.vis-dropdown-header__title,
.vis-dropdown-header__subtitle {
  margin: 0;
  overflow: hidden;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-dropdown-header__title {
  margin-block-end: -2px;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
}

.vis-dropdown-header__subtitle {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
}
</style>
