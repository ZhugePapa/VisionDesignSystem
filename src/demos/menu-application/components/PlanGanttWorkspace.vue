<script setup lang="ts">
import { ElScrollbar, type ScrollbarInstance } from 'element-plus'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { VisTable, type VisTableColumn, type VisTableRowData } from '../../../components/table'
import VisButton from '../../../components/button/VisButton.vue'
import { VisTooltip } from '../../../components/tooltip'
import milestoneImage from '../assets/work-items/gantt-milestone.svg'
import milestoneHoverImage from '../assets/work-items/gantt-milestone-hover.svg'
import type { DemoWorkItem } from '../work-items'
import type { DemoPlanMilestone } from '../work-item-store'
import {
  GANTT_DAY_WIDTH, GANTT_ROW_HEIGHT, dateDay, dayDate, displayDate, editSchedule,
  isWeekend, localToday, monthSegments, progressHandleLeft, scheduleDays, type GanttEditMode, type GanttSchedule,
} from '../gantt-calendar'

defineOptions({ inheritAttrs: false })
interface PlanRow extends VisTableRowData { id: string; item: DemoWorkItem; title: string; plannedStart: string; plannedEnd: string; progress: number }
const props = defineProps<{
  data: PlanRow[]
  columns: VisTableColumn[]
  milestones: DemoPlanMilestone[]
  /** Full plan range is independent of filtering and expansion. */
  schedules: GanttSchedule[]
}>()
const emit = defineEmits<{
  'update-work-item': [id: string, schedule: GanttSchedule]
  'notice': [text: string]
}>()
const slots = useSlots()
const forwardedSlots = computed(() => Object.keys(slots))
const table = ref<InstanceType<typeof VisTable>>()
const timeline = ref<ScrollbarInstance>()
const root = ref<HTMLElement>()
const leftWidth = ref(801)
const scrollLeft = ref(0)
const scrollTop = ref(0)
const isPanning = ref(false)
const hoveredRow = ref<string | null>(null)
const hoveredMilestone = ref<string | null>(null)
const selectedDay = ref(dateDay('2026-09-02')!)
const today = dateDay(localToday())!
const draft = ref<{ id: string; mode: GanttEditMode; schedule: GanttSchedule } | null>(null)
let animationFrame = 0
let resizeObserver: ResizeObserver | undefined
let splitterAdjusted = false
let drag: { id: string; mode: GanttEditMode; original: GanttSchedule; clientX: number; initialScroll: number; latestX: number; target: HTMLElement; pointerId: number; moved: boolean } | null = null
let split: { startX: number; width: number; target: HTMLElement; pointerId: number } | null = null
let pan: { startX: number; initialScroll: number; target: HTMLElement; pointerId: number } | null = null
let canvasPointer: Pick<PointerEvent, 'clientX' | 'clientY'> | null = null

