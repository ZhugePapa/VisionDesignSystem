<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisAvatarLabel, type VisAvatarImageVariant } from '../../../components/avatar'
import { VisBadge } from '../../../components/badge'
import type { VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import { VisInputSearchBox } from '../../../components/input-search-box'
import Icon from '../../../components/icons/Icon.vue'
import { VisPageHeader } from '../../../components/page-header'
import { VisSegmented, type VisSegmentedOption, type VisSegmentedValue } from '../../../components/segmented'
import { VisTable, type VisTableColumn, type VisTableRowData } from '../../../components/table'
import { VisTag } from '../../../components/tag'
import type { VisTabsItem, VisTabsValue } from '../../../components/tabs'
import { defaultProjectKey, projects } from '../navigation'
import { createRepositoryTabs } from '../repository-tabs'
import {
  findRepositoryByKey,
  type DemoBranch,
  type DemoMergeRequest,
  type DemoMergeRequestStatus,
} from '../repositories'
import RepositoryCreateRefModal from './RepositoryCreateRefModal.vue'

type BranchScope = 'all' | 'related' | 'active' | 'stale'

interface BranchTableRow extends VisTableRowData {
  name: string
  updater: string
  updaterAvatar: VisAvatarImageVariant
  updatedAt: string
  mergeRequest?: DemoMergeRequest
  ahead: number
  behind: number
  protected: boolean
  isDefault: boolean
  isStale: boolean
}

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
  { value: 'all', label: '全部' },
  { value: 'related', label: '与我相关' },
  { value: 'active', label: '活跃' },
  { value: 'stale', label: '已过时' },
]

const columns: VisTableColumn[] = [
  { key: 'name', label: '分支名', minWidth: 200 },
  { key: 'updater', label: '更新人', width: 120 },
  { key: 'updatedAt', label: '更新时间', width: 200 },
  { key: 'mergeRequest', label: '合并请求', width: 160, showOverflowTooltip: false },
  {
    key: 'comparison',
    label: '领先 丨 滞后',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    showOverflowTooltip: false,
  },
  { key: 'actions', label: '操作', width: 120, showOverflowTooltip: false },
]

const selectedScope = ref<BranchScope>('all')
const searchValue = ref('')
const selectedStatus = ref('状态')
const selectedCreator = ref('创建人')
const copiedBranchName = ref('')
const createBranchModalOpen = ref(false)

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

function branchRow(row: VisTableRowData): BranchTableRow {
  return row as BranchTableRow
}

function branchMergeRequest(branch: DemoBranch): DemoMergeRequest | undefined {
  return repositoryData.value?.mergeRequests.find((request) => request.sourceBranch === branch.name)
}

function mergeRequestStatusClass(status: DemoMergeRequestStatus): string {
  if (status === 'merged') return 'is-success'
  if (status === 'rejected') return 'is-danger'
  if (status === 'closed') return 'is-closed'
  return 'is-active'
}

function relativeBranchCounts(branch: DemoBranch): { ahead: number; behind: number } {
  const data = repositoryData.value
  if (!data) return { ahead: 0, behind: 0 }

  const defaultCommitIds = new Set(data.branchCommitIds[data.defaultBranch] ?? [])
  const branchCommitIds = new Set(data.branchCommitIds[branch.name] ?? [])
  return {
    ahead: [...branchCommitIds].filter((id) => !defaultCommitIds.has(id)).length,
    behind: [...defaultCommitIds].filter((id) => !branchCommitIds.has(id)).length,
  }
}

const branchRows = computed<BranchTableRow[]>(() =>
  (repositoryData.value?.branches ?? []).map((branch) => {
    const comparison = relativeBranchCounts(branch)
    return {
      name: branch.name,
      updater: branch.updatedBy,
      updaterAvatar: avatarVariant(branch.updatedBy),
      updatedAt: branch.updatedAt,
      mergeRequest: branchMergeRequest(branch),
      ahead: comparison.ahead,
      behind: comparison.behind,
      protected: branch.protected,
      isDefault: branch.isDefault,
      isStale: branch.stale,
    }
  }),
)

const creatorItems = computed<VisDropdownEntry[]>(() => {
  const creators = Array.from(new Set(branchRows.value.map((branch) => branch.updater)))
  return ['创建人', ...creators].map((label, index) => ({
    type: 'item',
    label,
    active: selectedCreator.value === label,
    ...(index > 0
      ? {
          itemType: 'avatar' as const,
          title: label,
          subtitle: label === '张大山' ? 'zhangdashan' : label === '李思雨' ? 'lisiyu' : label,
          avatarImageVariant: avatarVariant(label),
        }
      : {}),
  }))
})

