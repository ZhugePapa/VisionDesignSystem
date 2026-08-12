<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisBreadcrumb, type VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisButtonSplit } from '../../../components/button-split'
import { VisCard } from '../../../components/card'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import { VisFileIcon } from '../../../components/file-icon'
import Icon from '../../../components/icons/Icon.vue'
import type { IconName } from '../../../components/icons/generated/registry.generated'
import { VisInputSearchBox } from '../../../components/input-search-box'
import { defaultProjectKey, projects } from '../navigation'
import { demoRepositories, findRepositoryByKey, type DemoRepository } from '../repositories'

interface RepoListRow {
  key: string
  name: string
  level: number
  kind: 'group' | 'repo'
  fileIcon?: 'folder' | 'code'
  stars: number
}

const route = useRoute()
const router = useRouter()

const currentProject = computed(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})

const breadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目' },
  { label: currentProject.value.label },
  { label: '代码仓库', active: true },
])

const recentRepositoryKeys = [
  'flight-control-core',
  'attitude-algo',
  'mission-plan-frontend',
  'telemetry-gateway',
  'embedded-drivers',
] as const

const recentRepositories: DemoRepository[] = recentRepositoryKeys
  .map((key) => demoRepositories.find((repository) => repository.key === key))
  .filter((repository): repository is DemoRepository => Boolean(repository))

const repositorySearch = ref('')
const selectedStatus = ref('全部状态')
const selectedCreator = ref('全部创建人')

const statusItems = computed<VisDropdownEntry[]>(() =>
  ['全部状态', '活跃', '已归档', '已锁定'].map((label) => ({
    type: 'item',
    label,
    active: selectedStatus.value === label,
  })),
)

const creatorItems = computed<VisDropdownEntry[]>(() =>
  ['全部创建人', '张大山', '李思雨', '王建国'].map((label, index) => ({
    type: 'item',
    label,
    active: selectedCreator.value === label,
    ...(index > 0
      ? {
          itemType: 'avatar' as const,
          title: label,
          subtitle: ['zhangdashan', 'lisiyu', 'wangjianguo'][index - 1],
          avatarImageVariant: ['09', '06', '03'][index - 1] as '09' | '06' | '03',
        }
      : {}),
  })),
)

const moreItems: VisDropdownEntry[] = [
  { type: 'item', label: '按最近访问排序', active: true },
  { type: 'item', label: '按名称排序' },
  { type: 'divider' },
  { type: 'item', label: '仅显示已收藏' },
]

const repoRows: RepoListRow[] = [
  { key: 'airborne', name: '机载软件中心', level: 0, kind: 'group', fileIcon: 'folder', stars: 23 },
  { key: 'fly-control', name: '飞控系统', level: 1, kind: 'group', fileIcon: 'folder', stars: 23 },
  { key: 'core-algo', name: '核心算法', level: 2, kind: 'group', fileIcon: 'folder', stars: 23 },
  { key: 'flight-control-core', name: '飞控核心模块', level: 3, kind: 'repo', stars: 23 },
  { key: 'guidance-algo', name: '制导算法库', level: 3, kind: 'repo', stars: 23 },
  { key: 'attitude-algo', name: '姿态估计算法', level: 3, kind: 'repo', stars: 23 },
  { key: 'telemetry-gateway', name: '遥测数据网关', level: 2, kind: 'repo', stars: 15 },
  { key: 'command', name: '指挥控制系统', level: 1, kind: 'group', fileIcon: 'folder', stars: 23 },
  { key: 'mission-plan-frontend', name: '任务规划前端', level: 3, kind: 'repo', stars: 23 },
  { key: 'embedded-drivers', name: '嵌入式驱动组件', level: 3, kind: 'repo', stars: 23 },
  { key: 'group-avionics', name: '综合航电系统', level: 2, kind: 'group', fileIcon: 'code', stars: 23 },
]

const expandedGroupKeys = ref<Set<string>>(
  new Set(['airborne', 'fly-control', 'core-algo', 'command']),
)

