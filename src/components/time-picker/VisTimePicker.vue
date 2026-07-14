<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'

import VisButton from '../button/VisButton.vue'
import VisDivider from '../divider/VisDivider.vue'
import { Icon } from '../icons'
import type {
  VisTimePickerProps,
  VisTimePickerValue,
} from './time-picker.types'

type TimePart = 'hour' | 'minute' | 'second'
type RangePart = 'start' | 'end'
type ScrollBehavior = 'auto' | 'smooth'
type TimeColumnKey = `${RangePart}-${TimePart}`

interface TimeOptionGroup {
  key: TimePart
}

interface TimeColumnItem {
  id: number
  value: string
}

interface ShortcutOption {
  label: string
  value: string
}

interface TimeColumnScrollAnimation {
  frame: number
  startTime: number
  startTop: number
  targetTop: number
  duration: number
}

const props = withDefaults(
  defineProps<VisTimePickerProps>(),
  {
    modelValue: null,
    range: false,
    type: 'HH MM SS',
    timeSelect: false,
    state: 'default',
    disabled: false,
    readView: false,
    placeholder: '请选择时间',
    startPlaceholder: '选择开始时间',
    endPlaceholder: '选择结束时间',
    open: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisTimePickerValue): void
  (event: 'update:open', value: boolean): void
  (event: 'change', value: VisTimePickerValue): void
  (event: 'clear'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const isHovering = ref(false)
const isFocused = ref(false)
const internalOpen = ref(false)
const activeRangePart = ref<RangePart>('start')
const draftSingle = ref('00:00:00')
const draftRange = ref<[string, string]>(['00:00:00', '00:00:00'])
const timeColumnRefs = ref<HTMLElement[]>([])
const timeColumnItems = ref<Partial<Record<TimeColumnKey, TimeColumnItem[]>>>({})
const timeColumnOrigins = ref<Partial<Record<TimeColumnKey, number>>>({})

const timeItemStep = 40
const timeItemHeight = 32
const timeColumnLoadBatch = 50
const timeColumnEdgeThreshold = 12
const timeColumnWheelStep = 1
const timeColumnAnimationDuration = 120
const timeColumnScrollAnimations = new Map<HTMLElement, TimeColumnScrollAnimation>()

const hourOptions = Array.from({ length: 24 }, (_, index) => formatUnit(index))
const minuteOptions = Array.from({ length: 60 }, (_, index) => formatUnit(index))
const secondOptions = minuteOptions

const timeParts = computed<TimeOptionGroup[]>(() => {
  const groups: TimeOptionGroup[] = [
    { key: 'hour' },
    { key: 'minute' },
  ]

  if (props.type === 'HH MM SS') groups.push({ key: 'second' })
  return groups
})

const panelOpen = computed(() => {
  if (props.disabled) return false
  if (props.open !== undefined) return props.open
  return internalOpen.value
})

const hasSeconds = computed(() => props.type === 'HH MM SS')
const panelWidth = computed(() => {
  if (!props.range) return '240px'
  return hasSeconds.value ? '400px' : '360px'
})
const controlWidth = panelWidth
const panelHeight = computed(() => {
  if (props.timeSelect) return '240px'
  if (props.range) return '412px'
  return '396px'
})

const selectedSingle = computed(() => {
  if (props.range || typeof props.modelValue !== 'string') return null
  return normalizeTime(props.modelValue)
})

const selectedRange = computed<[string, string] | null>(() => {
  if (!props.range || !Array.isArray(props.modelValue)) return null
  const start = normalizeTime(props.modelValue[0])
  const end = normalizeTime(props.modelValue[1])
  if (!start || !end) return null
  return [start, end]
})

const hasSelection = computed(() => (props.range ? Boolean(selectedRange.value) : Boolean(selectedSingle.value)))
const visualState = computed<'default' | 'hover' | 'focus' | 'danger' | 'disabled'>(() => {
  if (props.disabled) return 'disabled'
  if (props.state === 'danger') return 'danger'
  if (props.state === 'focus' || isFocused.value || panelOpen.value) return 'focus'
  if (props.state === 'hover' || isHovering.value) return 'hover'
  return 'default'
})

const showClear = computed(() => {
  if (props.disabled || !hasSelection.value) return false
  return visualState.value === 'hover' || visualState.value === 'focus' || visualState.value === 'danger'
})

const controlClasses = computed(() => ({
  'is-range': props.range,
  'is-read-view': props.readView,
  'is-disabled': props.disabled,
  'is-selected': hasSelection.value,
  'is-state-default': visualState.value === 'default',
  'is-state-hover': visualState.value === 'hover',
  'is-state-focus': visualState.value === 'focus',
  'is-state-danger': visualState.value === 'danger',
}))

const singleDisplayText = computed(() => {
  if (selectedSingle.value) return displayTime(selectedSingle.value)
  if (props.readView) return '-'
  return props.placeholder
})

const rangeDisplayStartText = computed(() => {
  if (selectedRange.value) return displayTime(selectedRange.value[0])
  if (props.readView) return '-'
  return props.startPlaceholder
})

const rangeDisplayEndText = computed(() => {
  if (selectedRange.value) return displayTime(selectedRange.value[1])
  if (props.readView) return ''
  return props.endPlaceholder
})

const shortcutOptions = computed<ShortcutOption[]>(() => {
  const suffix = hasSeconds.value ? ':00' : ''
  return Array.from({ length: 24 }, (_, hour) => {
    const value = `${formatUnit(hour)}:00:00`
    const period = hour < 12 ? '上午' : hour === 12 ? '中午' : hour < 18 ? '下午' : '晚上'
    return {
      label: `${period}  ${formatUnit(hour)}:00${suffix}`,
      value,
    }
  })
})

watch(
  () => [props.modelValue, props.range, props.type] as const,
  () => {
    syncDraftFromValue()
    resetTimeColumnData()
    if (panelOpen.value) void nextTick(() => centerAllColumns('auto'))
  },
  { immediate: true },
)

watch(panelOpen, (open) => {
  if (!open) return
  syncDraftFromValue()
  void nextTick(() => centerAllColumns('auto'))
})

function formatUnit(value: number): string {
  return `${value}`.padStart(2, '0')
}

function normalizeTime(value: string | null | undefined): string | null {
  if (!value) return null
  const match = value.trim().match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/)
  if (!match) return null

  const hour = Number.parseInt(match[1], 10)
  const minute = Number.parseInt(match[2], 10)
  const second = match[3] === undefined ? 0 : Number.parseInt(match[3], 10)
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return null
  return `${formatUnit(hour)}:${formatUnit(minute)}:${formatUnit(second)}`
}

function displayTime(value: string): string {
  return hasSeconds.value ? value : value.slice(0, 5)
}

function nowTime(): string {
  const now = new Date()
  return `${formatUnit(now.getHours())}:${formatUnit(now.getMinutes())}:${formatUnit(now.getSeconds())}`
}

function syncDraftFromValue(): void {
  if (props.range) {
    draftRange.value = selectedRange.value ?? [nowTime(), nowTime()]
    return
  }

  draftSingle.value = selectedSingle.value ?? nowTime()
}

function resetTimeColumnData(): void {
  timeColumnItems.value = {}
  timeColumnOrigins.value = {}
}

function setOpen(nextOpen: boolean): void {
  if (props.disabled) return
  if (props.open === undefined) internalOpen.value = nextOpen
  emit('update:open', nextOpen)
}

function onControlClick(): void {
  if (props.disabled) return
  setOpen(!panelOpen.value)
}

function onControlFocus(): void {
  if (props.disabled) return
  isFocused.value = true
}

function onControlBlur(): void {
  isFocused.value = false
}

function onPointerEnter(): void {
  if (props.disabled) return
  isHovering.value = true
}

function onPointerLeave(): void {
  isHovering.value = false
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!panelOpen.value) return
  const root = rootRef.value
  if (!root || root.contains(event.target as Node)) return
  setOpen(false)
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') setOpen(false)
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
  for (const animation of timeColumnScrollAnimations.values()) {
    cancelAnimationFrame(animation.frame)
  }
  timeColumnScrollAnimations.clear()
})

