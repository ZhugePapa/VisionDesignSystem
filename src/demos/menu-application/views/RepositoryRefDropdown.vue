<script setup lang="ts">
import { computed, ref } from 'vue'

import VisButton from '../../../components/button/VisButton.vue'
import { VisDropdown, VisDropdownItem } from '../../../components/dropdown'
import Icon from '../../../components/icons/Icon.vue'
import { VisSegmented, type VisSegmentedOption, type VisSegmentedValue } from '../../../components/segmented'
import { VisTag } from '../../../components/tag'
import type { DemoBranch, DemoTag } from '../repositories'

const props = defineProps<{
  modelValue: string
  branches: DemoBranch[]
  tags: DemoTag[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const open = ref(false)
const mode = ref<'branches' | 'tags'>('branches')
const search = ref('')

const options: VisSegmentedOption[] = [
  { value: 'branches', label: '分支' },
  { value: 'tags', label: '标签' },
]

const filteredItems = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  const items = mode.value === 'branches' ? props.branches : props.tags
  return items.filter((item) => !query || item.name.toLocaleLowerCase().includes(query))
})

function handleModeChange(value: VisSegmentedValue): void {
  mode.value = value as 'branches' | 'tags'
  search.value = ''
}

function selectItem(name: string): void {
  emit('update:modelValue', name)
  open.value = false
}
</script>

<template>
  <VisDropdown v-model:open="open" class="repository-ref-dropdown">
    <template #trigger="{ toggle }">
      <VisButton
        variant="secondary"
        size="md"
        prefix
        :icon-name="mode === 'branches' ? 'git-branch-02' : 'tag-01'"
        suffix
        suffix-icon-name="chevron-down"
        :label="modelValue"
        aria-haspopup="menu"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="repository-ref-dropdown__label">{{ modelValue }}</span>
      </VisButton>
    </template>

    <div class="repository-ref-menu">
      <label class="repository-ref-menu__search">
        <Icon name="search-lg" :size="16" decorative />
        <input
          v-model="search"
          type="search"
          :placeholder="mode === 'branches' ? '搜索分支' : '搜索标签'"
          :aria-label="mode === 'branches' ? '搜索分支' : '搜索标签'"
        >
      </label>

      <VisSegmented
        :model-value="mode"
        :options="options"
        :icon="false"
        aria-label="切换分支或标签"
        @change="handleModeChange"
      />

      <div class="repository-ref-menu__list">
        <VisDropdownItem
          v-for="item in filteredItems"
          :key="item.name"
          :label="item.name"
          type="icon"
          :icon-name="mode === 'branches' ? 'git-branch-02' : 'tag-01'"
          :active="item.name === modelValue"
          :suffix="mode === 'branches' && 'isDefault' in item && item.isDefault"
          @select="selectItem(item.name)"
        >
          <template #suffix>
            <VisTag
              v-if="mode === 'branches' && 'isDefault' in item && item.isDefault"
              label="默认"
            />
          </template>
        </VisDropdownItem>
        <span v-if="!filteredItems.length" class="repository-ref-menu__empty">无匹配结果</span>
      </div>
    </div>
  </VisDropdown>
</template>

<style scoped>
.repository-ref-dropdown {
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 176px;
  flex: 0 1 176px;
}

.repository-ref-dropdown :deep(.vis-dropdown-shell__trigger),
.repository-ref-dropdown :deep(.vis-button) {
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 100%;
}

.repository-ref-dropdown :deep(.vis-button__label) {
  min-inline-size: 0;
  overflow: hidden;
  text-align: start;
  flex: 1 1 0;
}

.repository-ref-dropdown__label {
  min-inline-size: 0;
  display: block;
  overflow: hidden;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repository-ref-dropdown :deep(.vis-dropdown) {
  inset-block-start: calc(100% + var(--space-4));
  inline-size: var(--space-192);
  block-size: 232px;
  z-index: 50;
}

.repository-ref-dropdown :deep(.vis-dropdown__list) {
  block-size: 100%;
  padding-block: var(--space-6);
}

.repository-ref-menu {
  min-block-size: 0;
  block-size: 100%;
  padding-inline: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.repository-ref-menu__search {
  box-sizing: border-box;
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding-inline: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}

.repository-ref-menu__search:focus-within {
  border-color: var(--color-border-brand);
  box-shadow: 0 0 0 2px var(--color-effect-focus-ring-brand);
}

.repository-ref-menu__search input {
  min-inline-size: 0;
  border: 0;
  padding: 0;
  outline: 0;
  color: var(--color-text-primary);
  background: transparent;
  font: inherit;
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  flex: 1 1 0;
}

.repository-ref-menu__search input::placeholder {
  color: var(--color-text-tertiary);
}

.repository-ref-menu :deep(.vis-segmented) {
  inline-size: 100%;
  flex: 0 0 auto;
}

.repository-ref-menu :deep(.vis-segmented__item) {
  flex: 1 1 0;
}

.repository-ref-menu__list {
  min-block-size: 0;
  margin-inline: calc(var(--space-8) * -1);
  overflow-y: auto;
  flex: 1 1 0;
  scrollbar-width: thin;
}

.repository-ref-menu__list :deep(.vis-tag) {
  block-size: var(--space-24);
  padding-inline: var(--space-8);
  background: var(--color-bg-surface-subtle);
}

.repository-ref-menu__empty {
  padding: var(--space-12) var(--space-16);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}
</style>
