<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter, type RouteLocationRaw } from 'vue-router'

import { VisAvatar } from '../../components/avatar'
import VisBreadcrumb from '../../components/breadcrumb/VisBreadcrumb.vue'
import type { VisBreadcrumbItem } from '../../components/breadcrumb/breadcrumb.types'
import VisButton from '../../components/button/VisButton.vue'
import VisConfigProvider from '../../components/config-provider/VisConfigProvider.vue'
import type { VisTheme } from '../../components/config-provider/config-provider.types'
import VisInputSearchBox from '../../components/input-search-box/VisInputSearchBox.vue'
import { VisMenu } from '../../components/menu'
import type {
  VisMenuKey,
  VisMenuProject,
  VisMenuSelectPayload,
} from '../../components/menu/menu.types'
import {
  defaultProjectKey,
  findNavigationPath,
  mainSections,
  projectItems,
  projects,
  type ApplicationMenuItem,
} from './navigation'

const route = useRoute()
const router = useRouter()

const savedTheme = window.localStorage.getItem('vision-menu-demo-theme')
const savedCollapsed = window.localStorage.getItem('vision-menu-demo-collapsed')
const theme = ref<VisTheme>(savedTheme === 'dark' ? 'dark' : 'light')
const collapsed = ref(savedCollapsed === 'true')
const openKey = ref<VisMenuKey | null>(null)
const mainOpen = ref(false)
const projectSwitcherOpen = ref(false)

const activeKey = computed<VisMenuKey>(() =>
  typeof route.meta.menuKey === 'string' || typeof route.meta.menuKey === 'number'
    ? route.meta.menuKey
    : 'overview',
)
const activePath = computed<ApplicationMenuItem[]>(() =>
  findNavigationPath(activeKey.value) ?? [projectItems[0]],
)
const activeItem = computed(() => activePath.value[activePath.value.length - 1])
const currentProject = computed<VisMenuProject>(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})
const mainActiveKey = computed<VisMenuKey>(() => `main-${currentProject.value.key}`)
const themeLabel = computed(() => (theme.value === 'light' ? '切换到暗色模式' : '切换到亮色模式'))
const isRepositoryDetail = computed(() => route.meta.layout === 'repository-detail')
const pageDescription = computed(() =>
  typeof route.meta.description === 'string' ? route.meta.description : activeItem.value.description,
)
const headerBreadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目', iconName: 'file-06' },
  ...activePath.value.map((item, index, path) => ({
    label: item.label,
    active: index === path.length - 1,
  })),
])

function withProject(target: RouteLocationRaw, projectKey = currentProject.value.key): RouteLocationRaw {
  if (typeof target === 'string') return target
  if ('name' in target && target.name) {
    return {
      ...target,
      params: { ...target.params, projectKey: String(projectKey) },
    }
  }
  return target
}

function navigateToItem(item?: ApplicationMenuItem): void {
  const target = item?.route ?? item?.children?.[0]?.route
  if (target) void router.push(withProject(target))
}

function onSelect(payload: VisMenuSelectPayload): void {
  if (payload.route) void router.push(withProject(payload.route as RouteLocationRaw))
}

function onMainSelect(payload: VisMenuSelectPayload): void {
  const selectedProject = projects.find((project) => `main-${project.key}` === payload.key)
  const target = payload.route as RouteLocationRaw | undefined

  if (target) {
    void router.push(withProject(target, selectedProject?.key ?? currentProject.value.key))
  }
  mainOpen.value = false
}

function onProjectChange(project: VisMenuProject): void {
  openKey.value = activePath.value.length > 1 ? activePath.value[0].key : null
  const target: RouteLocationRaw = route.name
    ? { name: route.name, params: { ...route.params, projectKey: String(project.key) } }
    : { name: 'project-overview', params: { projectKey: String(project.key) } }
  void router.push(target)
}

function onBreadcrumbClick(_item: VisBreadcrumbItem, index: number): void {
  if (index === 0) {
    navigateToItem(projectItems[0])
    return
  }
  navigateToItem(activePath.value[index - 1])
}

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

watch(
  activePath,
  (path) => {
    openKey.value = path.length > 1 ? path[0].key : null
  },
  { immediate: true },
)
watch(theme, (value) => window.localStorage.setItem('vision-menu-demo-theme', value))
watch(collapsed, (value) => window.localStorage.setItem('vision-menu-demo-collapsed', String(value)))

onMounted(() => {
  if (savedCollapsed === null) collapsed.value = window.matchMedia('(max-width: 900px)').matches
})
</script>

