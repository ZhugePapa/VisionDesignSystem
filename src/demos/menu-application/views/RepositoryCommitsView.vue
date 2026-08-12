<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisAvatar, type VisAvatarImageVariant } from '../../../components/avatar'
import { VisBadge } from '../../../components/badge'
import type { VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisButtonSplit } from '../../../components/button-split'
import { VisCard } from '../../../components/card'
import { VisDivider } from '../../../components/divider'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import { VisInputSearchBox } from '../../../components/input-search-box'
import Icon from '../../../components/icons/Icon.vue'
import { VisLink } from '../../../components/link'
import { VisPageHeader } from '../../../components/page-header'
import type { VisTabsItem, VisTabsValue } from '../../../components/tabs'
import { defaultProjectKey, projects } from '../navigation'
import { createRepositoryTabs } from '../repository-tabs'
import {
  findRepositoryByKey,
  type DemoCommit,
  type DemoMergeRequestStatus,
} from '../repositories'

interface CommitGroup {
  date: string
  commits: DemoCommit[]
}

const route = useRoute()
const router = useRouter()

const repository = computed(() => findRepositoryByKey(String(route.params.repositoryId)))
const repositoryData = computed(() => repository.value?.data)
const currentProject = computed(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})

function resolveInitialBranch(): string {
  const queryBranch = typeof route.query.branch === 'string' ? route.query.branch : ''
  if (queryBranch && repositoryData.value?.branches.some((branch) => branch.name === queryBranch)) {
    return queryBranch
  }
  return repositoryData.value?.defaultBranch ?? 'main'
}

const selectedBranch = ref(resolveInitialBranch())
const searchValue = ref('')
const selectedCreator = ref('创建人')
const selectedTime = ref('创建时间')
const expandedCommitIds = ref<Set<string>>(new Set())
const copiedCommitId = ref('')

const repositoryTabs = computed<VisTabsItem[]>(() =>
  createRepositoryTabs(repositoryData.value?.mergeRequests.length ?? 0),
)

const breadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目' },
  { label: currentProject.value.label },
  { label: '代码仓库', active: true },
])

const branchItems = computed<VisDropdownEntry[]>(() =>
  (repositoryData.value?.branches ?? []).map((branch) => ({
    type: 'item',
    label: branch.name,
    active: branch.name === selectedBranch.value,
    description: true,
    descriptionText: `${branch.commitId} · ${branch.updatedAt}`,
  })),
)

const creatorItems = computed<VisDropdownEntry[]>(() => {
  const creators = Array.from(new Set((repositoryData.value?.commits ?? []).map((commit) => commit.author)))
  return ['创建人', ...creators].map((label) => ({
    type: 'item',
    label,
    active: selectedCreator.value === label,
  }))
})

const timeItems = computed<VisDropdownEntry[]>(() =>
  ['创建时间', '最近 7 天', '最近 30 天'].map((label) => ({
    type: 'item',
    label,
    active: selectedTime.value === label,
  })),
)

const branchCommits = computed<DemoCommit[]>(() => {
  const commits = repositoryData.value?.commits ?? []
  const branchCommitIds = repositoryData.value?.branchCommitIds[selectedBranch.value]
  if (!branchCommitIds) return commits
  const commitOrder = new Map(branchCommitIds.map((id, index) => [id, index]))
  return commits
    .filter((commit) => commitOrder.has(commit.id))
    .sort((left, right) => (commitOrder.get(left.id) ?? 0) - (commitOrder.get(right.id) ?? 0))
})

const filteredCommits = computed<DemoCommit[]>(() => {
  const query = searchValue.value.trim().toLocaleLowerCase()
  const rangeDays = selectedTime.value === '最近 7 天' ? 7 : selectedTime.value === '最近 30 天' ? 30 : 0
  const rangeStart = rangeDays > 0 ? Date.now() - rangeDays * 24 * 60 * 60 * 1000 : 0

  return branchCommits.value.filter((commit) => {
    const matchesQuery = !query
      || `${commit.message} ${commit.id} ${commit.description ?? ''} ${commit.author}`.toLocaleLowerCase().includes(query)
    const matchesCreator = selectedCreator.value === '创建人' || commit.author === selectedCreator.value
    const matchesTime = rangeDays === 0 || new Date(commit.time.replace(' ', 'T')).getTime() >= rangeStart
    return matchesQuery && matchesCreator && matchesTime
  })
})

