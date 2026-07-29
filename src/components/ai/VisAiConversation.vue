<script setup lang="ts">
import { computed } from 'vue'

import VisButton from '../button/VisButton.vue'
import type {
  VisAiConversationItemData,
  VisAiConversationAction,
  VisAiConversationProps,
  VisAiKey,
} from './ai.types'
import VisAiConversationItem from './VisAiConversationItem.vue'

defineOptions({ name: 'VisAiConversation' })

const props = withDefaults(defineProps<VisAiConversationProps>(), {
  modelValue: '',
  items: () => [],
  title: '小 VI 智能助理',
  collapsed: false,
  showCreation: true,
  creationLabel: '发起新会话',
})

const emit = defineEmits<{
  'update:modelValue': [key: VisAiKey]
  'update:collapsed': [collapsed: boolean]
  select: [item: VisAiConversationItemData]
  create: []
  pin: [item: VisAiConversationItemData]
  more: [item: VisAiConversationItemData]
  action: [payload: { item: VisAiConversationItemData; action: VisAiConversationAction }]
}>()

interface ConversationGroup {
  label: string
  items: VisAiConversationItemData[]
}

const groups = computed<ConversationGroup[]>(() => {
  const order: string[] = []
  const grouped = new Map<string, VisAiConversationItemData[]>()

  props.items.forEach((item) => {
    const group = item.group ?? ''
    if (!grouped.has(group)) {
      order.push(group)
      grouped.set(group, [])
    }
    grouped.get(group)?.push(item)
  })

  return order.map((label) => ({ label, items: grouped.get(label) ?? [] }))
})

function selectConversation(item: VisAiConversationItemData): void {
  if (item.disabled) return
  emit('update:modelValue', item.key)
  emit('select', item)
}
</script>

<template>
  <aside
    class="vis-ai-conversation"
    :class="{ 'is-collapsed': collapsed }"
    :aria-label="title"
  >
    <header class="vis-ai-conversation__header">
      <span class="vis-ai-conversation__title">{{ title }}</span>
      <span class="vis-ai-conversation__header-actions">
        <VisButton
          v-if="collapsed && showCreation"
          class="vis-ai-conversation__header-button"
          variant="text"
          size="md"
          icon-only
          icon-name="message-plus-circle"
          :label="creationLabel"
          @click="emit('create')"
        />
        <VisButton
          class="vis-ai-conversation__header-button"
          variant="text"
          size="md"
          icon-only
          icon-name="layout-left"
          :label="collapsed ? '展开会话列表' : '收起会话列表'"
          @click="emit('update:collapsed', !collapsed)"
        />
      </span>
    </header>

    <template v-if="!collapsed">
      <div v-if="showCreation" class="vis-ai-conversation__creation">
        <VisButton
          class="vis-ai-conversation__creation-button"
          variant="primary"
          size="md"
          prefix
          icon-name="message-plus-circle"
          @click="emit('create')"
        >
          {{ creationLabel }}
        </VisButton>
      </div>

      <div class="vis-ai-conversation__list">
        <section
          v-for="group in groups"
          :key="group.label || '__ungrouped'"
          class="vis-ai-conversation__group"
        >
          <h3 v-if="group.label" class="vis-ai-conversation__group-label">{{ group.label }}</h3>
          <VisAiConversationItem
            v-for="item in group.items"
            :key="String(item.key)"
            :item-key="item.key"
            :label="item.label"
            :group="item.group"
            :pinned="item.pinned"
            :disabled="item.disabled"
            :active="modelValue === item.key"
            @select="selectConversation(item)"
            @pin="emit('pin', item)"
            @more="emit('more', item)"
            @action="emit('action', { item, action: $event })"
          />
        </section>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.vis-ai-conversation {
  box-sizing: border-box;
  inline-size: 216px;
  min-block-size: 320px;
  border-inline-end: 1px solid var(--color-border-default);
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  background: var(--color-bg-surface-subtle);
  overflow: visible;
  transition: inline-size 160ms ease;
}

.vis-ai-conversation.is-collapsed {
  inline-size: max-content;
  min-block-size: unset;
  border: 0;
  padding: var(--space-20) var(--space-12) var(--space-20) var(--space-20);
  background: transparent;
}

.vis-ai-conversation__header {
  box-sizing: border-box;
  padding: var(--space-20) var(--space-12) var(--space-20) var(--space-20);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.vis-ai-conversation.is-collapsed .vis-ai-conversation__header {
  min-block-size: var(--space-32);
  padding: 0;
}

.vis-ai-conversation__title {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-ai-conversation__header-actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.vis-ai-conversation.is-collapsed .vis-ai-conversation__header-actions {
  gap: var(--space-8);
}

.vis-ai-conversation__header-button.vis-button {
  --vis-button-fg: var(--color-fg-tertiary);

  flex: 0 0 auto;
}

.vis-ai-conversation__creation {
  padding: 0 var(--space-12);
}

.vis-ai-conversation__creation-button {
  inline-size: 100%;
}

.vis-ai-conversation__list {
  min-block-size: 0;
  flex: 1 1 0;
  padding: 0 var(--space-12) var(--space-12);
  overflow: visible;
}

.vis-ai-conversation__group {
  display: flex;
  flex-direction: column;
}

.vis-ai-conversation__group-label {
  margin: 0;
  padding: var(--space-16) var(--space-8) var(--space-4);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-conversation {
    transition: none;
  }
}
</style>
