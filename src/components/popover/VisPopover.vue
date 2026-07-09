<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import VisButton from '../button/VisButton.vue'
import { VisFeaturedIcon } from '../featured-icon'
import type { IconName } from '../icons/generated/registry.generated'
import type { VisPopoverPosition, VisPopoverTrigger } from './popover.types'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    position?: VisPopoverPosition
    trigger?: VisPopoverTrigger
    disabled?: boolean
    arrow?: boolean
    title?: string
    content?: string
    showTitle?: boolean
    icon?: boolean
    iconName?: IconName
    actions?: boolean
    closeButton?: boolean
    cancelText?: string
    confirmText?: string
    width?: number | string
  }>(),
  {
    modelValue: undefined,
    position: 'top',
    trigger: 'click',
    disabled: false,
    arrow: true,
    title: 'Header',
    content: 'Popover content',
    showTitle: true,
    icon: false,
    iconName: 'info',
    actions: false,
    closeButton: false,
    cancelText: '取消',
    confirmText: '确认',
    width: 256,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'cancel'): void
  (event: 'confirm'): void
  (event: 'close'): void
}>()

const popoverId = useId()
const rootRef = ref<HTMLElement | null>(null)
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => !props.disabled && (isControlled.value ? Boolean(props.modelValue) : internalOpen.value))
const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
const rootStyle = computed(() => ({
  '--vis-popover-width': resolvedWidth.value,
}))

function setOpen(value: boolean, force = false): void {
  if (props.disabled || (!force && props.trigger === 'manual')) return

  if (!isControlled.value) {
    internalOpen.value = value
  }

  emit('update:modelValue', value)
  if (value) emit('show')
  else emit('hide')
}

function onPointerEnter(): void {
  if (props.trigger === 'hover') setOpen(true)
}

function onPointerLeave(): void {
  if (props.trigger === 'hover') setOpen(false)
}

function onFocusIn(): void {
  if (props.trigger === 'hover' || props.trigger === 'focus') setOpen(true)
}

function onFocusOut(): void {
  if (props.trigger === 'hover' || props.trigger === 'focus') setOpen(false)
}

function onClick(): void {
  if (props.trigger === 'click') setOpen(!isOpen.value)
}

function onCancel(): void {
  emit('cancel')
  if (props.trigger !== 'manual') setOpen(false)
}

function onConfirm(): void {
  emit('confirm')
  if (props.trigger !== 'manual') setOpen(false)
}

function onClose(): void {
  emit('close')
  setOpen(false, true)
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!isOpen.value || props.trigger !== 'click') return
  const rootElement = rootRef.value
  if (!rootElement || !(event.target instanceof Node)) return
  if (rootElement.contains(event.target)) return
  setOpen(false)
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && isOpen.value) setOpen(false)
  },
)

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <span
    ref="rootRef"
    class="vis-popover"
    :class="[`position-${position}`, { 'is-open': isOpen, 'is-disabled': disabled }]"
    :style="rootStyle"
    @mouseenter="onPointerEnter"
    @mouseleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <span
      class="vis-popover__trigger"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="isOpen ? popoverId : undefined"
      @click="onClick"
    >
      <slot />
    </span>

    <Transition name="vis-popover-fade">
      <span
        v-if="isOpen"
        :id="popoverId"
        class="vis-popover__popup"
        role="dialog"
      >
        <span class="vis-popover__panel">
          <span class="vis-popover__main">
            <VisFeaturedIcon
              v-if="icon"
              class="vis-popover__featured-icon"
              size="xs"
              color="brand"
              type="light-round"
              :icon="iconName"
              decorative
            />
            <span class="vis-popover__content-stack">
              <span v-if="showTitle" class="vis-popover__title">
                <slot name="title">{{ title }}</slot>
              </span>
              <span class="vis-popover__content">
                <slot name="content">{{ content }}</slot>
              </span>
            </span>
          </span>

          <span v-if="actions" class="vis-popover__actions">
            <slot name="actions" :cancel="onCancel" :confirm="onConfirm">
              <VisButton variant="secondary" size="md" @click.stop="onCancel">{{ cancelText }}</VisButton>
              <VisButton variant="primary" size="md" @click.stop="onConfirm">{{ confirmText }}</VisButton>
            </slot>
          </span>

          <VisButton
            v-if="closeButton"
            class="vis-popover__close"
            variant="text"
            size="sm"
            icon-only
            icon-name="x-close"
            label="关闭气泡框"
            @click.stop="onClose"
          />
        </span>

        <span v-if="arrow" class="vis-popover__arrow" aria-hidden="true">
          <svg
            class="vis-popover__arrow-icon"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.41421 4.58579C6.63317 5.36683 5.36683 5.36684 4.58579 4.58579L-6.57417e-07 3.69565e-07L12 6.07967e-07L7.41421 4.58579Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.vis-popover {
  --vis-popover-offset: var(--space-4);
  --vis-popover-arrow-size: 6px;

  position: relative;
  box-sizing: border-box;
  inline-size: max-content;
  display: inline-flex;
  font-family: var(--font-family-sans);
  vertical-align: middle;
}

.vis-popover__trigger {
  min-inline-size: 0;
  display: inline-flex;
}

