<script setup lang="ts">
import Icon from '../icons/Icon.vue'
import type { VisAiArtifactProps } from './ai.types'

defineOptions({ name: 'VisAiArtifact' })

withDefaults(defineProps<VisAiArtifactProps>(), {
  name: '这里是文件名称.md',
  description: 'Markdown 文件',
  meta: '',
  type: 'file-markdown',
  state: 'default',
  openLabel: '打开',
  disabled: false,
  downloadEnabled: true,
})

const emit = defineEmits<{
  open: [key: VisAiArtifactProps['itemKey']]
  download: [key: VisAiArtifactProps['itemKey']]
}>()
</script>

<template>
  <article
    class="vis-ai-artifact"
    :class="[
      `type-${type}`,
      `state-${state}`,
      { 'is-disabled': disabled },
    ]"
  >
    <span class="vis-ai-artifact__featured-icon" aria-hidden="true">
      <Icon name="file-05" :size="20" decorative />
    </span>

    <span class="vis-ai-artifact__content">
      <strong class="vis-ai-artifact__name" :title="name">{{ name }}</strong>
      <span class="vis-ai-artifact__details">
        <span v-if="description" class="vis-ai-artifact__description">{{ description }}</span>
        <span v-if="meta" class="vis-ai-artifact__meta">{{ meta }}</span>
      </span>
    </span>

    <span class="vis-ai-artifact__split-button">
      <button
        class="vis-ai-artifact__open"
        type="button"
        :disabled="disabled"
        @click="emit('open', itemKey)"
      >
        {{ openLabel }}
      </button>
      <button
        v-if="downloadEnabled"
        class="vis-ai-artifact__download"
        type="button"
        :disabled="disabled"
        :aria-label="`下载 ${name}`"
        @click="emit('download', itemKey)"
      >
        <Icon name="chevron-down" :size="16" decorative />
      </button>
    </span>
  </article>
</template>

<style scoped>
.vis-ai-artifact {
  box-sizing: border-box;
  inline-size: min(100%, 563px);
  min-inline-size: 0;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  transition: background-color 120ms ease, border-color 120ms ease;
}

.vis-ai-artifact.is-disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-ai-artifact__featured-icon {
  box-sizing: border-box;
  inline-size: var(--space-40);
  block-size: var(--space-40);
  flex: 0 0 auto;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-secondary);
  background: var(--color-bg-surface);
  box-shadow: 0 1px 2px var(--color-effect-shadow-grey);
}

.vis-ai-artifact__content {
  min-inline-size: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.vis-ai-artifact__name,
.vis-ai-artifact__details,
.vis-ai-artifact__description,
.vis-ai-artifact__meta {
  max-inline-size: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-family-text);
}

.vis-ai-artifact__name {
  color: currentColor;
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
}

.vis-ai-artifact__details {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
}

.vis-ai-artifact__split-button {
  flex: 0 0 auto;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  background: var(--color-bg-surface);
}

.vis-ai-artifact__open,
.vis-ai-artifact__download {
  block-size: var(--space-32);
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: transparent;
  cursor: pointer;
}

.vis-ai-artifact__open {
  padding-inline: var(--space-12);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.vis-ai-artifact__download {
  inline-size: var(--space-32);
  border-inline-start: 1px solid var(--color-border-default);
}

.vis-ai-artifact__open:hover,
.vis-ai-artifact__download:hover {
  background: var(--color-bg-surface-subtle);
}

.vis-ai-artifact__open:focus-visible,
.vis-ai-artifact__download:focus-visible {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--color-border-brand);
  outline-offset: -2px;
}

.vis-ai-artifact__open:disabled,
.vis-ai-artifact__download:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .vis-ai-artifact__description {
    display: none;
  }
}
</style>
