<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import { VisInput } from '../../../components/input'
import { VisInputTextarea } from '../../../components/input-textarea'
import { VisMessage } from '../../../components/message'
import { VisModal } from '../../../components/modal'
import { VisSelect, type VisSelectModelValue, type VisSelectOption } from '../../../components/select'
import type { DemoBranch } from '../repositories'

const props = defineProps<{
  modelValue: boolean
  type: 'branch' | 'tag'
  branches: DemoBranch[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const baseBranch = ref('')
const name = ref('')
const description = ref('')
const successVisible = ref(false)

const title = computed(() => (props.type === 'branch' ? '新建分支' : '新建标签'))
const nameLabel = computed(() => (props.type === 'branch' ? '分支名称' : '标签名称'))
const namePlaceholder = computed(() => `请填写${props.type === 'branch' ? '分支' : '标签'}名称，最长 200 字节`)
const branchOptions = computed<VisSelectOption[]>(() => props.branches.map((branch) => ({
  label: branch.name,
  value: branch.name,
})))

function defaultBaseBranch(): string {
  return props.branches.find((branch) => branch.isDefault)?.name ?? props.branches[0]?.name ?? 'main'
}

function resetForm(): void {
  baseBranch.value = defaultBaseBranch()
  name.value = ''
  description.value = ''
}

function closeModal(): void {
  emit('update:modelValue', false)
}

function updateBaseBranch(value: VisSelectModelValue | undefined): void {
  if (typeof value === 'string' || typeof value === 'number') baseBranch.value = String(value)
}

function confirmCreate(): void {
  closeModal()
  successVisible.value = false
  void nextTick(() => {
    successVisible.value = true
  })
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm()
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="repository-create-ref-modal__mask">
      <VisModal
        :model-value="modelValue"
        :title="title"
        :width="384"
        height="auto"
        divider
        footer
        confirm-text="新建"
        @close="closeModal"
        @cancel="closeModal"
        @confirm="confirmCreate"
      >
        <div class="repository-create-ref-modal__form">
          <label class="repository-create-ref-modal__item">
            <span class="repository-create-ref-modal__label">基于 <em>*</em></span>
            <VisSelect
              :model-value="baseBranch"
              :options="branchOptions"
              :prefix="false"
              width="100%"
              aria-label="选择基础分支"
              @update:model-value="updateBaseBranch"
            />
          </label>

          <label class="repository-create-ref-modal__item">
            <span class="repository-create-ref-modal__label">{{ nameLabel }} <em>*</em></span>
            <VisInput
              v-model="name"
              class="repository-create-ref-modal__control"
              :placeholder="namePlaceholder"
              :max-length="false"
              :aria-label="nameLabel"
            />
          </label>

          <label class="repository-create-ref-modal__item">
            <span class="repository-create-ref-modal__label">描述</span>
            <VisInputTextarea
              v-model="description"
              class="repository-create-ref-modal__textarea"
              placeholder="请输入描述信息"
              :max-length="200"
              aria-label="描述"
            />
          </label>
        </div>
      </VisModal>
    </div>

    <div class="repository-create-ref-modal__message-host" aria-live="polite">
      <VisMessage
        v-model="successVisible"
        type="success"
        text="已成功新建"
        auto-close
        :duration="3000"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.repository-create-ref-modal__mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-component-mask);
}

.repository-create-ref-modal__form {
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.repository-create-ref-modal__item {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.repository-create-ref-modal__label {
  min-block-size: var(--space-24);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.repository-create-ref-modal__label em {
  color: var(--color-text-danger-primary);
  font-style: normal;
}

.repository-create-ref-modal__control,
.repository-create-ref-modal__textarea {
  inline-size: 100%;
}

.repository-create-ref-modal__control :deep(.vis-input),
.repository-create-ref-modal__textarea :deep(.vis-input-textarea) {
  inline-size: 100%;
}

.repository-create-ref-modal__message-host {
  position: fixed;
  inset-block-start: var(--space-20);
  inset-inline-start: 50%;
  z-index: 1100;
  transform: translateX(-50%);
  pointer-events: none;
}
</style>