const statusItems = computed<VisDropdownEntry[]>(() =>
  ['状态', '默认分支', '保护分支', '普通分支'].map((label) => ({
    type: 'item',
    label,
    active: selectedStatus.value === label,
  })),
)

const filteredBranches = computed<BranchTableRow[]>(() => {
  const query = searchValue.value.trim().toLocaleLowerCase()
  return branchRows.value.filter((branch) => {
    const matchesScope = selectedScope.value === 'all'
      || (selectedScope.value === 'related' && branch.updater === '张大山')
      || (selectedScope.value === 'active' && !branch.isStale)
      || (selectedScope.value === 'stale' && branch.isStale)
    const matchesQuery = !query
      || `${branch.name} ${branch.updater} ${branch.mergeRequest?.id ?? ''}`.toLocaleLowerCase().includes(query)
    const matchesStatus = selectedStatus.value === '状态'
      || (selectedStatus.value === '默认分支' && branch.isDefault)
      || (selectedStatus.value === '保护分支' && branch.protected)
      || (selectedStatus.value === '普通分支' && !branch.protected)
    const matchesCreator = selectedCreator.value === '创建人' || branch.updater === selectedCreator.value
    return matchesScope && matchesQuery && matchesStatus && matchesCreator
  })
})

function handleScopeChange(value: VisSegmentedValue): void {
  selectedScope.value = value as BranchScope
}

function handleStatusSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedStatus.value = payload.item.label
}

function handleCreatorSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedCreator.value = payload.item.label
}

function resetFilters(): void {
  selectedScope.value = 'all'
  searchValue.value = ''
  selectedStatus.value = '状态'
  selectedCreator.value = '创建人'
}

async function copyBranchName(branchName: string): Promise<void> {
  if (!navigator.clipboard) return
  const copied = await navigator.clipboard.writeText(branchName).then(() => true).catch(() => false)
  if (!copied) return
  copiedBranchName.value = branchName
  window.setTimeout(() => {
    if (copiedBranchName.value === branchName) copiedBranchName.value = ''
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
    query: tab !== 'code' ? { tab: String(tab) } : undefined,
  })
}

function syncDocumentTitle(): void {
  document.title = `分支 - ${repository.value?.name ?? '代码仓库'} - Vision Application`
}

watch(repository, () => {
  resetFilters()
  syncDocumentTitle()
})
onMounted(syncDocumentTitle)
</script>

