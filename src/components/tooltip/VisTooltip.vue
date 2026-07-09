<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import type { VisTooltipProps } from './tooltip.types'

defineOptions({
  name: 'VisTooltip',
})

const props = withDefaults(defineProps<VisTooltipProps>(), {
  content: 'Tooltip',
  modelValue: undefined,
  position: 'top',
  trigger: 'hover',
  disabled: false,
  arrow: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
}>()

const tooltipId = useId()
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => !props.disabled && (isControlled.value ? Boolean(props.modelValue) : internalOpen.value))

function setOpen(value: boolean): void {
  if (props.disabled || props.trigger === 'manual') return

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
</script>

<template>
  <span
    class="vis-tooltip"
    :class="[`position-${position}`, { 'is-open': isOpen, 'is-disabled': disabled }]"
    @mouseenter="onPointerEnter"
    @mouseleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
  >
    <span class="vis-tooltip__trigger" :aria-describedby="isOpen ? tooltipId : undefined">
      <slot />
    </span>

    <Transition name="vis-tooltip-fade">
      <span v-if="isOpen" :id="tooltipId" class="vis-tooltip__popup" role="tooltip" aria-live="polite">
        <span class="vis-tooltip__bubble">
          <slot name="content">{{ content }}</slot>
        </span>
        <span v-if="arrow" class="vis-tooltip__arrow" aria-hidden="true">
          <svg
            class="vis-tooltip__arrow-icon"
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
.vis-tooltip {
  --vis-tooltip-offset: var(--space-4);

  position: relative;
  box-sizing: border-box;
  inline-size: max-content;
  display: inline-flex;
  vertical-align: middle;
  font-family: var(--font-family-sans);
}

.vis-tooltip__trigger {
  min-inline-size: 0;
  display: inline-flex;
}

.vis-tooltip__popup {
  position: absolute;
  z-index: 40;
  box-sizing: border-box;
  inline-size: max-content;
  max-inline-size: min(280px, calc(100vw - var(--space-32)));
  display: inline-flex;
  pointer-events: none;
  filter: drop-shadow(0 8px 10px var(--color-effect-shadow-grey)) drop-shadow(0 0 1.5px var(--color-effect-shadow-grey));
}

.vis-tooltip__bubble {
  box-sizing: border-box;
  min-block-size: 30px;
  border-radius: var(--radius-sm);
  padding: var(--space-4) var(--space-8);
  display: inline-flex;
  align-items: center;
  color: var(--color-text-white);
  background: var(--color-bg-inverse);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  white-space: nowrap;
}

.vis-tooltip__arrow {
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 6px;
  flex: 0 0 6px;
  display: flex;
  justify-content: center;
  color: var(--color-bg-inverse);
}

.vis-tooltip__arrow-icon {
  inline-size: 12px;
  block-size: 6px;
  display: block;
  flex: 0 0 auto;
}

.vis-tooltip.position-top .vis-tooltip__popup,
.vis-tooltip.position-tl .vis-tooltip__popup,
.vis-tooltip.position-tr .vis-tooltip__popup {
  inset-block-end: calc(100% + var(--vis-tooltip-offset));
  flex-direction: column;
}

.vis-tooltip.position-top .vis-tooltip__popup {
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.vis-tooltip.position-tl .vis-tooltip__popup {
  inset-inline-start: 0;
}

.vis-tooltip.position-tr .vis-tooltip__popup {
  inset-inline-end: 0;
}

.vis-tooltip.position-bottom .vis-tooltip__popup {
  inset-block-start: calc(100% + var(--vis-tooltip-offset));
  inset-inline-start: 50%;
  flex-direction: column-reverse;
  transform: translateX(-50%);
}

.vis-tooltip.position-left .vis-tooltip__popup {
  inset-block-start: 50%;
  inset-inline-end: calc(100% + var(--vis-tooltip-offset));
  align-items: center;
  transform: translateY(-50%);
}

.vis-tooltip.position-right .vis-tooltip__popup {
  inset-block-start: 50%;
  inset-inline-start: calc(100% + var(--vis-tooltip-offset));
  align-items: center;
  flex-direction: row-reverse;
  transform: translateY(-50%);
}

.vis-tooltip.position-top .vis-tooltip__arrow,
.vis-tooltip.position-tl .vis-tooltip__arrow,
.vis-tooltip.position-tr .vis-tooltip__arrow {
  padding-inline: var(--space-8);
}

.vis-tooltip.position-bottom .vis-tooltip__arrow {
  align-items: flex-end;
  padding-inline: var(--space-16);
}

.vis-tooltip.position-bottom .vis-tooltip__arrow-icon {
  transform: rotate(180deg);
}

.vis-tooltip.position-tl .vis-tooltip__arrow {
  justify-content: flex-start;
}

.vis-tooltip.position-tr .vis-tooltip__arrow {
  justify-content: flex-end;
}

.vis-tooltip.position-left .vis-tooltip__arrow,
.vis-tooltip.position-right .vis-tooltip__arrow {
  inline-size: 6px;
  block-size: auto;
  align-self: stretch;
  flex: 0 0 6px;
  align-items: center;
  padding-block: var(--space-8);
}

.vis-tooltip.position-left .vis-tooltip__arrow-icon,
.vis-tooltip.position-right .vis-tooltip__arrow-icon {
  position: absolute;
  inset-inline-start: 50%;
  inset-block-start: 50%;
}

.vis-tooltip.position-left .vis-tooltip__arrow-icon {
  transform: translate(-50%, -50%) rotate(-90deg);
}

.vis-tooltip.position-right .vis-tooltip__arrow-icon {
  transform: translate(-50%, -50%) rotate(90deg);
}

.vis-tooltip.is-disabled {
  pointer-events: none;
}

.vis-tooltip-fade-enter-active,
.vis-tooltip-fade-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.vis-tooltip-fade-enter-from,
.vis-tooltip-fade-leave-to {
  opacity: 0;
}

.vis-tooltip.position-top .vis-tooltip-fade-enter-from,
.vis-tooltip.position-top .vis-tooltip-fade-leave-to {
  transform: translateX(-50%) translateY(2px);
}

.vis-tooltip.position-tl .vis-tooltip-fade-enter-from,
.vis-tooltip.position-tl .vis-tooltip-fade-leave-to,
.vis-tooltip.position-tr .vis-tooltip-fade-enter-from,
.vis-tooltip.position-tr .vis-tooltip-fade-leave-to {
  transform: translateY(2px);
}

.vis-tooltip.position-bottom .vis-tooltip-fade-enter-from,
.vis-tooltip.position-bottom .vis-tooltip-fade-leave-to {
  transform: translateX(-50%) translateY(-2px);
}

.vis-tooltip.position-left .vis-tooltip-fade-enter-from,
.vis-tooltip.position-left .vis-tooltip-fade-leave-to {
  transform: translateY(-50%) translateX(2px);
}

.vis-tooltip.position-right .vis-tooltip-fade-enter-from,
.vis-tooltip.position-right .vis-tooltip-fade-leave-to {
  transform: translateY(-50%) translateX(-2px);
}
</style>
