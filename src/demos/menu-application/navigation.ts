import type { RouteLocationNamedRaw } from 'vue-router'

import type {
  VisMenuItemData,
  VisMenuKey,
  VisMenuProject,
  VisMenuSection,
} from '../../components/menu/menu.types'

export interface ApplicationMenuItem extends Omit<VisMenuItemData, 'children' | 'route'> {
  route?: RouteLocationNamedRaw
  path?: string
  description?: string
  children?: ApplicationMenuItem[]
}

export const defaultProjectKey = 'lighting'

export const projects: VisMenuProject[] = [
  { key: 'platform', label: '平台测试项目', logoVariant: 'logo_002' },
  { key: 'air-conditioning', label: '飞机空调系统', logoVariant: 'logo_001' },
  { key: 'lighting', label: '飞机照明系统', logoVariant: 'logo_003' },
  { key: 'navigation', label: '导航模块', logoVariant: 'logo_004' },
  { key: 'engine', label: '发动机项目', logoVariant: 'logo_001' },
]

export const projectItems: ApplicationMenuItem[] = [
  {
    key: 'overview',
    label: '概览',
    icon: 'linear',
    iconName: 'home-line',
    path: 'overview',
    route: { name: 'project-overview' },
    description: '查看项目运行状态、近期任务与部署进度。',
  },
  {
    key: 'work-items',
    label: '工作项',
    icon: 'linear',
    iconName: 'book-open-01',
    path: 'work-items',
    route: { name: 'project-work-items' },
    description: '统一查看史诗、特性、用户故事、任务和缺陷。',
  },
  {
    key: 'requirements',
    label: '需求管理',
    icon: 'linear',
    iconName: 'clipboard-check',
    badgeCount: 10,
    path: 'requirements',
    route: { name: 'project-requirements' },
    description: '跟踪需求状态、负责人和交付进度。',
  },
  {
    key: 'code',
    label: '代码',
    icon: 'linear',
    iconName: 'code-02',
    defaultChildKey: 'repositories',
    children: [
      {
        key: 'repositories',
        label: '仓库',
        icon: 'none',
        path: 'code/repositories',
        route: { name: 'project-repositories' },
        description: '浏览代码仓库、分支与最近提交。',
      },
      {
        key: 'code-quality',
        label: '代码质量',
        icon: 'none',
        path: 'code/quality',
        route: { name: 'project-code-quality' },
        description: '查看静态检查、覆盖率和质量门禁结果。',
      },
    ],
  },
  {
    key: 'pipelines',
    label: '流水线',
    icon: 'linear',
    iconName: 'dataflow-03',
    path: 'pipelines',
    route: { name: 'project-pipelines' },
    description: '管理持续集成流水线与运行记录。',
  },
  {
    key: 'artifacts',
    label: '制品',
    icon: 'linear',
    iconName: 'package',
    defaultChildKey: 'artifact-repository',
    children: [
      {
        key: 'artifact-repository',
        label: '制品库',
        icon: 'none',
        path: 'artifacts/repository',
        route: { name: 'project-artifact-repository' },
        description: '管理构建制品、版本和下载权限。',
      },
      {
        key: 'dependency-library',
        label: '依赖库',
        icon: 'none',
        path: 'artifacts/dependencies',
        route: { name: 'project-dependency-library' },
        description: '维护项目依赖与开源组件清单。',
      },
    ],
  },
  {
    key: 'deployments',
    label: '发布',
    icon: 'linear',
    iconName: 'server-01',
    defaultChildKey: 'applications',
    children: [
      {
        key: 'applications',
        label: '应用',
        icon: 'none',
        path: 'deployments/applications',
        route: { name: 'project-applications' },
        description: '维护应用及其关联代码、制品和发布状态。',
      },
      {
        key: 'environments',
        label: '环境',
        icon: 'none',
        path: 'deployments/environments',
        route: { name: 'project-environments' },
        description: '维护开发、测试和生产环境。',
      },
    ],
  },
  {
    key: 'testing',
    label: '测试',
    icon: 'linear',
    iconName: 'beaker-02',
    defaultChildKey: 'test-plans',
    children: [
      {
        key: 'test-plans',
        label: '测试计划',
        icon: 'none',
        path: 'testing/plans',
        route: { name: 'project-test-plans' },
        description: '规划测试范围、执行周期和负责人。',
      },
      {
        key: 'test-cases',
        label: '测试用例',
        icon: 'none',
        path: 'testing/cases',
        route: { name: 'project-test-cases' },
        description: '维护测试步骤、预期结果和测试运行记录。',
      },
      {
        key: 'test-defects',
        label: '缺陷',
        icon: 'none',
        path: 'testing/defects',
        route: { name: 'project-test-defects' },
        description: '跟踪缺陷优先级、修复状态和回归结果。',
      },
    ],
  },
  {
    key: 'project-settings',
    label: '设置',
    icon: 'linear',
    iconName: 'settings-01',
    defaultChildKey: 'settings-general',
    children: [
      {
        key: 'settings-general',
        label: '基本信息',
        icon: 'none',
        path: 'settings',
        route: { name: 'project-settings' },
        description: '维护项目名称、标识、负责人和基础属性。',
      },
      {
        key: 'settings-members',
        label: '成员',
        icon: 'none',
        path: 'settings/members',
        route: { name: 'project-settings-members' },
        description: '添加或移除项目成员，并查看成员角色。',
      },
      {
        key: 'settings-roles',
        label: '权限',
        icon: 'none',
        path: 'settings/roles',
        route: { name: 'project-settings-roles' },
        description: '定义项目角色和用户组，及其身份下资源的访问权限。',
      },
      {
        key: 'settings-notifications',
        label: '通知',
        icon: 'none',
        path: 'settings/notifications',
        route: { name: 'project-settings-notifications' },
        description: '设置项目事件的默认通知方式和接收范围。',
      },
      {
        key: 'settings-integrations',
        label: '集成',
        icon: 'none',
        path: 'settings/integrations',
        route: { name: 'project-settings-integrations' },
        description: '配置项目级外部系统连接和数据同步关系。',
      },
      {
        key: 'settings-approvals',
        label: '审批流程',
        icon: 'none',
        path: 'settings/approvals',
        route: { name: 'project-settings-approvals' },
        description: '定义基线、发布和生产部署的审批流程。',
      },
      {
        key: 'settings-audit',
        label: '审计日志',
        icon: 'none',
        path: 'settings/audit',
        route: { name: 'project-settings-audit' },
        description: '追踪项目内关键配置和权限变更。',
      },
      {
        key: 'settings-lifecycle',
        label: '归档与删除',
        icon: 'none',
        path: 'settings/lifecycle',
        route: { name: 'project-settings-lifecycle' },
        description: '管理项目归档、恢复和删除等生命周期操作。',
      },
    ],
  },
]

