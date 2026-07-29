<script setup lang="ts">
import { computed, ref } from 'vue'

import VisDropdown from '../dropdown/VisDropdown.vue'
import type { VisDropdownEntry } from '../dropdown/dropdown.types'
import Icon from '../icons/Icon.vue'
import VisTooltip from '../tooltip/VisTooltip.vue'
import type { VisAiConversationAction, VisAiConversationItemProps } from './ai.types'

defineOptions({ name: 'VisAiConversationItem' })

const props = withDefaults(defineProps<VisAiConversationItemProps>(), {
  itemKey: '',
  group: '',
  pinned: false,
  disabled: false,
  active: false,
})

const emit = defineEmits<{
  select: []
  pin: []
  more: []
  action: [action: VisAiConversationAction]
}>()

const moreOpen = ref(false)
const menuActions: VisAiConversationAction[] = ['share', 'rename', 'pin', 'delete']
const moreItems = computed<VisDropdownEntry[]>(() => [
  { type: 'item', itemType: 'icon', iconName: 'share-06', label: '分享' },
  { type: 'item', itemType: 'icon', iconName: 'edit-03', label: '重命名' },
  {
    type: 'item',
    itemType: 'icon',
    iconName: props.pinned ? 'unpin' : 'pin-02',
    label: props.pinned ? '取消置顶' : '置顶',
  },
  { type: 'item', itemType: 'icon', iconName: 'trash-01', label: '删除', danger: true },
])

function toggleMore(toggle: () => void): void {
  emit('more')
  toggle()
}

function selectMoreAction(payload: { item: VisDropdownEntry; index: number }): void {
  const action = menuActions[payload.index]
  moreOpen.value = false
  if (!action) return

  if (action === 'pin') emit('pin')
  emit('action', action)
}
</script>

<template>
  <div
    class="vis-ai-conversation-item"
    :class="{ 'is-active': active, 'is-disabled': disabled, 'is-menu-open': moreOpen }"
  >
    <button
      class="vis-ai-conversation-item__main"
      type="button"
      :disabled="disabled"
      :aria-current="active ? 'page' : undefined"
      @click="emit('select')"
    >
      <span class="vis-ai-conversation-item__label" :title="label">{{ label }}</span>
    </button>

    <span v-if="!disabled" class="vis-ai-conversation-item__actions">
      <VisTooltip :content="pinned ? '取消置顶' : '置顶'" position="top">
        <button
          class="vis-ai-conversation-item__action"
          type="button"
          :aria-label="pinned ? '取消置顶会话' : '置顶会话'"
          @click.stop="emit('pin')"
        >
          <Icon :name="pinned ? 'unpin' : 'pin-02'" :size="16" decorative />
        </button>
      </VisTooltip>

      <VisDropdown
        v-model:open="moreOpen"
        class="vis-ai-conversation-item__dropdown"
        :items="moreItems"
        @select="selectMoreAction"
      >
        <template #trigger="{ open, toggle }">
          <VisTooltip content="更多" position="top" :disabled="open">
            <button
              class="vis-ai-conversation-item__action"
              type="button"
              aria-label="更多会话操作"
              :aria-expanded="open ? 'true' : 'false'"
              aria-haspopup="menu"
              @click.stop="toggleMore(toggle)"
            >
              <Icon name="dots-horizontal" :size="16" decorative />
            </button>
          </VisTooltip>
        </template>
      </VisDropdown>
    </span>
  </div>
</template>

<style scoped>
.vis-ai-conversation-item {
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-40);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  background: transparent;
  transition:
    color 120ms ease,
    background-color 120ms ease;
}

.vis-ai-conversation-item:hover:not(.is-disabled),
.vis-ai-conversation-item:focus-within:not(.is-disabled),
.vis-ai-conversation-item.is-active {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.vis-ai-conversation-item.is-active {
  font-weight: 500;
}

.vis-ai-conversation-item.is-disabled {
  color: var(--color-text-disabled);
}

.vis-ai-conversation-item__main {
  min-inline-size: 0;
  block-size: 100%;
  flex: 1 1 0;
  border: 0;
  border-radius: inherit;
  padding: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: inherit;
  background: transparent;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: inherit;
  line-height: var(--font-text-md-line-height);
  text-align: start;
  cursor: pointer;
}

.vis-ai-conversation-item__main:disabled {
  cursor: not-allowed;
}

.vis-ai-conversation-item__main:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: -2px;
}

.vis-ai-conversation-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-ai-conversation-item__actions {
  position: absolute;
  inset-inline-end: var(--space-8);
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding-inline-start: var(--space-8);
  background: linear-gradient(90deg, transparent, var(--color-bg-secondary) var(--space-8));
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.vis-ai-conversation-item:hover .vis-ai-conversation-item__actions,
.vis-ai-conversation-item:focus-within .vis-ai-conversation-item__actions,
.vis-ai-conversation-item.is-menu-open .vis-ai-conversation-item__actions {
  opacity: 1;
  pointer-events: auto;
}

.vis-ai-conversation-item__action {
  position: relative;
  inline-size: var(--space-24);
  block-size: var(--space-24);
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-secondary);
  background: transparent;
  cursor: pointer;
}

.vis-ai-conversation-item__action:hover {
  color: var(--color-fg-primary);
  background: var(--color-bg-tertiary);
}

.vis-ai-conversation-item__action:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
}

.vis-ai-conversation-item__dropdown {
  z-index: 30;
}

.vis-ai-conversation-item__dropdown :deep(.vis-dropdown) {
  inset-block-start: calc(100% + var(--space-4));
  inset-inline-start: auto;
  inset-inline-end: 0;
  inline-size: 160px;
}

.vis-ai-conversation-item__dropdown :deep(.vis-dropdown__list) {
  padding-block: var(--space-6);
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-conversation-item,
  .vis-ai-conversation-item__actions {
    transition: none;
  }
}
</style>
