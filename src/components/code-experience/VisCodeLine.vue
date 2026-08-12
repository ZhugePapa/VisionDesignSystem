<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import type {
  VisCodeLineClickPayload,
  VisCodeLineNumberValue,
  VisCodeLineProps,
} from './code-experience.types'

const props = withDefaults(defineProps<VisCodeLineProps>(), {
  content: 'export MAVEN_PROJECTBASEDIR=${MAVEN_BASEDIR:-"$BASE_DIR"}',
  type: 'default',
  state: 'default',
  active: false,
  divider: false,
  number: 'default',
  lineNumber: 24,
  oldLineNumber: undefined,
  newLineNumber: undefined,
  commentable: true,
  interactive: true,
  wrap: false,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  click: [payload: VisCodeLineClickPayload]
  comment: [payload: VisCodeLineClickPayload]
}>()

const resolvedOldLineNumber = computed<VisCodeLineNumberValue | undefined>(() => {
  if (props.oldLineNumber !== undefined) return props.oldLineNumber
  return props.type === 'add' ? undefined : props.lineNumber
})

const resolvedNewLineNumber = computed<VisCodeLineNumberValue | undefined>(() => {
  if (props.newLineNumber !== undefined) return props.newLineNumber
  return props.type === 'delete' ? undefined : props.lineNumber
})

const accessibleLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  if (props.number === 'double') {
    return `旧行 ${resolvedOldLineNumber.value ?? '空'}，新行 ${resolvedNewLineNumber.value ?? '空'}`
  }
  if (props.number === 'default') return `第 ${props.lineNumber} 行`
  return '代码行'
})

function createPayload(nativeEvent: MouseEvent): VisCodeLineClickPayload {
  return {
    lineNumber: props.lineNumber,
    oldLineNumber: resolvedOldLineNumber.value,
    newLineNumber: resolvedNewLineNumber.value,
    content: props.content,
    nativeEvent,
  }
}

function handleClick(event: MouseEvent): void {
  if (!props.interactive) return
  emit('click', createPayload(event))
}

function handleComment(event: MouseEvent): void {
  if (!props.interactive) return
  emit('comment', createPayload(event))
}

defineOptions({ name: 'VisCodeLine' })
</script>

<template>
  <div
    class="vis-code-line"
    :class="[
      `type-${type}`,
      `number-${number}`,
      {
        'has-divider': divider,
        'is-interactive': interactive,
        'is-active': interactive && active,
        'is-hovered': interactive && state === 'hover',
        'is-wrapped': wrap,
      },
    ]"
    role="row"
    :aria-label="accessibleLabel"
    @click="handleClick"
  >
    <template v-if="number === 'double'">
      <div class="vis-code-line__number" role="rowheader">
        <slot name="old-number" :value="resolvedOldLineNumber">
          <span v-if="resolvedOldLineNumber !== undefined">{{ resolvedOldLineNumber }}</span>
        </slot>
      </div>
      <div class="vis-code-line__number" role="rowheader">
        <slot name="new-number" :value="resolvedNewLineNumber">
          <span v-if="resolvedNewLineNumber !== undefined">{{ resolvedNewLineNumber }}</span>
        </slot>
      </div>
    </template>

    <div v-else-if="number === 'default'" class="vis-code-line__number" role="rowheader">
      <slot name="number" :value="lineNumber">{{ lineNumber }}</slot>
    </div>

    <div class="vis-code-line__content" role="cell">
      <code class="vis-code-line__code"><slot>{{ content }}</slot></code>
      <button
        v-if="commentable && interactive"
        class="vis-code-line__comment"
        type="button"
        :aria-label="`在${accessibleLabel}添加评论`"
        @click.stop="handleComment"
      >
        <Icon name="message-plus-square" :size="16" decorative />
      </button>
    </div>
  </div>
</template>

<style scoped>
.vis-code-line {
  display: flex;
  align-items: stretch;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 30px;
  color: var(--color-text-primary);
  background: transparent;
  box-sizing: border-box;
}

.vis-code-line.type-delete {
  background: var(--color-fg-danger-subtle);
}

.vis-code-line.type-add {
  background: var(--color-fg-success-subtle);
}

.vis-code-line.type-default:is(.is-interactive:hover, .is-hovered) {
  background: var(--color-bg-secondary);
}

.vis-code-line.type-delete:is(.is-interactive:hover, .is-hovered, .is-active) {
  background: var(--color-fg-danger-secondary);
}

.vis-code-line.type-add:is(.is-interactive:hover, .is-hovered, .is-active) {
  background: var(--color-fg-success-secondary);
}

.vis-code-line.type-default.is-active {
  background: var(--color-bg-tertiary);
}

.vis-code-line__number {
  display: flex;
  flex: 0 0 64px;
  align-items: center;
  justify-content: flex-end;
  inline-size: 64px;
  min-block-size: 30px;
  padding-inline: var(--space-16);
  overflow: hidden;
  box-sizing: border-box;
  color: var(--color-text-secondary);
  font-family: var(--font-family-text), sans-serif;
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-code-line.has-divider .vis-code-line__number {
  border-inline-end: 1px solid var(--color-border-default);
}

.vis-code-line.has-divider.type-default .vis-code-line__number {
  background: var(--color-bg-primary);
}

.vis-code-line.has-divider.type-delete .vis-code-line__number {
  border-inline-end-color: var(--color-border-danger-subtle);
}

.vis-code-line.has-divider.type-add .vis-code-line__number {
  border-inline-end-color: var(--color-border-success-subtle);
}

.vis-code-line__content {
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: flex-start;
  min-inline-size: 0;
  padding: var(--space-6) var(--space-16);
  box-sizing: border-box;
}

.vis-code-line__code {
  display: block;
  flex: 1 1 0;
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-code-sm-size);
  font-weight: 400;
  font-style: normal;
  line-height: var(--font-code-sm-line-height);
  text-overflow: ellipsis;
  white-space: pre;
  word-break: break-word;
}

.vis-code-line.is-wrapped .vis-code-line__code {
  overflow: visible;
  white-space: pre-wrap;
}

.vis-code-line__comment {
  position: absolute;
  z-index: 1;
  inset-block-start: 50%;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--space-24);
  block-size: var(--space-24);
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--color-fg-tertiary);
  background: var(--color-bg-surface);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
}

.vis-code-line:is(.is-interactive:hover, .is-hovered) .vis-code-line__comment,
.vis-code-line__comment:focus-visible {
  opacity: 1;
  pointer-events: auto;
}

.vis-code-line__comment:focus-visible {
  outline: 2px solid var(--color-border-brand);
  outline-offset: 1px;
}
</style>
