<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import { VisPageHeader } from '../../../components/page-header'
import type { VisTabsItem, VisTabsValue } from '../../../components/tabs'

const route = useRoute()
const router = useRouter()

const applicationTabs: VisTabsItem[] = [
  { value: 'overview', label: '概览' },
  { value: 'release-orchestration', label: '发布编排' },
  { value: 'environment-planning', label: '环境规划' },
  { value: 'environment-parameters', label: '环境参数' },
  { value: 'release-history', label: '发布历史' },
]

const activeTab = computed<VisTabsValue>(() =>
  route.name === 'application-environment-planning' ? 'environment-planning' : 'overview',
)

function navigateToList(): void {
  void router.push({
    name: 'project-applications',
    params: { projectKey: route.params.projectKey },
  })
}

function onTabChange(value: VisTabsValue): void {
  const routeName =
    value === 'overview'
      ? 'application-overview'
      : value === 'environment-planning'
        ? 'application-environment-planning'
        : undefined

  if (!routeName) return

  void router.push({
    name: routeName,
    params: {
      projectKey: route.params.projectKey,
      applicationId: route.params.applicationId,
    },
  })
}
</script>

<template>
  <section class="application-detail">
    <VisPageHeader
      class="application-detail__header"
      title="代码仓库服务"
      :show-description="false"
      parent-link
      icon
      icon-name="dataflow-04"
      :tabs="applicationTabs"
      :active-tab="activeTab"
      aria-label="代码仓库服务"
      @back="navigateToList"
      @tab-change="onTabChange"
    />

    <div class="application-detail__body">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="application-detail-page" mode="out-in">
          <component :is="Component" :key="currentRoute.fullPath" />
        </Transition>
      </RouterView>
    </div>
  </section>
</template>

<style scoped>
.application-detail {
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
}

.application-detail__header {
  flex: 0 0 auto;
}

.application-detail__header :deep(.vis-page-header__tabs) {
  margin-inline: calc(var(--space-20) * -1);
}

.application-detail__header :deep(.vis-tabs) {
  padding-inline: var(--space-20);
}

.application-detail__header :deep(.vis-tabs.align-horizontal .vis-tabs__bar) {
  bottom: -1px;
}

.application-detail__body {
  min-block-size: 0;
  flex: 1 1 0;
  overflow: auto;
  background: var(--color-bg-surface);
}

.application-detail-page-enter-active,
.application-detail-page-leave-active {
  transition: opacity 120ms ease;
}

.application-detail-page-enter-from,
.application-detail-page-leave-to {
  opacity: 0;
}
</style>
