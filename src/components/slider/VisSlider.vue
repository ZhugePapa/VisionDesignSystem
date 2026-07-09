<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import type { VisSliderProps, VisSliderValue } from './slider.types'

const props = withDefaults(defineProps<VisSliderProps>(), {
  modelValue: 50,
  type: 'single',
  min: 0,
  max: 100,
  disabled: false,
  label: false,
  width: 240,
  step: 1,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisSliderValue): void
  (event: 'change', value: VisSliderValue): void
}>()

const railRef = ref<HTMLDivElement | null>(null)
const hoveredThumb = ref<0 | 1 | null>(null)
const draggingThumb = ref<0 | 1 | null>(null)
const trackWidthPx = ref(240)
let trackResizeObserver: ResizeObserver | null = null

const isRange = computed(() => props.type === 'range')
const minValue = computed(() => Math.min(props.min, props.max))
const maxValue = computed(() => Math.max(props.min, props.max))

function normalizeSize(value: number | string): string {
  if (typeof value === 'number') return `${value}px`

  const trimmed = value.trim()
  if (/^[\d.]+$/.test(trimmed)) return `${trimmed}px`
  return trimmed
}

const sliderVars = computed<Record<string, string>>(() => {
  const trackWidth = normalizeSize(props.width)

  return {
    '--vis-slider-track-width': trackWidth,
    '--vis-slider-root-width': trackWidth,
  }
})

function clamp(value: number): number {
  return Math.min(maxValue.value, Math.max(minValue.value, value))
}

function normalizeStep(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 1
}

function snapToStep(value: number): number {
  const step = normalizeStep(props.step)
  const offset = value - minValue.value
  const snapped = Math.round(offset / step) * step + minValue.value
  return clamp(snapped)
}

const values = computed(() => {
  if (!isRange.value) {
    const single = Array.isArray(props.modelValue)
      ? (props.modelValue[1] ?? props.modelValue[0] ?? minValue.value)
      : props.modelValue

    return {
      start: minValue.value,
      end: clamp(single),
    }
  }

  if (Array.isArray(props.modelValue)) {
    const start = clamp(props.modelValue[0] ?? minValue.value)
    const end = clamp(props.modelValue[1] ?? maxValue.value)
    return start <= end ? { start, end } : { start: end, end: start }
  }

  return {
    start: minValue.value,
    end: clamp(props.modelValue),
  }
})

const fillStyles = computed(() => {
  const range = maxValue.value - minValue.value
  const thumbWidth = 20
  const minFillWidth = thumbWidth + 4

  const toOffset = (value: number): number => {
    if (range <= 0) return 0
    const ratio = (clamp(value) - minValue.value) / range
    return ratio * trackWidthPx.value
  }

  const start = isRange.value ? toOffset(values.value.start) : 0
  const end = toOffset(values.value.end)
  const left = Math.max(Math.min(start, trackWidthPx.value), 0)
  const right = Math.max(Math.min(end, trackWidthPx.value), left)

  return {
    left: `${left}px`,
    width: `${Math.min(Math.max(right - left, minFillWidth), trackWidthPx.value - left)}px`,
  }
})

function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '')
}

function emitValue(start: number, end: number): void {
  const payload: VisSliderValue = isRange.value ? [start, end] : end
  emit('update:modelValue', payload)
  emit('change', payload)
}

function setThumbValue(index: 0 | 1, next: number): void {
  const snapped = snapToStep(next)

  if (!isRange.value) {
    emitValue(minValue.value, snapped)
    return
  }

  const currentStart = values.value.start
  const currentEnd = values.value.end

  if (index === 0) {
    emitValue(Math.min(snapped, currentEnd), currentEnd)
    return
  }

  emitValue(currentStart, Math.max(snapped, currentStart))
}

function clientXToValue(clientX: number): number {
  const rail = railRef.value
  if (!rail) return values.value.end

  const rect = rail.getBoundingClientRect()
  if (rect.width <= 0) return values.value.end

  const ratio = (clientX - rect.left) / rect.width
  return clamp(minValue.value + ratio * (maxValue.value - minValue.value))
}

