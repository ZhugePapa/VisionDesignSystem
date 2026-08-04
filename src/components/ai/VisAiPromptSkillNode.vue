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

function selectNode(): void {
  const position = props.getPos()
  if (typeof position !== 'number') return
  props.editor.chain().setNodeSelection(position).focus().run()
}
</script>

<template>
  <NodeViewWrapper as="span">
    <span
      class="vis-ai-prompt-skill-node"
      contenteditable="false"
      role="button"
      tabindex="-1"
      :aria-label="`已选择技能 ${label}，按 Delete 或 Backspace 移除`"
      @mousedown.prevent="selectNode"
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

</style>
