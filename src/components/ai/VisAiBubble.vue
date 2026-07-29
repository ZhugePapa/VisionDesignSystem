<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import VisButton from '../button/VisButton.vue'
import VisScrollShadow from '../scroll-shadow/VisScrollShadow.vue'
import type { VisAiBubbleProps } from './ai.types'

const props = withDefaults(defineProps<VisAiBubbleProps>(), {
  content: '帮我生成需求文档',
  spilled: undefined,
  maxLines: 4,
  copyable: true,
  editable: true,
  state: 'default',
})

const emit = defineEmits<{
  'update:spilled': [value: boolean]
  expand: []
  copy: [content: string]
  edit: [content: string]
}>()

const contentRef = ref<HTMLElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)
const revealed = ref(false)
const autoSpilled = ref(false)
const lineHeight = 20
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

const isSpilled = computed(() => !revealed.value && (props.spilled ?? autoSpilled.value))
const showActions = computed(() => props.copyable || props.editable)
const rootClasses = computed(() => ({
  'is-spilled': isSpilled.value,
  'is-hover-preview': props.state === 'hover',
}))
const rootStyle = computed(() => ({
  '--vis-ai-bubble-max-lines': String(props.maxLines),
  '--vis-ai-bubble-collapsed-height': `${props.maxLines * lineHeight}px`,
}))

function measureSpill(): void {
  const element = measureRef.value ?? contentRef.value
  if (!element) return

  const nextSpilled = element.scrollHeight > props.maxLines * lineHeight + 1
  if (nextSpilled === autoSpilled.value) return

  autoSpilled.value = nextSpilled
  emit('update:spilled', nextSpilled)
}

function revealContent(): void {
  if (!isSpilled.value) return
  revealed.value = true
  emit('update:spilled', false)
  emit('expand')
}

async function copyContent(): Promise<void> {
  if (navigator.clipboard && props.content) {
    await navigator.clipboard.writeText(props.content).catch(() => undefined)
  }
  emit('copy', props.content)
}

function editContent(): void {
  emit('edit', props.content)
}

watch(
  () => [props.content, props.maxLines],
  () => {
    revealed.value = false
    nextTick(measureSpill)
  },
)

watch(
  () => props.spilled,
  (value) => {
    if (value) revealed.value = false
  },
)

onMounted(() => {
  const element = contentRef.value
  if (!element) return

  resizeObserver = new ResizeObserver(measureSpill)
  resizeObserver.observe(element)
  if (measureRef.value) resizeObserver.observe(measureRef.value)
  mutationObserver = new MutationObserver(measureSpill)
  mutationObserver.observe(element, { childList: true, characterData: true, subtree: true })
  nextTick(measureSpill)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})
</script>

<template>
  <div class="vis-ai-bubble-shell" :class="rootClasses" :style="rootStyle">
    <div
      class="vis-ai-bubble"
      :data-spilled="isSpilled ? 'true' : 'false'"
    >
      <div ref="contentRef" class="vis-ai-bubble__content">
        <slot>{{ content }}</slot>
      </div>

      <VisScrollShadow
        v-if="isSpilled"
        class="vis-ai-bubble__scroll"
        variant="secondary"
        :size="80"
        aria-hidden="true"
      >
        <div class="vis-ai-bubble__shadow-spacer" />
      </VisScrollShadow>

      <div v-if="isSpilled" class="vis-ai-bubble__expand-row">
        <VisButton
          variant="link-grey"
          size="sm"
          prefix
          icon-name="chevron-down-double"
          @click="revealContent"
        >
          展开
        </VisButton>
      </div>
    </div>

    <div ref="measureRef" class="vis-ai-bubble__measure" aria-hidden="true">
      <slot>{{ content }}</slot>
    </div>

    <div v-if="showActions" class="vis-ai-bubble__actions">
      <VisButton
        v-if="copyable"
        variant="text"
        size="sm"
        icon-only
        icon-name="copy-02"
        label="复制"
        @click="copyContent"
      />
      <VisButton
        v-if="editable"
        variant="text"
        size="sm"
        icon-only
        icon-name="edit-03"
        label="编辑"
        @click="editContent"
      />
    </div>
  </div>
</template>

<style scoped>
.vis-ai-bubble-shell {
  position: relative;
  box-sizing: border-box;
  inline-size: fit-content;
  max-inline-size: min(100%, var(--space-640));
}

.vis-ai-bubble-shell.is-spilled {
  inline-size: min(100%, var(--space-640));
}

.vis-ai-bubble {
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: var(--space-640);
  border-radius: var(--radius-lg) var(--radius-lg) 0 var(--radius-lg);
  padding: var(--space-12);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.is-spilled .vis-ai-bubble {
  padding-block-end: var(--space-20);
}

.vis-ai-bubble__content {
  min-inline-size: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.is-spilled .vis-ai-bubble__content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--vis-ai-bubble-max-lines);
}

.vis-ai-bubble__scroll {
  position: absolute;
  inset-block-start: var(--space-32);
  inset-inline: 0;
  z-index: 1;
  block-size: 80px;
  border-end-start-radius: var(--radius-lg);
  border-end-end-radius: var(--radius-lg);
  overflow: hidden;
  pointer-events: none;
}

.vis-ai-bubble__scroll :deep(.vis-scrollshadow__edge--end) {
  border-end-start-radius: var(--radius-lg);
  border-end-end-radius: var(--radius-lg);
  opacity: 1;
}

.vis-ai-bubble__shadow-spacer {
  block-size: 160px;
}

.vis-ai-bubble__measure {
  position: absolute;
  inset-inline: var(--space-12);
  inset-block-start: 0;
  z-index: -1;
  visibility: hidden;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  pointer-events: none;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-ai-bubble__expand-row {
  position: absolute;
  inset-block-start: calc(var(--space-12) + var(--vis-ai-bubble-collapsed-height) - 2px);
  inset-inline: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.vis-ai-bubble__actions {
  position: absolute;
  inset-inline-end: calc(100% + var(--space-8));
  inset-block-end: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-fg-tertiary);
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.vis-ai-bubble-shell:is(:hover, :focus-within, .is-hover-preview) .vis-ai-bubble__actions {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 720px) {
  .vis-ai-bubble__actions {
    position: static;
    justify-content: flex-end;
    margin-block-start: var(--space-4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-bubble__actions {
    transition: none;
  }
}
</style>
