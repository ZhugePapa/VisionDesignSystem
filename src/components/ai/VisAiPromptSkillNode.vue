<script setup lang="ts">
import type { IconName } from '../icons'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed } from 'vue'

import type { VisAiSkillColor } from './ai.types'
import VisAiSkill from './VisAiSkill.vue'

defineOptions({ name: 'VisAiPromptSkillNode' })

const props = defineProps(nodeViewProps)

const label = computed(() => String(props.node.attrs.label || ''))
const color = computed(
  () => (props.node.attrs.color || 'blue') as VisAiSkillColor,
)
const iconName = computed(
  () => (props.node.attrs.iconName || 'book-open-01') as IconName,
)

function selectNode(event: MouseEvent): void {
  const position = props.getPos()
  if (typeof position !== 'number') return
  props.editor.commands.setNodeSelection(position)
  const target = event.currentTarget
  if (target instanceof HTMLElement) target.focus()
}
</script>

<template>
  <NodeViewWrapper as="span">
    <span
      class="vis-ai-prompt-skill-node"
      :class="{ 'is-selected': selected }"
      contenteditable="false"
      role="button"
      tabindex="0"
      :aria-label="`已选择技能 ${label}，按 Delete 或 Backspace 移除`"
      @mousedown.prevent="selectNode"
      @keydown.delete.prevent.stop="deleteNode"
      @keydown.backspace.prevent.stop="deleteNode"
    >
      <VisAiSkill
        :label="label"
        :color="color"
        :icon-name="iconName"
      />
    </span>
  </NodeViewWrapper>
</template>

<style scoped>
.vis-ai-prompt-skill-node {
  display: inline-flex;
  max-inline-size: min(240px, 70vw);
  border-radius: var(--radius-sm);
  margin-inline-end: var(--space-4);
  vertical-align: -4px;
  user-select: none;
}

.vis-ai-prompt-skill-node.is-selected {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 1px;
}
</style>