const range = computed(() => {
  const dates = props.schedules.map(scheduleDays).filter(value => value !== null)
  const start = Math.min(dateDay('2026-08-26')!, ...dates.map(value => value.start)) - 7
  const end = Math.max(dateDay('2026-10-31')!, today + 14, ...dates.map(value => value.end)) + 14
  return { start, end }
})
const days = computed(() => Array.from({ length: range.value.end - range.value.start + 1 }, (_, index) => range.value.start + index))
const months = computed(() => monthSegments(range.value.start, range.value.end))
const timelineWidth = computed(() => days.value.length * GANTT_DAY_WIDTH)
const milestoneRevision = computed(() => JSON.stringify(props.milestones))
const workspaceStyle = computed(() => ({ '--plan-left-width': `${leftWidth.value}px`, '--gantt-day-width': `${GANTT_DAY_WIDTH}px` }))
function xForDay(day: number): number { return (day - range.value.start) * GANTT_DAY_WIDTH }
function scheduleFor(row: PlanRow): GanttSchedule { return draft.value?.id === row.id ? draft.value.schedule : row }
function barStyle(row: PlanRow): Record<string, string> {
  const schedule = scheduleFor(row), dates = scheduleDays(schedule)
  return dates ? { left: `${xForDay(dates.start)}px`, width: `${(dates.end - dates.start + 1) * GANTT_DAY_WIDTH}px`, '--task-progress': `${schedule.progress}%` } : {}
}
function barState(row: PlanRow): string {
  const progress = scheduleFor(row).progress
  return progress === 100 ? 'complete' : progress === 0 ? 'pending' : 'in-progress'
}
function editable(row: PlanRow): boolean {
  return scheduleDays(row) !== null
}
function progressStyle(row: PlanRow): Record<string, string> {
  const schedule = scheduleFor(row), dates = scheduleDays(schedule)
  const width = dates ? (dates.end - dates.start + 1) * GANTT_DAY_WIDTH : 0
  return { left: `${progressHandleLeft(width, schedule.progress)}px` }
}
function milestoneFor(id: string): DemoPlanMilestone[] { return props.milestones.filter(value => value.workItemId === id) }
function blockedX(row: PlanRow): number {
  const dates = scheduleDays(scheduleFor(row))
  const milestoneDays = milestoneFor(row.id).map(value => dateDay(value.date)).filter((value): value is number => value !== null)
  return xForDay(Math.max(dates?.end ?? range.value.start, ...milestoneDays)) + GANTT_DAY_WIDTH + 16
}

// Both scroll surfaces use this authoritative Y value; X is intentionally independent.
function tableScrolled(position: { scrollTop: number; scrollLeft: number }): void {
  if (Math.abs(scrollTop.value - position.scrollTop) < 0.5) return
  scrollTop.value = position.scrollTop
  timeline.value?.setScrollTop(position.scrollTop)
}
function timelineScrolled(position: { scrollTop: number; scrollLeft: number }): void {
  scrollLeft.value = position.scrollLeft
  if (canvasPointer) hoverCanvas(canvasPointer)
  if (Math.abs(scrollTop.value - position.scrollTop) < 0.5) return
  scrollTop.value = position.scrollTop
  table.value?.setScrollTop(position.scrollTop)
}
function scrollToDay(day: number): void {
  const wrap = timeline.value?.wrapRef
  if (!wrap) return
  timeline.value?.setScrollLeft(Math.max(0, xForDay(day) - wrap.clientWidth / 3))
}
function locateToday(): void { selectedDay.value = today; scrollToDay(today) }
function locatePlan(): void {
  const first = props.data.map(row => scheduleDays(row)).find(value => value !== null)
  scrollToDay(first?.start ?? dateDay('2026-09-01')!)
}

function hoverCanvas(event: Pick<PointerEvent, 'clientX' | 'clientY'>): void {
  if (drag) return
  const wrap = timeline.value?.wrapRef
  if (!wrap) return
  const bounds = wrap.getBoundingClientRect()
  const inside = event.clientX >= bounds.left && event.clientX < bounds.right && event.clientY >= bounds.top && event.clientY < bounds.bottom
  canvasPointer = inside ? { clientX: event.clientX, clientY: event.clientY } : null
  const index = Math.floor((event.clientY - bounds.top + wrap.scrollTop) / GANTT_ROW_HEIGHT)
  hoveredRow.value = inside ? props.data[index]?.id ?? null : null
}
function leaveCanvas(): void {
  if (drag) return
  canvasPointer = null
  hoveredRow.value = null
}

