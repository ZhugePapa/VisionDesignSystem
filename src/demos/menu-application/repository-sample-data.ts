export type DemoRepositoryFileType = 'dir' | 'file'
export type DemoMergeRequestStatus = 'open' | 'merged' | 'draft' | 'rejected' | 'closed'
export type DemoBlameRank = 'default' | 'rank2' | 'rank3' | 'rank4' | 'rank5' | 'rank6'

export interface DemoBlameLine {
  content: string
  lineNumber: number
}

export interface DemoBlameGroup {
  id: string
  author: string
  commit: string
  time: string
  rank: DemoBlameRank
  lines: DemoBlameLine[]
}

export interface DemoRepositoryFile {
  name: string
  type: DemoRepositoryFileType
  extension?: string
  size?: string
  content?: string
  lastCommitId: string
  lastCommit: string
  committer: string
  updatedAt: string
  commitIds: string[]
  blame?: DemoBlameGroup[]
  children?: DemoRepositoryFile[]
}

export interface DemoCommit {
  id: string
  message: string
  description?: string
  author: string
  time: string
  relativeTime: string
  branch: string
  changedPaths: string[]
  verified?: boolean
  mergeRequestId?: number
}

export interface DemoBranch {
  name: string
  commitId: string
  protected: boolean
  isDefault: boolean
  updatedBy: string
  updatedAt: string
  stale: boolean
}

export interface DemoMergeRequest {
  id: number
  title: string
  description: string
  author: string
  sourceBranch: string
  targetBranch: string
  status: DemoMergeRequestStatus
  createdAt: string
  updatedAt: string
  commits: number
  comments: number
  additions: number
  deletions: number
  reviewers: string[]
}

export interface DemoTag {
  name: string
  commitId: string
  createdAt: string
  description?: string
}

export interface DemoRepositoryData {
  defaultBranch: string
  files: DemoRepositoryFile[]
  branchFiles: Record<string, DemoRepositoryFile[]>
  branchHeadCommitIds: Record<string, string>
  branchCommitIds: Record<string, string[]>
  commits: DemoCommit[]
  branches: DemoBranch[]
  mergeRequests: DemoMergeRequest[]
  tags: DemoTag[]
  readme: string
}

interface RepositoryFixtureConfig {
  key: string
  title: string
  defaultBranch: 'main' | 'master' | 'develop'
  sourcePath: string
  sourceFile: string
  extension: string
  manifestName: string
  manifestContent: string
  mainContent: string
  featureContent: string
  featureBranch: string
  headId: string
  featureId: string
  docsId: string
  initId: string
  headMessage: string
  featureMessage: string
  author: string
  reviewer: string
  withBlame?: boolean
  extraBranch?: string
  extraTag?: string
  draftTitle?: string
}

function extensionOf(fileName: string): string {
  return fileName.includes('.') ? fileName.split('.').pop() ?? '' : ''
}

function createBlame(
  content: string,
  config: Pick<RepositoryFixtureConfig, 'key' | 'author' | 'reviewer' | 'headMessage'>,
): DemoBlameGroup[] {
  const lines = content.trimEnd().split('\n')
  const splitIndex = Math.max(1, Math.ceil(lines.length / 2))
  const toLines = (start: number, values: string[]): DemoBlameLine[] =>
    values.map((line, index) => ({ content: line, lineNumber: start + index }))

  const groups: DemoBlameGroup[] = [
    {
      id: `${config.key}-foundation`,
      author: config.reviewer,
      commit: 'chore: 初始化仓库',
      time: '2 天前',
      rank: 'rank3',
      lines: toLines(1, lines.slice(0, splitIndex)),
    },
    {
      id: `${config.key}-latest`,
      author: config.author,
      commit: config.headMessage,
      time: '4 分钟前',
      rank: 'rank6',
      lines: toLines(splitIndex + 1, lines.slice(splitIndex)),
    },
  ]

  return groups.filter((group) => group.lines.length > 0)
}

function sourceTree(
  path: string,
  sourceFile: DemoRepositoryFile,
  directoryMeta: Pick<DemoRepositoryFile, 'lastCommitId' | 'lastCommit' | 'committer' | 'updatedAt' | 'commitIds'>,
): DemoRepositoryFile {
  const segments = path.split('/').filter(Boolean)
  let node = sourceFile
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    node = {
      name: segments[index],
      type: 'dir',
      ...directoryMeta,
      children: [node],
    }
  }
  return node
}