onBeforeUpdate(() => {
  timeColumnRefs.value = []
})

function getPartValue(value: string, part: TimePart): string {
  const [hour, minute, second] = value.split(':')
  if (part === 'hour') return hour
  if (part === 'minute') return minute
  return second
}

function setPartValue(value: string, part: TimePart, nextPartValue: string): string {
  const pieces = value.split(':')
  const index = part === 'hour' ? 0 : part === 'minute' ? 1 : 2
  pieces[index] = nextPartValue
  return pieces.join(':')
}

function currentDraftValue(part?: RangePart): string {
  if (!props.range) return draftSingle.value
  return part === 'end' ? draftRange.value[1] : draftRange.value[0]
}

function setCurrentDraftValue(nextValue: string, part?: RangePart): void {
  if (!props.range) {
    draftSingle.value = nextValue
    return
  }

  const nextRange: [string, string] = [...draftRange.value]
  nextRange[part === 'end' ? 1 : 0] = nextValue
  draftRange.value = nextRange
}

function selectTimePart(part: TimePart, value: string, rangePart?: RangePart, itemId?: number): void {
  const targetPart = rangePart ?? activeRangePart.value
  const nextValue = setPartValue(currentDraftValue(targetPart), part, value)
  setCurrentDraftValue(nextValue, targetPart)
  void nextTick(() => {
    if (itemId !== undefined) {
      centerColumnItem(targetPart, part, itemId, 'smooth')
      return
    }

    centerColumnSelection(targetPart, part, 'smooth')
  })
}

