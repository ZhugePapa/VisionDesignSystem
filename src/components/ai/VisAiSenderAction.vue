<script setup lang="ts">
import Icon from '../icons/Icon.vue'

defineOptions({ name: 'VisAiSenderAction' })

const props = withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    loading: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  submit: []
  stop: []
}>()

function activate(): void {
  if (props.disabled) return
  if (props.loading) {
    emit('stop')
    return
  }
  emit('submit')
}
</script>

<template>
  <button
    class="vis-ai-sender-action"
    :class="{ 'is-loading': loading }"
    type="button"
    :disabled="disabled"
    :aria-label="loading ? '停止生成' : '发送消息'"
    @click="activate"
  >
    <Icon :name="loading ? 'stop' : 'arrow-up'" :size="16" decorative />
  </button>
</template>

<style scoped>
.vis-ai-sender-action {
  box-sizing: border-box;
  inline-size: var(--space-32);
  block-size: var(--space-32);
  border: 0;
  border-radius: var(--radius-full);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-white);
  background: var(--color-fg-brand-primary);
  cursor: pointer;
  transition:
    background-color 120ms ease,
    transform 120ms ease;
}

.vis-ai-sender-action:hover:not(:disabled) {
  background:
    linear-gradient(var(--color-component-hover), var(--color-component-hover)),
    var(--color-fg-brand-primary);
}

.vis-ai-sender-action:active:not(:disabled) {
  transform: scale(0.96);
}

.vis-ai-sender-action:focus-visible {
  outline: 0;
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-ai-sender-action:disabled {
  color: var(--color-component-button-fg-disabled);
  background: var(--color-fg-brand-disabled);
  cursor: not-allowed;
}

.vis-ai-sender-action.is-loading {
  background: var(--color-fg-brand-primary);
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-sender-action {
    transition: none;
  }
}
</style>