.vis-popover__popup {
  position: absolute;
  z-index: 45;
  box-sizing: border-box;
  inline-size: var(--vis-popover-width);
  display: inline-flex;
  pointer-events: auto;
  filter:
    drop-shadow(0 8px 10px var(--color-effect-shadow-grey))
    drop-shadow(0 0 1.5px var(--color-effect-shadow-grey));
}

.vis-popover__panel {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: var(--space-32);
  border-radius: var(--radius-sm);
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-16);
  color: var(--color-text-primary);
  background: var(--color-component-popover-bg);
}

.vis-popover__main {
  min-inline-size: 0;
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
}

.vis-popover__featured-icon {
  flex: 0 0 auto;
}

.vis-popover__content-stack {
  min-inline-size: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

.vis-popover__title {
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  white-space: nowrap;
}

.vis-popover__content {
  inline-size: 100%;
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-popover__actions {
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-8);
}

.vis-popover__close {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-end: 14px;
}

.vis-popover__arrow {
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--vis-popover-arrow-size);
  flex: 0 0 var(--vis-popover-arrow-size);
  display: flex;
  justify-content: center;
  color: var(--color-component-popover-bg);
}

.vis-popover__arrow-icon {
  inline-size: 12px;
  block-size: var(--vis-popover-arrow-size);
  display: block;
  flex: 0 0 auto;
}

.vis-popover.position-top .vis-popover__popup,
.vis-popover.position-tl .vis-popover__popup,
.vis-popover.position-tr .vis-popover__popup {
  inset-block-end: calc(100% + var(--vis-popover-offset));
  flex-direction: column;
}

.vis-popover.position-top .vis-popover__popup {
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.vis-popover.position-tl .vis-popover__popup {
  inset-inline-start: 0;
}

.vis-popover.position-tr .vis-popover__popup {
  inset-inline-end: 0;
}

.vis-popover.position-bottom .vis-popover__popup {
  inset-block-start: calc(100% + var(--vis-popover-offset));
  inset-inline-start: 50%;
  flex-direction: column-reverse;
  transform: translateX(-50%);
}

.vis-popover.position-left .vis-popover__popup {
  inset-block-start: 50%;
  inset-inline-end: calc(100% + var(--vis-popover-offset));
  align-items: center;
  flex-direction: row;
  transform: translateY(-50%);
}

.vis-popover.position-right .vis-popover__popup {
  inset-block-start: 50%;
  inset-inline-start: calc(100% + var(--vis-popover-offset));
  align-items: center;
  flex-direction: row-reverse;
  transform: translateY(-50%);
}

.vis-popover.position-left .vis-popover__panel,
.vis-popover.position-right .vis-popover__panel {
  flex: 1 1 auto;
}

.vis-popover.position-top .vis-popover__arrow,
.vis-popover.position-tl .vis-popover__arrow,
.vis-popover.position-tr .vis-popover__arrow,
.vis-popover.position-bottom .vis-popover__arrow {
  padding-inline: var(--space-16);
}

.vis-popover.position-bottom .vis-popover__arrow {
  align-items: flex-end;
}

.vis-popover.position-tl .vis-popover__arrow {
  justify-content: flex-end;
}

.vis-popover.position-tr .vis-popover__arrow {
  justify-content: flex-start;
}

.vis-popover.position-bottom .vis-popover__arrow-icon {
  transform: rotate(180deg);
}

.vis-popover.position-left .vis-popover__arrow,
.vis-popover.position-right .vis-popover__arrow {
  inline-size: var(--vis-popover-arrow-size);
  block-size: auto;
  align-self: stretch;
  flex: 0 0 var(--vis-popover-arrow-size);
  align-items: center;
  padding-block: var(--space-16);
}

.vis-popover.position-left .vis-popover__arrow-icon,
.vis-popover.position-right .vis-popover__arrow-icon {
  position: absolute;
  inset-inline-start: 50%;
  inset-block-start: 50%;
}

.vis-popover.position-left .vis-popover__arrow-icon {
  transform: translate(-50%, -50%) rotate(-90deg);
}

.vis-popover.position-right .vis-popover__arrow-icon {
  transform: translate(-50%, -50%) rotate(90deg);
}

.vis-popover.is-disabled {
  pointer-events: none;
}

.vis-popover-fade-enter-active,
.vis-popover-fade-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.vis-popover-fade-enter-from,
.vis-popover-fade-leave-to {
  opacity: 0;
}

.vis-popover.position-top .vis-popover-fade-enter-from,
.vis-popover.position-top .vis-popover-fade-leave-to {
  transform: translateX(-50%) translateY(2px);
}

.vis-popover.position-tl .vis-popover-fade-enter-from,
.vis-popover.position-tl .vis-popover-fade-leave-to,
.vis-popover.position-tr .vis-popover-fade-enter-from,
.vis-popover.position-tr .vis-popover-fade-leave-to {
  transform: translateY(2px);
}

.vis-popover.position-bottom .vis-popover-fade-enter-from,
.vis-popover.position-bottom .vis-popover-fade-leave-to {
  transform: translateX(-50%) translateY(-2px);
}

.vis-popover.position-left .vis-popover-fade-enter-from,
.vis-popover.position-left .vis-popover-fade-leave-to {
  transform: translateY(-50%) translateX(2px);
}

.vis-popover.position-right .vis-popover-fade-enter-from,
.vis-popover.position-right .vis-popover-fade-leave-to {
  transform: translateY(-50%) translateX(-2px);
}
</style>
