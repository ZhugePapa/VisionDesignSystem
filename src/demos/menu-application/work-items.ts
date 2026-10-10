import type { VisAvatarImageVariant } from '../../components/avatar'

export type DemoWorkItemType = 'epic' | 'feature' | 'story' | 'task' | 'bug'
export type DemoWorkItemStatus =
  | 'not-started'
  | 'planning'
  | 'in-progress'
  | 'to-verify'
  | 'completed'
  | 'closed'
  | 'blocked'
export type DemoWorkItemPriority = 'low' | 'medium' | 'high' | 'highest'

export interface DemoWorkItemAssignee {
  name: string
  avatar: VisAvatarImageVariant
}

export interface DemoWorkItem {
  id: string
  key: string
  title: string
  type: DemoWorkItemType
  parentId?: string
  status: DemoWorkItemStatus
  plannedStart: string
  plannedEnd: string
  assignees: DemoWorkItemAssignee[]
  creator: string
  priority: DemoWorkItemPriority
  iteration: string
  actualHours: number
  progress: number
  followed?: boolean
  blocked?: { reason: string }
  scheduleOverrides?: Partial<{ plannedStart: string; plannedEnd: string; progress: number }>
}

export const demoWorkItemPeople: DemoWorkItemAssignee[] = [
  { name: '张大山', avatar: '09' },
  { name: '李明', avatar: '08' },
  { name: '王强', avatar: '05' },
  { name: '赵敏', avatar: '02' },
  { name: '周凯', avatar: '06' },
]

const peopleByName = new Map(demoWorkItemPeople.map((person) => [person.name, person]))

function people(...names: string[]): DemoWorkItemAssignee[] {
  return names.map((name) => peopleByName.get(name) ?? demoWorkItemPeople[0])
}

const designedWorkItems: DemoWorkItem[] = [
  {
    id: 'feature-015', key: 'FEAT-015', title: '飞控任务调度与资源管理能力建设', type: 'feature',
    status: 'in-progress', plannedStart: '2025/08/01', plannedEnd: '2025/10/15', assignees: people('李明'),
    creator: '张大山', priority: 'high', iteration: '飞控核心能力迭代 04', actualHours: 168, progress: 58, followed: true,
  },
  {
    id: 'feature-008', key: 'FEAT-008', title: '机载通信链路可靠性优化', type: 'feature',
    status: 'to-verify', plannedStart: '2025/07/20', plannedEnd: '2025/09/30', assignees: people('王强'),
    creator: '李明', priority: 'medium', iteration: '通信链路优化迭代 02', actualHours: 142, progress: 86,
  },
  {
    id: 'feature-006', key: 'FEAT-006', title: '设备健康状态智能监测能力', type: 'feature',
    status: 'planning', plannedStart: '2025/09/01', plannedEnd: '2025/11/20', assignees: people('赵敏'),
    creator: '赵敏', priority: 'high', iteration: '健康管理能力迭代 01', actualHours: 32, progress: 12,
  },
  {
    id: 'feature-014', key: 'FEAT-014', title: '软件版本基线与配置管理能力', type: 'feature',
    status: 'planning', plannedStart: '2025/06/15', plannedEnd: '2025/08/30', assignees: people('周凯'),
    creator: '周凯', priority: 'high', iteration: '软件配置管理迭代 03', actualHours: 96, progress: 40,
  },
  {
    id: 'feature-023', key: 'FEAT-023', title: '自动化集成测试环境建设', type: 'feature',
    status: 'in-progress', plannedStart: '2025/08/10', plannedEnd: '2025/10/30', assignees: people('周凯'),
    creator: '李明', priority: 'medium', iteration: '自动化测试平台迭代 02', actualHours: 126, progress: 52, followed: true,
  },
  {
    id: 'feature-009', key: 'FEAT-009', title: '研制数据安全审计与追踪能力', type: 'feature',
    status: 'in-progress', plannedStart: '2025/10/01', plannedEnd: '2025/12/15', assignees: people('张大山'),
    creator: '张大山', priority: 'high', iteration: '安全审计能力迭代 01', actualHours: 44, progress: 24,
  },
  {
    id: 'bug-021', key: 'BUG-021', title: '航迹规划异常情况下退出保护失效', type: 'bug',
    status: 'closed', plannedStart: '2025/07/01', plannedEnd: '2025/07/12', assignees: people('周凯', '李明', '张大山'),
    creator: '王强', priority: 'low', iteration: '自主导航缺陷修复 07', actualHours: 28, progress: 100,
  },
  {
    id: 'bug-031', key: 'BUG-031', title: '仿真环境下传感器数据丢失', type: 'bug',
    status: 'to-verify', plannedStart: '2025/10/12', plannedEnd: '2025/10/18', assignees: people('张大山'),
    creator: '赵敏', priority: 'high', iteration: '半实物仿真迭代 05', actualHours: 12, progress: 82, followed: true,
  },
  {
    id: 'epic-001', key: 'EPIC-001', title: 'XX型无人机飞控系统研制', type: 'epic',
    status: 'in-progress', plannedStart: '2025/03/01', plannedEnd: '2025/12/30', assignees: people('张大山'),
    creator: '张大山', priority: 'highest', iteration: '飞控系统年度研制主线', actualHours: 1286, progress: 64, followed: true,
  },
  {
    id: 'feature-012', key: 'FEAT-012', title: '飞控软件自主导航能力开发', type: 'feature', parentId: 'epic-001',
    status: 'not-started', plannedStart: '2025/03/01', plannedEnd: '2025/12/30', assignees: people('李明'),
    creator: '张大山', priority: 'highest', iteration: '自主导航能力迭代 03', actualHours: 0, progress: 0,
  },
  {
    id: 'story-034', key: 'US-034', title: '支持多航点自主规划任务', type: 'story', parentId: 'feature-012',
    status: 'to-verify', plannedStart: '2025/06/01', plannedEnd: '2025/07/15', assignees: people('王强'),
    creator: '李明', priority: 'high', iteration: '航迹规划能力迭代 02', actualHours: 126, progress: 88,
  },
  {
    id: 'task-089', key: 'TASK-089', title: '编写航迹规划算法接口文档', type: 'task', parentId: 'story-034',
    status: 'completed', plannedStart: '2025/07/08', plannedEnd: '2025/07/08', assignees: people('王强'),
    creator: '王强', priority: 'medium', iteration: '航迹规划能力迭代 02', actualHours: 8, progress: 100,
  },
  {
    id: 'task-090', key: 'TASK-090', title: '实现路径规划核心算法模块', type: 'task', parentId: 'story-034',
    status: 'in-progress', plannedStart: '2025/06/10', plannedEnd: '2025/07/05', assignees: people('李明'),
    creator: '李明', priority: 'high', iteration: '航迹规划能力迭代 02', actualHours: 72, progress: 68,
  },
  {
    id: 'story-041', key: 'US-041', title: '查看飞行状态实时参数', type: 'story', parentId: 'feature-012',
    status: 'in-progress', plannedStart: '2025/07/20', plannedEnd: '2025/08/10', assignees: people('赵敏'),
    creator: '赵敏', priority: 'medium', iteration: '飞行状态监测迭代 01', actualHours: 36, progress: 52,
  },
  {
    id: 'task-094', key: 'TASK-094', title: '接入姿态与航向遥测数据', type: 'task', parentId: 'story-041',
    status: 'planning', plannedStart: '2025/07/20', plannedEnd: '2025/07/28', assignees: people('赵敏'),
    creator: '赵敏', priority: 'medium', iteration: '飞行状态监测迭代 01', actualHours: 10, progress: 20,
  },
  {
    id: 'epic-002', key: 'EPIC-002', title: '航空装备智能运维保障平台建设', type: 'epic',
    status: 'planning', plannedStart: '2025/01/15', plannedEnd: '2025/12/30', assignees: people('张大山'),
    creator: '张大山', priority: 'highest', iteration: '智能保障年度主线', actualHours: 628, progress: 38,
  },
  {
    id: 'feature-031', key: 'FEAT-031', title: '机载设备故障预测模型', type: 'feature', parentId: 'epic-002',
    status: 'planning', plannedStart: '2025/04/01', plannedEnd: '2025/10/30', assignees: people('周凯'),
    creator: '周凯', priority: 'high', iteration: '智能保障能力迭代 03', actualHours: 84, progress: 22,
  },
  {
    id: 'epic-003', key: 'EPIC-003', title: '新一代机载软件工程化能力建设', type: 'epic',
    status: 'blocked', plannedStart: '2025/03/01', plannedEnd: '2025/11/30', assignees: people('李明'),
    creator: '李明', priority: 'high', iteration: '软件工程能力年度主线', actualHours: 316, progress: 31,
  },
  {
    id: 'feature-036', key: 'FEAT-036', title: '持续集成质量门禁标准化', type: 'feature', parentId: 'epic-003',
    status: 'in-progress', plannedStart: '2025/06/01', plannedEnd: '2025/09/30', assignees: people('李明'),
    creator: '李明', priority: 'high', iteration: '工程效能迭代 04', actualHours: 105, progress: 56,
  },
  {
    id: 'epic-004', key: 'EPIC-004', title: 'XX型无人机综合任务系统研制', type: 'epic',
    status: 'planning', plannedStart: '2025/03/01', plannedEnd: '2026/06/30', assignees: people('李明'),
    creator: '张大山', priority: 'high', iteration: '综合任务年度主线', actualHours: 486, progress: 28,
  },
]