function pickThumbIndex(clientX: number): 0 | 1 {
  if (!isRange.value) return 1

  const clicked = clientXToValue(clientX)
  const distanceStart = Math.abs(clicked - values.value.start)
  const distanceEnd = Math.abs(clicked - values.value.end)
  return distanceStart <= distanceEnd ? 0 : 1
}

function onTrackPointerDown(event: PointerEvent): void {
  if (props.disabled) return

  const target = event.target as HTMLElement
  if (target.closest('.vis-slider__thumb')) return

  const index = pickThumbIndex(event.clientX)
  draggingThumb.value = index
  setThumbValue(index, clientXToValue(event.clientX))
}

function onThumbPointerDown(index: 0 | 1, event: PointerEvent): void {
  if (props.disabled) return

  event.preventDefault()
  draggingThumb.value = index
}

function onWindowPointerMove(event: PointerEvent): void {
  if (draggingThumb.value === null) return
  setThumbValue(draggingThumb.value, clientXToValue(event.clientX))
}

function onWindowPointerUp(): void {
  draggingThumb.value = null
}

function showTooltip(index: 0 | 1): boolean {
  if (props.disabled || props.label) return false
  return hoveredThumb.value === index || draggingThumb.value === index
}

function thumbAriaValue(index: 0 | 1): number {
  return index === 0 ? values.value.start : values.value.end
}

onMounted(() => {
  const syncTrackWidth = () => {
    const width = railRef.value?.getBoundingClientRect().width
    if (width && Number.isFinite(width) && width > 0) {
      trackWidthPx.value = width
    }
  }

  syncTrackWidth()
  if (railRef.value) {
    trackResizeObserver = new ResizeObserver(() => syncTrackWidth())
    trackResizeObserver.observe(railRef.value)
  }

  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
})

onBeforeUnmount(() => {
  if (trackResizeObserver) {
    trackResizeObserver.disconnect()
    trackResizeObserver = null
  }
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
})
</script>

<template>
  <div
    class="vis-slider"
    :class="{
      'is-range': isRange,
      'is-disabled': disabled,
      'is-label': label,
    }"
    :style="sliderVars"
  >
    <div class="vis-slider__main">
      <div ref="railRef" class="vis-slider__track" @pointerdown="onTrackPointerDown">
        <div class="vis-slider__fill" :class="{ 'is-range': isRange }" :style="fillStyles">
          <button
            v-if="isRange"
            type="button"
            class="vis-slider__thumb vis-slider__thumb--start"
            :class="{ 'is-hover': showTooltip(0), 'is-pressing': draggingThumb === 0 }"
            :disabled="disabled"
            role="slider"
            :aria-valuemin="minValue"
            :aria-valuemax="values.end"
            :aria-valuenow="thumbAriaValue(0)"
            aria-label="调整最小值"
            @pointerdown.stop="onThumbPointerDown(0, $event)"
            @mouseenter="hoveredThumb = 0"
            @mouseleave="hoveredThumb = null"
          >
            <span class="vis-slider__thumb-core" />
            <span v-if="label" class="vis-slider__label">{{ formatNumber(values.start) }}</span>
            <span v-if="showTooltip(0)" class="vis-slider__tooltip">
              {{ formatNumber(values.start) }}
              <svg class="vis-slider__tooltip-arrow" viewBox="0 0 12 6" aria-hidden="true">
                <path
                  d="M7.41421 4.58579C6.63317 5.36683 5.36683 5.36684 4.58579 4.58579L0 0H12L7.41421 4.58579Z"
                />
              </svg>
            </span>
          </button>

          <button
            type="button"
            class="vis-slider__thumb vis-slider__thumb--end"
            :class="{ 'is-hover': showTooltip(1), 'is-pressing': draggingThumb === 1 }"
            :disabled="disabled"
            role="slider"
            :aria-valuemin="isRange ? values.start : minValue"
            :aria-valuemax="maxValue"
            :aria-valuenow="thumbAriaValue(1)"
            :aria-label="isRange ? '调整最大值' : '调整值'"
            @pointerdown.stop="onThumbPointerDown(1, $event)"
            @mouseenter="hoveredThumb = 1"
            @mouseleave="hoveredThumb = null"
          >
            <span class="vis-slider__thumb-core" />
            <span v-if="label" class="vis-slider__label">{{ formatNumber(values.end) }}</span>
            <span v-if="showTooltip(1)" class="vis-slider__tooltip">
              {{ formatNumber(values.end) }}
              <svg class="vis-slider__tooltip-arrow" viewBox="0 0 12 6" aria-hidden="true">
                <path
                  d="M7.41421 4.58579C6.63317 5.36683 5.36683 5.36684 4.58579 4.58579L0 0H12L7.41421 4.58579Z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-slider {
  inline-size: var(--vis-slider-root-width);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  overflow: visible;
}

