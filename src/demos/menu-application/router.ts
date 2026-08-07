import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import ProjectLayout from './ProjectLayout.vue'
import { defaultProjectKey, getProjectPageItems } from './navigation'

const projectRoutes: RouteRecordRaw[] = getProjectPageItems().map((item) => ({
  path: item.path ?? String(item.key),
  name: item.route?.name,
  component:
    item.key === 'overview'
      ? () => import('./views/ProjectOverviewView.vue')
      : item.key === 'repositories'
        ? () => import('./views/RepositoryHomeView.vue')
        : item.key === 'applications'
          ? () => import('./views/ApplicationListView.vue')
      : () => import('./views/ProjectSectionView.vue'),
  meta: {
    menuKey: item.key,
    title: item.key === 'repositories' ? '代码仓库' : item.label,
    description: item.description,
    layout:
      item.key === 'repositories'
        ? 'repository-detail'
        : item.key === 'applications'
          ? 'application-workspace'
          : undefined,
  },
}))

const repositoryDetailRoute: RouteRecordRaw = {
  path: 'code/repositories/:repositoryId',
  name: 'repository-detail',
  component: () => import('./views/RepositoryDetailView.vue'),
  meta: {
    menuKey: 'repositories',
    layout: 'repository-detail',
  },
}

const applicationDetailRoute: RouteRecordRaw = {
  path: 'deployments/applications/:applicationId',
  component: () => import('./views/ApplicationDetailLayout.vue'),
  redirect: (to) => ({
    name: 'application-overview',
    params: to.params,
  }),
  meta: {
    menuKey: 'applications',
    layout: 'application-workspace',
  },
  children: [
    {
      path: 'overview',
      name: 'application-overview',
      component: () => import('./views/ApplicationOverviewView.vue'),
      meta: {
        menuKey: 'applications',
        layout: 'application-workspace',
        title: '应用概览',
      },
    },
    {
      path: 'environment-planning',
      name: 'application-environment-planning',
      component: () => import('./views/ApplicationEnvironmentPlanningView.vue'),
      meta: {
        menuKey: 'applications',
        layout: 'application-workspace',
        title: '环境规划',
      },
    },
  ],
}

export const menuApplicationRouter = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: `/projects/${defaultProjectKey}/overview`,
    },
    {
      path: '/projects/:projectKey',
      component: ProjectLayout,
      redirect: (to) => ({ name: 'project-overview', params: { projectKey: to.params.projectKey } }),
      children: [...projectRoutes, applicationDetailRoute, repositoryDetailRoute],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: `/projects/${defaultProjectKey}/overview`,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

menuApplicationRouter.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? `${to.meta.title} - ` : ''
  document.title = `${title}Vision Application`
})
