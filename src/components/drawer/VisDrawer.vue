<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import type { VisDrawerProps } from './drawer.types'

const props = withDefaults(defineProps<VisDrawerProps>(), {
  modelValue: true,
  title: '对话框标题',
  position: 'right',
  divider: true,
  actions: true,
  icon: false,
  iconName: 'file-06',
  twoLevel: false,
  closeable: true,
  handle: true,
  width: undefined,
  height: undefined,
  cancelText: '按钮',
  confirmText: '按钮',
  backText: '返回',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  cancel: []
  confirm: []
  back: []
}>()

const isRight = computed(() => props.position === 'right')
const isBottom = computed(() => props.position === 'bottom')

const rootStyle = computed<CSSProperties>(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height

  return {
    '--vis-drawer-width': width ?? (isRight.value ? 'var(--space-384)' : '100%'),
    '--vis-drawer-height': height ?? (isRight.value ? '900px' : props.divider ? '400px' : 'var(--space-384)'),
  }
})

function closeDrawer(): void {
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
</script>

<template>
  <section
    v-if="modelValue"
    class="vis-drawer"
    :class="[
      `position-${position}`,
      {
        'has-divider': divider,
        'has-actions': actions,
        'has-icon': icon,
        'is-two-level': twoLevel,
      },
    ]"
    :style="rootStyle"
    role="dialog"
    :aria-label="title"
  >
    <header class="vis-drawer__header">
      <div v-if="twoLevel" class="vis-drawer__back-group">
        <VisButton variant="link-grey" size="md" prefix icon-name="arrow-left" @click="onBack">
          {{ backText }}
        </VisButton>
        <span class="vis-drawer__vertical-divider" aria-hidden="true" />
      </div>

      <span v-if="icon" class="vis-drawer__file-icon" aria-hidden="true">
        <slot name="icon">
          <Icon :name="iconName" :size="24" decorative />
        </slot>
      </span>

      <p class="vis-drawer__title">{{ title }}</p>

      <div v-if="isBottom && actions" class="vis-drawer__header-actions">
        <slot name="actions">
          <VisButton variant="secondary" size="md" @click="onCancel">{{ cancelText }}</VisButton>
          <VisButton variant="primary" size="md" @click="onConfirm">{{ confirmText }}</VisButton>
        </slot>
      </div>

      <VisButton
        v-if="closeable"
        class="vis-drawer__close"
        variant="text"
        size="md"
        icon-only
        icon-name="x-close"
        label="关闭抽屉"
        @click="closeDrawer"
      />

      <span v-if="isBottom && handle" class="vis-drawer__handle" aria-hidden="true" />
    </header>

    <div class="vis-drawer__body">
      <slot />
    </div>

    <footer v-if="isRight && actions" class="vis-drawer__footer">
      <slot name="actions">
        <VisButton variant="secondary" size="md" @click="onCancel">{{ cancelText }}</VisButton>
        <VisButton variant="primary" size="md" @click="onConfirm">{{ confirmText }}</VisButton>
      </slot>
    </footer>
  </section>
</template>

<style scoped>
.vis-drawer {
  box-sizing: border-box;
  inline-size: var(--vis-drawer-width);
  block-size: var(--vis-drawer-height);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  isolation: isolate;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-sans);
}

.vis-drawer.position-right {
  border-inline-start: 1px solid var(--color-border-default);
  overflow: hidden;
}

.vis-drawer.position-bottom {
  border-start-start-radius: var(--radius-lg);
  border-start-end-radius: var(--radius-lg);
  overflow: hidden;
}

.vis-drawer__header {
  box-sizing: border-box;
  position: relative;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: var(--space-64);
  padding: var(--space-20);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex: 0 0 auto;
}

.vis-drawer.position-right .vis-drawer__header {
  block-size: var(--space-64);
  padding-inline-end: calc(var(--space-20) + var(--space-32) + var(--space-12));
}

.vis-drawer.position-bottom .vis-drawer__header {
  block-size: calc(var(--space-32) + var(--space-40));
  padding-inline-end: var(--space-20);
}

.vis-drawer.has-divider .vis-drawer__header {
  border-block-end: 1px solid var(--color-border-default);
}

.vis-drawer__back-group {
  display: inline-flex;
  align-items: center;
  gap: var(--space-16);
  flex: 0 0 auto;
}

.vis-drawer__vertical-divider {
  inline-size: 1px;
  block-size: var(--space-16);
  flex: 0 0 auto;
  background: var(--color-border-default);
}

.vis-drawer__file-icon {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--color-fg-brand-primary);
}

.vis-drawer__title {
  margin: 0;
  min-inline-size: 0;
  flex: 1 1 auto;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-drawer__header-actions,
.vis-drawer__footer {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-drawer__close {
  flex: 0 0 auto;
}

.vis-drawer.position-right .vis-drawer__close {
  position: absolute;
  inset-block-start: var(--space-16);
  inset-inline-end: var(--space-16);
}

.vis-drawer__handle {
  position: absolute;
  inset-block-start: var(--space-4);
  inset-inline-start: 50%;
  inline-size: var(--space-16);
  block-size: 3px;
  border-radius: var(--radius-full);
  background: var(--color-fg-disabled);
  transform: translateX(-50%);
}

.vis-drawer__body {
  min-block-size: 0;
  min-inline-size: 0;
  inline-size: 100%;
  flex: 1 1 auto;
  background: var(--color-bg-canvas);
}

.vis-drawer.position-bottom.has-divider .vis-drawer__body {
  flex: 0 0 328px;
}

.vis-drawer__footer {
  box-sizing: border-box;
  inline-size: 100%;
  padding: 0 var(--space-20) var(--space-20);
  flex: 0 0 auto;
}

.vis-drawer.position-right.has-divider .vis-drawer__footer {
  padding: var(--space-20);
  border-block-start: 1px solid var(--color-border-default);
}
</style>
