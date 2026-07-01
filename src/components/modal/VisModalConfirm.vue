<script setup lang="ts">
import { computed } from 'vue'

import { VisButton } from '../button'
import { VisFeaturedIcon, type VisFeaturedIconColor } from '../featured-icon'
import type { IconName } from '../icons/generated/registry.generated'

export type VisModalConfirmType = 'confirm' | 'info' | 'success' | 'danger' | 'warning'

interface ModalConfirmVisual {
  color: VisFeaturedIconColor
  iconName: IconName
  title: string
  description: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    type?: VisModalConfirmType
    title?: string
    description?: string
    closeable?: boolean
    cancelText?: string
    confirmText?: string
    okText?: string
  }>(),
  {
    modelValue: true,
    type: 'confirm',
    title: undefined,
    description: undefined,
    closeable: true,
    cancelText: '取消',
    confirmText: '确认',
    okText: '知道了',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'cancel'): void
  (event: 'confirm'): void
}>()

const visualMap: Record<VisModalConfirmType, ModalConfirmVisual> = {
  confirm: {
    color: 'brand',
    iconName: 'info',
    title: '确认操作',
    description: '确认对话框的内容',
  },
  info: {
    color: 'brand',
    iconName: 'info',
    title: '提示信息',
    description: '提示对话框的内容',
  },
  success: {
    color: 'success',
    iconName: 'check',
    title: '操作成功',
    description: '成功对话框的内容',
  },
  danger: {
    color: 'danger',
    iconName: 'x-close',
    title: '操作失败',
    description: '错误对话框的内容',
  },
  warning: {
    color: 'warning',
    iconName: 'alert-triangle',
    title: '操作警告',
    description: '警告对话框的内容',
  },
}

const visual = computed(() => visualMap[props.type])
const resolvedTitle = computed(() => props.title ?? visual.value.title)
const resolvedDescription = computed(() => props.description ?? visual.value.description)
const isConfirmType = computed(() => props.type === 'confirm')

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
</script>

<template>
  <section
    v-if="modelValue"
    class="vis-modal-confirm"
    :class="[`type-${type}`]"
    role="alertdialog"
    :aria-label="resolvedTitle"
  >
    <div class="vis-modal-confirm__top">
      <VisFeaturedIcon
        type="light-round"
        size="sm"
        :color="visual.color"
        :icon="visual.iconName"
        decorative
      />

      <div class="vis-modal-confirm__content">
        <p class="vis-modal-confirm__title">{{ resolvedTitle }}</p>
        <p class="vis-modal-confirm__description">{{ resolvedDescription }}</p>
      </div>

      <VisButton
        v-if="closeable"
        class="vis-modal-confirm__close"
        variant="text"
        size="md"
        icon-only
        icon-name="x-close"
        label="关闭对话框"
        @click="closeModal"
      />
    </div>

    <footer class="vis-modal-confirm__actions">
      <slot name="footer">
        <VisButton v-if="isConfirmType" variant="secondary" size="md" @click="onCancel">
          {{ cancelText }}
        </VisButton>
        <VisButton variant="primary" size="md" @click="onConfirm">
          {{ isConfirmType ? confirmText : okText }}
        </VisButton>
      </slot>
    </footer>
  </section>
</template>

<style scoped>
.vis-modal-confirm {
  box-sizing: border-box;
  inline-size: var(--space-384);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  box-shadow: var(--shadow-default-lg);
  font-family: var(--font-family-sans);
}

.vis-modal-confirm__top {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  padding: var(--space-20);
  padding-inline-end: calc(var(--space-20) + var(--space-32) + var(--space-12));
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  flex: 0 0 auto;
}

.vis-modal-confirm__content {
  min-inline-size: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-4);
  padding-block: 1px;
}

.vis-modal-confirm__title,
.vis-modal-confirm__description {
  margin: 0;
  width: 100%;
  letter-spacing: 0;
}

.vis-modal-confirm__title {
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  line-height: var(--font-text-lg-line-height);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-modal-confirm__description {
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
}

.vis-modal-confirm__close {
  position: absolute;
  inset-block-start: var(--space-16);
  inset-inline-end: var(--space-16);
}

.vis-modal-confirm__actions {
  box-sizing: border-box;
  width: 100%;
  padding: 0 var(--space-20) var(--space-20);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-8);
  flex: 0 0 auto;
}
</style>
