<script setup lang="ts">
import { computed } from 'vue'

import { resolveVisFileIconType, VisFileIcon } from '../file-icon'
import Icon from '../icons/Icon.vue'
import { VisProgressCircle } from '../progress-circle'
import type { VisAiAttachmentProps } from './ai.types'

defineOptions({ name: 'VisAiAttachment' })

const props = withDefaults(defineProps<VisAiAttachmentProps>(), {
  type: 'file',
  extension: '',
  size: '',
  url: '',
  alt: '',
  uploading: false,
  progress: 25,
  status: 'ready',
  error: '',
  removable: true,
})

const emit = defineEmits<{
  remove: [key: VisAiAttachmentProps['itemKey']]
  preview: [key: VisAiAttachmentProps['itemKey']]
  retry: [key: VisAiAttachmentProps['itemKey']]
}>()

const isBusy = computed(
  () => props.uploading || props.status === 'uploading' || props.status === 'parsing',
)
const fileMeta = computed(() => {
  if (props.status === 'error') return ['上传失败，点击重试']
  if (props.status === 'parsing') return ['处理中...']
  return [props.extension, props.size].filter(Boolean)
})
const resolvedFileIconType = computed(
  () => props.fileIconType ?? resolveVisFileIconType(props.extension),
)

function removeAttachment(): void {
  if (!props.removable) return
  emit('remove', props.itemKey)
}

function previewAttachment(): void {
  if (props.type !== 'image') return
  if (props.status === 'error') {
    emit('retry', props.itemKey)
    return
  }
  emit('preview', props.itemKey)
}

function retryAttachment(): void {
  if (props.status !== 'error') return
  emit('retry', props.itemKey)
}
</script>

<template>
  <article
    class="vis-ai-attachment"
    :class="[
      `type-${type}`,
      {
        'is-uploading': isBusy,
        'is-error': status === 'error',
      },
    ]"
    :aria-busy="isBusy ? 'true' : undefined"
    :title="status === 'error' ? (error || '上传失败，点击重试') : undefined"
    :role="type !== 'image' && status === 'error' ? 'button' : undefined"
    :tabindex="type !== 'image' && status === 'error' ? 0 : undefined"
    @click="retryAttachment"
    @keydown.enter.prevent="retryAttachment"
    @keydown.space.prevent="retryAttachment"
  >
    <button
      v-if="type === 'image'"
      class="vis-ai-attachment__image-button"
      type="button"
      :aria-label="`预览 ${name}`"
      @click.stop="previewAttachment"
    >
      <img v-if="url" class="vis-ai-attachment__image" :src="url" :alt="alt || name" />
      <span v-else class="vis-ai-attachment__image-placeholder">
        <Icon name="image-01" :size="20" decorative />
      </span>
      <span v-if="isBusy" class="vis-ai-attachment__upload-mask">
        <VisProgressCircle size="sm" :value="progress" decorative />
      </span>
      <span v-else-if="status === 'error'" class="vis-ai-attachment__error-mask">
        <Icon name="refresh-cw-01" :size="16" decorative />
      </span>
    </button>

    <template v-else>
      <span class="vis-ai-attachment__file-icon" aria-hidden="true">
        <VisProgressCircle v-if="isBusy" size="sm" :value="progress" decorative />
        <VisFileIcon v-else :type="resolvedFileIconType" :size="32" decorative />
      </span>
      <span class="vis-ai-attachment__content">
        <span class="vis-ai-attachment__name" :title="name">{{ name }}</span>
        <span v-if="status === 'uploading' || (uploading && status !== 'parsing')" class="vis-ai-attachment__meta">上传中...</span>
        <span v-else-if="fileMeta.length" class="vis-ai-attachment__meta">
          <span v-for="value in fileMeta" :key="value">{{ value }}</span>
        </span>
      </span>
    </template>

    <button
      v-if="removable"
      class="vis-ai-attachment__close"
      type="button"
      :aria-label="`移除 ${name}`"
      @click.stop="removeAttachment"
    >
      <Icon name="x-close" :size="12" decorative />
    </button>
  </article>
</template>

<style scoped>
.vis-ai-attachment {
  position: relative;
  box-sizing: border-box;
  block-size: var(--space-64);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  transition:
    border-color 120ms ease,
    background-color 120ms ease;
}

.vis-ai-attachment:hover {
  background: var(--color-bg-primary);
}

.vis-ai-attachment.is-error {
  border-color: var(--color-border-error);
}

.vis-ai-attachment.type-file.is-error {
  cursor: pointer;
}

.vis-ai-attachment.type-file {
  min-inline-size: var(--space-192);
  max-inline-size: var(--space-256);
  padding: var(--space-12) var(--space-24) var(--space-12) var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.vis-ai-attachment.type-image {
  inline-size: var(--space-64);
  overflow: hidden;
}

.vis-ai-attachment__file-icon {
  box-sizing: border-box;
  inline-size: var(--space-32);
  block-size: var(--space-32);
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.vis-ai-attachment.is-uploading .vis-ai-attachment__file-icon {
  background: transparent;
}

.vis-ai-attachment__content {
  min-inline-size: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vis-ai-attachment__name,
.vis-ai-attachment__meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-family-text);
}

.vis-ai-attachment__name {
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-ai-attachment__meta {
  display: flex;
  gap: var(--space-6);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.vis-ai-attachment__image-button {
  position: relative;
  inline-size: 100%;
  block-size: 100%;
  border: 0;
  border-radius: inherit;
  padding: 0;
  display: block;
  overflow: hidden;
  color: var(--color-fg-tertiary);
  background: var(--color-bg-secondary);
  cursor: pointer;
}

.vis-ai-attachment__image-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  transition: background-color 120ms ease;
}

.vis-ai-attachment.type-image:not(.is-uploading):hover .vis-ai-attachment__image-button::after {
  background: var(--primitive-alpha-black-40);
}

.vis-ai-attachment__image,
.vis-ai-attachment__image-placeholder {
  inline-size: 100%;
  block-size: 100%;
  display: block;
}

.vis-ai-attachment__image {
  object-fit: cover;
}

.vis-ai-attachment__image-placeholder {
  display: grid;
  place-items: center;
}

.vis-ai-attachment__upload-mask {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  display: grid;
  place-items: center;
  background: var(--primitive-alpha-black-40);
  backdrop-filter: blur(2.5px);
}

.vis-ai-attachment__error-mask {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  display: grid;
  place-items: center;
  color: var(--color-fg-white);
  background: var(--primitive-alpha-black-40);
}

.vis-ai-attachment__upload-mask :deep(.vis-progress-circle) {
  --vis-progress-circle-track-color: var(--primitive-alpha-white-30);
  --vis-progress-circle-color: var(--color-fg-white);
}

.vis-ai-attachment__close {
  position: absolute;
  inset-block-start: 3px;
  inset-inline-end: 3px;
  z-index: 1;
  box-sizing: border-box;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  border: 0;
  border-radius: var(--radius-full);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-secondary);
  background: var(--color-bg-tertiary);
  cursor: pointer;
  opacity: 0;
  transition:
    color 120ms ease,
    opacity 120ms ease;
}

.vis-ai-attachment:hover .vis-ai-attachment__close,
.vis-ai-attachment__close:focus-visible {
  opacity: 1;
}

.vis-ai-attachment__close:hover {
  color: var(--color-fg-primary);
  background: var(--color-bg-quaternary);
}

.vis-ai-attachment__close:focus-visible,
.vis-ai-attachment__image-button:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-attachment,
  .vis-ai-attachment__close {
    transition: none;
  }
}
</style>
