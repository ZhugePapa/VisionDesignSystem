import type { VisFeaturedIconColor } from '../../components/featured-icon'
import type { IconName } from '../../components/icons/generated/registry.generated'
import {
  lightweightRepositoryData,
  repositoryDataByKey,
  type DemoRepositoryData,
} from './repository-sample-data'

export type {
  DemoBlameGroup,
  DemoBlameLine,
  DemoBlameRank,
  DemoBranch,
  DemoCommit,
  DemoMergeRequest,
  DemoMergeRequestStatus,
  DemoRepositoryData,
  DemoRepositoryFile,
  DemoTag,
} from './repository-sample-data'

export interface DemoRepository {
  key: string
  name: string
  code: string
  description: string
  icon: IconName
  color: VisFeaturedIconColor
  stars: number
  language: string
  path: string
  status: 'active' | 'archived' | 'locked'
  creator: string
  data: DemoRepositoryData
}

type DemoRepositoryMetadata = Omit<DemoRepository, 'data'>

const repositoryMetadata: DemoRepositoryMetadata[] = [
  {
    key: 'flight-control-core',
    name: '飞控核心模块',
    code: 'Plane-control',
    description: '飞行控制系统核心算法与控制逻辑，包含姿态控制、航向控制和稳定性计算。',
    icon: 'plane',
    color: 'brand',
    stars: 23,
    language: 'Vue',
    path: '机载软件中心 / 飞控系统 / 核心算法',
    status: 'active',
    creator: '张大山',
  },
  {
    key: 'guidance-algo',
    name: '制导算法库',
    code: 'Guidance-algo',
    description: '提供比例导引、追踪与拦截等制导算法的仿真与实装实现。',
    icon: 'calculator',
    color: 'danger',
    stars: 18,
    language: 'C++',
    path: '机载软件中心 / 飞控系统 / 核心算法',
    status: 'active',
    creator: '李思雨',
  },
  {
    key: 'attitude-algo',
    name: '姿态估计算法',
    code: 'Attitude-estimation',
    description: '提供基于惯导、卫星导航和传感器融合的姿态解算能力。',
    icon: 'calculator',
    color: 'warning',
    stars: 16,
    language: 'C++',
    path: '机载软件中心 / 飞控系统 / 核心算法',
    status: 'active',
    creator: '王建国',
  },
  {
    key: 'mission-plan-frontend',
    name: '任务规划前端',
    code: 'Mission-plan-ui',
    description: '管理模型仿真、半实物仿真、测试场景和验证工具。',
    icon: 'check-square-broken',
    color: 'grey',
    stars: 12,
    language: 'Vue',
    path: '机载软件中心 / 指挥控制系统',
    status: 'active',
    creator: '李思雨',
  },
  {
    key: 'telemetry-gateway',
    name: '遥测数据网关',
    code: 'Telemetry-gateway',
    description: '负责遥测数据的采集、协议转换、消息转发和异常数据过滤。',
    icon: 'code-02',
    color: 'success',
    stars: 15,
    language: 'Go',
    path: '机载软件中心 / 飞控系统',
    status: 'locked',
    creator: '张大山',
  },
  {
    key: 'embedded-drivers',
    name: '嵌入式驱动组件',
    code: 'Embedded-drivers',
    description: '管理串口、总线、存储、传感器等硬件设备的通用驱动程序。',
    icon: 'bar-chart-square-02',
    color: 'success',
    stars: 11,
    language: 'C',
    path: '机载软件中心 / 指挥控制系统',
    status: 'archived',
    creator: '王建国',
  },
]

/**
 * 每个仓库保留独立、关系自洽的轻量数据集，用于模拟真实仓库差异。
 */
export const demoRepositories: DemoRepository[] = repositoryMetadata.map((repository) => ({
  ...repository,
  data: repositoryDataByKey[repository.key] ?? lightweightRepositoryData,
}))

export function findRepositoryByKey(key: string): DemoRepository | undefined {
  return demoRepositories.find((repository) => repository.key === key)
}

export function findRepositoryByName(name: string): DemoRepository | undefined {
  return demoRepositories.find((repository) => repository.name === name)
}
