<script setup lang="ts">
import aiLogoUrl from '../../assets/AI-logo-2.svg'
import { VisAvatar } from '../avatar'
import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import VisInputSearchBox from '../input-search-box/VisInputSearchBox.vue'
import type { VisMenuHeaderNavigationProps } from './menu.types'
import VisMenuBrandMark from './VisMenuBrandMark.vue'

defineOptions({ name: 'VisMenuHeaderNavigation' })

withDefaults(defineProps<VisMenuHeaderNavigationProps>(), {
  brandTitle: 'VISSLM',
  search: true,
  searchPlaceholder: '请输入关键字',
  avatarImageVariant: '09',
  aiActionLabel: 'AI 助手',
  themeActionLabel: '切换主题',
})

const emit = defineEmits<{
  menu: []
  ai: []
  theme: []
  notifications: []
}>()
</script>

<template>
  <header class="vis-menu-header-navigation">
    <VisButton
      class="vis-menu-header-navigation__menu-button"
      variant="text"
      size="md"
      icon-only
      icon-name="menu-01"
      label="打开主导航"
      @click="emit('menu')"
    >
      <template #icon>
        <Icon name="menu-01" :size="20" decorative />
      </template>
    </VisButton>

    <div class="vis-menu-header-navigation__brand">
      <slot name="brand">
        <VisMenuBrandMark :size="28" />
        <strong class="vis-menu-header-navigation__brand-title">{{ brandTitle }}</strong>
      </slot>
    </div>

    <div class="vis-menu-header-navigation__spacer" />

    <slot name="search">
      <VisInputSearchBox
        v-if="search"
        class="vis-menu-header-navigation__search"
        :placeholder="searchPlaceholder"
        aria-label="搜索项目内容"
      />
    </slot>

    <div class="vis-menu-header-navigation__actions" aria-label="快捷操作">
      <slot name="actions">
        <VisButton
          class="vis-menu-header-navigation__ai-button"
          variant="text"
          size="md"
          icon-only
          :label="aiActionLabel"
          @click="emit('ai')"
        >
          <template #icon>
            <img
              class="vis-menu-header-navigation__ai-logo"
              :src="aiLogoUrl"
              alt=""
              aria-hidden="true"
            >
          </template>
        </VisButton>
        <VisButton
          variant="text"
          size="md"
          icon-only
          icon-name="palette"
          :label="themeActionLabel"
          @click="emit('theme')"
        />
        <VisButton
          variant="text"
          size="md"
          icon-only
          icon-name="bell-01"
          label="通知"
          @click="emit('notifications')"
        />
      </slot>
    </div>

    <slot name="avatar">
      <VisAvatar
        type="image"
        size="md"
        badge="state"
        :image-variant="avatarImageVariant"
        image-alt="当前用户头像"
        :decorative="false"
      />
    </slot>
  </header>
</template>

<style scoped>
.vis-menu-header-navigation {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  block-size: var(--space-56);
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-sans);
}

.vis-menu-header-navigation__menu-button {
  flex: 0 0 auto;
}

.vis-menu-header-navigation__brand {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 1 auto;
}

.vis-menu-header-navigation__brand-title {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h3-size);
  font-weight: 600;
  line-height: var(--font-heading-h3-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-menu-header-navigation__spacer {
  min-inline-size: var(--space-8);
  flex: 1 1 0;
}

.vis-menu-header-navigation__search {
  inline-size: 200px;
  flex: 0 0 200px;
}

.vis-menu-header-navigation__actions {
  padding-inline: var(--space-8);
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-menu-header-navigation__ai-logo {
  inline-size: 20px;
  block-size: 20px;
  display: block;
  transform-origin: center;
  animation: vis-menu-header-navigation-ai-rotate 2000ms linear infinite;
  will-change: transform;
}

@keyframes vis-menu-header-navigation-ai-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .vis-menu-header-navigation__search {
    display: none;
  }
}

@media (max-width: 720px) {
  .vis-menu-header-navigation {
    padding-inline: var(--space-8);
    gap: var(--space-8);
  }

  .vis-menu-header-navigation__brand-title {
    font-size: var(--font-heading-h5-size);
    line-height: var(--font-heading-h5-line-height);
  }

  .vis-menu-header-navigation__actions {
    padding-inline: 0;
    gap: var(--space-4);
  }

  .vis-menu-header-navigation__actions > :first-child,
  .vis-menu-header-navigation__actions > :last-child {
    display: none;
  }
}
</style>