<template>
  <section class="repository-branches" :aria-label="`${repository?.name ?? '代码仓库'}分支列表`">
    <VisPageHeader
      class="repository-branches__header"
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

    <main class="repository-branches__scroll">
      <div class="repository-branches__content">
        <h1>分支</h1>

        <div class="repository-branches__toolbar" aria-label="分支筛选">
          <div class="repository-branches__filters">
            <VisSegmented
              :model-value="selectedScope"
              :options="scopeOptions"
              :icon="false"
              aria-label="分支范围"
              @change="handleScopeChange"
            />
            <VisInputSearchBox
              v-model="searchValue"
              class="repository-branches__search"
              placeholder="请输入标题/编号/描述关键字"
              aria-label="搜索分支"
            />
            <VisDropdown :items="statusItems" :button-label="selectedStatus" @select="handleStatusSelect" />
            <VisDropdown :items="creatorItems" :button-label="selectedCreator" @select="handleCreatorSelect" />
            <VisButton
              variant="secondary"
              size="md"
              icon-only
              icon-name="filter-funnel-02"
              label="清除分支筛选"
              @click="resetFilters"
            />
          </div>

          <VisButton
            variant="primary"
            size="md"
            prefix
            icon-name="plus"
            label="创建分支"
            @click="createBranchModalOpen = true"
          >
            创建分支
          </VisButton>
        </div>

        <div class="repository-branches__table-scroll">
          <VisTable
            class="repository-branches__table"
            :data="filteredBranches"
            :columns="columns"
            row-key="name"
            empty-text="未找到符合条件的分支"
            aria-label="分支列表"
          >
          <template #cell-name="{ row }">
            <div class="branch-name-cell">
              <VisBadge
                class="branch-name-badge"
                type="default"
                color="blue"
                :label="branchRow(row).name"
              />
              <VisButton
                variant="text"
                size="sm"
                icon-only
                :icon-name="copiedBranchName === branchRow(row).name ? 'check' : 'copy-04'"
                :label="copiedBranchName === branchRow(row).name ? `已复制${branchRow(row).name}` : `复制分支名${branchRow(row).name}`"
                @click="copyBranchName(branchRow(row).name)"
              />
            </div>
          </template>

          <template #cell-updater="{ row }">
            <VisAvatarLabel
              size="sm"
              :addition="false"
              :title="branchRow(row).updater"
              :avatar-image-variant="branchRow(row).updaterAvatar"
              :avatar-image-alt="branchRow(row).updater"
            />
          </template>

          <template #cell-mergeRequest="{ row }">
            <VisTag
              v-if="branchRow(row).mergeRequest"
              class="branch-merge-request"
              :class="mergeRequestStatusClass(branchRow(row).mergeRequest!.status)"
              :label="`#${branchRow(row).mergeRequest?.id}`"
            >
              <template #leading>
                <Icon name="git-pull-request" :size="16" decorative />
              </template>
            </VisTag>
            <span v-else class="branch-empty-value">-</span>
          </template>

          <template #cell-comparison="{ row }">
            <div class="branch-comparison" :aria-label="`领先${branchRow(row).ahead}，滞后${branchRow(row).behind}`">
              <span>{{ branchRow(row).ahead }}</span>
              <span aria-hidden="true">丨</span>
              <span>{{ branchRow(row).behind }}</span>
            </div>
          </template>

          <template #cell-actions="{ row }">
            <div class="branch-actions">
              <VisButton
                variant="text"
                size="sm"
                icon-only
                icon-name="trash-01"
                :label="`删除分支${branchRow(row).name}（演示）`"
                :disabled="branchRow(row).protected || branchRow(row).isDefault"
              />
              <VisButton
                variant="text"
                size="sm"
                icon-only
                icon-name="dots-horizontal"
                :label="`${branchRow(row).name}更多操作（演示）`"
              />
            </div>
          </template>
          </VisTable>
        </div>
      </div>
    </main>

    <RepositoryCreateRefModal
      v-model="createBranchModalOpen"
      type="branch"
      :branches="repositoryData?.branches ?? []"
    />
  </section>
</template>

<style scoped>
.repository-branches {
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

.repository-branches__header {
  flex: 0 0 auto;
  background: var(--color-bg-canvas);
}

.repository-branches__scroll {
  min-block-size: 0;
  flex: 1 1 0;
  overflow-y: auto;
  background: var(--color-bg-canvas);
}

.repository-branches__content {
  box-sizing: border-box;
  inline-size: min(100%, 1200px);
  margin-inline: auto;
  padding: var(--space-16) 0 var(--space-32);
}

.repository-branches__content h1 {
  margin: 0 0 var(--space-16);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
}

.repository-branches__toolbar {
  margin-block-end: var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.repository-branches__filters {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.repository-branches__search {
  inline-size: 240px;
}

.repository-branches__table-scroll {
  inline-size: 100%;
  overflow-x: auto;
  border-radius: var(--radius-sm);
}

.repository-branches__table {
  min-inline-size: 1000px;
}

.repository-branches__table :deep(.vis-el-table__body-wrapper) {
  overflow-x: hidden;
}

.branch-name-badge {
  block-size: var(--space-24) !important;
}

.branch-name-cell,
.branch-actions,
.branch-comparison {
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.branch-name-cell,
.branch-actions {
  gap: var(--space-8);
}

.branch-comparison {
  inline-size: 100%;
  justify-content: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
}

.branch-comparison span:first-child,
.branch-comparison span:last-child {
  min-inline-size: 0;
  flex: 1 1 0;
}

.branch-comparison span:first-child {
  text-align: end;
}

.branch-empty-value {
  color: var(--color-text-tertiary);
}

.branch-merge-request.is-success :deep(.vis-icon) {
  color: var(--color-fg-success-primary);
}

.branch-merge-request.is-danger :deep(.vis-icon) {
  color: var(--color-fg-danger-primary);
}

.branch-merge-request.is-closed :deep(.vis-icon) {
  color: var(--color-fg-tertiary);
}

.branch-merge-request.is-active :deep(.vis-icon) {
  color: var(--color-fg-brand-primary);
}

@media (max-width: 1320px) {
  .repository-branches__content {
    inline-size: 100%;
    padding-inline: var(--space-20);
  }
}

@media (max-width: 760px) {
  .repository-branches__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .repository-branches__filters,
  .repository-branches__search {
    inline-size: 100%;
  }
}
</style>