// Canvas panning changes only the viewport, never a work item's schedule.
function beginPan(event: PointerEvent): void {
  if (event.button !== 0 || event.pointerType !== 'mouse' || drag || split || pan) return
  const origin = event.target as Element
  if (origin.closest('.gantt-task, .gantt-milestone, .gantt-block, button, a, input, [role="button"]')) return
  const wrap = timeline.value?.wrapRef
  if (!wrap) return
  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)
  pan = { startX: event.clientX, initialScroll: wrap.scrollLeft, target, pointerId: event.pointerId }
  isPanning.value = true
  window.addEventListener('pointermove', movePan)
  window.addEventListener('pointerup', finishPan)
  window.addEventListener('pointercancel', cleanupPan)
  window.addEventListener('keydown', escapePan)
  window.addEventListener('blur', cleanupPan)
}
function movePan(event: PointerEvent): void {
  const wrap = timeline.value?.wrapRef
  if (!pan || !wrap || event.pointerId !== pan.pointerId) return
  event.preventDefault()
  const next = Math.max(0, Math.min(wrap.scrollWidth - wrap.clientWidth, pan.initialScroll - (event.clientX - pan.startX)))
  timeline.value?.setScrollLeft(next)
  scrollLeft.value = next
}
function finishPan(event: PointerEvent): void {
  if (!pan || event.pointerId !== pan.pointerId) return
  movePan(event)
  cleanupPan()
}
function cleanupPan(): void {
  if (pan?.target.hasPointerCapture(pan.pointerId)) pan.target.releasePointerCapture(pan.pointerId)
  pan = null
  isPanning.value = false
  window.removeEventListener('pointermove', movePan)
  window.removeEventListener('pointerup', finishPan)
  window.removeEventListener('pointercancel', cleanupPan)
  window.removeEventListener('keydown', escapePan)
  window.removeEventListener('blur', cleanupPan)
}
function escapePan(event: KeyboardEvent): void { if (event.key === 'Escape') cleanupPan() }

