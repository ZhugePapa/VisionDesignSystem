<script setup lang="ts">
import { computed, ref } from 'vue'

import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import VisLoading from '../loading/VisLoading.vue'
import type { VisUploadFileItem, VisUploadProps } from './upload.types'

defineOptions({
  name: 'VisUpload',
})

const props = withDefaults(defineProps<VisUploadProps>(), {
  modelValue: undefined,
  type: 'button',
  uploaded: false,
  description: true,
  disabled: false,
  multiple: false,
  accept: undefined,
  buttonText: '点击上传',
  dragTitle: '点击或拖拽文件到此处上传',
  dragDescription: 'Only pdf, png, jpg can be uploaded, and the size does not exceed 100MB',
  descriptionText: 'jpg/png files with a size less than 500KB.',
  fileIconName: 'file-06',
})

const emit = defineEmits<{
  'update:modelValue': [files: VisUploadFileItem[]]
  change: [files: VisUploadFileItem[]]
  remove: [file: VisUploadFileItem]
  download: [file: VisUploadFileItem]
  retry: [file: VisUploadFileItem]
}>()

const inputRef = ref<HTMLInputElement>()
const isDragActive = ref(false)

const files = computed(() => props.modelValue ?? [])
const hasFiles = computed(() => props.uploaded || files.value.length > 0)
const isDrag = computed(() => props.type === 'drag')
const isTrigger = computed(() => props.type === 'trigger')

const rootClasses = computed(() => [
  `type-${props.type}`,
  {
    'is-uploaded': hasFiles.value,
    'is-disabled': props.disabled,
    'is-drag-active': isDragActive.value,
  },
])

function openFileDialog(): void {
  if (props.disabled) return
  inputRef.value?.click()
}

function commitFiles(nextFiles: VisUploadFileItem[]): void {
  emit('update:modelValue', nextFiles)
  emit('change', nextFiles)
}

function toUploadFile(file: File): VisUploadFileItem {
  return {
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    status: 'loading',
  }
}

function addFiles(fileList: FileList | null): void {
  if (!fileList?.length) return

  const incoming = Array.from(fileList).map(toUploadFile)
  const nextFiles = props.multiple ? [...files.value, ...incoming] : incoming.slice(0, 1)
  commitFiles(nextFiles)
}

function handleNativeChange(event: Event): void {
  const target = event.target as HTMLInputElement
  addFiles(target.files)
  target.value = ''
}

function handleDrop(event: DragEvent): void {
  if (props.disabled) return
  isDragActive.value = false
  addFiles(event.dataTransfer?.files ?? null)
}

function removeFile(file: VisUploadFileItem): void {
  if (props.disabled) return
  commitFiles(files.value.filter((item) => item.id !== file.id))
  emit('remove', file)
}

function downloadFile(file: VisUploadFileItem): void {
  if (props.disabled) return
  emit('download', file)
}

function retryFile(file: VisUploadFileItem): void {
  if (props.disabled) return
  emit('retry', file)
}
</script>

