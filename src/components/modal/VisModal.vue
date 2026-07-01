<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import { VisButton } from '../button'
import { VisFeaturedIcon } from '../featured-icon'

export interface VisModalMenuItem {
  key: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    menuTitle?: string
    divider?: boolean
    footer?: boolean
    icon?: boolean
    twoLevel?: boolean
    withMenu?: boolean
    closeable?: boolean
    width?: number | string
    height?: number | string
    menuItems?: VisModalMenuItem[]
    activeMenuKey?: string
    cancelText?: string
    confirmText?: string
    backText?: string
  }>(),
  {
    modelValue: true,
    title: '对话框标题',
    menuTitle: undefined,
    divider: true,
    footer: true,
    icon: false,
    twoLevel: false,
    withMenu: false,
    closeable: true,
    width: undefined,
    height: undefined,
    menuItems: () => [
      { key: 'overview', label: '菜单名称' },
      { key: 'profile', label: '菜单名称' },
      { key: 'security', label: '菜单名称' },
      { key: 'billing', label: '菜单名称' },
      { key: 'members', label: '菜单名称' },
      { key: 'logs', label: '菜单名称' },
    ],
    activeMenuKey: 'overview',
    cancelText: '取消',
    confirmText: '确认',
    backText: '返回',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'cancel'): void
  (event: 'confirm'): void
  (event: 'back'): void
  (event: 'menu-select', item: VisModalMenuItem): void
}>()

const activeMenu = computed(
  () => props.menuItems.find((item) => item.key === props.activeMenuKey) ?? props.menuItems[0],
)
const headerTitle = computed(() => (props.withMenu ? (props.menuTitle ?? activeMenu.value?.label ?? props.title) : props.title))
const resolvedDivider = computed(() => !props.withMenu && props.divider)

const rootStyle = computed<CSSProperties>(() => {
  const defaultWidth = props.withMenu ? 'var(--space-640)' : 'var(--space-384)'
  const defaultHeight = props.withMenu ? 'var(--space-512)' : resolvedDivider.value ? '276px' : '242px'
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height

  return {
    '--vis-modal-width': width ?? defaultWidth,
    '--vis-modal-height': height ?? defaultHeight,
  }
})

function closeModal(): void {
  emit('update:modelValue', false)
  emit('close')
}

function onCancel(): void {
  emit('cancel')
}

function onConfirm(): void {
  emit('confirm')
}

function onBack(): void {
  emit('back')
}

function onMenuSelect(item: VisModalMenuItem): void {
  if (item.disabled) return
  emit('menu-select', item)
}
</script>

<template>
  <section
    v-if="modelValue"
    class="vis-modal"
    :class="[
      {
        'has-divider': resolvedDivider,
        'has-menu': withMenu,
        'has-footer': footer,
        'has-icon': icon,
        'is-two-level': twoLevel,
      },
    ]"
    :style="rootStyle"
    role="dialog"
    :aria-label="title"
  >
    <template v-if="withMenu">
      <aside class="vis-modal__menu" aria-label="对话框菜单">
        <div class="vis-modal__menu-header">
          <p class="vis-modal__title">{{ title }}</p>
        </div>

        <div class="vis-modal__menu-slot">
          <slot name="menu">
            <button
              v-for="item in menuItems"
              :key="item.key"
              class="vis-modal__menu-item"
              :class="{ 'is-active': item.key === activeMenuKey }"
              type="button"
              :disabled="item.disabled"
              @click="onMenuSelect(item)"
            >
              {{ item.label }}
            </button>
          </slot>
        </div>
      </aside>

      <div class="vis-modal__main">
        <header class="vis-modal__header vis-modal__main-header">
          <div v-if="twoLevel" class="vis-modal__back-group">
            <VisButton variant="link-grey" size="md" prefix icon-name="arrow-left" @click="onBack">
              {{ backText }}
            </VisButton>
            <span class="vis-modal__vertical-divider" aria-hidden="true" />
          </div>

          <VisFeaturedIcon
            v-if="icon"
            type="light-round"
            size="sm"
            color="brand"
            icon="info"
            decorative
          />

          <p class="vis-modal__main-title">{{ headerTitle }}</p>

          <VisButton
            v-if="closeable"
            class="vis-modal__close"
            variant="text"
            size="md"
            icon-only
            icon-name="x-close"
            label="关闭对话框"
            @click="closeModal"
          />
        </header>

        <div class="vis-modal__body">
          <slot />
        </div>

        <footer v-if="footer" class="vis-modal__footer">
          <slot name="footer">
            <VisButton variant="secondary" size="md" @click="onCancel">{{ cancelText }}</VisButton>
            <VisButton variant="primary" size="md" @click="onConfirm">{{ confirmText }}</VisButton>
          </slot>
        </footer>
      </div>
    </template>

    <template v-else>
      <header class="vis-modal__header">
        <div v-if="twoLevel" class="vis-modal__back-group">
          <VisButton variant="link-grey" size="md" prefix icon-name="arrow-left" @click="onBack">
            {{ backText }}
          </VisButton>
          <span class="vis-modal__vertical-divider" aria-hidden="true" />
        </div>

        <VisFeaturedIcon
          v-if="icon"
          type="light-round"
          size="sm"
          color="brand"
          icon="info"
          decorative
        />

        <div class="vis-modal__title-wrap">
          <p class="vis-modal__title">{{ title }}</p>
        </div>

        <VisButton
          v-if="closeable"
          class="vis-modal__close"
          variant="text"
          size="md"
          icon-only
          icon-name="x-close"
          label="关闭对话框"
          @click="closeModal"
        />
      </header>

      <div class="vis-modal__body">
        <slot />
      </div>

      <footer v-if="footer" class="vis-modal__footer">
        <slot name="footer">
          <VisButton variant="secondary" size="md" @click="onCancel">{{ cancelText }}</VisButton>
          <VisButton variant="primary" size="md" @click="onConfirm">{{ confirmText }}</VisButton>
        </slot>
      </footer>
    </template>
  </section>