const fillerTitles = [
  '飞行控制参数在线标定', '惯导数据融合精度优化', '健康管理告警策略配置', '仿真测试场景资产沉淀',
  '软件配置项追溯能力', '总线通信异常诊断', '控制律模型回归验证', '机载日志分级采集',
]
const fillerStatuses: DemoWorkItemStatus[] = ['not-started', 'planning', 'in-progress', 'to-verify', 'completed']
const fillerPriorities: DemoWorkItemPriority[] = ['low', 'medium', 'high']

const fillerWorkItems: DemoWorkItem[] = Array.from(
  { length: 196 - designedWorkItems.length },
  (_, index) => {
    const number = index + 101
    const person = demoWorkItemPeople[index % demoWorkItemPeople.length]
    const month = String((index % 10) + 1).padStart(2, '0')
    const endMonth = String(Math.min((index % 10) + 2, 12)).padStart(2, '0')
    return {
      id: `feature-generated-${number}`,
      key: `FEAT-${number}`,
      title: `${fillerTitles[index % fillerTitles.length]} ${String(index + 1).padStart(2, '0')}`,
      type: index % 7 === 0 ? 'bug' : 'feature',
      status: fillerStatuses[index % fillerStatuses.length],
      plannedStart: `2026/${month}/01`,
      plannedEnd: `2026/${endMonth}/20`,
      assignees: [person],
      creator: person.name,
      priority: fillerPriorities[index % fillerPriorities.length],
      iteration: `飞控能力迭代 ${String((index % 8) + 1).padStart(2, '0')}`,
      actualHours: (index % 16) * 8,
      progress: (index * 13) % 101,
      followed: index % 9 === 0,
    }
  },
)

export const demoWorkItems: DemoWorkItem[] = [...designedWorkItems, ...fillerWorkItems]

