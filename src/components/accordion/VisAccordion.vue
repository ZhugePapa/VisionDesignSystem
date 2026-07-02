<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import VisAccordionItem from './VisAccordionItem.vue'
import type { VisAccordionItemData, VisAccordionItemKey, VisAccordionProps } from './accordion.types'

const defaultAccordionContent =
  '设计系统（Design System） 是一套用于指导产品设计和开发的标准化工具、规则和组件集合。它的核心目标是确保产品在视觉、交互和功能上保持一致性，同时提升团队协作效率。以下是设计系统的关键要素和意义。'

const props = withDefaults(defineProps<VisAccordionProps>(), {
  items: () => [
    { key: '1', title: '折叠面板' },
    { key: '2', title: '折叠面板' },
    { key: '3', title: '折叠面板' },
    { key: '4', title: '折叠面板' },
    { key: '5', title: '折叠面板' },
    { key: '6', title: '折叠面板' },
  ],
  modelValue: undefined,
  defaultValue: null,
  borderless: false,
  icon: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisAccordionItemKey | null): void
  (event: 'toggle', payload: { key: VisAccordionItemKey; expanded: boolean; item: VisAccordionItemData }): void
}>()

const internalValue = ref<VisAccordionItemKey | null>(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)
const resolvedValue = computed(() => (isControlled.value ? props.modelValue ?? null : internalValue.value))

watch(
  () => props.defaultValue,
  (value) => {
    if (!isControlled.value) {
      internalValue.value = value
    }
  },
)

function onItemExpandedChange(item: VisAccordionItemData, expanded: boolean): void {
  const nextValue = expanded ? item.key : null

  if (!isControlled.value) {
    internalValue.value = nextValue
  }

  emit('update:modelValue', nextValue)
  emit('toggle', { key: item.key, expanded, item })
}
</script>

<template>
  <div class="vis-accordion" :class="{ 'is-borderless': borderless }">
    <slot>
      <VisAccordionItem
        v-for="item in items"
        :key="String(item.key)"
        :title="item.title"
        :expanded="resolvedValue === item.key"
        :borderless="borderless"
        :disabled="item.disabled"
        :icon="icon"
        @update:expanded="onItemExpandedChange(item, $event)"
      >
        {{ item.content ?? defaultAccordionContent }}
      </VisAccordionItem>
    </slot>
  </div>
</template>

<style scoped>
.vis-accordion {
  position: relative;
  box-sizing: border-box;
  inline-size: 320px;
  overflow: hidden;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: var(--color-bg-canvas);
}

.vis-accordion::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  box-sizing: border-box;
  border: 1px solid var(--color-border-default);
  border-radius: inherit;
  pointer-events: none;
}

.vis-accordion.is-borderless {
  overflow: hidden;
  border-radius: 0;
  background: transparent;
}

.vis-accordion.is-borderless::after {
  display: none;
}
</style>
