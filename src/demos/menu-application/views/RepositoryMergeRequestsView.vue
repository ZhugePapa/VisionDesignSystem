<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisAvatar, type VisAvatarImageVariant } from '../../../components/avatar'
import type { VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisCard } from '../../../components/card'
import { VisDivider } from '../../../components/divider'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import Icon from '../../../components/icons/Icon.vue'
import { VisInputSearchBox } from '../../../components/input-search-box'
import { VisLink } from '../../../components/link'
import { VisPageHeader } from '../../../components/page-header'
import { VisSegmented, type VisSegmentedOption, type VisSegmentedValue } from '../../../components/segmented'
import { VisTag } from '../../../components/tag'
import type { VisTabsItem, VisTabsValue } from '../../../components/tabs'
import { defaultProjectKey, projects } from '../navigation'
import {
  findRepositoryByKey,
  type DemoMergeRequest,
  type DemoMergeRequestStatus,
} from '../repositories'
import { createRepositoryTabs } from '../repository-tabs'

type MergeRequestScope = 'all' | 'open' | 'merged' | 'closed'

const route = useRoute()
const router = useRouter()

const repository = computed(() => findRepositoryByKey(String(route.params.repositoryId)))
const repositoryData = computed(() => repository.value?.data)
const currentProject = computed(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})

const repositoryTabs = computed<VisTabsItem[]>(() =>
  createRepositoryTabs(repositoryData.value?.mergeRequests.length ?? 0),
)
const breadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目' },
  { label: currentProject.value.label },
  { label: '代码仓库', active: true },
])

const scopeOptions: VisSegmentedOption[] = [
  { value: 'all', label: '所有' },
  { value: 'open', label: '开启中' },
  { value: 'merged', label: '已合并' },
  { value: 'closed', label: '已关闭' },
]

const selectedScope = ref<MergeRequestScope>('all')
const searchValue = ref('')
const selectedCreator = ref('创建人')
const selectedTime = ref('创建时间')

const avatarVariantByAuthor: Record<string, VisAvatarImageVariant> = {
  张大山: '09',
  李思雨: '06',
  王建国: '03',
  孙工: '05',
  周工程师: '02',
}

function avatarVariant(author: string): VisAvatarImageVariant {
  return avatarVariantByAuthor[author] ?? '09'
}

const creatorItems = computed<VisDropdownEntry[]>(() => {
  const creators = Array.from(new Set((repositoryData.value?.mergeRequests ?? []).map((request) => request.author)))
  return ['创建人', ...creators].map((label, index) => ({
    type: 'item',
    label,
    active: selectedCreator.value === label,
    ...(index > 0
      ? {
          itemType: 'avatar' as const,
          title: label,
          subtitle: label,
          avatarImageVariant: avatarVariant(label),
        }
      : {}),
  }))
})

const timeItems = computed<VisDropdownEntry[]>(() =>
  ['创建时间', '最近 7 天', '最近 30 天'].map((label) => ({
    type: 'item',
    label,
    active: selectedTime.value === label,
  })),
)

function matchesScope(status: DemoMergeRequestStatus): boolean {
  if (selectedScope.value === 'all') return true
  if (selectedScope.value === 'open') return status === 'open' || status === 'draft'
  if (selectedScope.value === 'merged') return status === 'merged'
  return status === 'closed' || status === 'rejected'
}

function matchesTime(createdAt: string): boolean {
  const rangeDays = selectedTime.value === '最近 7 天' ? 7 : selectedTime.value === '最近 30 天' ? 30 : 0
  if (!rangeDays) return true
  const created = new Date(createdAt.replace(' ', 'T')).getTime()
  return created >= Date.now() - rangeDays * 24 * 60 * 60 * 1000
}

const filteredMergeRequests = computed<DemoMergeRequest[]>(() => {
  const query = searchValue.value.trim().toLocaleLowerCase()
  return (repositoryData.value?.mergeRequests ?? []).filter((request) => {
    const searchable = `${request.title} ${request.id} ${request.description} ${request.author} ${request.sourceBranch} ${request.targetBranch}`
      .toLocaleLowerCase()
    return matchesScope(request.status)
      && (!query || searchable.includes(query))
      && (selectedCreator.value === '创建人' || request.author === selectedCreator.value)
      && matchesTime(request.createdAt)
  })
})

function statusClass(status: DemoMergeRequestStatus): string {
  if (status === 'merged') return 'is-success'
  if (status === 'rejected') return 'is-danger'
  if (status === 'closed') return 'is-closed'
  return 'is-active'
}

function statusLabel(status: DemoMergeRequestStatus): string {
  const labels: Record<DemoMergeRequestStatus, string> = {
    open: '开启中',
    merged: '已合并',
    rejected: '已拒绝',
    closed: '已关闭',
    draft: '草稿',
  }
  return labels[status]
}