function selectShortcut(value: string): void {
  if (props.range) {
    setCurrentDraftValue(value, activeRangePart.value)
    return
  }

  draftSingle.value = value
  emitValue(displayTime(value))
  setOpen(false)
}

function emitValue(value: VisTimePickerValue): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function confirmSelection(): void {
  if (props.range) {
    emitValue([displayTime(draftRange.value[0]), displayTime(draftRange.value[1])])
  } else {
    emitValue(displayTime(draftSingle.value))
  }

  setOpen(false)
}

function selectNow(): void {
  const value = nowTime()
  if (props.range) setCurrentDraftValue(value, activeRangePart.value)
  else draftSingle.value = value
  void nextTick(() => centerAllColumns('smooth'))
}

function onClear(event: MouseEvent): void {
  event.stopPropagation()
  emitValue(null)
  emit('clear')
}

function setActiveRangePart(part: RangePart, event?: MouseEvent): void {
  event?.stopPropagation()
  activeRangePart.value = part
  if (!panelOpen.value) setOpen(true)
}

function setTimeColumnRef(element: Element | ComponentPublicInstance | null): void {
  if (element instanceof HTMLElement) timeColumnRefs.value.push(element)
}

function timeColumnKey(rangePart: RangePart, part: TimePart): TimeColumnKey {
  return `${rangePart}-${part}`
}

function normalizeOptionIndex(index: number, part: TimePart): number {
  const count = optionCount(part)
  return ((index % count) + count) % count
}

function buildTimeColumnItems(origin: number, count: number, part: TimePart): TimeColumnItem[] {
  return Array.from({ length: count }, (_, offset) => {
    const rawIndex = origin + offset
    return {
      id: rawIndex,
      value: formatUnit(normalizeOptionIndex(rawIndex, part)),
    }
  })
}

function ensureTimeColumnData(rangePart: RangePart, part: TimePart): TimeColumnItem[] {
  const key = timeColumnKey(rangePart, part)
  const existingItems = timeColumnItems.value[key]
  if (existingItems?.length) return existingItems

  const selectedIndex = Number.parseInt(getPartValue(currentDraftValue(rangePart), part), 10)
  const origin = selectedIndex - timeColumnLoadBatch
  const items = buildTimeColumnItems(origin, timeColumnLoadBatch * 2 + 1, part)
  timeColumnOrigins.value = {
    ...timeColumnOrigins.value,
    [key]: origin,
  }
  timeColumnItems.value = {
    ...timeColumnItems.value,
    [key]: items,
  }
  return items
}

function getTimeColumnItems(rangePart: RangePart, part: TimePart): TimeColumnItem[] {
  return ensureTimeColumnData(rangePart, part)
}

function findTimeColumn(rangePart: RangePart, part: TimePart): HTMLElement | undefined {
  return timeColumnRefs.value.find((column) => column.dataset.rangePart === rangePart && column.dataset.timePart === part)
}

function optionCount(part: TimePart): number {
  return part === 'hour' ? hourOptions.length : minuteOptions.length
}