</template>

<style scoped>
.vis-modal {
  box-sizing: border-box;
  inline-size: var(--vis-modal-width);
  block-size: var(--vis-modal-height);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  box-shadow: var(--shadow-default-lg);
  font-family: var(--font-family-sans);
}

.vis-modal.has-menu {
  flex-direction: row;
  align-items: stretch;
}

.vis-modal__header {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  min-inline-size: 0;
  padding: var(--space-20);
  padding-inline-end: calc(var(--space-20) + var(--space-32) + var(--space-12));
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex: 0 0 auto;
}

.vis-modal:not(.has-divider) > .vis-modal__header {
  padding-block-end: 0;
}

.vis-modal.has-divider > .vis-modal__header {
  border-bottom: 1px solid var(--color-border-default);
}

.vis-modal__main-header {
  block-size: var(--space-64);
  padding-block: 0;
  border-bottom: 0;
}

.vis-modal__title-wrap {
  min-inline-size: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  padding-block: 1px;
}

.vis-modal__title,
.vis-modal__main-title {
  margin: 0;
  min-inline-size: 0;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  line-height: var(--font-text-lg-line-height);
  font-weight: 500;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-modal__main-title {
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
}

.vis-modal__close {
  position: absolute;
  inset-block-start: var(--space-16);
  inset-inline-end: var(--space-16);
}

.vis-modal__body {
  min-block-size: 0;
  min-inline-size: 0;
  flex: 1 1 auto;
  width: 100%;
}

.vis-modal__footer {
  box-sizing: border-box;
  width: 100%;
  padding: 0 var(--space-20) var(--space-20);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-modal__footer .vis-button {
  --vis-button-padding-inline: var(--space-16);
}

.vis-modal.has-divider > .vis-modal__footer {
  padding: var(--space-20);
  border-top: 1px solid var(--color-border-default);
}

.vis-modal__back-group {
  display: inline-flex;
  align-items: center;
  gap: var(--space-12);
  flex: 0 0 auto;
}

.vis-modal__vertical-divider {
  inline-size: 1px;
  block-size: var(--space-16);
  flex: 0 0 auto;
  background: var(--color-border-default);
}

.vis-modal__menu {
  box-sizing: border-box;
  inline-size: 192px;
  block-size: 100%;
  border-inline-end: 1px solid var(--color-border-default);
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  background: var(--color-bg-surface);
}

.vis-modal__menu-header {
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-20);
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.vis-modal__menu-slot {
  min-block-size: 0;
  width: 100%;
  padding-inline: var(--space-8);
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
}

.vis-modal__menu-item {
  box-sizing: border-box;
  width: 100%;
  min-block-size: var(--space-32);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12);
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--color-text-secondary);
  background: transparent;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.vis-modal__menu-item:is(:hover, .is-active):not(:disabled) {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.vis-modal__menu-item:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-modal__main {
  min-inline-size: 0;
  block-size: 100%;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  background: var(--color-bg-canvas);
}

.vis-modal.has-menu .vis-modal__footer {
  padding: 0 var(--space-20) var(--space-20);
  border-top: 0;
}
</style>