const visibleRepoRows = computed<RepoListRow[]>(() => {
  const visible: RepoListRow[] = []
  const path: RepoListRow[] = []
  for (const row of repoRows) {
    while (path.length > 0 && path[path.length - 1].level >= row.level) path.pop()
    if (path.some((group) => !expandedGroupKeys.value.has(group.key))) continue
    visible.push(row)
    if (row.kind === 'group') path.push(row)
  }
  const query = repositorySearch.value.trim().toLocaleLowerCase()
  const statusMap: Record<DemoRepository['status'], string> = {
    active: '活跃',
    archived: '已归档',
    locked: '已锁定',
  }
  const hasFilters = Boolean(query)
    || selectedStatus.value !== '全部状态'
    || selectedCreator.value !== '全部创建人'
  if (!hasFilters) return visible

  return visible
    .filter((row) => {
      const detail = repoDetail(row)
      if (!detail) return false
      const matchesQuery = !query
        || `${detail.name} ${detail.code} ${detail.description} ${detail.language}`.toLocaleLowerCase().includes(query)
      const matchesStatus = selectedStatus.value === '全部状态'
        || statusMap[detail.status] === selectedStatus.value
      const matchesCreator = selectedCreator.value === '全部创建人'
        || detail.creator === selectedCreator.value
      return matchesQuery && matchesStatus && matchesCreator
    })
    .map((row) => ({ ...row, level: 0 }))
})

function toggleGroup(key: string): void {
  const next = new Set(expandedGroupKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedGroupKeys.value = next
}

function isGroupExpanded(key: string): boolean {
  return expandedGroupKeys.value.has(key)
}

function repoDetail(row: RepoListRow): DemoRepository | undefined {
  return row.kind === 'repo' ? findRepositoryByKey(row.key) : undefined
}

function repositoryMergeRequestCount(repository: DemoRepository | undefined): number {
  return repository?.data.mergeRequests.filter((request) => request.status === 'open' || request.status === 'draft').length ?? 0
}

function repositoryBranchCount(repository: DemoRepository | undefined): number {
  return repository?.data.branches.length ?? 0
}

function handleStatusSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedStatus.value = payload.item.label
}

function handleCreatorSelect(payload: { item: VisDropdownEntry }): void {
  if (payload.item.label) selectedCreator.value = payload.item.label
}

function openRepository(repositoryKey: string): void {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  void router.push(`/projects/${projectKey}/code/repositories/${repositoryKey}`)
}
</script>

