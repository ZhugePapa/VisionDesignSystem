<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import VisButton from '../button/VisButton.vue'
import {
  VisDropdown,
  VisDropdownDivider,
  VisDropdownItem,
} from '../dropdown'
import Icon from '../icons/Icon.vue'
import VisToggleButton from '../toggle-button/VisToggleButton.vue'
import type {
  VisAiAttachmentItem,
  VisAiKey,
  VisAiSenderProps,
  VisAiSenderSpeed,
  VisAiSenderSkill,
  VisAiSenderSubmitPayload,
} from './ai.types'
import VisAiAttachment from './VisAiAttachment.vue'
import VisAiSenderAction from './VisAiSenderAction.vue'
import VisAiSkill from './VisAiSkill.vue'

defineOptions({ name: 'VisAiSender' })

const props = withDefaults(defineProps<VisAiSenderProps>(), {
  modelValue: '',
  attachments: () => [],
  disabled: false,
  loading: false,
  placeholder: '请描述您的问题',
  deepThinking: false,
  model: '',
  models: () => [
    { key: 'kimi-k3', label: 'Kimi K3', iconName: 'cube-01' },
    { key: 'glm-5.2', label: 'Glm 5.2', iconName: 'cube-01' },
    { key: 'deepseek-v4-pro', label: 'Deepseek v4 pro', iconName: 'cube-01' },
  ],
  speed: 'high',
  skill: '',
  skills: () => [
    {
      key: 'requirement-check',
      label: '需求规范检查',
      description: '识别需求中的模糊、缺失、冲突及不可验证问题。',
      iconName: 'file-search-02',
      color: 'aqua',
    },
    {
      key: 'requirement-breakdown',
      label: '需求智能拆解',
      description: '将系统需求拆解为软件需求、功能需求和研发任务。',
      iconName: 'paragraph-wrap',
      color: 'violet',
    },
    {
      key: 'requirement-trace',
      label: '需求关系追踪',
      description: '检查需求与设计、代码、测试的关联缺失。',
      iconName: 'line-chart-up-03',
      color: 'green',
    },
    {
      key: 'change-impact',
      label: '变更影响分析',
      description: '分析变更对模块、接口、测试、基线及交付的影响。',
      iconName: 'bar-line-chart',
      color: 'yellow',
    },
  ],
  submitOnEnter: true,
  maxLength: undefined,
  autoFocus: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:deepThinking': [value: boolean]
  'update:model': [value: VisAiKey]
  'update:speed': [value: VisAiSenderSpeed]
  'update:skill': [value: VisAiKey | '']
  submit: [payload: VisAiSenderSubmitPayload]
  stop: []
  attachmentRequest: []
  documentRequest: []
  removeAttachment: [item: VisAiAttachmentItem]
  previewAttachment: [item: VisAiAttachmentItem]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const attachmentMenuOpen = ref(false)
const modelMenuOpen = ref(false)
const speedMenuOpen = ref(false)
const isComposing = ref(false)
let speedCloseTimer: ReturnType<typeof setTimeout> | undefined

const speedOptions: Array<{ value: VisAiSenderSpeed; label: string }> = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'ultra', label: '极高' },
]

const selectedModel = computed(() => props.models.find((item) => item.key === props.model))
const selectedSkill = computed(() => props.skills.find((item) => item.key === props.skill))
const selectedSpeedLabel = computed(
  () => speedOptions.find((item) => item.value === props.speed)?.label ?? '高',
)
const canSubmit = computed(
  () =>
    !props.disabled &&
    !props.loading &&
    (props.modelValue.trim().length > 0 || props.attachments.length > 0),
)

