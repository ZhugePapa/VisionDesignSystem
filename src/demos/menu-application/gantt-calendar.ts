/** Date-only arithmetic: do not parse locale-dependent dates or divide local days across DST. */
const DAY_MS = 86_400_000
export const GANTT_ROW_HEIGHT = 48
export const GANTT_DAY_WIDTH = 32

export interface GanttSchedule {
  plannedStart: string
  plannedEnd: string
  progress: number
}
export type GanttEditMode = 'move' | 'start' | 'end' | 'progress'

export interface GanttWorkItemSchedule extends GanttSchedule {
  id: string
  parentId?: string
  /** Manually edited summary fields take precedence over descendant rollups. */
  scheduleOverrides?: Partial<GanttSchedule>
}

/** Figma: 8px grip inset 1px from the fill end; its stroke at x=4 sits 5px inside. */
export function progressHandleLeft(width: number, progress: number): number {
  const handleInset = 9
  return Math.max(0, Math.min(width - handleInset, width * Math.min(100, Math.max(0, progress)) / 100 - handleInset))
}

/** Always aggregate the full tree; retain explicitly edited summary fields. */
export function refreshParentSchedules(items: GanttWorkItemSchedule[]): void {
  const children = new Map<string, GanttWorkItemSchedule[]>()
  for (const item of items) if (item.parentId) children.set(item.parentId, [...(children.get(item.parentId) ?? []), item])
  const visit = (item: GanttWorkItemSchedule, path = new Set<string>()): { leaves: number; progressSum: number } => {
    const descendants = children.get(item.id) ?? []
    if (!descendants.length || path.has(item.id)) return { leaves: 1, progressSum: item.progress }
    const nextPath = new Set([...path, item.id])
    const values = descendants.map(child => visit(child, nextPath))
    const days = descendants.map(scheduleDays).filter(value => value !== null)
    const overrides = item.scheduleOverrides ?? {}
    if (days.length) {
      let start = dateDay(overrides.plannedStart ?? '') ?? Math.min(...days.map(value => value.start))
      let end = dateDay(overrides.plannedEnd ?? '') ?? Math.max(...days.map(value => value.end))
      // A child edit must not invalidate a manually pinned opposite boundary.
      if (start > end) {
        if (overrides.plannedStart) end = start
        else start = end
      }
      item.plannedStart = dayDate(start)
      item.plannedEnd = dayDate(end)
    }
    const leaves = values.reduce((sum, value) => sum + value.leaves, 0)
    const descendantProgress = values.reduce((sum, value) => sum + value.progressSum, 0)
    item.progress = overrides.progress ?? Math.round(descendantProgress / leaves)
    return { leaves, progressSum: overrides.progress === undefined ? descendantProgress : item.progress * leaves }
  }
  items.filter(item => !item.parentId).forEach(item => visit(item))
}

export function dateDay(value: string): number | null {
  const match = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3])
  if (year < 1900 || year > 2100) return null
  const time = Date.UTC(year, month - 1, day)
  const date = new Date(time)
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? time / DAY_MS : null
}

export function dayDate(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10)
}

export function displayDate(value: string): string { return value.replaceAll('-', '/') }
export function localToday(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function scheduleDays(schedule: GanttSchedule): { start: number; end: number } | null {
  const start = dateDay(schedule.plannedStart), end = dateDay(schedule.plannedEnd)
  return start !== null && end !== null && start <= end ? { start, end } : null
}

/** End date is inclusive; resize clamps to at least one calendar day. */
export function editSchedule(original: GanttSchedule, mode: GanttEditMode, deltaPx: number, dayWidth = GANTT_DAY_WIDTH): GanttSchedule {
  const days = scheduleDays(original)
  if (!days || !Number.isFinite(deltaPx) || dayWidth <= 0) return { ...original }
  const delta = Math.round(deltaPx / dayWidth)
  if (mode === 'progress') {
    const width = (days.end - days.start + 1) * dayWidth
    return { ...original, progress: Math.min(100, Math.max(0, Math.round(original.progress + deltaPx / width * 100))) }
  }
  const start = mode === 'move' ? days.start + delta : mode === 'start' ? Math.min(days.end, days.start + delta) : days.start
  const end = mode === 'move' ? days.end + delta : mode === 'end' ? Math.max(days.start, days.end + delta) : days.end
  return { ...original, plannedStart: dayDate(start), plannedEnd: dayDate(end) }
}

export function monthSegments(start: number, end: number): { key: string; label: string; days: number }[] {
  const segments: { key: string; label: string; days: number }[] = []
  for (let day = start; day <= end; day++) {
    const date = new Date(day * DAY_MS)
    const key = dayDate(day).slice(0, 7)
    const previous = segments.at(-1)
    if (previous?.key === key) previous.days++
    else segments.push({ key, label: `${date.getUTCFullYear()} 年 ${date.getUTCMonth() + 1} 月`, days: 1 })
  }
  return segments
}

export function isWeekend(day: number): boolean {
  const weekday = new Date(day * DAY_MS).getUTCDay()
  return weekday === 0 || weekday === 6
}
