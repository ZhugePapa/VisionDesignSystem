<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import VisButton from '../button/VisButton.vue'
import { Icon, type IconName } from '../icons'
import type {
  VisDatePickerShortcut,
  VisDatePickerState,
  VisDatePickerValue,
} from './date-picker.types'

type DaySelectType = 'none' | 'default' | 'start' | 'midst' | 'end'

interface DayCell {
  key: string
  date: Date
  day: number
  inCurrentMonth: boolean
  isToday: boolean
  isDisabled: boolean
  selectType: DaySelectType
}

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

const props = withDefaults(
  defineProps<{
    modelValue?: VisDatePickerValue
    range?: boolean
    disabled?: boolean
    state?: VisDatePickerState
    placeholder?: string
    startPlaceholder?: string
    endPlaceholder?: string
    open?: boolean
    prefix?: boolean
    prefixIcon?: IconName
    showFooterShortcuts?: boolean
    shortcuts?: VisDatePickerShortcut[]
    disabledDate?: (date: Date) => boolean
  }>(),
  {
    modelValue: null,
    range: false,
    disabled: false,
    state: 'default',
    placeholder: '请选择日期',
    startPlaceholder: '选择开始日期',
    endPlaceholder: '选择结束日期',
    open: undefined,
    prefix: true,
    prefixIcon: 'calendar',
    showFooterShortcuts: true,
    shortcuts: () => [
      { label: '最近 3 天', days: 3 },
      { label: '最近 7 天', days: 7 },
      { label: '最近 30 天', days: 30 },
    ],
    disabledDate: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisDatePickerValue): void
  (event: 'change', value: VisDatePickerValue): void
  (event: 'update:open', value: boolean): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const isHovering = ref(false)
const internalOpen = ref(false)
const draftRangeStart = ref<Date | null>(null)
const draftRangeHoverEnd = ref<Date | null>(null)

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}/${month}/${day}`
}

function parseDateString(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (!match) return null
  const year = Number.parseInt(match[1], 10)
  const month = Number.parseInt(match[2], 10) - 1
  const day = Number.parseInt(match[3], 10)
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  return normalizeDate(date)
}

function addDays(date: Date, days: number): Date {
  return normalizeDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days))
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function compareDate(a: Date, b: Date): number {
  const aTime = normalizeDate(a).getTime()
  const bTime = normalizeDate(b).getTime()
  if (aTime === bTime) return 0
  return aTime > bTime ? 1 : -1
}

const selectedSingleDate = computed<Date | null>(() => {
  if (props.range) return null
  if (typeof props.modelValue !== 'string') return null
  return parseDateString(props.modelValue)
})

const selectedRangeDates = computed<[Date, Date] | null>(() => {
  if (!props.range) return null
  if (!Array.isArray(props.modelValue) || props.modelValue.length !== 2) return null
  const start = parseDateString(props.modelValue[0])
  const end = parseDateString(props.modelValue[1])
  if (!start || !end) return null
  return compareDate(start, end) <= 0 ? [start, end] : [end, start]
})

const activeRangeDates = computed<[Date, Date] | null>(() => {
  if (!props.range) return null
  if (draftRangeStart.value) {
    const start = draftRangeStart.value
    const hovered = draftRangeHoverEnd.value
    if (hovered && !sameDay(hovered, start)) return [start, hovered]
    return [start, start]
  }
  if (selectedRangeDates.value) return selectedRangeDates.value
  return null
})

function resolveInitialMonth(): Date {
  if (props.range) {
    if (selectedRangeDates.value) {
      return new Date(selectedRangeDates.value[0].getFullYear(), selectedRangeDates.value[0].getMonth(), 1)
    }
    if (draftRangeStart.value) return new Date(draftRangeStart.value.getFullYear(), draftRangeStart.value.getMonth(), 1)
  } else if (selectedSingleDate.value) {
    return new Date(selectedSingleDate.value.getFullYear(), selectedSingleDate.value.getMonth(), 1)
  }

  const today = normalizeDate(new Date())
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

const leftMonth = ref<Date>(resolveInitialMonth())

const panelOpen = computed(() => {
  if (props.disabled) return false
  if (props.open !== undefined) return props.open
  return internalOpen.value
})

watch(
  () => [props.modelValue, props.range],
  () => {
    if (panelOpen.value) return
    leftMonth.value = resolveInitialMonth()
    if (!props.range) draftRangeStart.value = null
  },
)

const rightMonth = computed(() => addMonths(leftMonth.value, 1))

const visualState = computed<'default' | 'hover' | 'focus' | 'danger' | 'disabled'>(() => {
  if (props.disabled) return 'disabled'
  if (props.state === 'danger') return 'danger'
  if (panelOpen.value || props.state === 'focus') return 'focus'
  if (props.state === 'hover' || isHovering.value) return 'hover'
  return 'default'
})

const hasSelection = computed(() => {
  if (props.range) {
    if (selectedRangeDates.value) return true
    return !!draftRangeStart.value
  }
  return !!selectedSingleDate.value
})

const controlClasses = computed(() => ({
  'is-range': props.range,
  'is-disabled': props.disabled,
  'is-state-default': visualState.value === 'default',
  'is-state-hover': visualState.value === 'hover',
  'is-state-focus': visualState.value === 'focus',
  'is-state-danger': visualState.value === 'danger',
  'is-selected': hasSelection.value,
}))

const showClear = computed(() => {
  if (props.disabled || !hasSelection.value) return false
  return visualState.value === 'hover' || visualState.value === 'focus' || visualState.value === 'danger'
})

const singleDisplayText = computed(() => {
  if (selectedSingleDate.value) return formatDate(selectedSingleDate.value)
  return props.placeholder
})

const rangeDisplayStartText = computed(() => {
  if (selectedRangeDates.value) return formatDate(selectedRangeDates.value[0])
  if (draftRangeStart.value) return formatDate(draftRangeStart.value)
  return props.startPlaceholder
})

const rangeDisplayEndText = computed(() => {
  if (selectedRangeDates.value) return formatDate(selectedRangeDates.value[1])
  return props.endPlaceholder
})

function emitValue(value: VisDatePickerValue): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function setOpen(nextOpen: boolean): void {
  if (props.disabled) return

  if (props.open === undefined) internalOpen.value = nextOpen

  emit('update:open', nextOpen)

  if (!nextOpen) {
    draftRangeStart.value = null
    draftRangeHoverEnd.value = null
  } else if (props.range && selectedRangeDates.value) {
    draftRangeStart.value = null
    draftRangeHoverEnd.value = null
    leftMonth.value = new Date(selectedRangeDates.value[0].getFullYear(), selectedRangeDates.value[0].getMonth(), 1)
  }
}

function onControlClick(): void {
  if (props.disabled) return
  setOpen(!panelOpen.value)
}

function onPointerEnter(): void {
  if (props.disabled) return
  isHovering.value = true
}

function onPointerLeave(): void {
  isHovering.value = false
}

function onDayHover(cell: DayCell): void {
  if (!props.range) return
  if (!draftRangeStart.value) return
  if (cell.isDisabled) return
  draftRangeHoverEnd.value = normalizeDate(cell.date)
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!panelOpen.value) return
  const root = rootRef.value
  if (!root) return
  if (root.contains(event.target as Node)) return
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
})

function getSelectType(date: Date): DaySelectType {
  if (props.range) {
    const range = activeRangeDates.value
    if (!range) return 'none'

    const [start, end] = range
    const minDate = compareDate(start, end) <= 0 ? start : end
    const maxDate = compareDate(start, end) <= 0 ? end : start
    const compareWithMin = compareDate(date, minDate)
    const compareWithMax = compareDate(date, maxDate)

    if (sameDay(start, end)) {
      if (draftRangeStart.value && !draftRangeHoverEnd.value && sameDay(date, start)) return 'start'
      return sameDay(date, start) ? 'default' : 'none'
    }

    if (sameDay(date, start)) return 'start'
    if (sameDay(date, end)) return 'end'
    if (compareWithMin > 0 && compareWithMax < 0) return 'midst'
    return 'none'
  }

  if (selectedSingleDate.value && sameDay(date, selectedSingleDate.value)) return 'default'
  return 'none'
}

function buildMonthCells(monthDate: Date): DayCell[] {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const monthStart = new Date(year, month, 1)
  const offset = monthStart.getDay()
  const gridStart = addDays(monthStart, -offset)
  const today = normalizeDate(new Date())

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    const inCurrentMonth = date.getMonth() === month
    const selectType = inCurrentMonth ? getSelectType(date) : 'none'
    const isDisabled = !!props.disabledDate?.(date)

    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      day: date.getDate(),
      inCurrentMonth,
      isToday: sameDay(date, today),
      isDisabled,
      selectType,
    }
  })
}

const leftMonthCells = computed(() => buildMonthCells(leftMonth.value))
const rightMonthCells = computed(() => buildMonthCells(rightMonth.value))

function monthLabel(date: Date): string {
  return `${date.getMonth() + 1}月`
}

function yearLabel(date: Date): string {
  return `${date.getFullYear()}年`
}

function shiftByMonth(delta: number): void {
  leftMonth.value = addMonths(leftMonth.value, delta)
}

function shiftByYear(delta: number): void {
  leftMonth.value = addMonths(leftMonth.value, delta * 12)
}

function selectDay(cell: DayCell): void {
  if (props.disabled || cell.isDisabled) return

  const selectedDate = normalizeDate(cell.date)

  if (!props.range) {
    emitValue(formatDate(selectedDate))
    setOpen(false)
    return
  }

  if (!draftRangeStart.value) {
    if (selectedRangeDates.value) emitValue(null)
    draftRangeStart.value = selectedDate
    draftRangeHoverEnd.value = null
    return
  }

  const start = draftRangeStart.value
  const next: [string, string] =
    compareDate(start, selectedDate) <= 0
      ? [formatDate(start), formatDate(selectedDate)]
      : [formatDate(selectedDate), formatDate(start)]
  emitValue(next)
  draftRangeStart.value = null
  draftRangeHoverEnd.value = null
  setOpen(false)
}

function onTodayShortcut(): void {
  const today = normalizeDate(new Date())

  if (props.range) {
    const value: [string, string] = [formatDate(today), formatDate(today)]
    emitValue(value)
  } else {
    emitValue(formatDate(today))
  }

  leftMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
  setOpen(false)
}

function onRangeShortcut(days: number): void {
  if (!props.range) return
  const today = normalizeDate(new Date())
  const start = addDays(today, -(days - 1))
  const value: [string, string] = [formatDate(start), formatDate(today)]
  emitValue(value)
  leftMonth.value = new Date(start.getFullYear(), start.getMonth(), 1)
  setOpen(false)
}

function onClear(event: MouseEvent): void {
  event.stopPropagation()
  draftRangeStart.value = null
  draftRangeHoverEnd.value = null
  emitValue(null)
}

function cellClasses(cell: DayCell): Record<string, boolean> {
  return {
    'is-not-current': !cell.inCurrentMonth,
    'is-today': cell.isToday,
    'is-disabled': cell.isDisabled,
    'is-select-default': cell.selectType === 'default',
    'is-select-start': cell.selectType === 'start',
    'is-select-midst': cell.selectType === 'midst',
    'is-select-end': cell.selectType === 'end',
    'is-interactive': !cell.isDisabled,
  }
}
</script>

<template>
  <div ref="rootRef" class="vis-date-picker" :class="{ 'is-open': panelOpen }">
    <div
      class="vis-date-picker__control"
      :class="controlClasses"
      @click="onControlClick"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <span v-if="prefix" class="vis-date-picker__prefix" aria-hidden="true">
        <Icon :name="prefixIcon" :size="16" decorative />
      </span>

      <template v-if="range">
        <span class="vis-date-picker__text vis-date-picker__text--start">{{ rangeDisplayStartText }}</span>
        <span class="vis-date-picker__separator">至</span>
        <span class="vis-date-picker__text vis-date-picker__text--end" :class="{ 'is-placeholder': !selectedRangeDates }">
          {{ rangeDisplayEndText }}
        </span>
      </template>

      <template v-else>
        <span class="vis-date-picker__text">{{ singleDisplayText }}</span>
      </template>

      <button v-if="showClear" class="vis-date-picker__clear" type="button" aria-label="清空日期" @click="onClear">
        <Icon name="x-circle" :size="16" decorative />
      </button>
    </div>

    <div v-if="panelOpen" class="vis-date-picker__panel" :class="{ 'is-range': range }">
      <div class="vis-date-picker__panel-content" :class="{ 'is-range': range }">
        <div class="vis-date-picker__calendar">
          <div class="vis-date-picker__header">
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-left-double" @click="shiftByYear(-1)" />
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-left" @click="shiftByMonth(-1)" />
            <div class="vis-date-picker__header-title">
              <VisButton class="vis-date-picker__header-title-button" variant="text" size="md">{{ yearLabel(leftMonth) }}</VisButton>
              <VisButton class="vis-date-picker__header-title-button" variant="text" size="md">{{ monthLabel(leftMonth) }}</VisButton>
            </div>
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-right" @click="shiftByMonth(1)" />
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-right-double" @click="shiftByYear(1)" />
          </div>

          <div class="vis-date-picker__week-row">
            <span v-for="weekday in weekdayLabels" :key="`left-week-${weekday}`" class="vis-date-picker__week-cell">{{ weekday }}</span>
          </div>

          <div class="vis-date-picker__day-grid">
            <button
              v-for="cell in leftMonthCells"
              :key="`left-${cell.key}`"
              type="button"
              class="vis-date-picker__day-cell"
              :class="cellClasses(cell)"
              :disabled="cell.isDisabled"
              @click="selectDay(cell)"
              @mouseenter="onDayHover(cell)"
            >
              <span class="vis-date-picker__day-band">
                <span class="vis-date-picker__day-bubble">{{ cell.day }}</span>
              </span>
            </button>
          </div>
        </div>

        <div v-if="range" class="vis-date-picker__range-divider" aria-hidden="true" />

        <div v-if="range" class="vis-date-picker__calendar">
          <div class="vis-date-picker__header">
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-left-double" @click="shiftByYear(-1)" />
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-left" @click="shiftByMonth(-1)" />
            <div class="vis-date-picker__header-title">
              <VisButton class="vis-date-picker__header-title-button" variant="text" size="md">{{ yearLabel(rightMonth) }}</VisButton>
              <VisButton class="vis-date-picker__header-title-button" variant="text" size="md">{{ monthLabel(rightMonth) }}</VisButton>
            </div>
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-right" @click="shiftByMonth(1)" />
            <VisButton class="vis-date-picker__nav-button" variant="text" size="md" icon-only icon-name="chevron-right-double" @click="shiftByYear(1)" />
          </div>

          <div class="vis-date-picker__week-row">
            <span v-for="weekday in weekdayLabels" :key="`right-week-${weekday}`" class="vis-date-picker__week-cell">{{ weekday }}</span>
          </div>

          <div class="vis-date-picker__day-grid">
            <button
              v-for="cell in rightMonthCells"
              :key="`right-${cell.key}`"
              type="button"
              class="vis-date-picker__day-cell"
              :class="cellClasses(cell)"
              :disabled="cell.isDisabled"
              @click="selectDay(cell)"
              @mouseenter="onDayHover(cell)"
            >
              <span class="vis-date-picker__day-band">
                <span class="vis-date-picker__day-bubble">{{ cell.day }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="showFooterShortcuts" class="vis-date-picker__footer" :class="{ 'is-range': range }">
        <template v-if="range">
          <VisButton
            v-for="shortcut in shortcuts"
            :key="shortcut.label"
            class="vis-date-picker__shortcut-chip"
            variant="text"
            size="sm"
            @click="onRangeShortcut(shortcut.days)"
          >
            {{ shortcut.label }}
          </VisButton>
          <span class="vis-date-picker__footer-spacer" />
          <VisButton class="vis-date-picker__shortcut-link" variant="text" size="sm">更多</VisButton>
        </template>

        <template v-else>
          <VisButton class="vis-date-picker__today-button" variant="link-color" size="md" @click="onTodayShortcut">今天</VisButton>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-date-picker {
  position: relative;
  inline-size: fit-content;
  font-family: var(--font-family-sans);
}

.vis-date-picker__control {
  position: relative;
  inline-size: 240px;
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  padding-inline: var(--space-12);
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.vis-date-picker__control.is-range {
  inline-size: 320px;
}

.vis-date-picker__control.is-state-default.is-disabled {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-default);
  cursor: not-allowed;
}

.vis-date-picker__control.is-state-hover:not(.is-disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-default);
}

.vis-date-picker__control.is-state-focus:not(.is-disabled) {
  background: var(--color-bg-surface);
  border-color: var(--color-border-brand);
}

.vis-date-picker__control.is-state-danger:not(.is-disabled) {
  background: var(--color-bg-surface);
  border-color: var(--color-border-danger);
}

.vis-date-picker__prefix {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--color-fg-tertiary);
}

.vis-date-picker__text {
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

.vis-date-picker__control.is-selected .vis-date-picker__text {
  color: var(--color-text-primary);
}

.vis-date-picker__control.is-selected .vis-date-picker__text--end.is-placeholder {
  color: var(--color-text-tertiary);
}

.vis-date-picker__control.is-disabled .vis-date-picker__text,
.vis-date-picker__control.is-disabled .vis-date-picker__separator,
.vis-date-picker__control.is-disabled .vis-date-picker__prefix {
  color: var(--color-text-disabled);
}

.vis-date-picker__separator {
  inline-size: 22px;
  flex: 0 0 auto;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  text-align: center;
}

.vis-date-picker__clear {
  position: absolute;
  inset-inline-end: var(--space-12);
  inset-block-start: 50%;
  z-index: 1;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  color: var(--color-fg-tertiary);
  background: transparent;
  cursor: pointer;
}

.vis-date-picker__clear:hover {
  color: var(--color-fg-secondary);
}

.vis-date-picker__panel {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: calc(100% + var(--space-4));
  z-index: 40;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-default-md);
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
}

.vis-date-picker__panel:not(.is-range) {
  inline-size: 312px;
}

.vis-date-picker__panel.is-range {
  inline-size: 625px;
}

.vis-date-picker__panel-content {
  display: inline-flex;
  align-items: flex-start;
  block-size: 352px;
  padding: var(--space-16);
}

.vis-date-picker__panel-content.is-range {
  gap: var(--space-16);
}

.vis-date-picker__range-divider {
  inline-size: 1px;
  block-size: calc(var(--space-40) * 8);
  background: var(--color-border-default);
}

.vis-date-picker__calendar {
  inline-size: 280px;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
}

.vis-date-picker__header {
  block-size: var(--space-40);
  display: inline-flex;
  align-items: center;
}

.vis-date-picker__nav-button {
  inline-size: var(--space-32);
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
}

.vis-date-picker__header-title {
  flex: 1 0 0;
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: var(--space-16);
  gap: calc(var(--space-4) + 2px);
}

.vis-date-picker__header-title-button {
  --vis-button-fg: var(--color-text-primary);

  flex: 0 0 auto;
}

.vis-date-picker__week-row {
  display: grid;
  grid-template-columns: repeat(7, var(--space-40));
}

.vis-date-picker__week-cell {
  inline-size: var(--space-40);
  block-size: var(--space-40);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 500;
}

.vis-date-picker__day-grid {
  display: grid;
  grid-template-columns: repeat(7, var(--space-40));
}

.vis-date-picker__day-cell {
  inline-size: var(--space-40);
  block-size: var(--space-40);
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.vis-date-picker__day-band {
  inline-size: var(--space-32);
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.vis-date-picker__day-bubble {
  inline-size: var(--space-32);
  block-size: var(--space-32);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
}

.vis-date-picker__day-cell.is-not-current .vis-date-picker__day-bubble {
  color: var(--color-text-tertiary);
}

.vis-date-picker__day-cell.is-today .vis-date-picker__day-bubble {
  color: var(--color-text-brand-primary);
  font-weight: 500;
}

.vis-date-picker__day-cell.is-today:not(.is-not-current):not(.is-disabled):not(.is-select-default):not(.is-select-start):not(.is-select-end):not(.is-select-midst) .vis-date-picker__day-band {
  background: var(--color-fg-brand-subtle);
  border-radius: var(--radius-full);
}

.vis-date-picker__day-cell.is-select-default .vis-date-picker__day-bubble,
.vis-date-picker__day-cell.is-select-start .vis-date-picker__day-bubble,
.vis-date-picker__day-cell.is-select-end .vis-date-picker__day-bubble {
  background: var(--color-fg-brand-primary);
  color: var(--color-text-white);
  font-weight: 400;
}

.vis-date-picker__day-cell.is-select-default.is-today .vis-date-picker__day-bubble,
.vis-date-picker__day-cell.is-select-start.is-today .vis-date-picker__day-bubble,
.vis-date-picker__day-cell.is-select-end.is-today .vis-date-picker__day-bubble {
  font-weight: 500;
}

.vis-date-picker__day-cell.is-select-midst .vis-date-picker__day-band {
  inline-size: var(--space-40);
  border-radius: 0;
  background: var(--color-bg-secondary);
}

.vis-date-picker__day-cell.is-select-start {
  justify-content: flex-end;
}

.vis-date-picker__day-cell.is-select-start .vis-date-picker__day-band {
  inline-size: 36px;
  justify-content: flex-start;
  background: var(--color-bg-secondary);
  border-radius: 0;
}

.vis-date-picker__day-cell.is-select-end {
  justify-content: flex-start;
}

.vis-date-picker__day-cell.is-select-end .vis-date-picker__day-band {
  inline-size: 36px;
  justify-content: flex-end;
  background: var(--color-bg-secondary);
  border-radius: 0;
}

.vis-date-picker__day-cell.is-disabled {
  cursor: not-allowed;
}

.vis-date-picker__day-cell.is-disabled .vis-date-picker__day-band {
  background: var(--color-bg-secondary);
}

.vis-date-picker__day-cell.is-disabled .vis-date-picker__day-bubble {
  color: var(--color-text-disabled);
}

.vis-date-picker__day-cell.is-disabled.is-select-start .vis-date-picker__day-bubble,
.vis-date-picker__day-cell.is-disabled.is-select-end .vis-date-picker__day-bubble,
.vis-date-picker__day-cell.is-disabled.is-select-default .vis-date-picker__day-bubble {
  background: var(--color-bg-secondary);
}

.vis-date-picker__day-cell.is-interactive:not(.is-disabled):not(.is-select-default):not(.is-select-start):not(.is-select-end):not(.is-select-midst):hover .vis-date-picker__day-bubble {
  background: var(--color-fg-brand-primary);
  color: var(--color-text-white);
}

.vis-date-picker__footer {
  block-size: 44px;
  border-top: 1px solid var(--color-border-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-16);
}

.vis-date-picker__footer.is-range {
  block-size: 48px;
  justify-content: flex-start;
  gap: var(--space-8);
}

.vis-date-picker__today-button {
  --vis-button-fg: var(--color-text-brand-primary);
  --vis-button-link-base: var(--color-text-brand-primary);

  flex: 1 0 0;
}

.vis-date-picker__shortcut-chip,
.vis-date-picker__shortcut-link {
  --vis-button-height: var(--space-24);
  --vis-button-font-size: var(--font-text-sm-size);
  --vis-button-line-height: var(--font-text-sm-line-height);
  --vis-button-padding-inline: var(--space-8);
  --vis-button-font-weight: 400;
  --vis-button-fg: var(--color-text-secondary);
}

.vis-date-picker__footer-spacer {
  flex: 1 0 0;
  min-inline-size: 0;
}
</style>