export const mainSections: VisMenuSection[] = [
  {
    key: 'global',
    items: [
      { key: 'workspace', label: '工作台', icon: 'linear', iconName: 'home-line', route: { name: 'project-overview' } },
    ],
  },
  {
    key: 'projects',
    label: '项目',
    items: projects.slice(0, 4).map((project) => ({
      key: `main-${project.key}`,
      label: project.label,
      icon: 'linear',
      projectLogo: project.logoVariant,
      route: { name: 'project-overview', params: { projectKey: project.key } },
    })),
  },
  {
    key: 'services',
    label: '常用',
    items: [
      { key: 'service-requirements', label: '需求', icon: 'linear', iconName: 'clipboard-check', route: { name: 'project-requirements' } },
      { key: 'service-code', label: '代码仓库', icon: 'linear', iconName: 'code-02', route: { name: 'project-repositories' } },
      { key: 'service-artifacts', label: '制品库', icon: 'linear', iconName: 'package', route: { name: 'project-artifact-repository' } },
      { key: 'service-tests', label: '测试计划', icon: 'linear', iconName: 'beaker-02', route: { name: 'project-test-plans' } },
    ],
  },
]

export function findNavigationPath(
  key: VisMenuKey,
  items: ApplicationMenuItem[] = projectItems,
): ApplicationMenuItem[] | undefined {
  for (const item of items) {
    if (item.key === key) return [item]
    const childPath = item.children ? findNavigationPath(key, item.children) : undefined
    if (childPath) return [item, ...childPath]
  }
  return undefined
}

export function getProjectPageItems(items: ApplicationMenuItem[] = projectItems): ApplicationMenuItem[] {
  return items.flatMap((item) => (item.children?.length ? getProjectPageItems(item.children) : [item]))
}