function updateValue(event: Event): void {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function submit(): void {
  if (!canSubmit.value) return

  emit('submit', {
    value: props.modelValue,
    model: props.model || undefined,
    speed: props.speed,
    skill: props.skill || undefined,
    deepThinking: props.deepThinking,
    attachments: props.attachments,
  })
}

function onKeydown(event: KeyboardEvent): void {
  if (
    event.key === 'Backspace' &&
    !isComposing.value &&
    selectedSkill.value &&
    event.currentTarget instanceof HTMLTextAreaElement &&
    event.currentTarget.selectionStart === 0 &&
    event.currentTarget.selectionEnd === 0
  ) {
    event.preventDefault()
    emit('update:skill', '')
    nextTick(() => textareaRef.value?.focus())
    return
  }

  if (!props.submitOnEnter || event.key !== 'Enter' || event.shiftKey || isComposing.value) return
  event.preventDefault()
  submit()
}

function chooseModel(key: VisAiKey): void {
  const item = props.models.find((model) => model.key === key)
  if (!item || item.disabled) return
  emit('update:model', key)
  modelMenuOpen.value = false
}

function chooseSkill(item: VisAiSenderSkill): void {
  if (item.disabled) return
  emit('update:skill', item.key)
  attachmentMenuOpen.value = false
  nextTick(() => textareaRef.value?.focus())
}

function chooseSpeed(speed: VisAiSenderSpeed): void {
  emit('update:speed', speed)
  speedMenuOpen.value = false
  modelMenuOpen.value = false
}

function openSpeedMenu(): void {
  if (speedCloseTimer) clearTimeout(speedCloseTimer)
  speedMenuOpen.value = true
}

function scheduleSpeedMenuClose(): void {
  if (speedCloseTimer) clearTimeout(speedCloseTimer)
  speedCloseTimer = setTimeout(() => {
    speedMenuOpen.value = false
  }, 120)
}

function removeAttachment(item: VisAiAttachmentItem): void {
  emit('removeAttachment', item)
}

function toggleAttachmentMenu(toggle: () => void, event: MouseEvent): void {
  toggle()
  const trigger = event.currentTarget
  if (trigger instanceof HTMLElement) trigger.blur()
}

watch(modelMenuOpen, (open) => {
  if (!open) speedMenuOpen.value = false
})

onBeforeUnmount(() => {
  if (speedCloseTimer) clearTimeout(speedCloseTimer)
})
</script>

<template>
  <div
    class="vis-ai-sender"
    :class="{
      'is-disabled': disabled,
      'is-loading': loading,
      'has-attachments': attachments.length > 0,
    }"
  >
    <div v-if="attachments.length" class="vis-ai-sender__attachments">
      <VisAiAttachment
        v-for="item in attachments"
        :key="String(item.key)"
        :item-key="item.key"
        :name="item.name"
        :type="item.type"
        :extension="item.extension"
        :file-icon-type="item.fileIconType"
        :size="item.size"
        :url="item.url"
        :alt="item.alt"
        :uploading="item.uploading"
        :progress="item.progress"
        :removable="item.removable"
        @remove="removeAttachment(item)"
        @preview="emit('previewAttachment', item)"
      />
    </div>

    <div class="vis-ai-sender__editor">
      <VisAiSkill
        v-if="selectedSkill"
        :label="selectedSkill.label"
        :icon="Boolean(selectedSkill.iconName)"
        :icon-name="selectedSkill.iconName"
        :color="selectedSkill.color"
      />

      <textarea
        ref="textareaRef"
        class="vis-ai-sender__textarea"
        rows="1"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="loading"
        :maxlength="maxLength"
        :autofocus="autoFocus"
        @input="updateValue"
        @keydown="onKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      />
    </div>

    <footer class="vis-ai-sender__footer">
      <div class="vis-ai-sender__tools vis-ai-sender__tools-left">
        <VisDropdown
          v-model:open="attachmentMenuOpen"
          class="vis-ai-sender__attachment-dropdown"
        >
          <template #trigger="{ toggle }">
            <VisButton
              class="vis-ai-sender__attachment-trigger"
              :class="{ 'is-open': attachmentMenuOpen }"
              variant="text"
              size="md"
              icon-only
              icon-name="plus"
              label="添加内容"
              :disabled="disabled || loading"
              @click="toggleAttachmentMenu(toggle, $event)"
            />
          </template>

          <VisDropdownItem
            type="icon"
            icon-name="attachment-01"
            label="文件和图片"
            @select="emit('attachmentRequest'); attachmentMenuOpen = false"
          />
          <VisDropdownItem
            type="icon"
            icon-name="file-check-02"
            label="生成文档"
            @select="emit('documentRequest'); attachmentMenuOpen = false"
          />
          <VisDropdownItem
            type="icon"
            icon-name="book-open-01"
            label="更多技能"
            arrow
          />
          <VisDropdownDivider />
          <VisDropdownItem
            v-for="item in skills"
            :key="String(item.key)"
            class="vis-ai-sender__skill-option"
            :class="`color-${item.color ?? 'aqua'}`"
            type="icon"
            :icon-name="item.iconName"
            :label="item.label"
            :description="true"
            :description-text="item.description"
            :disabled="item.disabled"
            @select="chooseSkill(item)"
          />
        </VisDropdown>

        <VisToggleButton
          :model-value="deepThinking"
          size="md"
          icon-name="atom-02"
          :suffix="false"
          label="深度思考"
          :disabled="disabled || loading"
          @update:model-value="emit('update:deepThinking', $event)"
        />

      </div>

      <div class="vis-ai-sender__tools vis-ai-sender__tools-right">
        <VisDropdown v-model:open="modelMenuOpen" class="vis-ai-sender__model-dropdown">
          <template #trigger="{ toggle }">
            <button
              class="vis-ai-sender__model-trigger"
              type="button"
              :disabled="disabled || loading"
              aria-haspopup="menu"
              :aria-expanded="modelMenuOpen"
              @click="toggle"
            >
              <span>{{ selectedModel?.label ?? '选择模型' }}</span>
              <span v-if="selectedModel" class="vis-ai-sender__model-speed">{{ selectedSpeedLabel }}</span>
              <Icon name="chevron-down" :size="16" decorative />
            </button>
          </template>

          <VisDropdownItem
            v-for="item in models"
            :key="String(item.key)"
            type="icon"
            :icon-name="item.iconName ?? 'cube-01'"
            :label="item.label"
            :disabled="item.disabled"
            @select="chooseModel(item.key)"
          />
          <VisDropdownItem
            type="icon"
            icon-name="dots-horizontal"
            label="更多模型"
            arrow
          />
          <VisDropdownDivider />
          <VisDropdown
            v-model:open="speedMenuOpen"
            class="vis-ai-sender__speed-dropdown"
            @mouseenter="openSpeedMenu"
            @mouseleave="scheduleSpeedMenuClose"
            @focusin="openSpeedMenu"
            @focusout="scheduleSpeedMenuClose"
          >
            <template #trigger>
              <VisDropdownItem
                type="icon"
                icon-name="zap-fast"
                label="速率"
                suffix
                arrow
                @select="openSpeedMenu"
              >
                <template #suffix>{{ selectedSpeedLabel }}</template>
              </VisDropdownItem>
            </template>

            <VisDropdownItem
              v-for="option in speedOptions"
              :key="option.value"
              :label="option.label"
              @select="chooseSpeed(option.value)"
            />
          </VisDropdown>
        </VisDropdown>

        <VisAiSenderAction
          :loading="loading"
          :disabled="disabled || (!loading && !canSubmit)"
          @submit="submit"
          @stop="emit('stop')"
        />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.vis-ai-sender {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 320px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-sm);
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;
}