function updateColumnEdgePadding(column: HTMLElement): void {
  const edgePadding = Math.max(0, (column.clientHeight - timeItemHeight) / 2)
  column.style.setProperty('--vis-time-column-edge-padding', `${edgePadding}px`)
}

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3)
}

function stopColumnScrollAnimation(column: HTMLElement): void {
  const animation = timeColumnScrollAnimations.get(column)
  if (!animation) return
  cancelAnimationFrame(animation.frame)
  timeColumnScrollAnimations.delete(column)
}

function animateColumnToTop(column: HTMLElement, targetTop: number): void {
  stopColumnScrollAnimation(column)

  const startTop = column.scrollTop
  if (Math.abs(startTop - targetTop) < 1) {
    column.scrollTop = targetTop
    return
  }

  const animation: TimeColumnScrollAnimation = {
    frame: 0,
    startTime: performance.now(),
    startTop,
    targetTop,
    duration: timeColumnAnimationDuration,
  }

  const tick = (time: number) => {
    const progress = Math.min((time - animation.startTime) / animation.duration, 1)
    const eased = easeOutCubic(progress)
    column.scrollTop = animation.startTop + (animation.targetTop - animation.startTop) * eased

    if (progress < 1) {
      animation.frame = requestAnimationFrame(tick)
      return
    }

    column.scrollTop = animation.targetTop
    timeColumnScrollAnimations.delete(column)
  }

  animation.frame = requestAnimationFrame(tick)
  timeColumnScrollAnimations.set(column, animation)
}

function scrollColumnToIndex(column: HTMLElement, index: number, behavior: ScrollBehavior): void {
  updateColumnEdgePadding(column)
  const targetTop = index * timeItemStep
  if (behavior === 'smooth') {
    animateColumnToTop(column, targetTop)
    return
  }

  stopColumnScrollAnimation(column)
  column.scrollTop = targetTop
}

function centerColumnSelection(rangePart: RangePart, part: TimePart, behavior: ScrollBehavior): void {
  const column = findTimeColumn(rangePart, part)
  if (!column) return
  const items = ensureTimeColumnData(rangePart, part)
  const selectedValue = getPartValue(currentDraftValue(rangePart), part)
  const middleIndex = Math.floor(items.length / 2)
  let targetIndex = items.findIndex((item, index) => item.value === selectedValue && index >= middleIndex)
  if (targetIndex < 0) targetIndex = items.findIndex((item) => item.value === selectedValue)
  if (targetIndex < 0) return
  scrollColumnToIndex(column, targetIndex, behavior)
}

function centerColumnItem(rangePart: RangePart, part: TimePart, itemId: number, behavior: ScrollBehavior): void {
  const column = findTimeColumn(rangePart, part)
  if (!column) return
  const items = ensureTimeColumnData(rangePart, part)
  const targetIndex = items.findIndex((item) => item.id === itemId)
  if (targetIndex < 0) return
  scrollColumnToIndex(column, targetIndex, behavior)
}

function centerAllColumns(behavior: ScrollBehavior): void {
  const rangeParts: RangePart[] = props.range ? ['start', 'end'] : ['start']
  for (const rangePart of rangeParts) {
    for (const group of timeParts.value) {
      centerColumnSelection(rangePart, group.key, behavior)
    }
  }
}

function ensureColumnScrollBuffer(column: HTMLElement, rangePart: RangePart, part: TimePart): void {
  const key = timeColumnKey(rangePart, part)
  const items = ensureTimeColumnData(rangePart, part)
  const index = Math.round(column.scrollTop / timeItemStep)

  if (index <= timeColumnEdgeThreshold) {
    stopColumnScrollAnimation(column)
    const origin = timeColumnOrigins.value[key] ?? 0
    const nextOrigin = origin - timeColumnLoadBatch
    const nextItems = [
      ...buildTimeColumnItems(nextOrigin, timeColumnLoadBatch, part),
      ...items,
    ]

    timeColumnOrigins.value = {
      ...timeColumnOrigins.value,
      [key]: nextOrigin,
    }
    timeColumnItems.value = {
      ...timeColumnItems.value,
      [key]: nextItems,
    }

    void nextTick(() => {
      column.scrollTop += timeColumnLoadBatch * timeItemStep
    })
    return
  }

  if (items.length - index <= timeColumnEdgeThreshold + 1) {
    const origin = timeColumnOrigins.value[key] ?? 0
    timeColumnItems.value = {
      ...timeColumnItems.value,
      [key]: [
        ...items,
        ...buildTimeColumnItems(origin + items.length, timeColumnLoadBatch, part),
      ],
    }
  }
}