const commitGroups = computed<CommitGroup[]>(() => {
  const groups = new Map<string, DemoCommit[]>()
  for (const commit of filteredCommits.value) {
    const date = commit.time.slice(0, 10)
    const commits = groups.get(date) ?? []
    commits.push(commit)
    groups.set(date, commits)
  }
  return Array.from(groups, ([date, commits]) => ({ date, commits }))
})

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

function mergeRequestStatusClass(mergeRequestId: number): string {
  const status: DemoMergeRequestStatus = repositoryData.value?.mergeRequests
    .find((request) => request.id === mergeRequestId)?.status ?? 'open'

  if (status === 'merged') return 'is-success'
  if (status === 'rejected') return 'is-danger'
  if (status === 'closed') return 'is-closed'
  return 'is-active'
}

function handleBranchSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedBranch.value = payload.item.label
}

function handleCreatorSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedCreator.value = payload.item.label
}

function handleTimeSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedTime.value = payload.item.label
}

function toggleCommitDescription(commitId: string): void {
  const next = new Set(expandedCommitIds.value)
  if (next.has(commitId)) next.delete(commitId)
  else next.add(commitId)
  expandedCommitIds.value = next
}

function isCommitExpanded(commitId: string): boolean {
  return expandedCommitIds.value.has(commitId)
}

async function copyCommitId(commitId: string): Promise<void> {
  if (!navigator.clipboard) return
  const copied = await navigator.clipboard.writeText(commitId).then(() => true).catch(() => false)
  if (!copied) return
  copiedCommitId.value = commitId
  window.setTimeout(() => {
    if (copiedCommitId.value === commitId) copiedCommitId.value = ''
  }, 1600)
}

function openRepositoryDetail(tab: VisTabsValue = 'code'): void {
  if (tab === 'merge-requests') {
    void router.push({
      name: 'repository-merge-requests',
      params: {
        projectKey: String(route.params.projectKey ?? defaultProjectKey),
        repositoryId: String(route.params.repositoryId),
      },
    })
    return
  }
  void router.push({
    name: 'repository-detail',
    params: {
      projectKey: String(route.params.projectKey ?? defaultProjectKey),
      repositoryId: String(route.params.repositoryId),
    },
    query: {
      branch: selectedBranch.value,
      ...(tab !== 'code' ? { tab: String(tab) } : {}),
    },
  })
}

function syncDocumentTitle(): void {
  document.title = `提交 - ${repository.value?.name ?? '代码仓库'} - Vision Application`
}

watch(repository, () => {
  selectedBranch.value = resolveInitialBranch()
  expandedCommitIds.value = new Set()
  syncDocumentTitle()
})
watch(selectedBranch, () => {
  expandedCommitIds.value = new Set()
})
onMounted(syncDocumentTitle)
</script>

