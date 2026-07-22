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
    iconName: 'home-line',
    path: 'overview',
    route: { name: 'project-overview' },
    description: '查看项目运行状态、近期任务与部署进度。',
  },
  {
    key: 'project-management',
    label: '项目管理',
    iconName: 'book-open-02',
    path: 'management',
    route: { name: 'project-management' },
    description: '管理项目成员、迭代计划和基础配置。',
  },
  {
    key: 'requirements',
    label: '需求管理',
    iconName: 'clipboard-check',
    badgeCount: 10,
    path: 'requirements',
    route: { name: 'project-requirements' },
    description: '跟踪需求状态、负责人和交付进度。',
  },
  {
    key: 'code',
    label: '代码管理',
    iconName: 'code-02',
    defaultChildKey: 'repositories',
    children: [
      {
        key: 'repositories',
        label: '代码仓库',
        path: 'code/repositories',
        route: { name: 'project-repositories' },
        description: '浏览代码仓库、分支与最近提交。',
      },
      {
        key: 'code-quality',
        label: '代码质量',
        path: 'code/quality',
        route: { name: 'project-code-quality' },
        description: '查看静态检查、覆盖率和质量门禁结果。',
      },
    ],
  },
  {
    key: 'pipelines',
    label: '流水线',
    iconName: 'dataflow-03',
    path: 'pipelines',
    route: { name: 'project-pipelines' },
    description: '管理持续集成流水线与运行记录。',
  },
  {
    key: 'artifacts',
    label: '制品管理',
    iconName: 'package',
    defaultChildKey: 'artifact-repository',
    children: [
      {
        key: 'artifact-repository',
        label: '制品仓库',
        path: 'artifacts/repository',
        route: { name: 'project-artifact-repository' },
        description: '管理构建制品、版本和下载权限。',
      },
      {
        key: 'dependency-library',
        label: '依赖库',
        path: 'artifacts/dependencies',
        route: { name: 'project-dependency-library' },
        description: '维护项目依赖与开源组件清单。',
      },
    ],
  },
  {
    key: 'deployments',
    label: '部署管理',
    iconName: 'server-01',
    defaultChildKey: 'applications',
    children: [
      {
        key: 'applications',
        label: '应用管理',
        path: 'deployments/applications',
        route: { name: 'project-applications' },
        description: '管理应用服务、部署版本和运行状态。',
      },
      {
        key: 'environments',
        label: '环境管理',
        path: 'deployments/environments',
        route: { name: 'project-environments' },
        description: '维护开发、测试和生产环境。',
      },
    ],
  },
  {
    key: 'testing',
    label: '测试管理',
    iconName: 'beaker-02',
    defaultChildKey: 'test-plans',
    children: [
      {
        key: 'test-plans',
        label: '测试计划',
        path: 'testing/plans',
        route: { name: 'project-test-plans' },
        description: '规划测试范围、执行周期和负责人。',
      },
      {
        key: 'test-cases',
        label: '测试用例',
        path: 'testing/cases',
        route: { name: 'project-test-cases' },
        description: '维护测试步骤、预期结果和执行历史。',
      },
      {
        key: 'test-defects',
        label: '测试缺陷',
        path: 'testing/defects',
        route: { name: 'project-test-defects' },
        description: '跟踪缺陷优先级、修复状态和回归结果。',
      },
    ],
  },
  {
    key: 'project-settings',
    label: '项目设置',
    iconName: 'settings-01',
    path: 'settings',
    route: { name: 'project-settings' },
    description: '配置项目属性、通知和访问权限。',
  },
]

export const mainSections: VisMenuSection[] = [
  {
    key: 'global',
    items: [
      { key: 'workspace', label: '工作台', iconName: 'home-line', route: { name: 'project-overview' } },
      {
        key: 'organization-assets',
        label: '组织资产',
        iconName: 'layers-three-01',
        route: { name: 'project-management' },
      },
    ],
  },
  {
    key: 'projects',
    label: '项目',
    items: projects.slice(0, 4).map((project) => ({
      key: `main-${project.key}`,
      label: project.label,
      projectLogo: project.logoVariant,
      route: { name: 'project-overview', params: { projectKey: project.key } },
    })),
  },
  {
    key: 'services',
    label: '服务',
    items: [
      { key: 'service-work-items', label: '工作项', iconName: 'clipboard-check', route: { name: 'project-requirements' } },
      { key: 'service-code', label: '代码仓库', iconName: 'code-02', route: { name: 'project-repositories' } },
      { key: 'service-artifacts', label: '制品仓库', iconName: 'package', route: { name: 'project-artifact-repository' } },
      { key: 'service-tests', label: '测试计划', iconName: 'beaker-02', route: { name: 'project-test-plans' } },
      { key: 'service-wiki', label: '知识库', iconName: 'book-open-02', route: { name: 'project-management' } },
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