.vis-ai-sender:hover:not(.is-disabled) {
  border-color: var(--color-border-strong);
}

.vis-ai-sender:focus-within:not(.is-disabled) {
  border-color: transparent;
  background:
    linear-gradient(var(--color-bg-surface), var(--color-bg-surface)) padding-box,
    var(--gradient-ai-100) border-box;
  box-shadow:
    0 12px 15px 0 rgb(16 17 18 / 5%),
    0 0 2px 0 rgb(16 17 18 / 5%);
}

.vis-ai-sender.is-disabled {
  background: var(--color-bg-disabled);
}

.vis-ai-sender__attachments {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  overflow-x: auto;
}

.vis-ai-sender__editor {
  min-block-size: 44px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  column-gap: var(--space-8);
  row-gap: var(--space-4);
  overflow: hidden;
}

.vis-ai-sender__textarea {
  min-inline-size: 160px;
  min-block-size: 44px;
  max-block-size: 160px;
  flex: 1 1 240px;
  border: 0;
  padding: 0;
  outline: 0;
  resize: none;
  color: var(--color-text-primary);
  background: transparent;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  field-sizing: content;
}

.vis-ai-sender__textarea::placeholder {
  color: var(--color-text-tertiary);
}

.vis-ai-sender__textarea:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-ai-sender__footer {
  min-block-size: var(--space-32);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.vis-ai-sender__tools {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.vis-ai-sender__tools-right {
  margin-inline-start: auto;
}

.vis-ai-sender__model-trigger {
  box-sizing: border-box;
  block-size: var(--space-32);
  border: 0;
  border-radius: var(--radius-sm);
  padding-inline: var(--space-8);
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  color: var(--color-text-secondary);
  background: transparent;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
  cursor: pointer;
}

.vis-ai-sender__model-trigger:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
}

.vis-ai-sender__model-trigger:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 1px;
}