function createFiles(
  config: RepositoryFixtureConfig,
  content: string,
  commitId: string,
  message: string,
  updatedAt: string,
  includeBlame: boolean,
  historyIds: string[],
): DemoRepositoryFile[] {
  const primaryPath = `${config.sourcePath}/${config.sourceFile}`
  const primaryFile: DemoRepositoryFile = {
    name: config.sourceFile,
    type: 'file',
    extension: config.extension,
    size: `${Math.max(0.42, content.length / 620).toFixed(2)}kb`,
    content,
    lastCommitId: commitId,
    lastCommit: message,
    committer: config.author,
    updatedAt,
    commitIds: historyIds,
    blame: includeBlame ? createBlame(content, config) : undefined,
  }
  const directoryMeta = {
    lastCommitId: commitId,
    lastCommit: message,
    committer: config.author,
    updatedAt,
    commitIds: historyIds,
  }
  const readme = `# ${config.title}\n\n${config.title}的轻量演示仓库，包含源码、构建配置、测试和协作记录。\n\n## 快速开始\n\n\`\`\`bash\nmake test\n\`\`\`\n\n## 主要源码\n\n- \`${primaryPath}\`\n`

  return [
    sourceTree(config.sourcePath, primaryFile, directoryMeta),
    {
      name: 'tests',
      type: 'dir',
      lastCommitId: commitId,
      lastCommit: message,
      committer: config.reviewer,
      updatedAt,
      commitIds: [commitId],
      children: [
        {
          name: `${config.key}.spec.${config.extension === 'vue' ? 'ts' : config.extension}`,
          type: 'file',
          extension: config.extension === 'vue' ? 'ts' : config.extension,
          size: '0.86kb',
          content: `// ${config.title} regression fixture\n// Covers the primary execution path.\n`,
          lastCommitId: commitId,
          lastCommit: message,
          committer: config.reviewer,
          updatedAt,
          commitIds: [commitId],
        },
      ],
    },
    {
      name: config.manifestName,
      type: 'file',
      extension: extensionOf(config.manifestName),
      size: '0.68kb',
      content: config.manifestContent,
      lastCommitId: config.initId,
      lastCommit: 'chore: 初始化构建配置',
      committer: config.reviewer,
      updatedAt: '3 周前',
      commitIds: [config.initId],
    },
    {
      name: 'README.md',
      type: 'file',
      extension: 'md',
      size: '1.12kb',
      content: readme,
      lastCommitId: config.docsId,
      lastCommit: 'docs: 完善运行和目录说明',
      committer: config.reviewer,
      updatedAt: '5 天前',
      commitIds: [config.docsId, config.initId],
    },
  ]
}