function beginDrag(event: PointerEvent, row: PlanRow, mode: GanttEditMode): void {
  if (event.button !== 0 || pan || split || drag || !editable(row) || !scheduleDays(row)) return
  event.preventDefault()
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)
  drag = {
    id: row.id, mode, original: { plannedStart: row.plannedStart, plannedEnd: row.plannedEnd, progress: row.progress },
    clientX: event.clientX, latestX: event.clientX, initialScroll: scrollLeft.value,
    target, pointerId: event.pointerId, moved: false,
  }
  hoveredRow.value = row.id
  window.addEventListener('pointermove', movePointer)
  window.addEventListener('pointerup', finishPointer)
  window.addEventListener('pointercancel', cancelPointer)
  window.addEventListener('keydown', escapePointer)
  window.addEventListener('blur', cancelPointer)
  animationFrame = requestAnimationFrame(autoScroll)
}
function updateDraft(): void {
  if (!drag) return
  const delta = drag.latestX - drag.clientX + scrollLeft.value - drag.initialScroll
  if (Math.abs(delta) > 3) drag.moved = true
  if (!drag.moved) return
  const schedule = editSchedule(drag.original, drag.mode, delta)
  const previous = draft.value?.schedule
  if (previous && previous.plannedStart === schedule.plannedStart && previous.plannedEnd === schedule.plannedEnd && previous.progress === schedule.progress) return
  draft.value = { id: drag.id, mode: drag.mode, schedule }
}
function movePointer(event: PointerEvent): void {
  if (!drag || event.pointerId !== drag.pointerId) return
  drag.latestX = event.clientX
  // The animation loop coalesces pointer events; the table retains committed data.
}
function autoScroll(): void {
  if (!drag) return
  const wrap = timeline.value?.wrapRef
  if (wrap && drag.moved) {
    const rect = wrap.getBoundingClientRect()
    const delta = drag.latestX < rect.left + 32 ? -8 : drag.latestX > rect.right - 32 ? 8 : 0
    if (delta) {
      const next = Math.max(0, Math.min(wrap.scrollWidth - wrap.clientWidth, wrap.scrollLeft + delta))
      timeline.value?.setScrollLeft(next)
      scrollLeft.value = next
    }
  }
  updateDraft()
  animationFrame = requestAnimationFrame(autoScroll)
}
function cleanupDrag(): void {
  cancelAnimationFrame(animationFrame)
  if (drag?.target.hasPointerCapture(drag.pointerId)) drag.target.releasePointerCapture(drag.pointerId)
  drag = null
  draft.value = null
  window.removeEventListener('pointermove', movePointer)
  window.removeEventListener('pointerup', finishPointer)
  window.removeEventListener('pointercancel', cancelPointer)
  window.removeEventListener('keydown', escapePointer)
  window.removeEventListener('blur', cancelPointer)
}
function finishPointer(event: PointerEvent): void {
  if (!drag || event.pointerId !== drag.pointerId) return
  movePointer(event)
  // Flush the last pointer position even if it arrives before the next frame.
  updateDraft()
  const result = draft.value, original = drag.original
  if (result && JSON.stringify(result.schedule) !== JSON.stringify(original)) {
    if (dateDay(result.schedule.plannedStart) === null || dateDay(result.schedule.plannedEnd) === null) emit('notice', '日期超出支持范围，已取消修改')
    else emit('update-work-item', result.id, result.schedule)
  }
  cleanupDrag()
  hoverCanvas(event)
}
function cancelPointer(): void { cleanupDrag(); hoveredRow.value = null }
function escapePointer(event: KeyboardEvent): void { if (event.key === 'Escape') cancelPointer() }
function keyboardEdit(event: KeyboardEvent, row: PlanRow, mode: GanttEditMode): void {
  if (!editable(row) || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
  event.preventDefault()
  const direction = event.key === 'ArrowLeft' ? -1 : 1
  const dates = scheduleDays(row)
  const delta = mode === 'progress' && dates ? direction * (dates.end - dates.start + 1) * GANTT_DAY_WIDTH / 100 : direction * GANTT_DAY_WIDTH
  emit('update-work-item', row.id, editSchedule({ plannedStart: row.plannedStart, plannedEnd: row.plannedEnd, progress: row.progress }, mode, delta))
}
function handleText(row: PlanRow, mode: GanttEditMode): string {
  const value = scheduleFor(row)
  return mode === 'progress' ? `进度：${value.progress}%` : `${mode === 'start' ? '开始' : '结束'}：${displayDate(mode === 'start' ? value.plannedStart : value.plannedEnd)}`
}

function clampLeftWidth(width: number): number {
  return Math.max(280, Math.min(width, Math.min(1000, (root.value?.clientWidth ?? 1662) - 240)))
}
function beginSplit(event: PointerEvent): void {
  if (event.button !== 0 || drag || pan || split) return
  event.preventDefault()
  splitterAdjusted = true
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)
  split = { startX: event.clientX, width: leftWidth.value, target, pointerId: event.pointerId }
  window.addEventListener('pointermove', resizeSplit)
  window.addEventListener('pointerup', finishSplit)
  window.addEventListener('pointercancel', finishSplit)
}
function resizeSplit(event: PointerEvent): void {
  if (split && event.pointerId === split.pointerId) leftWidth.value = clampLeftWidth(split.width + event.clientX - split.startX)
}
function finishSplit(): void {
  if (split?.target.hasPointerCapture(split.pointerId)) split.target.releasePointerCapture(split.pointerId)
  split = null
  window.removeEventListener('pointermove', resizeSplit)
  window.removeEventListener('pointerup', finishSplit)
  window.removeEventListener('pointercancel', finishSplit)
  table.value?.doLayout()
}
watch(() => props.data.map(row => row.id).join(','), async () => {
  cleanupDrag()
  cleanupPan()
  hoveredRow.value = null
  await nextTick()
  const wrap = timeline.value?.wrapRef
  const top = Math.min(scrollTop.value, Math.max(0, (wrap?.scrollHeight ?? 0) - (wrap?.clientHeight ?? 0)))
  scrollTop.value = top
  timeline.value?.setScrollTop(top)
  table.value?.setScrollTop(top)
})
onMounted(async () => {
  resizeObserver = new ResizeObserver(() => {
    leftWidth.value = clampLeftWidth(splitterAdjusted ? leftWidth.value : Math.min(801, (root.value?.clientWidth ?? 1662) * .48))
    table.value?.doLayout()
  })
  if (root.value) resizeObserver.observe(root.value)
  await nextTick()
  locatePlan()
})
onBeforeUnmount(() => { cleanupDrag(); cleanupPan(); finishSplit(); resizeObserver?.disconnect() })
defineExpose({ locateToday, locatePlan })
</script>