<template>
  <div class="vis-upload" :class="rootClasses">
    <input
      ref="inputRef"
      class="vis-upload__input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleNativeChange"
    >

    <div
      v-if="isDrag || isTrigger"
      class="vis-upload__trigger"
      role="button"
      tabindex="0"
      :aria-disabled="disabled ? 'true' : undefined"
      @click="openFileDialog"
      @keydown.enter.prevent="openFileDialog"
      @keydown.space.prevent="openFileDialog"
      @dragenter.prevent="isDragActive = true"
      @dragover.prevent="isDragActive = true"
      @dragleave.prevent="isDragActive = false"
      @drop.prevent="handleDrop"
    >
      <Icon v-if="isTrigger" name="plus" :size="16" decorative />
      <template v-else>
        <Icon name="upload-cloud-02" :size="24" decorative />
        <div class="vis-upload__drag-text">
          <p class="vis-upload__drag-title">{{ dragTitle }}</p>
          <p class="vis-upload__drag-description">{{ dragDescription }}</p>
        </div>
      </template>
    </div>

    <VisButton
      v-else
      class="vis-upload__button"
      variant="secondary"
      size="md"
      :label="buttonText"
      :disabled="disabled"
      @click="openFileDialog"
    />

    <p v-if="description" class="vis-upload__description">{{ descriptionText }}</p>

    <template v-if="files.length">
      <div class="vis-upload__spacer" aria-hidden="true" />
      <div class="vis-upload__file-list">
        <div
          v-for="file in files"
          :key="file.id"
          class="vis-upload__file-row"
          :class="[`status-${file.status ?? 'default'}`]"
        >
          <div class="vis-upload__file-main">
            <Icon class="vis-upload__file-icon" :name="fileIconName" :size="16" decorative />
            <span class="vis-upload__file-name">{{ file.name }}</span>

            <VisLoading v-if="file.status === 'loading'" size="xs" color="brand" decorative />

            <VisButton
              v-else-if="file.status === 'danger'"
              class="vis-upload__retry"
              variant="link-color"
              size="sm"
              label="点击重试"
              :disabled="disabled"
              @click="retryFile(file)"
            />

            <VisButton
              v-else
              class="vis-upload__download"
              variant="text"
              size="sm"
              icon-only
              icon-name="download-01"
              label="下载"
              :disabled="disabled"
              @click="downloadFile(file)"
            />
          </div>

          <VisButton
            class="vis-upload__remove"
            variant="text"
            size="md"
            icon-only
            icon-name="trash-01"
            label="删除"
            :disabled="disabled"
            @click="removeFile(file)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.vis-upload {
  inline-size: 234px;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
}

.vis-upload.type-drag {
  inline-size: 400px;
}

.vis-upload__input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.vis-upload__button {
  flex: 0 0 auto;
}

.vis-upload__trigger {
  box-sizing: border-box;
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-secondary);
  background: var(--color-bg-secondary);
  cursor: pointer;
  outline: none;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.vis-upload.type-trigger .vis-upload__trigger {
  inline-size: var(--space-56);
  block-size: var(--space-56);
}

.vis-upload.type-drag .vis-upload__trigger {
  inline-size: 100%;
  block-size: 160px;
  flex-direction: column;
  gap: var(--space-4);
  padding-inline: var(--space-24);
  text-align: center;
}

.vis-upload:not(.is-disabled) .vis-upload__trigger:hover {
  background: var(--color-bg-tertiary);
}

.vis-upload.is-drag-active .vis-upload__trigger,
.vis-upload__trigger:focus-visible {
  border-color: var(--color-border-brand-subtle);
  color: var(--color-text-primary);
  background: var(--color-fg-brand-subtle);
}

.vis-upload.is-disabled {
  opacity: 0.6;
}

.vis-upload.is-disabled .vis-upload__trigger {
  cursor: not-allowed;
}

.vis-upload__drag-text {
  min-inline-size: 0;
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.vis-upload__drag-title,
.vis-upload__drag-description,
.vis-upload__description {
  margin: 0;
  font-weight: 400;
  letter-spacing: 0;
}

.vis-upload__drag-title {
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
}

.vis-upload.is-drag-active .vis-upload__drag-title {
  color: var(--color-text-primary);
}

.vis-upload__drag-description {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-md-line-height);
}

.vis-upload__description {
  box-sizing: border-box;
  max-inline-size: 100%;
  padding-block: 2px;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-upload__spacer {
  inline-size: 100%;
  block-size: var(--space-8);
  flex: 0 0 auto;
}

.vis-upload__file-list {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.vis-upload__file-row {
  inline-size: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.vis-upload__file-main {
  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--space-32);
  flex: 1 1 0;
  border-radius: var(--radius-sm);
  padding-inline: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.vis-upload__file-icon {
  flex: 0 0 auto;
  color: var(--color-fg-secondary);
}

.vis-upload__file-name {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  color: inherit;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-upload__file-row.status-danger .vis-upload__file-main,
.vis-upload__file-row.status-danger .vis-upload__file-icon {
  color: var(--color-text-danger-primary);
}

.vis-upload__download,
.vis-upload__retry,
.vis-upload__remove {
  flex: 0 0 auto;
}
</style>
