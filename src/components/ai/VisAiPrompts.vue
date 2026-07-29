<script setup lang="ts">
import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import type { VisAiKey, VisAiPromptItem, VisAiPromptsProps } from './ai.types'

defineOptions({ name: 'VisAiPrompts' })

withDefaults(defineProps<VisAiPromptsProps>(), {
  items: () => [],
  oneLine: false,
  disabled: false,
})

const emit = defineEmits<{
  select: [item: VisAiPromptItem]
}>()

function selectPrompt(item: VisAiPromptItem, disabled: boolean): void {
  if (disabled || item.disabled) return
  emit('select', item)
}

function itemKey(key: VisAiKey): string {
  return String(key)
}
</script>

<template>
  <div class="vis-ai-prompts" :class="{ 'is-one-line': oneLine }">
    <svg class="vis-ai-prompts__gradient-defs" aria-hidden="true">
      <defs>
        <linearGradient id="vis-ai-prompts-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#3cadea" />
          <stop offset="0.495192" stop-color="#b22bc4" />
          <stop offset="1" stop-color="#e5792b" />
        </linearGradient>
      </defs>
    </svg>

    <component
      v-for="item in items"
      :is="oneLine ? 'button' : 'div'"
      :key="itemKey(item.key)"
      class="vis-ai-prompts__item"
      :class="{ 'is-disabled': disabled || item.disabled }"
      :type="oneLine ? 'button' : undefined"
      :disabled="oneLine && (disabled || item.disabled) ? true : undefined"
      :role="oneLine ? undefined : 'group'"
      :aria-disabled="disabled || item.disabled ? 'true' : undefined"
      @click="selectPrompt(item, disabled)"
    >
      <Icon
        v-if="item.iconName"
        class="vis-ai-prompts__icon"
        :name="item.iconName"
        :size="16"
        decorative
      />
      <span class="vis-ai-prompts__content">
        <span class="vis-ai-prompts__label">
          {{ oneLine ? item.descriptions?.[0] ?? item.label : item.label }}
        </span>
        <VisButton
          v-for="(description, index) in item.descriptions"
          v-if="!oneLine"
          :key="`${itemKey(item.key)}-${index}`"
          class="vis-ai-prompts__description"
          variant="link-grey"
          size="sm"
          :disabled="disabled || item.disabled"
          @click.stop="selectPrompt(item, disabled)"
        >
          {{ description }}
        </VisButton>
      </span>
    </component>
  </div>
</template>

<style scoped>
.vis-ai-prompts {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
}

.vis-ai-prompts__gradient-defs {
  position: absolute;
  inline-size: 0;
  block-size: 0;
  overflow: hidden;
  pointer-events: none;
}

.vis-ai-prompts__item {
  position: relative;
  box-sizing: border-box;
  inline-size: var(--space-256);
  min-block-size: 110px;
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-12);
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  color: var(--color-text-primary);
  text-align: start;
  background: var(--color-bg-surface);
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease;
}

.vis-ai-prompts__item:hover {
  background: var(--color-bg-surface-subtle);
}

.vis-ai-prompts__item:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

.vis-ai-prompts__item.is-disabled {
  color: var(--color-text-disabled);
  background: var(--color-bg-secondary);
  cursor: not-allowed;
}

.vis-ai-prompts__icon {
  flex: 0 0 auto;
  margin-block: 2px;
  color: var(--color-component-icon-aqua);
}

.vis-ai-prompts__icon :deep(path),
.vis-ai-prompts__icon :deep(line),
.vis-ai-prompts__icon :deep(polyline),
.vis-ai-prompts__icon :deep(rect),
.vis-ai-prompts__icon :deep(circle) {
  stroke: url("#vis-ai-prompts-gradient");
}

.vis-ai-prompts__item.is-disabled .vis-ai-prompts__icon {
  color: var(--color-fg-disabled);
}

.vis-ai-prompts__content {
  min-inline-size: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.vis-ai-prompts__label {
  font-family: var(--font-family-text);
}

.vis-ai-prompts__label {
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
}

.vis-ai-prompts__description {
  inline-size: 100%;
  justify-content: flex-start;
  text-align: start;
}

.vis-ai-prompts.is-one-line .vis-ai-prompts__item {
  min-block-size: 44px;
  border: 1px solid var(--color-border-default);
  padding-block: 11px;
  align-items: center;
}

.vis-ai-prompts.is-one-line .vis-ai-prompts__item:hover {
  border-color: var(--color-border-default);
}

.vis-ai-prompts.is-one-line .vis-ai-prompts__label {
  overflow: hidden;
  color: var(--color-text-secondary);
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-prompts__item {
    transition: none;
  }
}
</style>