<template>
  <div ref="root" class="plan-gantt" :class="{ 'is-panning': isPanning }" :style="workspaceStyle" aria-label="项目计划甘特图">
    <div class="plan-gantt__attributes">
      <VisTable ref="table" v-bind="$attrs" class="plan-gantt__table" :data="data" :hovered-row-key="hoveredRow" :columns="columns" appearance="grid" height="100%" row-key="id" @scroll="tableScrolled">
        <template v-for="name in forwardedSlots" :key="name" #[name]="scope"><slot :name="name" v-bind="scope" /></template>
      </VisTable>
    </div>
    <div class="plan-gantt__split" role="separator" aria-label="调整属性表格宽度" aria-orientation="vertical" tabindex="0" :aria-valuenow="leftWidth" :aria-valuemin="280" :aria-valuemax="1000" @pointerdown="beginSplit" @keydown.left.prevent="leftWidth = clampLeftWidth(leftWidth - 32)" @keydown.right.prevent="leftWidth = clampLeftWidth(leftWidth + 32)" />
    <div class="plan-gantt__timeline">
      <header class="plan-gantt__calendar" aria-label="时间轴日期">
        <div class="plan-gantt__calendar-content" :style="{ width: `${timelineWidth}px`, transform: `translateX(${-scrollLeft}px)` }">
          <div class="plan-gantt__months"><span v-for="month in months" :key="month.key" :style="{ width: `${month.days * GANTT_DAY_WIDTH}px` }">{{ month.label }}</span></div>
          <div class="plan-gantt__days">
            <button v-for="day in days" :key="day" class="plan-gantt__day" :class="{ 'is-weekend': isWeekend(day), 'is-selected': day === selectedDay, 'is-today': day === today }" :aria-label="`${dayDate(day)}${day === today ? ' 今天' : ''}`" :aria-pressed="day === selectedDay" @click="selectedDay = day">{{ Number(dayDate(day).slice(-2)) }}</button>
          </div>
        </div>
      </header>
      <ElScrollbar ref="timeline" class="plan-gantt__scroll" @scroll="timelineScrolled">
        <div class="plan-gantt__canvas" :style="{ width: `${timelineWidth}px`, height: `${Math.max(data.length * GANTT_ROW_HEIGHT, 1)}px` }" @pointerenter="hoverCanvas" @pointermove="hoverCanvas" @pointerleave="leaveCanvas" @pointerdown="beginPan" @lostpointercapture="cleanupPan">
          <div class="plan-gantt__weekends" aria-hidden="true"><i v-for="day in days.filter(isWeekend)" :key="day" :style="{ left: `${xForDay(day)}px` }" /></div>
          <div class="plan-gantt__date-line" :style="{ left: `${xForDay(selectedDay) + GANTT_DAY_WIDTH / 2}px` }" aria-hidden="true" />
          <div v-for="row in data" :key="row.id" v-memo="[row, draft?.id === row.id ? draft.schedule : null, hoveredMilestone, range.start, milestoneRevision]" class="plan-gantt__row" :data-work-item-id="row.id">
            <div v-if="scheduleDays(scheduleFor(row))" class="gantt-task" :class="[`state-${barState(row)}`, { 'is-editable': editable(row), 'is-dragging': draft?.id === row.id }]" :style="barStyle(row)" :data-task-id="row.id">
              <div class="gantt-task__surface" />
              <div class="gantt-task__track"><div class="gantt-task__fill" /></div>
              <div class="gantt-task__move" role="button" :tabindex="editable(row) ? 0 : -1" :aria-disabled="!editable(row)" :aria-label="`${row.title}，${displayDate(scheduleFor(row).plannedStart)}至${displayDate(scheduleFor(row).plannedEnd)}`" @pointerdown="beginDrag($event, row, 'move')" @keydown="keyboardEdit($event, row, 'move')" />
              <template v-if="editable(row)">
                <VisTooltip v-for="mode in (['start', 'end', 'progress'] as const)" :key="mode" class="gantt-task__handle-wrap" :class="`handle-${mode}`" :style="mode === 'progress' ? progressStyle(row) : undefined" :content="handleText(row, mode)" position="top" teleported :open-delay="300" :model-value="draft?.id === row.id && draft.mode === mode ? true : undefined">
                  <button class="gantt-task__handle" :class="{ 'is-single': mode === 'progress' }" :aria-label="`${mode === 'start' ? '调整开始日期' : mode === 'end' ? '调整结束日期' : '调整完成度'}：${row.title}`" @pointerdown="beginDrag($event, row, mode)" @keydown="keyboardEdit($event, row, mode)"><i /><i v-if="mode !== 'progress'" /></button>
                </VisTooltip>
              </template>
              <VisTooltip v-if="draft?.id === row.id && draft.mode === 'move'" class="gantt-task__move-tip" :content="`${displayDate(draft.schedule.plannedStart)} — ${displayDate(draft.schedule.plannedEnd)}`" :model-value="true" trigger="manual" position="top" teleported><span /></VisTooltip>
            </div>
            <VisButton v-else variant="text" size="sm" class="plan-gantt__unscheduled" label="设置工作项日期" @click="emit('notice', '请先在工作项中填写开始和结束日期')">未排期</VisButton>
            <VisTooltip v-for="milestone in milestoneFor(row.id)" :key="milestone.id" class="gantt-milestone" :style="{ left: `${xForDay(dateDay(milestone.date)!) + GANTT_DAY_WIDTH / 2 - 16}px` }" :content="`${milestone.name} · ${displayDate(milestone.date)}`" position="top" teleported :open-delay="300">
              <span class="gantt-milestone__marker" @mouseenter="hoveredMilestone = milestone.id" @mouseleave="hoveredMilestone = null"><img :src="hoveredMilestone === milestone.id ? milestoneHoverImage : milestoneImage" width="32" height="32" :alt="milestone.name"></span>
            </VisTooltip>
            <VisTooltip v-if="row.item.blocked || row.item.status === 'blocked'" class="gantt-block" :style="{ left: `${blockedX(row)}px` }" :content="row.item.blocked?.reason ?? '工作项存在阻塞，请先解除阻塞条件'" position="top" teleported :open-delay="300"><span class="gantt-block__label">阻塞</span></VisTooltip>
          </div>
        </div>
        <div v-if="!data.length" class="plan-gantt__empty">未找到符合条件的工作项</div>
      </ElScrollbar>
    </div>
    <span class="plan-gantt__sr-only" aria-live="polite">{{ draft ? `${draft.mode === 'progress' ? '完成度' : '排期'}预览，按 Escape 取消` : '' }}</span>
  </div>
