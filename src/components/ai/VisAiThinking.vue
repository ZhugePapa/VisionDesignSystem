<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Icon from '../icons/Icon.vue'
import { VisLoadingText } from '../loading'
import type { VisAiThinkingProps } from './ai.types'

defineOptions({ name: 'VisAiThinking' })

const props = withDefaults(defineProps<VisAiThinkingProps>(), {
  expanded: undefined,
  defaultExpanded: false,
  state: 'default',
  label: '正在思考...',
  content: '这里是思考的内容',
})

const emit = defineEmits<{
  'update:expanded': [expanded: boolean]
  toggle: [expanded: boolean]
}>()

const internalExpanded = ref(props.defaultExpanded)
const isControlled = computed(() => props.expanded !== undefined)
const isExpanded = computed(() => (
  isControlled.value ? Boolean(props.expanded) : internalExpanded.value
))

function toggleExpanded(): void {
  const nextExpanded = !isExpanded.value
  if (!isControlled.value) internalExpanded.value = nextExpanded
  emit('update:expanded', nextExpanded)
  emit('toggle', nextExpanded)
}

watch(
  () => props.defaultExpanded,
  (expanded) => {
    if (!isControlled.value) internalExpanded.value = expanded
  },
)
</script>

<template>
  <div
    class="vis-ai-thinking"
    :class="[
      `state-${state}`,
      { 'is-expanded': isExpanded },
    ]"
  >
    <button
      class="vis-ai-thinking__trigger"
      type="button"
      :aria-expanded="isExpanded"
      @click="toggleExpanded"
    >
      <VisLoadingText :label="label" />
      <Icon
        class="vis-ai-thinking__chevron"
        :name="isExpanded ? 'chevron-down' : 'chevron-right'"
        :size="16"
        decorative
      />
    </button>

    <div v-if="isExpanded" class="vis-ai-thinking__content">
      <slot>{{ content }}</slot>
    </div>
  </div>
</template>

<style scoped>
.vis-ai-thinking {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-8);
  max-inline-size: 100%;
}

.vis-ai-thinking__trigger {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.vis-ai-thinking__trigger:focus-visible {
  border-radius: var(--radius-sm);
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

.vis-ai-thinking__chevron {
  color: var(--color-fg-tertiary);
  opacity: 0;
}

.vis-ai-thinking:is(:hover, :focus-within, .state-hover) .vis-ai-thinking__chevron {
  opacity: 1;
}

.vis-ai-thinking__content {
  box-sizing: border-box;
  inline-size: 100%;
  padding-inline-start: var(--space-20);
  color: var(--color-text-disabled);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  white-space: pre-wrap;
}

@media (prefers-reduced-motion: no-preference) {
  .vis-ai-thinking__chevron {
    transition: opacity 120ms ease;
  }
}
</style>