function syncPartFromColumnScroll(column: HTMLElement, rangePart: RangePart, part: TimePart): void {
  updateColumnEdgePadding(column)
  const items = ensureTimeColumnData(rangePart, part)
  const index = Math.min(Math.max(Math.round(column.scrollTop / timeItemStep), 0), items.length - 1)
  const nextValue = items[index]?.value
  if (!nextValue) return

  if (getPartValue(currentDraftValue(rangePart), part) === nextValue) return
  setCurrentDraftValue(setPartValue(currentDraftValue(rangePart), part, nextValue), rangePart)
}

function onTimeColumnWheel(event: WheelEvent, part: TimePart, rangePart: RangePart): void {
  event.preventDefault()
  event.stopPropagation()

  const column = event.currentTarget as HTMLElement
  ensureColumnScrollBuffer(column, rangePart, part)
  const items = ensureTimeColumnData(rangePart, part)
  const animation = timeColumnScrollAnimations.get(column)
  const baseTop = animation?.targetTop ?? column.scrollTop
  const currentIndex = Math.min(Math.max(Math.round(baseTop / timeItemStep), 0), items.length - 1)
  const direction = event.deltaY > 0 ? 1 : -1
  const nextIndex = Math.min(Math.max(currentIndex + direction * timeColumnWheelStep, 0), items.length - 1)
  const nextValue = items[nextIndex]?.value
  if (!nextValue) return

  scrollColumnToIndex(column, nextIndex, 'smooth')
  setCurrentDraftValue(setPartValue(currentDraftValue(rangePart), part, nextValue), rangePart)
  ensureColumnScrollBuffer(column, rangePart, part)
}

function onTimeColumnScroll(event: Event, part: TimePart, rangePart: RangePart): void {
  const column = event.currentTarget as HTMLElement
  syncPartFromColumnScroll(column, rangePart, part)
  ensureColumnScrollBuffer(column, rangePart, part)
}

function onPanelWheel(event: WheelEvent): void {
  event.preventDefault()
}

function onShortcutListWheel(event: WheelEvent): void {
  event.preventDefault()
  event.stopPropagation()
  const list = event.currentTarget as HTMLElement
  list.scrollTop += event.deltaY > 0 ? timeItemHeight : -timeItemHeight
}
</script>