function handleScopeChange(value: VisSegmentedValue): void {
  selectedScope.value = value as MergeRequestScope
}

function handleCreatorSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedCreator.value = payload.item.label
}

function handleTimeSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedTime.value = payload.item.label
}

function resetFilters(): void {
  selectedScope.value = 'all'
  searchValue.value = ''
  selectedCreator.value = '创建人'
  selectedTime.value = '创建时间'
}

function openRepositoryTab(tab: VisTabsValue): void {
  if (tab === 'merge-requests') return
  void router.push({
    name: 'repository-detail',
    params: {
      projectKey: String(route.params.projectKey ?? defaultProjectKey),
      repositoryId: String(route.params.repositoryId),
    },
    query: tab !== 'code' ? { tab: String(tab) } : undefined,
  })
}

function syncDocumentTitle(): void {
  document.title = `合并请求 - ${repository.value?.name ?? '代码仓库'} - Vision Application`
}

watch(repository, () => {
  resetFilters()
  syncDocumentTitle()
})
onMounted(syncDocumentTitle)
</script>

<template>
  <section class="repository-merge-requests" :aria-label="`${repository?.name ?? '代码仓库'}合并请求列表`">
    <VisPageHeader
      class="repository-merge-requests__header"
      :title="repository?.name ?? '代码仓库'"
      :description="repository?.description ?? ''"
      :breadcrumb-items="breadcrumbItems"
      :tabs="repositoryTabs"
      active-tab="merge-requests"
      @tab-change="openRepositoryTab"
    >
      <template #icon>
        <VisFeaturedIcon
          size="xl"
          type="light-square"
          color="brand"
          icon="dataflow-04"
          :label="repository?.name ?? '代码仓库'"
          :decorative="false"
        />
      </template>
      <template #suffix>
        <VisButton variant="text" size="sm" icon-only icon-name="chevron-down" label="切换代码仓库" />
      </template>
    </VisPageHeader>

    <main class="repository-merge-requests__scroll">
      <div class="repository-merge-requests__content">
        <h1>合并请求</h1>

        <div class="repository-merge-requests__toolbar" aria-label="合并请求筛选">
          <div class="repository-merge-requests__filters">
            <VisSegmented
              :model-value="selectedScope"
              :options="scopeOptions"
              :icon="false"
              aria-label="合并请求状态"
              @change="handleScopeChange"
            />
            <VisInputSearchBox
              v-model="searchValue"
              class="repository-merge-requests__search"
              placeholder="请输入关键字"
              aria-label="搜索合并请求"
            />
            <VisDropdown :items="creatorItems" :button-label="selectedCreator" @select="handleCreatorSelect" />
            <VisDropdown :items="timeItems" :button-label="selectedTime" @select="handleTimeSelect" />
            <VisButton
              variant="text"
              size="md"
              prefix
              icon-name="filter-lines"
              label="更多筛选"
            >
              更多筛选
            </VisButton>
          </div>

          <VisButton
            class="repository-merge-requests__create"
            variant="primary"
            size="md"
            prefix
            icon-name="plus"
            label="新建合并请求（演示）"
          >
            新建合并请求
          </VisButton>
        </div>

        <div v-if="filteredMergeRequests.length" class="merge-request-list">
          <VisCard
            v-for="request in filteredMergeRequests"
            :key="request.id"
            class="merge-request-item"
            :show-action="false"
            body-class="merge-request-item__body"
          >
            <article class="merge-request-item__content">
              <div class="merge-request-item__top">
                <Icon
                  class="merge-request-item__status-icon"
                  :class="statusClass(request.status)"
                  name="git-pull-request"
                  :size="24"
                  :label="statusLabel(request.status)"
                  :decorative="false"
                />
                <VisLink class="merge-request-item__title" :label="request.title">
                  {{ request.title }}
                </VisLink>
                <span class="merge-request-item__spacer" aria-hidden="true" />
                <VisButton
                  class="merge-request-item__comments"
                  variant="text"
                  size="sm"
                  prefix
                  icon-name="message-text-square-02"
                  :label="`${request.comments} 条评论`"
                  :aria-label="`${request.comments} 条评论`"
                >
                  {{ request.comments }}
                </VisButton>
              </div>

              <div class="merge-request-item__meta">
                <span class="merge-request-item__identity">
                  <span class="merge-request-item__author">
                    <VisAvatar
                      size="xxs"
                      type="image"
                      :image-variant="avatarVariant(request.author)"
                      :image-alt="request.author"
                    />
                    <span>{{ request.author }}</span>
                  </span>
                  <span>创建于</span>
                  <time :datetime="request.createdAt.replace(' ', 'T')">{{ request.createdAt }}</time>
                </span>
                  <VisDivider type="vertical" length="12px" />
                  <VisTag label="仓库标签" />
                  <VisDivider type="vertical" length="12px" />
                  <span class="merge-request-item__branch-flow">
                    <VisTag :label="request.sourceBranch">
                      <template #leading>
                        <Icon name="git-branch-02" :size="12" decorative />
                      </template>
                      {{ request.sourceBranch }}
                    </VisTag>
                    <Icon class="merge-request-item__arrow" name="arrow-right" :size="16" decorative />
                    <VisTag :label="request.targetBranch">
                      <template #leading>
                        <Icon name="git-branch-02" :size="12" decorative />
                      </template>
                      {{ request.targetBranch }}
                    </VisTag>
                  </span>
                  <VisDivider type="vertical" length="12px" />
                  <span class="merge-request-item__additions">+{{ request.additions }}</span>
                  <span class="merge-request-item__deletions">-{{ request.deletions }}</span>
              </div>
            </article>
          </VisCard>
        </div>

        <div v-else class="repository-merge-requests__empty">
          <VisFeaturedIcon size="lg" type="modern" color="grey" icon="git-pull-request" decorative />
          <p>未找到符合条件的合并请求</p>
          <span>请尝试调整搜索或筛选条件</span>
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped>
.repository-merge-requests {
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-text);
}