function createRepositoryData(config: RepositoryFixtureConfig): DemoRepositoryData {
  const defaultFiles = createFiles(config, config.mainContent, config.headId, config.headMessage, '4 分钟前', Boolean(config.withBlame), [config.headId, config.initId])
  const developFiles = createFiles(config, config.mainContent, config.initId, 'chore: 初始化仓库', '3 周前', false, [config.initId])
  const featureFiles = createFiles(
    config,
    config.featureContent,
    config.featureId,
    config.featureMessage,
    '2 天前',
    Boolean(config.withBlame),
    [config.featureId, config.initId],
  )
  const developBranch = config.defaultBranch === 'develop' ? 'main' : 'develop'
  const readme = defaultFiles.find((file) => file.name === 'README.md')?.content ?? ''
  const extraBranch = config.extraBranch
    ? [{
        name: config.extraBranch,
        commitId: config.headId,
        protected: true,
        isDefault: false,
        updatedBy: config.author,
        updatedAt: '2026-08-04 10:40',
        stale: true,
      }]
    : []
  const draftRequests: DemoMergeRequest[] = config.draftTitle
    ? [{
        id: 17,
        title: config.draftTitle,
        description: '方案仍在整理中，暂不进入正式评审流程。',
        author: config.author,
        sourceBranch: config.extraBranch ?? config.featureBranch,
        targetBranch: config.defaultBranch,
        status: 'draft',
        createdAt: '2026-08-10 16:42',
        updatedAt: '昨天',
        commits: 2,
        comments: 1,
        additions: 31,
        deletions: 4,
        reviewers: [config.reviewer],
      }]
    : []

  return {
    defaultBranch: config.defaultBranch,
    files: defaultFiles,
    branchFiles: {
      [config.defaultBranch]: defaultFiles,
      [developBranch]: developFiles,
      [config.featureBranch]: featureFiles,
      ...(config.extraBranch ? { [config.extraBranch]: defaultFiles } : {}),
    },
    branchHeadCommitIds: {
      [config.defaultBranch]: config.headId,
      [developBranch]: config.docsId,
      [config.featureBranch]: config.featureId,
      ...(config.extraBranch ? { [config.extraBranch]: config.headId } : {}),
    },
    branchCommitIds: {
      [config.defaultBranch]: [config.headId, config.docsId, config.initId],
      [developBranch]: [config.docsId, config.initId],
      [config.featureBranch]: [config.featureId, config.initId],
      ...(config.extraBranch
        ? { [config.extraBranch]: [config.headId, config.docsId, config.initId] }
        : {}),
    },
    commits: [
      {
        id: config.headId,
        message: config.headMessage,
        description: `- 更新 ${config.sourcePath}/${config.sourceFile}，完成本次功能实现\n- 补充 ${config.key} 回归用例，覆盖主要执行路径\n- 保持构建配置与仓库说明同步\n\nCo-Authored-By: ${config.reviewer}`,
        author: config.author,
        time: '2026-08-11 09:18',
        relativeTime: '4 分钟前',
        branch: config.defaultBranch,
        changedPaths: [
          `${config.sourcePath}/${config.sourceFile}`,
          `tests/${config.key}.spec.${config.extension === 'vue' ? 'ts' : config.extension}`,
        ],
        verified: true,
      },
      {
        id: config.featureId,
        message: config.featureMessage,
        description: `- 在 ${config.sourcePath}/${config.sourceFile} 中实现功能分支方案\n- 新增对应回归测试与异常路径验证`,
        author: config.reviewer,
        time: '2026-08-09 11:26',
        relativeTime: '2 天前',
        branch: config.featureBranch,
        changedPaths: [`${config.sourcePath}/${config.sourceFile}`, `tests/${config.key}.spec.${config.extension === 'vue' ? 'ts' : config.extension}`],
        verified: true,
        mergeRequestId: 18,
      },
      {
        id: config.docsId,
        message: 'docs: 完善运行和目录说明',
        description: '- 补充开发环境、测试命令和发布注意事项\n- 更新主要源码与目录结构说明',
        author: config.reviewer,
        time: '2026-08-06 14:05',
        relativeTime: '5 天前',
        branch: developBranch,
        changedPaths: ['README.md'],
        verified: true,
        mergeRequestId: 16,
      },
      {
        id: config.initId,
        message: 'chore: 初始化仓库',
        description: `- 初始化 ${config.title} 源码、测试与构建配置\n- 建立默认分支保护和基础目录结构`,
        author: config.author,
        time: '2026-07-21 09:30',
        relativeTime: '3 周前',
        branch: config.defaultBranch,
        changedPaths: [`${config.sourcePath}/${config.sourceFile}`, config.manifestName, 'README.md'],
        verified: true,
      },
    ],
    branches: [
      {
        name: config.defaultBranch,
        commitId: config.headId,
        protected: true,
        isDefault: true,
        updatedBy: config.author,
        updatedAt: '2026-08-11 09:18',
        stale: false,
      },
      {
        name: developBranch,
        commitId: config.docsId,
        protected: true,
        isDefault: false,
        updatedBy: config.reviewer,
        updatedAt: '2026-08-06 14:05',
        stale: false,
      },
      {
        name: config.featureBranch,
        commitId: config.featureId,
        protected: false,
        isDefault: false,
        updatedBy: config.reviewer,
        updatedAt: '2026-08-09 11:26',
        stale: false,
      },
      ...extraBranch,
    ],
    mergeRequests: [
      {
        id: 18,
        title: config.featureMessage.replace(/^[a-z]+:\s*/i, ''),
        description: `将 ${config.featureBranch} 的改动合入 ${config.defaultBranch}，包含源码与回归用例更新。`,
        author: config.reviewer,
        sourceBranch: config.featureBranch,
        targetBranch: config.defaultBranch,
        status: 'open',
        createdAt: '2026-08-09 11:24',
        updatedAt: '2 天前',
        commits: 1,
        comments: 3,
        additions: 46,
        deletions: 12,
        reviewers: [config.author],
      },
      {
        id: 16,
        title: '完善仓库运行与构建说明',
        description: '补充开发环境、测试命令和发布注意事项。',
        author: config.reviewer,
        sourceBranch: developBranch,
        targetBranch: config.defaultBranch,
        status: 'merged',
        createdAt: '2026-08-06 13:54',
        updatedAt: '5 天前',
        commits: 1,
        comments: 2,
        additions: 24,
        deletions: 8,
        reviewers: [config.author],
      },
      ...draftRequests,
    ],
    tags: [
      {
        name: 'v1.0.0-rc.1',
        commitId: config.headId,
        createdAt: '2026-08-11 09:20',
        description: `标记 ${config.title} 的候选发布版本，包含「${config.headMessage}」相关改动。`,
      },
      ...(config.extraTag ? [{
        name: config.extraTag,
        commitId: config.docsId,
        createdAt: '2026-08-06 14:08',
        description: '标记运行说明与目录文档整理完成的稳定版本。',
      }] : []),
    ],
    readme,
  }
}

