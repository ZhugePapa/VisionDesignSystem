<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import VisFeaturedIcon from '../featured-icon/VisFeaturedIcon.vue'
import type { VisFeaturedIconColor } from '../featured-icon/featured-icon.types'
import type { IconName } from '../icons/generated/registry.generated'
import VisLoading from '../loading/VisLoading.vue'
import type { VisMessageProps, VisMessageType } from './message.types'

const props = withDefaults(defineProps<VisMessageProps>(), {
  type: 'info',
  text: '这里是提示内容',
  modelValue: true,
  autoClose: false,
  duration: 3000,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  'after-leave': []
}>()

const visible = ref(false)
let closeTimer: number | undefined

const visualMap: Record<Exclude<VisMessageType, 'loading'>, { color: VisFeaturedIconColor; iconName: IconName }> = {
  info: { color: 'brand', iconName: 'info' },
  success: { color: 'success', iconName: 'check' },
  warning: { color: 'warning', iconName: 'alert' },
  danger: { color: 'danger', iconName: 'x-close' },
}

const resolvedVisual = computed(() => (props.type === 'loading' ? null : visualMap[props.type]))
const role = computed(() => (props.type === 'danger' || props.type === 'warning' ? 'alert' : 'status'))
const ariaLive = computed(() => (props.type === 'danger' || props.type === 'warning' ? 'assertive' : 'polite'))

function clearCloseTimer() {
  if (closeTimer === undefined) return
  window.clearTimeout(closeTimer)
  closeTimer = undefined
}

function scheduleAutoClose() {
  clearCloseTimer()
  if (!props.modelValue || !props.autoClose || props.type === 'loading' || props.duration <= 0) return
  closeTimer = window.setTimeout(() => {
    emit('update:modelValue', false)
    emit('close')
  }, props.duration)
}

watch(
  () => props.modelValue,
  (value) => {
    clearCloseTimer()
    if (value) {
      visible.value = false
      window.requestAnimationFrame(() => {
        visible.value = true
        scheduleAutoClose()
      })
    } else {
      visible.value = false
    }
  },
  { immediate: true },
)

watch(
  () => [props.autoClose, props.duration, props.type] as const,
  scheduleAutoClose,
)

onBeforeUnmount(clearCloseTimer)
</script>

<template>
  <Transition name="vis-message-move-in" @after-leave="emit('after-leave')">
    <div
      v-if="visible"
      class="vis-message"
      :class="[`type-${type}`]"
      :role="role"
      :aria-live="ariaLive"
    >
      <span v-if="type === 'loading'" class="vis-message__loading" aria-hidden="true">
        <VisLoading size="sm" color="grey" decorative />
      </span>
      <VisFeaturedIcon
        v-else-if="resolvedVisual"
        type="solid-round"
        size="xs"
        :color="resolvedVisual.color"
        :icon="resolvedVisual.iconName"
        decorative
      />
      <p class="vis-message__text">
        <slot>{{ text }}</slot>
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.vis-message {
  box-sizing: border-box;
  inline-size: fit-content;
  max-inline-size: 100%;
  min-block-size: 44px;
  border-radius: var(--radius-md);
  padding: var(--space-12) var(--space-16);
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-md);
  font-family: var(--font-family-sans);
}

.vis-message.type-loading {
  min-block-size: var(--space-48);
}

.vis-message__loading {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.vis-message__text {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  white-space: nowrap;
}

.vis-message-move-in-enter-active,
.vis-message-move-in-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.vis-message-move-in-enter-from,
.vis-message-move-in-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
