<script setup lang="ts">
import { ElCard } from 'element-plus'

import VisButton from '../button/VisButton.vue'
import type { VisCardProps } from './card.types'

withDefaults(defineProps<VisCardProps>(), {
  state: 'default',
  interactive: true,
  showAction: true,
  actionLabel: '更多操作',
  bodyStyle: undefined,
  bodyClass: undefined,
})

const emit = defineEmits<{
  action: [event: MouseEvent]
}>()
</script>

<template>
  <ElCard
    class="vis-card"
    :class="[
      `state-${state}`,
      {
        'is-interactive': interactive,
        'has-action': showAction,
      },
    ]"
    shadow="never"
    :body-style="bodyStyle"
    :body-class="['vis-card__body', bodyClass].filter(Boolean).join(' ')"
  >
    <VisButton
      v-if="showAction"
      class="vis-card__action"
      variant="text"
      size="md"
      icon-only
      icon-name="dots-horizontal"
      :label="actionLabel"
      @click.stop="emit('action', $event)"
    >
      <template v-if="$slots.action" #icon>
        <slot name="action" />
      </template>
    </VisButton>

    <slot />
  </ElCard>
</template>

<style scoped>
.vis-card {
  --el-card-border-color: var(--color-border-default);
  --el-card-border-radius: var(--radius-sm);
  --el-card-padding: 0px;
  --el-card-bg-color: var(--color-bg-surface);

  position: relative;
  box-sizing: border-box;
  min-inline-size: 0;
  border: 1px solid var(--el-card-border-color);
  border-radius: var(--el-card-border-radius);
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--el-card-bg-color);
  box-shadow: none;
  transition:
    background-color 150ms ease;
}

.vis-card.is-interactive:is(:hover, :focus-within),
.vis-card.state-hover {
  --el-card-bg-color: var(--color-bg-surface-subtle);
}

.vis-card :deep(.vis-card__body) {
  box-sizing: border-box;
  block-size: 100%;
  padding: var(--el-card-padding);
  overflow: hidden;
}

.vis-card__action {
  position: absolute;
  z-index: 1;
  inset-block-start: calc(var(--space-16) - 1px);
  inset-inline-end: calc(var(--space-16) - 1px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 120ms ease,
    visibility 120ms ease;
}

.vis-card.is-interactive:is(:hover, :focus-within) .vis-card__action,
.vis-card.state-hover .vis-card__action {
  opacity: 1;
  visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  .vis-card,
  .vis-card__action {
    transition: none;
  }
}
</style>
