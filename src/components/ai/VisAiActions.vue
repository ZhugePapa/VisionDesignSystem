<script setup lang="ts">
import { computed } from 'vue'

import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import type { VisAiActionFeedback, VisAiActionsProps } from './ai.types'

defineOptions({ name: 'VisAiActions' })

const props = withDefaults(defineProps<VisAiActionsProps>(), {
  current: 1,
  total: 5,
  pagination: true,
  copy: true,
  refresh: true,
  thumbs: true,
  share: true,
  more: true,
  disabled: false,
  feedback: null,
})

const emit = defineEmits<{
  'update:current': [current: number]
  'update:feedback': [feedback: VisAiActionFeedback]
  change: [current: number]
  copy: []
  refresh: []
  feedback: [feedback: Exclude<VisAiActionFeedback, null>]
  share: []
  more: []
}>()

const normalizedTotal = computed(() => Math.max(1, Math.floor(props.total)))
const normalizedCurrent = computed(() => (
  Math.min(normalizedTotal.value, Math.max(1, Math.floor(props.current)))
))
const previousDisabled = computed(() => props.disabled || normalizedCurrent.value <= 1)
const nextDisabled = computed(() => props.disabled || normalizedCurrent.value >= normalizedTotal.value)

function setCurrent(current: number): void {
  const nextCurrent = Math.min(normalizedTotal.value, Math.max(1, current))
  if (nextCurrent === normalizedCurrent.value) return

  emit('update:current', nextCurrent)
  emit('change', nextCurrent)
}

function setFeedback(feedback: Exclude<VisAiActionFeedback, null>): void {
  if (props.disabled) return

  const nextFeedback = props.feedback === feedback ? null : feedback
  emit('update:feedback', nextFeedback)
  emit('feedback', feedback)
}
</script>

<template>
  <div class="vis-ai-actions" aria-label="AI 回答操作">
    <div v-if="pagination" class="vis-ai-actions__pagination">
      <VisButton
        class="vis-ai-actions__button"
        variant="text"
        size="sm"
        icon-only
        icon-name="chevron-left"
        label="上一条回答"
        :disabled="previousDisabled"
        @click="setCurrent(normalizedCurrent - 1)"
      >
        <template #icon>
          <Icon
            class="vis-ai-actions__navigator-icon"
            name="chevron-left"
            :size="12"
            decorative
          />
        </template>
      </VisButton>

      <span class="vis-ai-actions__counter" aria-live="polite">
        <span>{{ normalizedCurrent }}</span>
        <Icon
          class="vis-ai-actions__separator"
          name="slash-divider"
          :size="12"
          decorative
        />
        <span>{{ normalizedTotal }}</span>
      </span>

      <VisButton
        class="vis-ai-actions__button"
        variant="text"
        size="sm"
        icon-only
        icon-name="chevron-right"
        label="下一条回答"
        :disabled="nextDisabled"
        @click="setCurrent(normalizedCurrent + 1)"
      >
        <template #icon>
          <Icon
            class="vis-ai-actions__navigator-icon"
            name="chevron-right"
            :size="12"
            decorative
          />
        </template>
      </VisButton>
    </div>

    <VisButton
      v-if="copy"
      class="vis-ai-actions__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="copy-05"
      label="复制回答"
      :disabled="disabled"
      @click="emit('copy')"
    >
      <template #icon>
        <Icon class="vis-ai-actions__action-icon" name="copy-05" :size="16" decorative />
      </template>
    </VisButton>

    <VisButton
      v-if="refresh"
      class="vis-ai-actions__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="refresh-cw-01"
      label="重新生成"
      :disabled="disabled"
      @click="emit('refresh')"
    >
      <template #icon>
        <Icon class="vis-ai-actions__action-icon" name="refresh-cw-01" :size="16" decorative />
      </template>
    </VisButton>

    <VisButton
      v-if="thumbs"
      class="vis-ai-actions__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="thumbs-up"
      label="赞同回答"
      :disabled="disabled"
      :aria-pressed="feedback === 'up'"
      @click="setFeedback('up')"
    >
      <template #icon>
        <Icon
          class="vis-ai-actions__action-icon"
          :class="{ 'is-selected': feedback === 'up' }"
          name="thumbs-up"
          :size="16"
          decorative
        />
      </template>
    </VisButton>

    <VisButton
      v-if="thumbs"
      class="vis-ai-actions__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="thumbs-down"
      label="不赞同回答"
      :disabled="disabled"
      :aria-pressed="feedback === 'down'"
      @click="setFeedback('down')"
    >
      <template #icon>
        <Icon
          class="vis-ai-actions__action-icon"
          :class="{ 'is-selected': feedback === 'down' }"
          name="thumbs-down"
          :size="16"
          decorative
        />
      </template>
    </VisButton>

    <VisButton
      v-if="share"
      class="vis-ai-actions__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="share-06"
      label="分享回答"
      :disabled="disabled"
      @click="emit('share')"
    >
      <template #icon>
        <Icon class="vis-ai-actions__action-icon" name="share-06" :size="16" decorative />
      </template>
    </VisButton>

    <VisButton
      v-if="more"
      class="vis-ai-actions__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="dots-horizontal"
      label="更多操作"
      :disabled="disabled"
      @click="emit('more')"
    >
      <template #icon>
        <Icon class="vis-ai-actions__action-icon" name="dots-horizontal" :size="16" decorative />
      </template>
    </VisButton>
  </div>
</template>

<style scoped>
.vis-ai-actions {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--space-8);
  color: var(--color-fg-tertiary);
}

.vis-ai-actions__pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-ai-actions__counter {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-secondary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  letter-spacing: 0;
  white-space: nowrap;
}

.vis-ai-actions__separator,
.vis-ai-actions__navigator-icon {
  color: var(--color-fg-secondary);
}

.vis-ai-actions__action-icon {
  color: var(--color-fg-tertiary);
}

.vis-ai-actions__action-icon.is-selected {
  color: var(--color-fg-primary);
}

.vis-ai-actions__button:disabled .vis-ai-actions__navigator-icon,
.vis-ai-actions__button:disabled .vis-ai-actions__action-icon {
  color: var(--color-fg-disabled);
}
</style>