<template>
  <section class="repository-home" aria-label="代码仓库列表">
    <div class="repository-home__inner">
      <header class="repository-home__heading">
        <VisBreadcrumb :items="breadcrumbItems" aria-label="面包屑导航" />
        <h2 class="repository-home__section-title">最近访问</h2>
      </header>

      <div class="repository-recent">
        <VisCard
          v-for="repository in recentRepositories"
          :key="repository.key"
          class="repository-recent__card"
          role="link"
          tabindex="0"
          :aria-label="`打开${repository.name}`"
          @click="openRepository(repository.key)"
          @keydown.enter="openRepository(repository.key)"
        >
          <div class="repository-recent__content">
            <VisFeaturedIcon
              class="repository-recent__icon"
              size="lg"
              type="light-square"
              :color="repository.color"
              :icon="repository.icon"
              :label="repository.name"
              :decorative="false"
            />
            <div class="repository-recent__body">
              <h3 class="repository-recent__name" :title="repository.name">{{ repository.name }}</h3>
              <p class="repository-recent__description" :title="repository.description">
                {{ repository.description }}
              </p>
              <div class="repository-recent__stats">
                <VisButton
                  variant="link-grey"
                  size="md"
                  prefix
                  icon-name="git-pull-request"
                  :label="String(repositoryMergeRequestCount(repository))"
                >
                  {{ repositoryMergeRequestCount(repository) }}
                </VisButton>
                <VisButton
                  variant="link-grey"
                  size="md"
                  prefix
                  icon-name="git-branch-02"
                  :label="String(repositoryBranchCount(repository))"
                >
                  {{ repositoryBranchCount(repository) }}
                </VisButton>
                <VisButton
                  variant="link-grey"
                  size="md"
                  prefix
                  icon-name="star-01"
                  :label="String(repository.stars)"
                >
                  {{ repository.stars }}
                </VisButton>
              </div>
            </div>
          </div>
        </VisCard>
      </div>

      <h2 class="repository-home__section-title">仓库列表</h2>

      <div class="repository-list">
        <div class="repository-toolbar">
          <div class="repository-toolbar__filters">
            <VisInputSearchBox
              v-model="repositorySearch"
              class="repository-toolbar__search"
              placeholder="请输入标题/编号/描述关键字"
              aria-label="搜索代码仓库"
            />
            <VisDropdown :items="statusItems" :button-label="selectedStatus" @select="handleStatusSelect" />
            <VisDropdown :items="creatorItems" :button-label="selectedCreator" @select="handleCreatorSelect" />
            <VisDropdown :items="moreItems">
              <template #trigger="{ toggle }">
                <VisButton
                  variant="secondary"
                  size="md"
                  prefix
                  icon-name="filter-funnel-02"
                  label="更多筛选（演示）"
                  disabled
                  aria-haspopup="menu"
                  @click="toggle"
                >
                  更多筛选
                </VisButton>
              </template>
            </VisDropdown>
          </div>

          <div class="repository-toolbar__actions">
            <VisButton variant="secondary" size="md" prefix icon-name="settings-01" label="设置（演示）" disabled>设置</VisButton>
            <VisButtonSplit color="primary">
              <VisButton variant="primary" size="md" prefix icon-name="plus" label="新建仓库（演示）" disabled>新建仓库</VisButton>
              <VisButton
                variant="primary"
                size="md"
                icon-only
                icon-name="chevron-down"
                label="更多新建方式（演示）"
                disabled
              />
            </VisButtonSplit>
          </div>
        </div>

        <div class="repository-tree">
          <div
            v-for="row in visibleRepoRows"
            :key="row.key"
            class="repository-tree__row"
            :class="{
              'is-repo': row.kind === 'repo',
              'is-clickable': row.kind === 'repo',
            }"
            :style="{ paddingInlineStart: `${12 + row.level * 24}px` }"
            :role="row.kind === 'repo' ? 'link' : undefined"
            :tabindex="row.kind === 'repo' ? 0 : undefined"
            :aria-label="row.kind === 'repo' ? `打开${row.name}` : undefined"
            @click="row.kind === 'repo' && openRepository(row.key)"
            @keydown.enter="row.kind === 'repo' && openRepository(row.key)"
          >
            <VisButton
              v-if="row.kind === 'group'"
              class="repository-tree__chevron"
              variant="text"
              size="sm"
              icon-only
              :icon-name="isGroupExpanded(row.key) ? 'chevron-down' : 'chevron-right'"
              :label="`${isGroupExpanded(row.key) ? '收起' : '展开'}${row.name}`"
              :aria-expanded="isGroupExpanded(row.key)"
              @click="toggleGroup(row.key)"
            />
            <span v-else class="repository-tree__chevron" aria-hidden="true" />

            <VisFileIcon
              v-if="row.kind === 'group'"
              class="repository-tree__node-icon"
              :type="row.fileIcon ?? 'folder'"
              :size="24"
              decorative
            />
            <VisFeaturedIcon
              v-else
              class="repository-tree__node-icon"
              size="sm"
              type="light-square"
              :color="repoDetail(row)?.color ?? 'grey'"
              :label="row.name"
              :decorative="false"
            >
              <template #icon>
                <Icon :name="repoDetail(row)?.icon ?? 'code-02'" :size="14" decorative />
              </template>
            </VisFeaturedIcon>

            <span class="repository-tree__name" :title="row.name">{{ row.name }}</span>

            <template v-if="row.kind === 'repo'">
              <VisButton
                class="repository-tree__stat"
                variant="text"
                size="sm"
                prefix
                icon-name="git-pull-request"
                :label="String(repositoryMergeRequestCount(repoDetail(row)))"
                @click.stop
              >
                {{ repositoryMergeRequestCount(repoDetail(row)) }}
              </VisButton>
              <VisButton
                class="repository-tree__stat"
                variant="text"
                size="sm"
                prefix
                icon-name="git-branch-02"
                :label="String(repositoryBranchCount(repoDetail(row)))"
                @click.stop
              >
                {{ repositoryBranchCount(repoDetail(row)) }}
              </VisButton>
            </template>
            <VisButton
              class="repository-tree__stat"
              variant="text"
              size="sm"
              prefix
              icon-name="star-01"
              :label="String(repoDetail(row)?.stars ?? row.stars)"
              @click.stop
            >
              {{ repoDetail(row)?.stars ?? row.stars }}
            </VisButton>

            <VisButton
              class="repository-tree__more"
              variant="text"
              size="sm"
              icon-only
              icon-name="dots-horizontal"
              :label="`${row.name}更多操作`"
              @click.stop
            />
          </div>
          <div v-if="visibleRepoRows.length === 0" class="repository-tree__empty">
            未找到符合条件的代码仓库
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.repository-home {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 0;
  min-block-size: 0;
  overflow-y: auto;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-text);
}