.repository-merge-requests__header {
  flex: 0 0 auto;
  background: var(--color-bg-canvas);
}

.repository-merge-requests__scroll {
  min-block-size: 0;
  flex: 1 1 0;
  overflow-y: auto;
  background: var(--color-bg-canvas);
}

.repository-merge-requests__content {
  box-sizing: border-box;
  inline-size: min(100%, 1200px);
  margin-inline: auto;
  padding: var(--space-16) 0 var(--space-32);
}

.repository-merge-requests__content h1 {
  margin: 0 0 var(--space-16);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h5-size);
  font-weight: 600;
  line-height: var(--font-heading-h5-line-height);
}

.repository-merge-requests__toolbar,
.repository-merge-requests__filters,
.merge-request-item__top,
.merge-request-item__meta,
.merge-request-item__author,
.merge-request-item__comments {
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.repository-merge-requests__toolbar {
  margin-block-end: var(--space-16);
  justify-content: space-between;
  gap: var(--space-8);
}

.repository-merge-requests__filters {
  gap: var(--space-8);
  flex-wrap: wrap;
}

.repository-merge-requests__search {
  inline-size: 240px;
}

.repository-merge-requests__create {
  min-inline-size: 128px;
  flex: 0 0 auto;
}

.merge-request-list {
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
}

.merge-request-item {
  border: 0;
  border-radius: 0;
}

.merge-request-item + .merge-request-item {
  border-block-start: 1px solid var(--color-border-default);
}

.merge-request-item__content {
  box-sizing: border-box;
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.merge-request-item__top {
  gap: var(--space-8);
}

.merge-request-item__status-icon {
  flex: 0 0 var(--space-24);
}

.merge-request-item__status-icon.is-active {
  color: var(--color-fg-brand-primary);
}

.merge-request-item__status-icon.is-success {
  color: var(--color-fg-success-primary);
}

.merge-request-item__status-icon.is-danger {
  color: var(--color-fg-danger-primary);
}

.merge-request-item__status-icon.is-closed {
  color: var(--color-fg-tertiary);
}

.merge-request-item__title {
  --el-link-font-size: var(--font-text-lg-size);
  --el-link-font-weight: 500;

  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.merge-request-item__spacer {
  min-inline-size: var(--space-8);
  flex: 1 1 0;
}

.merge-request-item__comments {
  flex: 0 0 auto;
}

.merge-request-item__meta {
  padding-inline-start: 36px;
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  flex-wrap: wrap;
}

.merge-request-item__identity,
.merge-request-item__branch-flow {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.merge-request-item__identity {
  white-space: nowrap;
}

.merge-request-item__author {
  gap: var(--space-6);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.merge-request-item__meta time {
  color: var(--color-text-primary);
}

.merge-request-item__meta :deep(.vis-tag) {
  block-size: var(--space-24);
  padding-inline: var(--space-6);
}

.merge-request-item__meta :deep(.vis-tag__label) {
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.merge-request-item__arrow {
  color: var(--color-fg-tertiary);
  flex: 0 0 auto;
}

.merge-request-item__additions {
  color: var(--color-text-success-primary);
}

.merge-request-item__deletions {
  color: var(--color-text-danger-primary);
}

.repository-merge-requests__empty {
  min-block-size: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
}

.repository-merge-requests__empty p {
  margin: var(--space-8) 0 0;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
}

.repository-merge-requests__empty span {
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

@media (max-width: 1320px) {
  .repository-merge-requests__content {
    inline-size: 100%;
    padding-inline: var(--space-20);
  }
}

@media (max-width: 760px) {
  .repository-merge-requests__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .repository-merge-requests__filters,
  .repository-merge-requests__search {
    inline-size: 100%;
  }

  .merge-request-item__content {
    padding: var(--space-12);
  }
}
</style>