<template>
  <div
    ref="rootRef"
    class="vis-time-picker"
    :class="{ 'is-open': panelOpen }"
    :style="{ '--vis-time-picker-width': controlWidth, '--vis-time-panel-width': panelWidth, '--vis-time-panel-height': panelHeight }"
  >
    <button
      class="vis-time-picker__control"
      :class="controlClasses"
      type="button"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="panelOpen"
      @click="onControlClick"
      @focus="onControlFocus"
      @blur="onControlBlur"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <span class="vis-time-picker__prefix" aria-hidden="true">
        <Icon name="clock" :size="16" decorative />
      </span>

      <template v-if="range">
        <span class="vis-time-picker__text" :class="{ 'is-active-part': activeRangePart === 'start' && panelOpen }" @click="setActiveRangePart('start', $event)">
          {{ rangeDisplayStartText }}
        </span>
        <span class="vis-time-picker__separator">至</span>
        <span class="vis-time-picker__text" :class="{ 'is-active-part': activeRangePart === 'end' && panelOpen, 'is-placeholder': !selectedRange }" @click="setActiveRangePart('end', $event)">
          {{ rangeDisplayEndText }}
        </span>
      </template>

      <template v-else>
        <span class="vis-time-picker__text">{{ singleDisplayText }}</span>
      </template>

      <span v-if="showClear" class="vis-time-picker__clear" aria-label="清空时间" role="button" tabindex="-1" @click="onClear">
        <Icon name="x-circle" :size="16" decorative />
      </span>
    </button>

    <div v-if="panelOpen" class="vis-time-picker__panel" :class="{ 'is-range': range, 'is-time-select': timeSelect }" @wheel="onPanelWheel">
      <template v-if="timeSelect">
        <div class="vis-time-picker__shortcut-list" @wheel="onShortcutListWheel">
          <button
            v-for="option in shortcutOptions"
            :key="option.value"
            type="button"
            class="vis-time-picker__shortcut-item"
            :class="{ 'is-selected': currentDraftValue(activeRangePart) === option.value }"
            @click="selectShortcut(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </template>

      <template v-else>
        <div class="vis-time-picker__columns-shell" :class="{ 'is-range': range }">
          <div class="vis-time-picker__columns-group" :class="{ 'is-active': !range || activeRangePart === 'start' }" @click="setActiveRangePart('start', $event)">
            <div
              v-for="group in timeParts"
              :key="`start-${group.key}`"
              :ref="setTimeColumnRef"
              class="vis-time-picker__column"
              data-range-part="start"
              :data-time-part="group.key"
              @wheel="onTimeColumnWheel($event, group.key, 'start')"
              @scroll="onTimeColumnScroll($event, group.key, 'start')"
            >
              <button
                v-for="item in getTimeColumnItems('start', group.key)"
                :key="`start-${group.key}-${item.id}`"
                type="button"
                class="vis-time-picker__item"
                :class="{ 'is-selected': getPartValue(currentDraftValue('start'), group.key) === item.value }"
                @click.stop="selectTimePart(group.key, item.value, 'start', item.id)"
              >
                {{ item.value }}
              </button>
            </div>
          </div>

          <VisDivider
            v-if="range"
            class="vis-time-picker__range-divider"
            type="vertical"
            length="100%"
          />

          <div v-if="range" class="vis-time-picker__columns-group" :class="{ 'is-active': activeRangePart === 'end' }" @click="setActiveRangePart('end', $event)">
            <div
              v-for="group in timeParts"
              :key="`end-${group.key}`"
              :ref="setTimeColumnRef"
              class="vis-time-picker__column"
              data-range-part="end"
              :data-time-part="group.key"
              @wheel="onTimeColumnWheel($event, group.key, 'end')"
              @scroll="onTimeColumnScroll($event, group.key, 'end')"
            >
              <button
                v-for="item in getTimeColumnItems('end', group.key)"
                :key="`end-${group.key}-${item.id}`"
                type="button"
                class="vis-time-picker__item"
                :class="{ 'is-selected': getPartValue(currentDraftValue('end'), group.key) === item.value }"
                @click.stop="selectTimePart(group.key, item.value, 'end', item.id)"
              >
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>

        <div class="vis-time-picker__footer" :class="{ 'is-range': range }">
          <VisButton v-if="!range" class="vis-time-picker__now-button" variant="text" size="md" @click="selectNow">此刻</VisButton>
          <VisButton class="vis-time-picker__confirm-button" variant="primary" size="md" @click="confirmSelection">确认</VisButton>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.vis-time-picker {
  position: relative;
  inline-size: fit-content;
}

.vis-time-picker__control {
  position: relative;
  box-sizing: border-box;
  inline-size: var(--vis-time-picker-width);
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-12);
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  background: var(--color-bg-surface);
  font-family: var(--font-family-text);
  text-align: start;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.vis-time-picker__control.is-read-view {
  border-color: transparent;
  background: transparent;
}

.vis-time-picker__control.is-state-hover:not(.is-disabled):not(.is-read-view) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-default);
}

.vis-time-picker__control.is-state-hover:not(.is-disabled).is-read-view {
  background: var(--color-bg-tertiary);
}

.vis-time-picker__control.is-state-focus:not(.is-disabled) {
  background: var(--color-bg-surface);
  border-color: var(--color-border-brand);
}

.vis-time-picker__control.is-state-danger:not(.is-disabled) {
  background: var(--color-bg-surface);
  border-color: var(--color-border-danger);
}

.vis-time-picker__control.is-disabled,
.vis-time-picker__control:disabled {
  border-color: var(--color-border-default);
  color: var(--color-text-disabled);
  background: var(--color-bg-secondary);
  cursor: not-allowed;
}

.vis-time-picker__prefix {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--color-fg-tertiary);
}