<template>
  <VisConfigProvider :theme="theme" namespace="vis-el" :z-index="3200">
    <div class="menu-application" :data-theme="theme">
      <header class="application-header">
        <VisButton
          class="application-main-trigger"
          variant="text"
          size="md"
          icon-only
          icon-name="menu-01"
          label="打开主导航"
          @click="mainOpen = true"
        />

        <VisBreadcrumb
          class="application-header__breadcrumb"
          :items="headerBreadcrumbItems"
          type="button"
          size="md"
          separator="slash"
          @click="onBreadcrumbClick"
        />

        <div class="application-header__spacer" />

        <VisInputSearchBox
          class="application-header__search"
          placeholder="请输入关键字"
          aria-label="搜索项目内容"
        />
        <div class="application-header__actions">
          <VisButton variant="text" size="md" icon-only icon-name="settings-01" label="设置" />
          <VisButton
            variant="text"
            size="md"
            icon-only
            icon-name="palette"
            :label="themeLabel"
            @click="toggleTheme"
          />
          <VisButton variant="text" size="md" icon-only icon-name="bell-01" label="通知" />
        </div>
        <VisAvatar
          type="image"
          size="md"
          badge="state"
          image-variant="09"
          image-alt="当前用户头像"
          :decorative="false"
        />
      </header>

      <div class="application-workspace">
        <VisMenu
          v-model:open-key="openKey"
          v-model:collapsed="collapsed"
          v-model:project-switcher-open="projectSwitcherOpen"
          :items="projectItems"
          :active-key="activeKey"
          :project="currentProject"
          :projects="projects"
          @select="onSelect"
          @project-change="onProjectChange"
        />

        <main
          class="application-content"
          :class="{ 'is-repository-detail': isRepositoryDetail }"
        >
          <div v-if="!isRepositoryDetail" class="application-content__heading">
            <div>
              <span class="application-eyebrow">{{ currentProject.label }}</span>
              <h1>{{ activeItem.label }}</h1>
              <p>{{ pageDescription }}</p>
            </div>
            <div class="application-heading__actions">
              <VisButton variant="secondary" size="md" prefix icon-name="filter-lines">筛选</VisButton>
              <VisButton size="md" prefix icon-name="plus">新建任务</VisButton>
            </div>
          </div>

          <RouterView v-slot="{ Component, route: currentRoute }">
            <Transition name="application-page" mode="out-in">
              <component :is="Component" :key="currentRoute.fullPath" />
            </Transition>
          </RouterView>
        </main>
      </div>

      <Transition name="application-drawer">
        <div v-if="mainOpen" class="application-main-layer">
          <button class="application-backdrop" type="button" aria-label="关闭主导航" @click="mainOpen = false" />
          <VisMenu
            class="application-main-menu"
            type="main"
            :sections="mainSections"
            :active-key="mainActiveKey"
            @select="onMainSelect"
          />
        </div>
      </Transition>
    </div>
  </VisConfigProvider>
</template>

<style scoped>
.menu-application {
  inline-size: 100%;
  block-size: 100%;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
}

.application-header {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-56);
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  background: var(--color-bg-canvas);
}

.application-main-trigger {
  --vis-button-bg: var(--color-bg-secondary);

  border-radius: var(--radius-full);
  flex: 0 0 auto;
}

.application-header__breadcrumb {
  min-inline-size: 0;
  flex: 0 1 auto;
}

.application-header__spacer {
  min-inline-size: var(--space-8);
  flex: 1 1 0;
}

.application-header__search {
  inline-size: 200px;
  flex: 0 0 200px;
}

.application-header__actions {
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.application-workspace {
  inline-size: 100%;
  block-size: calc(100% - var(--space-56));
  display: flex;
  align-items: stretch;
}

.application-workspace > .vis-menu {
  block-size: auto;
  align-self: stretch;
  flex: 0 0 auto;
}

.application-content {
  min-inline-size: 0;
  flex: 1 1 0;
  padding: var(--space-32);
  overflow-y: auto;
  background: var(--color-bg-secondary);
}

.application-content.is-repository-detail {
  padding: 0;
  overflow: hidden;
  background: var(--color-bg-canvas);
}

.application-content__heading {
  max-inline-size: 1240px;
  margin-inline: auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-24);
}

.application-eyebrow {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
}

.application-content h1 {
  margin: var(--space-4) 0 0;
  color: var(--color-text-primary);
  font-size: var(--font-heading-h3-size);
  font-weight: 600;
  line-height: var(--font-heading-h3-line-height);
}

.application-content__heading p {
  margin: var(--space-4) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.application-heading__actions {
  display: flex;
  gap: var(--space-8);
}

.application-main-layer {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.application-backdrop {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.application-main-menu {
  position: relative;
  z-index: 1;
  block-size: 100%;
}

.application-drawer-enter-active,
.application-drawer-leave-active,
.application-page-enter-active,
.application-page-leave-active {
  transition: opacity 160ms ease;
}

.application-drawer-enter-active .application-main-menu,
.application-drawer-leave-active .application-main-menu {
  transition: transform 160ms ease;
}

.application-drawer-enter-from,
.application-drawer-leave-to,
.application-page-enter-from,
.application-page-leave-to {
  opacity: 0;
}

.application-drawer-enter-from .application-main-menu,
.application-drawer-leave-to .application-main-menu {
  transform: translateX(-100%);
}

@media (max-width: 900px) {
  .application-header__search {
    display: none;
  }
}

@media (max-width: 720px) {
  .application-header {
    padding-inline: var(--space-8);
    gap: var(--space-8);
  }

  .application-header__actions {
    padding-inline: 0;
    gap: var(--space-4);
  }

  .application-header__actions > :first-child,
  .application-header__actions > :last-child {
    display: none;
  }

  .application-content {
    padding: var(--space-20);
  }

  .application-content.is-repository-detail {
    padding: 0;
  }

  .application-content__heading {
    display: grid;
  }
}
</style>