<template>
  <section class="repository-commits" :aria-label="`${repository?.name ?? '代码仓库'}提交列表`">
    <VisPageHeader
      class="repository-commits__header"
      :title="repository?.name ?? '代码仓库'"
      :description="repository?.description ?? ''"
      :breadcrumb-items="breadcrumbItems"
      :tabs="repositoryTabs"
      active-tab="code"
      @tab-change="openRepositoryDetail"
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

    <main class="repository-commits__scroll">
      <div class="repository-commits__content">
        <h1>提交</h1>

        <div class="repository-commits__filters" aria-label="提交筛选">
          <VisDropdown :items="branchItems" @select="handleBranchSelect">
            <template #trigger="{ toggle }">
              <VisButton
                class="repository-commits__branch"
                variant="secondary"
                size="md"
                suffix
                suffix-icon-name="chevron-down"
                :label="selectedBranch"
                aria-haspopup="menu"
                @click="toggle"
              >
                {{ selectedBranch }}
              </VisButton>
            </template>
          </VisDropdown>
          <VisInputSearchBox
            v-model="searchValue"
            class="repository-commits__search"
            placeholder="请输入标题/编号/描述关键字"
            aria-label="搜索提交"
          />
          <VisDropdown :items="creatorItems" :button-label="selectedCreator" @select="handleCreatorSelect" />
          <VisDropdown :items="timeItems" :button-label="selectedTime" @select="handleTimeSelect" />
        </div>

        <div v-if="commitGroups.length" class="repository-commits__groups">
          <section v-for="group in commitGroups" :key="group.date" class="commit-group">
            <div class="commit-group__label">
              <span>{{ group.date }}</span>
              <span>{{ group.commits.length }} 个提交</span>
            </div>

            <div class="commit-group__card">
              <VisCard
                v-for="commit in group.commits"
                :key="commit.id"
                class="commit-item"
                :show-action="false"
                body-class="commit-item__body"
              >
                <article class="commit-item__content">
                  <div class="commit-item__top">
                    <VisLink class="commit-item__title" :label="commit.message">
                      {{ commit.message }}
                    </VisLink>
                    <VisButton
                      v-if="commit.description"
                      variant="text"
                      size="sm"
                      icon-only
                      icon-name="annotation-dots"
                      :label="`${isCommitExpanded(commit.id) ? '收起' : '展开'}${commit.message}的提交描述`"
                      :aria-expanded="isCommitExpanded(commit.id)"
                      @click="toggleCommitDescription(commit.id)"
                    />
                    <span class="commit-item__spacer" aria-hidden="true" />
                    <VisBadge
                      v-if="commit.verified"
                      class="commit-item__verified"
                      type="default"
                      color="aqua"
                      label="已验证"
                    />
                    <VisButtonSplit class="commit-item__hash" color="grey" size="sm">
                      <VisButton variant="text" size="sm" prefix icon-name="git-commit" :label="commit.id">
                        {{ commit.id }}
                      </VisButton>
                      <VisButton
                        variant="text"
                        size="sm"
                        icon-only
                        :icon-name="copiedCommitId === commit.id ? 'check' : 'copy-04'"
                        :label="copiedCommitId === commit.id ? '已复制提交号' : `复制提交号 ${commit.id}`"
                        @click="copyCommitId(commit.id)"
                      />
                    </VisButtonSplit>
                    <VisButton
                      variant="text"
                      size="sm"
                      icon-only
                      icon-name="dots-horizontal"
                      label="更多提交操作（演示）"
                    />
                  </div>

                  <p v-if="isCommitExpanded(commit.id)" class="commit-item__description">
                    {{ commit.description }}
                  </p>

                  <div class="commit-item__meta">
                    <span class="commit-item__author">
                      <VisAvatar
                        size="xs"
                        type="image"
                        :image-variant="avatarVariant(commit.author)"
                        :image-alt="commit.author"
                      />
                      <span>{{ commit.author }}</span>
                    </span>
                    <span class="commit-item__muted">提交于</span>
                    <time :datetime="commit.time.replace(' ', 'T')">{{ commit.time }}</time>
                    <VisDivider
                      v-if="commit.mergeRequestId"
                      class="commit-item__divider"
                      type="vertical"
                      length="12px"
                    />
                    <span v-if="commit.mergeRequestId" class="commit-item__merge-request">
                      <VisLink
                        class="commit-item__merge-request-link"
                        :class="mergeRequestStatusClass(commit.mergeRequestId)"
                        prefix
                        :label="`合并请求 #${commit.mergeRequestId}`"
                      >
                        <template #prefix>
                          <Icon name="git-pull-request" :size="16" decorative />
                        </template>
                        #{{ commit.mergeRequestId }}
                      </VisLink>
                    </span>
                  </div>
                </article>
              </VisCard>
            </div>
          </section>
        </div>

        <div v-else class="repository-commits__empty">
          <VisFeaturedIcon size="lg" type="modern" color="grey" icon="git-commit" decorative />
          <p>未找到符合条件的提交</p>
          <span>请尝试切换分支或调整筛选条件</span>
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped>
.repository-commits {
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

.repository-commits__header {
  flex: 0 0 auto;
  background: var(--color-bg-canvas);
}

.repository-commits__scroll {
  min-block-size: 0;
  flex: 1 1 0;
  overflow-y: auto;
  background: var(--color-bg-canvas);
}

.repository-commits__content {
  box-sizing: border-box;
  inline-size: min(100%, 1200px);
  margin-inline: auto;
  padding: var(--space-16) 0 var(--space-32);
}

.repository-commits__content h1 {
  margin: 0 0 var(--space-12);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
}

.repository-commits__filters {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.repository-commits__branch {
  min-inline-size: 92px;
  justify-content: space-between;
}

.repository-commits__search {
  inline-size: 240px;
}

.repository-commits__groups {
  margin-block-start: var(--space-24);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.commit-group__label {
  margin-block-end: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.commit-group__card {
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
}

.commit-item {
  border: 0;
  border-radius: 0;
}

.commit-item__content {
  box-sizing: border-box;
  min-block-size: 82px;
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.commit-item + .commit-item {
  border-block-start: 1px solid var(--color-border-default);
}

.commit-item__top {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.commit-item__title {
  min-inline-size: 0;
  overflow: hidden;
  --el-link-font-size: var(--font-text-lg-size);
  --el-link-font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.commit-item__spacer {
  min-inline-size: var(--space-8);
  flex: 1 1 0;
}

.commit-item__verified {
  block-size: var(--space-24) !important;
  flex: 0 0 auto;
}

.commit-item__hash {
  flex: 0 0 auto;
}

.commit-item__description {
  max-inline-size: 724px;
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  white-space: pre-line;
}

.commit-item__meta {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.commit-item__author {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.commit-item__meta time {
  color: var(--color-text-primary);
}

.commit-item__muted {
  color: var(--color-text-tertiary);
}

.commit-item__divider {
  flex: 0 0 auto;
}

.commit-item__merge-request {
  display: inline-flex;
  align-items: center;
}

.commit-item__merge-request-link {
  --el-link-font-size: var(--font-text-md-size);

  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.commit-item__merge-request-link :deep(.vis-link__label) {
  line-height: var(--font-text-md-line-height);
}

.commit-item__merge-request-link.is-success :deep(.vis-link__icon) {
  color: var(--color-fg-success-primary);
}

.commit-item__merge-request-link.is-danger :deep(.vis-link__icon) {
  color: var(--color-fg-danger-primary);
}

.commit-item__merge-request-link.is-closed :deep(.vis-link__icon) {
  color: var(--color-fg-tertiary);
}

.commit-item__merge-request-link.is-active :deep(.vis-link__icon) {
  color: var(--color-fg-brand-primary);
}

.commit-item__verified :deep(.vis-badge__text) {
  line-height: var(--font-text-sm-line-height);
}

.repository-commits__empty {
  margin-block-start: var(--space-56);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  text-align: center;
}

.repository-commits__empty p,
.repository-commits__empty span {
  margin: 0;
}

.repository-commits__empty p {
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
}

.repository-commits__empty span {
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

@media (max-width: 1280px) {
  .repository-commits__content {
    inline-size: auto;
    margin-inline: var(--space-24);
  }
}

@media (max-width: 760px) {
  .repository-commits__content {
    margin-inline: var(--space-16);
  }

  .repository-commits__filters,
  .repository-commits__search {
    inline-size: 100%;
  }

  .commit-item__top {
    flex-wrap: wrap;
  }

  .commit-item__spacer {
    display: none;
  }

  .commit-item__meta {
    flex-wrap: wrap;
  }
}
</style>
