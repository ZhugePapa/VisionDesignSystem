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
        ? () => import('./views/RepositoryWebhooksView.vue')
      : () => import('./views/ProjectSectionView.vue'),
  meta: {
    menuKey: item.key,
    title: item.key === 'repositories' ? 'Webhook 设置' : item.label,
    description: item.description,
    layout: item.key === 'repositories' ? 'repository-detail' : undefined,
  },
}))

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
      children: projectRoutes,
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