.vis-time-picker__control.is-state-danger:not(.is-disabled) .vis-time-picker__prefix,
.vis-time-picker__control.is-state-danger:not(.is-disabled) .vis-time-picker__clear {
  color: var(--color-fg-danger-primary);
}

.vis-time-picker__control.is-disabled .vis-time-picker__prefix {
  color: var(--color-fg-disabled);
}

.vis-time-picker__text {
  min-inline-size: 0;
  flex: 1 0 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-time-picker__control.is-selected .vis-time-picker__text,
.vis-time-picker__text.is-active-part {
  color: var(--color-text-primary);
}

.vis-time-picker__control.is-selected .vis-time-picker__text.is-placeholder {
  color: var(--color-text-tertiary);
}

.vis-time-picker__control.is-disabled .vis-time-picker__text,
.vis-time-picker__control.is-disabled .vis-time-picker__separator {
  color: var(--color-text-disabled);
}

.vis-time-picker__separator {
  inline-size: 22px;
  flex: 0 0 auto;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  text-align: center;
}

.vis-time-picker__clear {
  position: absolute;
  inset-inline-end: var(--space-12);
  inset-block-start: 50%;
  z-index: 1;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  color: var(--color-fg-tertiary);
  cursor: pointer;
}

.vis-time-picker__clear:hover {
  color: var(--color-fg-secondary);
}

.vis-time-picker__panel {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: calc(100% + var(--space-4));
  z-index: 45;
  box-sizing: border-box;
  inline-size: var(--vis-time-panel-width);
  block-size: var(--vis-time-panel-height);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-md);
}

.vis-time-picker__panel.is-time-select {
  padding: var(--space-8);
}

.vis-time-picker__columns-shell {
  min-block-size: 0;
  flex: 1 1 auto;
  padding: var(--space-16);
  display: flex;
  align-items: stretch;
  gap: var(--space-16);
  overflow: hidden;
}

.vis-time-picker__columns-shell.is-range {
  gap: var(--space-16);
}

.vis-time-picker__columns-group {
  min-inline-size: 0;
  min-block-size: 0;
  flex: 1 1 0;
  display: flex;
  align-items: stretch;
  gap: var(--space-16);
  opacity: 0.9;
}

.vis-time-picker__columns-group.is-active {
  opacity: 1;
}

.vis-time-picker__range-divider {
  inline-size: 1px;
  flex: 0 0 1px;
  align-self: stretch;
}

.vis-time-picker .vis-time-picker__column {
  --vis-time-column-edge-padding: 0px;

  box-sizing: border-box;
  min-inline-size: 0;
  block-size: 100%;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-block: var(--vis-time-column-edge-padding);
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-padding-block: var(--vis-time-column-edge-padding);
  scrollbar-width: none;
}

.vis-time-picker .vis-time-picker__column::-webkit-scrollbar,
.vis-time-picker .vis-time-picker__shortcut-list::-webkit-scrollbar {
  display: none;
}

.vis-time-picker__item,
.vis-time-picker__shortcut-item {
  border: 0;
  margin: 0;
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  cursor: pointer;
}

.vis-time-picker__item {
  inline-size: 100%;
  block-size: var(--space-32);
  flex: 0 0 var(--space-32);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
}

.vis-time-picker__item:hover,
.vis-time-picker__shortcut-item:hover {
  background: var(--color-bg-tertiary);
}

.vis-time-picker__item.is-selected,
.vis-time-picker__shortcut-item.is-selected {
  color: var(--color-text-brand-primary);
  background: var(--color-fg-brand-subtle);
  font-weight: 500;
}

.vis-time-picker .vis-time-picker__shortcut-list {
  min-block-size: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
  scrollbar-width: none;
}

.vis-time-picker__shortcut-item {
  inline-size: 100%;
  block-size: var(--space-32);
  flex: 0 0 var(--space-32);
  padding: 0 var(--space-12);
  text-align: start;
  white-space: pre;
}

.vis-time-picker__footer {
  block-size: 56px;
  border-top: 1px solid var(--color-border-default);
  padding: var(--space-12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 56px;
}

.vis-time-picker__footer.is-range {
  justify-content: flex-end;
}

.vis-time-picker__now-button {
  --vis-button-fg: var(--color-text-secondary);
}

.vis-time-picker__confirm-button {
  flex: 0 0 auto;
}
</style>