.vis-ai-sender__model-trigger:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-ai-sender__model-speed {
  color: var(--color-text-tertiary);
}

.vis-ai-sender__attachment-trigger.is-open {
  --vis-button-bg: var(--color-bg-secondary);
}

.vis-ai-sender__attachment-trigger :deep(.vis-button__icon) {
  transition: transform 120ms ease;
}

.vis-ai-sender__attachment-trigger.is-open :deep(.vis-button__icon) {
  transform: rotate(45deg);
}

.vis-ai-sender__skill-option.color-aqua :deep(.vis-dropdown-item__icon) {
  color: var(--utility-aqua-500);
}

.vis-ai-sender__skill-option.color-violet :deep(.vis-dropdown-item__icon) {
  color: var(--utility-violet-500);
}

.vis-ai-sender__skill-option.color-green :deep(.vis-dropdown-item__icon) {
  color: var(--utility-green-500);
}

.vis-ai-sender__skill-option.color-yellow :deep(.vis-dropdown-item__icon) {
  color: var(--utility-yellow-500);
}

.vis-ai-sender__attachment-dropdown :deep(.vis-dropdown) {
  inset-block-start: auto;
  inset-block-end: var(--space-40);
  inline-size: 331px;
}

.vis-ai-sender__model-dropdown :deep(.vis-dropdown) {
  inset-block-start: auto;
  inset-block-end: var(--space-40);
  inset-inline-start: auto;
  inset-inline-end: 0;
  inline-size: 228px;
  overflow: visible;
}

.vis-ai-sender__model-dropdown :deep(.vis-dropdown__list) {
  padding-block: var(--space-6);
}

.vis-ai-sender__speed-dropdown {
  position: relative;
  inline-size: 100%;
  display: block;
}

.vis-ai-sender__speed-dropdown::after {
  position: absolute;
  inset-block: 0;
  inset-inline-end: -8px;
  inline-size: 8px;
  content: '';
}

.vis-ai-sender__speed-dropdown :deep(.vis-dropdown) {
  inset-block-start: 0;
  inset-block-end: auto;
  inset-inline-start: calc(100% + 7px);
  z-index: 21;
  inline-size: var(--space-96);
  overflow: hidden;
}

@media (max-width: 640px) {
  .vis-ai-sender {
    min-inline-size: 0;
  }

  .vis-ai-sender__tools {
    gap: var(--space-4);
  }

  .vis-ai-sender__model-speed {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-sender,
  .vis-ai-sender__attachment-trigger :deep(.vis-button__icon) {
    transition: none;
  }
}
</style>