.repository-home__inner {
  box-sizing: border-box;
  min-inline-size: 0;
  min-block-size: 100%;
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-16);
}

.repository-home__heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-12);
  flex: 0 0 auto;
}

.repository-home__section-title {
  margin: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 最近访问 ---------- */

.repository-recent {
  inline-size: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-16);
}

.repository-recent__card {
  --el-card-border-radius: var(--radius-md);

  box-sizing: border-box;
  inline-size: 320px;
  flex: 0 0 320px;
  cursor: pointer;
}

.repository-recent__card :deep(.vis-card__body) {
  padding: var(--space-20);
}

.repository-recent__content {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
}

.repository-recent__icon {
  flex: 0 0 auto;
}

.repository-recent__body {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  flex: 1 1 0;
}

.repository-recent__name {
  margin: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repository-recent__description {
  box-sizing: border-box;
  inline-size: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repository-recent__stats {
  padding-block-start: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-20);
}

.repository-recent__stats :deep(.vis-button) {
  padding-inline: 0;
  --vis-button-height: var(--font-text-sm-line-height);
  --vis-button-font-size: var(--font-text-sm-size);
  --vis-button-line-height: var(--font-text-sm-line-height);
}

/* ---------- 仓库列表 ---------- */

.repository-list {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-16);
}

.repository-toolbar {
  inline-size: 100%;
  min-inline-size: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
}

.repository-toolbar__filters {
  min-inline-size: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  flex: 1 1 0;
}

.repository-toolbar__search {
  inline-size: 240px;
}

.repository-toolbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

/* ---------- 仓库树 ---------- */

.repository-tree {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.repository-tree__row {
  box-sizing: border-box;
  block-size: 48px;
  padding-block: var(--space-12);
  padding-inline-end: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  border-radius: var(--radius-md);
}

.repository-tree__row:hover {
  background: var(--color-bg-secondary);
}

.repository-tree__row.is-clickable {
  cursor: pointer;
}

.repository-tree__row.is-clickable:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: -2px;
}

.repository-tree__chevron {
  flex: 0 0 var(--space-24);
}

.repository-tree__node-icon {
  flex: 0 0 var(--space-24);
}

.repository-tree__name {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 0;
}

.repository-tree__stat {
  flex: 0 0 auto;
}

.repository-tree__more {
  flex: 0 0 var(--space-24);
}

.repository-tree__empty {
  min-block-size: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}
</style>
