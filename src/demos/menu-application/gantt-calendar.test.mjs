import test from 'node:test'
import assert from 'node:assert/strict'
import { dateDay, dayDate, editSchedule, isWeekend, monthSegments, progressHandleLeft, refreshParentSchedules, scheduleDays } from './gantt-calendar.ts'

const original = { plannedStart: '2026-09-06', plannedEnd: '2026-09-13', progress: 50 }
test('date-only parsing validates real calendar dates and accepts legacy slash format', () => {
  assert.equal(dateDay('2026/09/06'), dateDay('2026-09-06'))
  assert.equal(dateDay('2026-02-29'), null)
  assert.equal(dateDay('2026-13-01'), null)
  assert.equal(dateDay('invalid'), null)
  assert.equal(dayDate(dateDay('2024-02-29')), '2024-02-29')
})
test('moving snaps to whole days and preserves inclusive duration', () => {
  const next = editSchedule(original, 'move', 63)
  assert.equal(next.plannedStart, '2026-09-08')
  assert.equal(next.plannedEnd, '2026-09-15')
  assert.equal(next.progress, 50)
  assert.equal(editSchedule(original, 'move', 15).plannedStart, original.plannedStart)
})
test('resizing cannot invert start/end and allows a one-day task', () => {
  assert.equal(editSchedule(original, 'start', 1000).plannedStart, original.plannedEnd)
  assert.equal(editSchedule(original, 'end', -1000).plannedEnd, original.plannedStart)
  assert.notEqual(scheduleDays(editSchedule(original, 'end', -1000)), null)
})
test('progress is based on the entire bar width and is independent of status', () => {
  assert.equal(editSchedule(original, 'progress', 64).progress, 75)
  assert.equal(editSchedule(original, 'progress', -1000).progress, 0)
  assert.equal(editSchedule(original, 'progress', 1000).progress, 100)
  assert.equal(editSchedule(original, 'progress', 64).plannedStart, original.plannedStart)
})
test('month segmentation handles boundaries and leap years', () => {
  const values = monthSegments(dateDay('2024-02-27'), dateDay('2024-03-02'))
  assert.deepEqual(values.map(value => value.days), [3, 2])
  assert.equal(isWeekend(dateDay('2026-09-06')), true)
  assert.equal(isWeekend(dateDay('2026-09-07')), false)
})
test('invalid or unscheduled ranges cannot be edited', () => {
  assert.equal(scheduleDays({ ...original, plannedStart: '' }), null)
  assert.equal(scheduleDays({ ...original, plannedStart: '2026-09-14' }), null)
  assert.deepEqual(editSchedule(original, 'move', NaN), original)
})
test('progress grip follows the Figma inset and stays inside at 0/100 percent', () => {
  // Design: 268px track, 145px fill, grip x=136; stroke x=140 (5px before fill end).
  assert.equal(progressHandleLeft(268, 145 / 268 * 100), 136)
  assert.equal(progressHandleLeft(256, 50), 119)
  assert.equal(progressHandleLeft(256, 0), 0)
  assert.equal(progressHandleLeft(256, 100), 247)
  assert.equal(progressHandleLeft(32, 50), 7)
  assert.equal(progressHandleLeft(32, 100), 23)
  assert.equal(progressHandleLeft(4, 50), 0)
  assert.equal(progressHandleLeft(0, 50), 0)
  assert.equal(progressHandleLeft(256, -10), 0)
  assert.equal(progressHandleLeft(256, 110), 247)
})
test('summary fields roll up until explicitly edited; edits survive future rollups', () => {
  const root = { id: 'root', ...original }
  const parent = { id: 'parent', parentId: 'root', ...original }
  const first = { id: 'first', parentId: 'parent', plannedStart: '2026-09-01', plannedEnd: '2026-09-05', progress: 20 }
  const second = { id: 'second', parentId: 'parent', plannedStart: '2026-09-03', plannedEnd: '2026-09-08', progress: 60 }
  const items = [root, parent, first, second]
  refreshParentSchedules(items)
  assert.equal(parent.progress, 40)
  assert.equal(parent.plannedStart, '2026-09-01')
  parent.scheduleOverrides = { plannedStart: '2026-09-02', progress: 75 }
  refreshParentSchedules(items)
  assert.equal(parent.plannedStart, '2026-09-02')
  assert.equal(parent.progress, 75)
  assert.equal(root.progress, 75)
  second.plannedEnd = '2026-09-10'
  refreshParentSchedules(items)
  assert.equal(parent.plannedEnd, '2026-09-10')
  assert.equal(parent.progress, 75)
})
test('derived boundary cannot cross a manually pinned summary date', () => {
  const parent = { id: 'parent', ...original, scheduleOverrides: { plannedStart: '2026-09-10' } }
  const child = { id: 'child', parentId: 'parent', plannedStart: '2026-09-01', plannedEnd: '2026-09-05', progress: 30 }
  refreshParentSchedules([parent, child])
  assert.deepEqual(scheduleDays(parent), { start: dateDay('2026-09-10'), end: dateDay('2026-09-10') })
})
