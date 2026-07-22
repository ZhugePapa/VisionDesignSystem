import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import { defaultDemoPageId, demoPages, getDemoRouteName, getDemoRoutePath } from './demo-pages'

const DocsApp = () => import('../App.vue')
const defaultPage = demoPages.find((page) => page.id === defaultDemoPageId) ?? demoPages[0]

const demoRoutes: RouteRecordRaw[] = demoPages.map((page) => ({
  path: getDemoRoutePath(page),
  name: getDemoRouteName(page.id),
  component: DocsApp,
  meta: {
    demoPage: page.id,
    title: page.title,
  },
}))

export const docsRouter = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: getDemoRoutePath(defaultPage),
    },
    ...demoRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: getDemoRoutePath(defaultPage),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

docsRouter.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? `${to.meta.title} - ` : ''
  document.title = `${pageTitle}Vision Design System`
})