.vis-slider.is-label {
  block-size: 42px;
}

.vis-slider__main {
  inline-size: 100%;
  display: inline-flex;
  align-items: center;
  gap: var(--space-16);
}

.vis-slider__track {
  position: relative;
  inline-size: var(--vis-slider-track-width);
  block-size: var(--space-20);
  border-radius: var(--radius-full);
  background: var(--color-bg-tertiary);
  overflow: visible;
}

.vis-slider__fill {
  position: absolute;
  inset-block-start: 0;
  block-size: 100%;
  box-sizing: border-box;
  border-radius: var(--radius-full);
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  background: var(--color-fg-brand-primary);
}

.vis-slider__fill.is-range {
  justify-content: space-between;
}

.vis-slider__thumb {
  position: relative;
  inline-size: var(--space-20);
  block-size: var(--space-16);
  padding: 0;
  margin: 0;
  border: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  background: transparent;
  cursor: pointer;
}

.vis-slider__thumb:disabled {
  cursor: not-allowed;
}

.vis-slider__thumb-core {
  inline-size: var(--space-20);
  block-size: var(--space-16);
  border-radius: var(--radius-full);
  background: var(--color-fg-white);
}

.vis-slider__label {
  position: absolute;
  inset-block-start: var(--space-20);
  inset-inline-start: 50%;
  transform: translateX(-50%);
  color: var(--color-text-primary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}

.vis-slider__thumb.is-pressing .vis-slider__thumb-core {
  inline-size: calc(var(--space-20) - 2px);
  block-size: calc(var(--space-16) - 2px);
}

.vis-slider__tooltip {
  position: absolute;
  inset-inline-start: 50%;
  inset-block-end: calc(100% + 10px);
  transform: translateX(-50%);
  min-inline-size: var(--space-32);
  box-sizing: border-box;
  border-radius: 6px;
  padding: var(--space-4) var(--space-8);
  background: var(--color-bg-inverse);
  color: var(--color-text-white);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
  box-shadow: var(--shadow-default-md);
  pointer-events: none;
}

.vis-slider__tooltip-arrow {
  position: absolute;
  inset-inline-start: 50%;
  inset-block-start: 100%;
  transform: translateX(-50%);
  inline-size: 12px;
  block-size: 6px;
  color: var(--color-bg-inverse);
}

.vis-slider__tooltip-arrow path {
  fill: currentColor;
}

.vis-slider.is-disabled {
  cursor: not-allowed;
}

.vis-slider.is-disabled .vis-slider__track {
  background: var(--color-bg-secondary);
}

.vis-slider.is-disabled .vis-slider__fill {
  background: var(--color-fg-brand-disabled);
}

.vis-slider.is-disabled .vis-slider__thumb {
  cursor: not-allowed;
}

.vis-slider.is-disabled .vis-slider__label {
  color: var(--color-text-disabled);
}

.vis-slider__thumb:focus-visible {
  outline: 2px solid var(--color-border-brand);
  outline-offset: 2px;
}
</style>