</template>

<style scoped>
.plan-gantt { position: relative; min-width: 0; min-height: 0; height: 100%; display: flex; overflow: hidden; border: 1px solid var(--color-border-default); border-radius: var(--radius-sm); background: var(--color-bg-canvas); }
.plan-gantt__attributes { box-sizing: border-box; width: var(--plan-left-width); min-width: 0; flex: 0 0 var(--plan-left-width); padding-right: 1px; overflow: hidden; }
.plan-gantt__table { height: 100%; border-radius: 0; }
.plan-gantt__table::after { display: none; }
.plan-gantt__table :deep(.vis-el-table__inner-wrapper) { height: 100%; min-height: 0; }
.plan-gantt__table :deep(.vis-el-table__body-wrapper) { height: calc(100% - 48px); min-height: 0; }
.plan-gantt__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar), .plan-gantt__table :deep(.vis-el-table__body-wrapper .vis-el-scrollbar__wrap) { height: 100%; min-height: 0; }
.plan-gantt__table :deep(.vis-el-table__cell), .plan-gantt__table :deep(.vis-table-header), .plan-gantt__table :deep(.vis-table-item) { height: 48px; box-sizing: border-box; }
.plan-gantt__table :deep(.vis-el-table__cell) { padding: 0; }
.plan-gantt__table :deep(.cell) { padding: 0; height: 47px; }
.plan-gantt__table :deep(.vis-table-item) { border-bottom: 0; height: 47px; }
.plan-gantt__table :deep(.vis-el-table__header-wrapper th) { background: var(--color-bg-primary); }
.plan-gantt__split { position: absolute; z-index: 6; top: 0; bottom: 0; left: calc(var(--plan-left-width) - 3px); width: 6px; cursor: col-resize; touch-action: none; }
/* Paint inside the reserved 1px gutter, not beside an exposed next-column border. */
.plan-gantt__split::after { content: ''; position: absolute; top: 0; bottom: 0; left: 2px; width: 1px; background: var(--color-border-default); pointer-events: none; }
.plan-gantt__split:focus-visible { outline: none; }
.plan-gantt__split:hover::after, .plan-gantt__split:focus-visible::after { background: var(--color-fg-brand-primary); }
.plan-gantt__timeline { min-width: 0; min-height: 0; flex: 1; display: flex; flex-direction: column; }
.plan-gantt__calendar { height: 48px; flex: 0 0 48px; overflow: hidden; background: var(--color-bg-surface); }
.plan-gantt__calendar-content { will-change: transform; }
.plan-gantt__months, .plan-gantt__days { height: 24px; display: flex; }
.plan-gantt__months span { box-sizing: border-box; flex: none; height: 24px; padding: 0 var(--space-4); border-right: 1px solid var(--color-border-default); border-bottom: 1px solid var(--color-border-default); color: var(--color-text-tertiary); font-size: var(--font-text-sm-size); line-height: 23px; }
.plan-gantt__day { box-sizing: border-box; width: var(--gantt-day-width); height: 24px; flex: none; padding: 0; border: 0; border-right: 1px solid var(--color-border-default); border-bottom: 1px solid var(--color-border-default); background: var(--color-bg-surface); color: var(--color-text-tertiary); font: inherit; font-size: var(--font-text-sm-size); cursor: pointer; }
.plan-gantt__day.is-weekend { background: var(--color-bg-primary); }
.plan-gantt__day.is-today { color: var(--color-fg-brand-primary); font-weight: 600; }
.plan-gantt__day.is-selected { color: var(--color-text-white); background: var(--color-fg-brand-primary); }
.plan-gantt__day:focus-visible { outline: 2px solid var(--color-fg-brand-primary); outline-offset: -2px; }
.plan-gantt__scroll { position: relative; min-height: 0; flex: 1; overflow: hidden; }
.plan-gantt__canvas { position: relative; min-height: 100%; cursor: grab; touch-action: pan-y; background-image: linear-gradient(to right, transparent calc(100% - 1px), var(--color-border-default) 0); background-size: var(--gantt-day-width) 100%; }
.is-panning .plan-gantt__canvas, .is-panning .plan-gantt__canvas * { cursor: grabbing; user-select: none; }
.plan-gantt__weekends, .plan-gantt__weekends i { position: absolute; top: 0; bottom: 0; pointer-events: none; }
.plan-gantt__weekends { inset: 0; }
.plan-gantt__weekends i { width: calc(var(--gantt-day-width) - 1px); background: var(--color-bg-primary); }
.plan-gantt__date-line { position: absolute; top: 0; bottom: 0; z-index: 1; width: 1px; background: var(--color-fg-brand-primary); pointer-events: none; }
.plan-gantt__row { position: relative; height: 48px; }
.gantt-task { position: absolute; top: 8px; height: 32px; z-index: 2; }
.gantt-task__surface { position: absolute; inset: 0 -16px; border-radius: var(--radius-sm); background: var(--color-bg-surface); box-shadow: var(--shadow-default-md); opacity: 0; }
/* The surface is also the hit area: the gap between the bar and date grips must not end hover. */
.gantt-task:hover, .gantt-task:focus-within, .gantt-task.is-dragging { z-index: 5; }
.gantt-task:hover .gantt-task__surface, .gantt-task:focus-within .gantt-task__surface, .gantt-task.is-dragging .gantt-task__surface { opacity: 1; }
.gantt-task__track { position: absolute; top: 8px; left: 0; right: 0; height: 16px; overflow: hidden; border-radius: var(--radius-sm); background: var(--color-fg-brand-secondary); }
.state-pending .gantt-task__track { background: var(--color-fg-disabled); }
.state-complete .gantt-task__track { background: var(--color-fg-success-primary); }
.gantt-task__fill { width: var(--task-progress); height: 100%; border-radius: inherit; background: var(--color-fg-brand-primary); }
.state-pending .gantt-task__fill, .state-complete .gantt-task__fill { display: none; }
.gantt-task__move { position: absolute; inset: 0; outline: none; }
.is-editable .gantt-task__move { cursor: grab; touch-action: none; }
.is-dragging .gantt-task__move { cursor: grabbing; }
.gantt-task__move:focus-visible { outline: 2px solid var(--color-fg-brand-primary); outline-offset: 3px; border-radius: var(--radius-sm); }
.gantt-task__handle-wrap { position: absolute; top: 10px; width: 12px; height: 12px; z-index: 3; visibility: hidden; }
.gantt-task:hover .gantt-task__handle-wrap, .gantt-task:focus-within .gantt-task__handle-wrap, .is-dragging .gantt-task__handle-wrap { visibility: visible; }
.handle-start { left: -14px; }
.handle-end { right: -14px; }
.gantt-task__handle-wrap.handle-progress { top: 12px; width: 8px; height: 8px; }
.gantt-task__handle { display: flex; position: relative; align-items: center; justify-content: center; gap: 2px; width: 12px; height: 12px; padding: 0; border: 0; border-radius: 2px; background: transparent; cursor: ew-resize; touch-action: none; }
.gantt-task__handle i { width: 1px; height: 10px; border-radius: var(--radius-full); background: var(--color-fg-quaternary); }
.gantt-task__handle:hover { background: var(--color-component-hover); }
.gantt-task__handle.is-single { width: 8px; height: 8px; }
.gantt-task__handle.is-single i { position: absolute; top: 0; left: 4px; height: 8px; background: color-mix(in srgb, var(--color-fg-white) 50%, transparent); }
.gantt-task__move-tip { position: absolute; left: 50%; top: 0; }
.gantt-milestone { position: absolute; top: 8px; z-index: 4; width: 32px; height: 32px; }
.gantt-milestone__marker, .gantt-milestone img { display: block; width: 32px; height: 32px; }
.gantt-block { position: absolute; top: 14px; z-index: 4; }
.gantt-block__label { display: block; height: 20px; padding: 1px 8px; box-sizing: border-box; border-radius: var(--radius-sm); color: var(--color-text-white); background: var(--color-fg-danger-primary); font-size: var(--font-text-sm-size); line-height: var(--font-text-sm-line-height); }
.gantt-block__label:hover { background: color-mix(in srgb, var(--color-fg-danger-primary), var(--color-component-hover) 10%); }
.plan-gantt__unscheduled { position: sticky; top: 12px; left: 16px; }
.plan-gantt__empty { position: absolute; top: 32px; left: 0; right: 0; text-align: center; color: var(--color-text-tertiary); }
.plan-gantt__sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.plan-gantt__scroll :deep(.vis-el-scrollbar__wrap) { height: 100%; overflow: auto; overscroll-behavior: contain; scrollbar-width: none; }
.plan-gantt__scroll :deep(.vis-el-scrollbar__wrap::-webkit-scrollbar) { display: none; }
.plan-gantt__scroll :deep(.vis-el-scrollbar__bar) { position: absolute; z-index: 5; right: 2px; bottom: 2px; border-radius: 4px; }
.plan-gantt__scroll :deep(.vis-el-scrollbar__bar.is-horizontal) { display: none; }
.plan-gantt__scroll :deep(.vis-el-scrollbar__bar.is-vertical) { width: 6px; top: 2px; }
.plan-gantt__scroll :deep(.vis-el-scrollbar__thumb) { position: relative; display: block; width: 100%; height: 100%; border-radius: inherit; background: var(--color-fg-quaternary); opacity: .45; cursor: pointer; }
</style>