export const repositoryDataByKey: Record<string, DemoRepositoryData> = {
  'flight-control-core': createRepositoryData({
    key: 'flight-control-core',
    title: '飞控核心模块',
    defaultBranch: 'main',
    sourcePath: 'src',
    sourceFile: 'App.vue',
    extension: 'vue',
    manifestName: 'package.json',
    manifestContent: `{"name":"flight-control-core","scripts":{"dev":"vite","test":"vitest run"},"dependencies":{"vue":"^3.5.0"}}\n`,
    mainContent: `<script setup lang="ts">\nimport { computed, ref } from 'vue'\nimport FlightStatusCard from './components/FlightStatusCard.vue'\n\nconst connected = ref(true)\nconst routeCount = ref(3)\nconst status = computed(() => connected.value ? '运行中' : '已断开')\n<\/script>\n\n<template>\n  <FlightStatusCard :status="status" :route-count="routeCount" />\n</template>\n`,
    featureContent: `<script setup lang="ts">\nimport { computed, ref } from 'vue'\nimport FlightStatusCard from './components/FlightStatusCard.vue'\n\nconst connected = ref(true)\nconst routeCount = ref(5)\nconst status = computed(() => connected.value ? '融合运行中' : '降级运行')\n<\/script>\n\n<template>\n  <FlightStatusCard :status="status" :route-count="routeCount" show-telemetry />\n</template>\n`,
    featureBranch: 'feature/attitude-fusion',
    headId: '3e73e7f',
    featureId: '78b02ac',
    docsId: '5fe8c31',
    initId: '1c94d61',
    headMessage: 'feat: 接入多模型路由',
    featureMessage: 'feat: 增加姿态融合遥测面板',
    author: '张大山',
    reviewer: '李思雨',
    withBlame: true,
    extraBranch: 'release/v1.1.0',
    extraTag: 'v1.0.0',
    draftTitle: '验证姿态融合降级策略',
  }),
  'guidance-algo': createRepositoryData({
    key: 'guidance-algo', title: '制导算法库', defaultBranch: 'main', sourcePath: 'src', sourceFile: 'proportional_nav.cpp', extension: 'cpp', manifestName: 'CMakeLists.txt',
    manifestContent: `cmake_minimum_required(VERSION 3.20)\nproject(guidance_algo)\nadd_library(guidance src/proportional_nav.cpp)\n`,
    mainContent: `#include <algorithm>\n\ndouble command(double closingRate, double losRate) {\n  return std::clamp(3.0 * closingRate * losRate, -8.0, 8.0);\n}\n`,
    featureContent: `#include <algorithm>\n\ndouble command(double closingRate, double losRate) {\n  return std::clamp(3.5 * closingRate * losRate, -6.5, 6.5);\n}\n`,
    featureBranch: 'feature/overload-limit', headId: '6d0bf3a', featureId: 'e21c84b', docsId: '9fa4d17', initId: '142b9ce', headMessage: 'fix: 修正比例导引过载限制', featureMessage: 'feat: 增加动态过载约束', author: '陈工', reviewer: '李四',
  }),
  'attitude-algo': createRepositoryData({
    key: 'attitude-algo', title: '姿态估计算法', defaultBranch: 'develop', sourcePath: 'src/fusion', sourceFile: 'kalman_filter.cpp', extension: 'cpp', manifestName: 'CMakeLists.txt',
    manifestContent: `project(attitude_estimation)\nadd_library(attitude src/fusion/kalman_filter.cpp)\n`,
    mainContent: `#include "kalman_filter.hpp"\n\nvoid KalmanFilter::predict(double dt) { covariance_ += processNoise_ * dt; }\n`,
    featureContent: `#include "kalman_filter.hpp"\n\nvoid KalmanFilter::predict(double dt) { covariance_ += adaptiveNoise(dt); }\n`,
    featureBranch: 'feature/adaptive-noise', headId: 'c7e92d1', featureId: 'b33a8f0', docsId: '5d18c6e', initId: '48cc021', headMessage: 'perf: 优化卡尔曼滤波协方差初值', featureMessage: 'feat: 引入自适应过程噪声', author: '王工', reviewer: '张大山',
    extraTag: 'v0.9.0',
  }),
  'mission-plan-frontend': createRepositoryData({
    key: 'mission-plan-frontend', title: '任务规划前端', defaultBranch: 'main', sourcePath: 'src/views', sourceFile: 'MissionCanvas.vue', extension: 'vue', manifestName: 'package.json',
    manifestContent: `{"name":"mission-plan-ui","scripts":{"dev":"vite"},"dependencies":{"vue":"^3.5.0"}}\n`,
    mainContent: `<script setup lang="ts">\nconst stages = ['起飞', '巡航', '返航']\n<\/script>\n<template><ol><li v-for="stage in stages" :key="stage">{{ stage }}</li></ol></template>\n`,
    featureContent: `<script setup lang="ts">\nconst stages = ['起飞', '爬升', '巡航', '任务执行', '返航']\n<\/script>\n<template><ol><li v-for="stage in stages" :key="stage">{{ stage }}</li></ol></template>\n`,
    featureBranch: 'feature/scenario-canvas', headId: 'd41c70a', featureId: '2b9e6f5', docsId: '8c3a2d7', initId: '719fc02', headMessage: 'feat: 新增场景编排画布', featureMessage: 'feat: 支持任务阶段拖拽编排', author: '赵前端', reviewer: '钱工',
    extraBranch: 'release/v2.8.0',
    draftTitle: '任务节点批量编排交互',
  }),
  'telemetry-gateway': createRepositoryData({
    key: 'telemetry-gateway', title: '遥测数据网关', defaultBranch: 'master', sourcePath: 'cmd/gateway', sourceFile: 'main.go', extension: 'go', manifestName: 'go.mod',
    manifestContent: `module example.com/telemetry-gateway\n\ngo 1.23\n`,
    mainContent: `package main\n\nimport "log"\n\nfunc main() { log.Println("telemetry gateway listening on :8080") }\n`,
    featureContent: `package main\n\nimport "log"\n\nfunc main() { log.Println("telemetry gateway v3 codec enabled on :8080") }\n`,
    featureBranch: 'feature/protocol-v3', headId: '3f8c91b', featureId: 'a06d3e2', docsId: '7e21b94', initId: '18abd42', headMessage: 'feat: 实现协议转换插件化', featureMessage: 'feat: 新增遥测帧定义 v3', author: '孙工', reviewer: '周工',
    extraBranch: 'release/v3.0.0',
  }),
  'embedded-drivers': createRepositoryData({
    key: 'embedded-drivers', title: '嵌入式驱动组件', defaultBranch: 'master', sourcePath: 'drivers/spi', sourceFile: 'spi_master.c', extension: 'c', manifestName: 'CMakeLists.txt',
    manifestContent: `project(embedded_drivers C)\nadd_library(drivers drivers/spi/spi_master.c)\n`,
    mainContent: `#include "spi_master.h"\n\nint spi_transfer(const uint8_t *tx, uint8_t *rx, size_t len) { return hal_spi_transfer(tx, rx, len); }\n`,
    featureContent: `#include "spi_master.h"\n\nint spi_transfer(const uint8_t *tx, uint8_t *rx, size_t len) { return hal_spi_dma_transfer(tx, rx, len); }\n`,
    featureBranch: 'feature/spi-dma', headId: 'b84a1f7', featureId: 'c25d9e0', docsId: '1a7c4b6', initId: '621fba0', headMessage: 'fix: 统一 SPI 读写时序', featureMessage: 'feat: 增加 SPI DMA 传输', author: '吴工', reviewer: '郑工',
    extraTag: 'v0.8.2',
  }),
}

export const lightweightRepositoryData = repositoryDataByKey['flight-control-core']
