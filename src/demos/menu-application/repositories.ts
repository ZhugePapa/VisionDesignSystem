import type { VisFeaturedIconColor } from '../../components/featured-icon'
import type { IconName } from '../../components/icons/generated/registry.generated'

export interface DemoRepositoryFile {
  name: string
  type: 'dir' | 'file'
  extension?: string
  lastCommit: string
  committer: string
  updatedAt: string
  children?: DemoRepositoryFile[]
}

export interface DemoCommit {
  id: string
  message: string
  author: string
  time: string
  branch?: string
}

export interface DemoLatestCommit {
  author: string
  message: string
  time: string
  hash: string
}

export interface DemoRepository {
  key: string
  name: string
  code: string
  description: string
  icon: IconName
  color: VisFeaturedIconColor
  pullRequests: number
  branches: number
  stars: number
  defaultBranch: string
  language: string
  path: string
  files: DemoRepositoryFile[]
  commits: DemoCommit[]
  latestCommit: DemoLatestCommit
}

export const demoRepositories: DemoRepository[] = [
  {
    key: 'flight-control-core',
    name: '飞控核心模块',
    code: 'Plane-control',
    description: '飞行控制系统核心算法与控制逻辑，包含姿态控制、航向控制和稳定性计算。',
    icon: 'plane',
    color: 'brand',
    pullRequests: 12,
    branches: 6,
    stars: 23,
    defaultBranch: 'master',
    language: 'C++',
    path: '机载软件中心 / 飞控系统 / 核心算法',
    files: [
      { name: 'image', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
      { name: 'compose', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
      { name: 'result', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
      { name: 'vote', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
      {
        name: 'src',
        type: 'dir',
        lastCommit: 'initial commit',
        committer: '张大山',
        updatedAt: '3 周前',
        children: [
          { name: 'assets', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'components', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'demos', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'docs', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'services', type: 'dir', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'app.vue', type: 'file', extension: 'vue', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'main.ts', type: 'file', extension: 'ts', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
          { name: 'index.ts', type: 'file', extension: 'ts', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
        ],
      },
      { name: 'LICENSE', type: 'file', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
      { name: 'README.MD', type: 'file', extension: 'md', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
      { name: 'docker-compose.yml', type: 'file', extension: 'yml', lastCommit: 'initial commit', committer: '张大山', updatedAt: '3 周前' },
    ],
    commits: [
      { id: '8f2a1c9', message: '更新姿态解算精度补偿', author: '张大山', time: '2026-07-24 10:32', branch: 'master' },
      { id: '3b7e05d', message: '新增航向保持接口', author: '李四', time: '2026-07-23 16:18' },
      { id: 'c91d42f', message: '补充稳定性回归用例', author: '王工', time: '2026-07-22 09:41' },
      { id: 'a51f8b2', message: '调整编译目标为静态库', author: '张大山', time: '2026-07-20 17:26' },
    ],
    latestCommit: {
      author: '张大山',
      message: 'feat: add multi-model AI routing',
      time: '4 分钟前',
      hash: '3е73e7ff',
    },
  },
  {
    key: 'guidance-algo',
    name: '制导算法库',
    code: 'Guidance-algo',
    description: '提供比例导引、追踪与拦截等制导算法的仿真与实装实现。',
    icon: 'calculator',
    color: 'danger',
    pullRequests: 12,
    branches: 6,
    stars: 23,
    defaultBranch: 'main',
    language: 'C++',
    path: '机载软件中心 / 飞控系统 / 核心算法',
    files: [
      {
        name: 'src',
        type: 'dir',
        lastCommit: '修正比例导引过载限制',
        committer: '陈工',
        updatedAt: '3 周前',
        children: [
          { name: 'core', type: 'dir', lastCommit: '修正比例导引过载限制', committer: '陈工', updatedAt: '3 周前' },
          { name: 'math', type: 'dir', lastCommit: '补充导引律选型说明', committer: '李四', updatedAt: '3 周前' },
          { name: 'proportional_nav.cpp', type: 'file', extension: 'cpp', lastCommit: '修正比例导引过载限制', committer: '陈工', updatedAt: '3 周前' },
        ],
      },
      { name: 'docs', type: 'dir', lastCommit: '补充导引律选型说明', committer: '李四', updatedAt: '3 周前' },
      { name: 'README.md', type: 'file', extension: 'md', lastCommit: '初始化仓库文档', committer: '李四', updatedAt: '3 周前' },
    ],
    commits: [
      { id: '6d0bf3a', message: '修正比例导引过载限制', author: '陈工', time: '2026-07-24 11:02', branch: 'main' },
      { id: 'e21c84b', message: '补充导引律选型说明', author: '李四', time: '2026-07-22 15:30' },
      { id: '9fa4d17', message: '初始化仓库文档', author: '李四', time: '2026-07-19 10:00' },
    ],
    latestCommit: {
      author: '陈工',
      message: '修正比例导引过载限制',
      time: '2 小时前',
      hash: '6d0bf3a',
    },
  },
  {
    key: 'attitude-algo',
    name: '姿态估计算法',
    code: 'Attitude-estimation',
    description: '提供基于惯导、卫星导航和传感器融合的姿态解算能力。',
    icon: 'calculator',
    color: 'warning',
    pullRequests: 12,
    branches: 6,
    stars: 23,
    defaultBranch: 'develop',
    language: 'C++',
    path: '机载软件中心 / 飞控系统 / 核心算法',
    files: [
      {
        name: 'src',
        type: 'dir',
        lastCommit: '优化卡尔曼滤波协方差初值',
        committer: '王工',
        updatedAt: '3 周前',
        children: [
          { name: 'fusion', type: 'dir', lastCommit: '接入卫星导航双频数据', committer: '张大山', updatedAt: '3 周前' },
          { name: 'kalman_filter.cpp', type: 'file', extension: 'cpp', lastCommit: '优化卡尔曼滤波协方差初值', committer: '王工', updatedAt: '3 周前' },
        ],
      },
      { name: 'README.md', type: 'file', extension: 'md', lastCommit: '说明传感器融合策略', committer: '张大山', updatedAt: '3 周前' },
    ],
    commits: [
      { id: 'c7e92d1', message: '优化卡尔曼滤波协方差初值', author: '王工', time: '2026-07-23 13:20', branch: 'develop' },
      { id: 'b33a8f0', message: '接入卫星导航双频数据', author: '张大山', time: '2026-07-21 18:45' },
      { id: '5d18c6e', message: '说明传感器融合策略', author: '张大山', time: '2026-07-18 09:12' },
    ],
    latestCommit: {
      author: '王工',
      message: '优化卡尔曼滤波协方差初值',
      time: '5 小时前',
      hash: 'c7e92d1',
    },
  },
  {
    key: 'mission-plan-frontend',
    name: '任务规划前端',
    code: 'Mission-plan-ui',
    description: '管理模型仿真、半实物仿真、测试场景和验证工具。',
    icon: 'check-square-broken',
    color: 'grey',
    pullRequests: 12,
    branches: 6,
    stars: 23,
    defaultBranch: 'main',
    language: 'Vue',
    path: '机载软件中心 / 指挥控制系统',
    files: [
      {
        name: 'src',
        type: 'dir',
        lastCommit: '新增场景编排画布',
        committer: '赵前端',
        updatedAt: '3 周前',
        children: [
          { name: 'components', type: 'dir', lastCommit: '抽取仿真控制面板组件', committer: '赵前端', updatedAt: '3 周前' },
          { name: 'views', type: 'dir', lastCommit: '新增场景编排画布', committer: '赵前端', updatedAt: '3 周前' },
        ],
      },
      { name: 'package.json', type: 'file', extension: 'json', lastCommit: '升级构建依赖', committer: '钱工', updatedAt: '3 周前' },
      { name: 'README.md', type: 'file', extension: 'md', lastCommit: '补充本地运行指引', committer: '赵前端', updatedAt: '3 周前' },
    ],
    commits: [
      { id: 'd41c70a', message: '新增场景编排画布', author: '赵前端', time: '2026-07-24 09:55', branch: 'main' },
      { id: '2b9e6f5', message: '抽取仿真控制面板组件', author: '赵前端', time: '2026-07-22 14:10' },
      { id: '8c3a2d7', message: '升级构建依赖', author: '钱工', time: '2026-07-21 11:33' },
    ],
    latestCommit: {
      author: '赵前端',
      message: '新增场景编排画布',
      time: '1 天前',
      hash: 'd41c70a',
    },
  },
  {
    key: 'telemetry-gateway',
    name: '遥测数据网关',
    code: 'Telemetry-gateway',
    description: '负责遥测数据的采集、协议转换、消息转发和异常数据过滤。',
    icon: 'code-02',
    color: 'success',
    pullRequests: 12,
    branches: 6,
    stars: 23,
    defaultBranch: 'master',
    language: 'Go',
    path: '机载软件中心 / 飞控系统',
    files: [
      {
        name: 'internal',
        type: 'dir',
        lastCommit: '实现协议转换插件化',
        committer: '孙工',
        updatedAt: '3 周前',
        children: [
          { name: 'protocol', type: 'dir', lastCommit: '实现协议转换插件化', committer: '孙工', updatedAt: '3 周前' },
          { name: 'codec', type: 'dir', lastCommit: '新增遥测帧定义 v3', committer: '孙工', updatedAt: '3 周前' },
        ],
      },
      { name: 'proto', type: 'dir', lastCommit: '新增遥测帧定义 v3', committer: '孙工', updatedAt: '3 周前' },
      { name: 'gateway.go', type: 'file', extension: 'go', lastCommit: '实现协议转换插件化', committer: '孙工', updatedAt: '3 周前' },
      { name: 'README.md', type: 'file', extension: 'md', lastCommit: '说明接入与部署方式', committer: '周工', updatedAt: '3 周前' },
    ],
    commits: [
      { id: '3f8c91b', message: '实现协议转换插件化', author: '孙工', time: '2026-07-24 08:47', branch: 'master' },
      { id: 'a06d3e2', message: '新增遥测帧定义 v3', author: '孙工', time: '2026-07-23 10:26' },
      { id: '7e21b94', message: '说明接入与部署方式', author: '周工', time: '2026-07-17 13:15' },
    ],
    latestCommit: {
      author: '孙工',
      message: '实现协议转换插件化',
      time: '3 小时前',
      hash: '3f8c91b',
    },
  },
  {
    key: 'embedded-drivers',
    name: '嵌入式驱动组件',
    code: 'Embedded-drivers',
    description: '管理串口、总线、存储、传感器等硬件设备的通用驱动程序。',
    icon: 'bar-chart-square-02',
    color: 'success',
    pullRequests: 12,
    branches: 6,
    stars: 23,
    defaultBranch: 'master',
    language: 'C',
    path: '机载软件中心 / 指挥控制系统',
    files: [
      {
        name: 'drivers',
        type: 'dir',
        lastCommit: '统一 SPI 读写时序',
        committer: '吴工',
        updatedAt: '3 周前',
        children: [
          { name: 'spi', type: 'dir', lastCommit: '统一 SPI 读写时序', committer: '吴工', updatedAt: '3 周前' },
          { name: 'uart', type: 'dir', lastCommit: '适配新飞控板 BSP', committer: '吴工', updatedAt: '3 周前' },
        ],
      },
      { name: 'boards', type: 'dir', lastCommit: '适配新飞控板 BSP', committer: '吴工', updatedAt: '3 周前' },
      { name: 'spi_master.c', type: 'file', extension: 'c', lastCommit: '统一 SPI 读写时序', committer: '吴工', updatedAt: '3 周前' },
      { name: 'README.md', type: 'file', extension: 'md', lastCommit: '补充板卡适配清单', committer: '郑工', updatedAt: '3 周前' },
    ],
    commits: [
      { id: 'b84a1f7', message: '统一 SPI 读写时序', author: '吴工', time: '2026-07-24 12:08', branch: 'master' },
      { id: 'c25d9e0', message: '适配新飞控板 BSP', author: '吴工', time: '2026-07-22 15:52' },
      { id: '1a7c4b6', message: '补充板卡适配清单', author: '郑工', time: '2026-07-16 09:30' },
    ],
    latestCommit: {
      author: '吴工',
      message: '统一 SPI 读写时序',
      time: '1 天前',
      hash: 'b84a1f7',
    },
  },
]

export function findRepositoryByKey(key: string): DemoRepository | undefined {
  return demoRepositories.find((repository) => repository.key === key)
}

export function findRepositoryByName(name: string): DemoRepository | undefined {
  return demoRepositories.find((repository) => repository.name === name)
}
