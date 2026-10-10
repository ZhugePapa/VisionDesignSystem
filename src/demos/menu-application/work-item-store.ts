import { ref, watch, type Ref } from 'vue'
import { demoWorkItems, type DemoWorkItem } from './work-items'
import { dateDay, dayDate, refreshParentSchedules, scheduleDays, type GanttSchedule } from './gantt-calendar'
export { refreshParentSchedules } from './gantt-calendar'

export interface DemoPlanMilestone { id: string; name: string; date: string; workItemId: string }
export interface DemoWorkItemChange { workItemId: string; before: GanttSchedule; after: GanttSchedule; changedAt: string }
interface ProjectWorkItemStore {
  items: Ref<DemoWorkItem[]>
  planIds: Ref<string[]>
  milestones: Ref<DemoPlanMilestone[]>
  changes: Ref<DemoWorkItemChange[]>
}
const projects = new Map<string, ProjectWorkItemStore>()
const seedIds = new Set(demoWorkItems.map(item => item.id))

function isCreatedWorkItem(value: unknown): value is DemoWorkItem {
  if (!value || typeof value !== 'object') return false
  const item = value as DemoWorkItem
  return ['id', 'key', 'title', 'creator', 'iteration'].every(key => typeof (item as unknown as Record<string, unknown>)[key] === 'string')
    && !seedIds.has(item.id) && !!item.id && !!item.title.trim()
    && ['epic', 'feature', 'story', 'task', 'bug'].includes(item.type)
    && ['not-started', 'planning', 'in-progress', 'to-verify', 'completed', 'closed', 'blocked'].includes(item.status)
    && ['low', 'medium', 'high', 'highest'].includes(item.priority)
    && !!scheduleDays(item) && Number.isFinite(item.progress) && item.progress >= 0 && item.progress <= 100
    && Number.isFinite(item.actualHours) && item.actualHours >= 0
    && Array.isArray(item.assignees) && item.assignees.every(person => person && typeof person.name === 'string' && typeof person.avatar === 'string')
    && (item.parentId === undefined || typeof item.parentId === 'string')
}

export function useProjectWorkItemStore(projectKey: string): ProjectWorkItemStore {
  const existing = projects.get(projectKey)
  if (existing) return existing
  // The design mixes 2025 table dates with a 2026 timeline. Seed one coherent demo schedule.
  const planIds = demoWorkItems.slice(0, 28).map(item => item.id)
  const items = demoWorkItems.map((item, index) => {
    const copy = { ...item, assignees: item.assignees.map(person => ({ ...person })) }
    if (planIds.includes(copy.id)) {
      const start = dateDay('2026-09-01')! + index % 8
      copy.plannedStart = dayDate(start)
      copy.plannedEnd = dayDate(start + (copy.id === 'task-089' ? 0 : 7 + index % 6))
      if (copy.status === 'not-started') copy.progress = 0
      if (copy.status === 'completed' || copy.status === 'closed') copy.progress = 100
      if (copy.id === 'task-090') copy.blocked = { reason: '路径规划仿真环境未就绪，等待测试环境交付' }
    }
    return copy
  })
  refreshParentSchedules(items)
  const store: ProjectWorkItemStore = {
    items: ref(items), planIds: ref(planIds), changes: ref([]),
    milestones: ref([
      { id: 'milestone-navigation', name: '自主导航能力验收', date: '2026-09-20', workItemId: 'feature-012' },
      { id: 'milestone-path', name: '路径规划算法验证', date: '2026-09-18', workItemId: 'task-090' },
    ]),
  }
  projects.set(projectKey, store)
  const storageKey = `vision-demo-plan-v1:${projectKey}`
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (saved && Array.isArray(saved.items)) {
      if (Array.isArray(saved.createdItems)) {
        for (const item of saved.createdItems) {
          if (isCreatedWorkItem(item) && !store.items.value.some(value => value.id === item.id)) store.items.value.push(item)
        }
      }
      for (const patch of saved.items) {
        const item = store.items.value.find(value => value.id === patch.id)
        if (item && scheduleDays(patch) && Number.isFinite(patch.progress) && patch.progress >= 0 && patch.progress <= 100) {
          Object.assign(item, { plannedStart: patch.plannedStart, plannedEnd: patch.plannedEnd, progress: patch.progress })
          if (patch.scheduleOverrides && typeof patch.scheduleOverrides === 'object') {
            const override = patch.scheduleOverrides
            item.scheduleOverrides = {
              ...(typeof override.plannedStart === 'string' && dateDay(override.plannedStart) !== null ? { plannedStart: override.plannedStart } : {}),
              ...(typeof override.plannedEnd === 'string' && dateDay(override.plannedEnd) !== null ? { plannedEnd: override.plannedEnd } : {}),
              ...(Number.isFinite(override.progress) && override.progress >= 0 && override.progress <= 100 ? { progress: override.progress } : {}),
            }
          }
        }
      }
      if (Array.isArray(saved.planIds)) store.planIds.value = saved.planIds.filter((id: unknown) => typeof id === 'string' && store.items.value.some(item => item.id === id))
      refreshParentSchedules(store.items.value)
    }
  } catch { /* Storage is optional; an unavailable/corrupt cache must not block the demo. */ }
  watch([store.items, store.planIds], () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        items: store.items.value.map(({ id, plannedStart, plannedEnd, progress, scheduleOverrides }) => ({ id, plannedStart, plannedEnd, progress, scheduleOverrides })),
        createdItems: store.items.value.filter(item => !seedIds.has(item.id)),
        planIds: store.planIds.value,
      }))
    } catch { /* Keep in-memory editing usable when browser storage is unavailable. */ }
  }, { deep: true })
  return store
}
