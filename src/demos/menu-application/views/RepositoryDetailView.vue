<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisAvatar, type VisAvatarImageVariant } from '../../../components/avatar'
import { VisBadge, type VisBadgeColorType } from '../../../components/badge'
import { VisBreadcrumb, type VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisButtonSplit } from '../../../components/button-split'
import { VisCard } from '../../../components/card'
import {
  VisCodeBlame,
  VisCodeBlameBar,
  type VisCodeBlameRank,
  type VisCodeLineData,
} from '../../../components/code-experience'
import { VisDropdown, VisDropdownDivider, VisDropdownItem, type VisDropdownEntry } from '../../../components/dropdown'
import { VisDivider } from '../../../components/divider'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import { VisFileIcon, resolveVisFileIconType, type VisFileIconType } from '../../../components/file-icon'
import Icon from '../../../components/icons/Icon.vue'
import { VisInputSearchBox } from '../../../components/input-search-box'
import { VisMarkdown } from '../../../components/markdown'
import { VisLink } from '../../../components/link'
import { VisPageHeader } from '../../../components/page-header'
import { VisTableHeader, VisTableItem, VisTableRow } from '../../../components/table'
import VisTabs from '../../../components/tabs/VisTabs.vue'
import type { VisTabsItem } from '../../../components/tabs'
import { defaultProjectKey, projects } from '../navigation'
import { createRepositoryTabs } from '../repository-tabs'
import {
  findRepositoryByKey,
  type DemoBlameGroup,
  type DemoCommit,
  type DemoMergeRequest,
  type DemoRepositoryFile,
} from '../repositories'
import RepositoryRefDropdown from './RepositoryRefDropdown.vue'
import RepositoryWebhooksView from './RepositoryWebhooksView.vue'

const route = useRoute()
const router = useRouter()

const figmaVueIconSrc = 'data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMTQgMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJ2dWUiPgo8cGF0aCBpZD0idmVjdG9yIiBkPSJNMCAwTDcgMTJMMTQgMEgxMS4yNUw3IDcuMjVMMi43NSAwSDBaIiBmaWxsPSIjNDFCODgzIiBzdHlsZT0iZmlsbDojNDFCODgzO2ZpbGw6Y29sb3IoZGlzcGxheS1wMyAwLjI1NDkgMC43MjE2IDAuNTEzNyk7ZmlsbC1vcGFjaXR5OjE7Ii8+CjxwYXRoIGlkPSJ2ZWN0b3JfMiIgZD0iTTIuNzUgMEw3IDcuMjVMMTEuMjUgMEg4Ljc1TDcuMDMyNjMgMy4wMDYzMUw1LjI1IDBIMi43NVoiIGZpbGw9IiMzNTQ5NUUiIHN0eWxlPSJmaWxsOiMzNTQ5NUU7ZmlsbDpjb2xvcihkaXNwbGF5LXAzIDAuMjA3OCAwLjI4NjMgMC4zNjg2KTtmaWxsLW9wYWNpdHk6MTsiLz4KPC9nPgo8L3N2Zz4K'
const figmaAvatarImageSrc = 'data:image/png;base64,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'

const repository = computed(() => findRepositoryByKey(String(route.params.repositoryId)))
const repositoryData = computed(() => repository.value?.data)

function resolveRouteBranch(): string {
  const queryBranch = typeof route.query.branch === 'string' ? route.query.branch : ''
  if (queryBranch && repositoryData.value?.branches.some((branch) => branch.name === queryBranch)) {
    return queryBranch
  }
  return repositoryData.value?.defaultBranch ?? 'main'
}

const asideCollapsed = ref(false)
const activeTab = ref(typeof route.query.tab === 'string' ? route.query.tab : 'code')
const selectedBranch = ref(resolveRouteBranch())
const codeDropdownOpen = ref(false)
const copiedCloneProtocol = ref<'ssh' | 'http' | ''>('')
const fileSearch = ref('')
const currentFolder = shallowRef<DemoRepositoryFile | null>(null)
const expandedFolders = ref<Set<string>>(new Set())
const openedFile = shallowRef<DemoRepositoryFile | null>(null)
const fileTab = ref<string | number>('code')
const expandedHistoryCommitIds = ref<Set<string>>(new Set())
const copiedHistoryCommitId = ref('')
const repositoryFiles = computed<DemoRepositoryFile[]>(() =>
  repositoryData.value?.branchFiles[selectedBranch.value]
  ?? repositoryData.value?.files
  ?? [],
)

const tabPlaceholderLabel = computed(() => {
  const tab = repositoryTabs.value.find((item) => item.value === activeTab.value)
  return tab?.label ?? '该功能'
})

const currentProject = computed(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})

const breadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目' },
  { label: currentProject.value.label },
  { label: '代码仓库' },
  { label: repository.value?.name ?? '代码仓库', active: true },
])

function syncDocumentTitle(): void {
  document.title = `${repository.value?.name ?? '代码仓库'} - Vision Application`
}

onMounted(syncDocumentTitle)
watch(repository, syncDocumentTitle)
watch(repository, () => {
  selectedBranch.value = resolveRouteBranch()
  activeTab.value = typeof route.query.tab === 'string' ? route.query.tab : 'code'
  currentFolder.value = null
  expandedFolders.value = new Set()
  openedFile.value = null
  fileTab.value = 'code'
})
watch(selectedBranch, () => {
  fileSearch.value = ''
  currentFolder.value = null
  expandedFolders.value = new Set()
  openedFile.value = null
  fileTab.value = 'code'
  expandedHistoryCommitIds.value = new Set()
  copiedHistoryCommitId.value = ''
})

const repositoryTabs = computed<VisTabsItem[]>(() =>
  createRepositoryTabs(repositoryData.value?.mergeRequests.length ?? 0),
)

const cloneSshUrl = computed(() => `git@code.visslm.local:lighting/${repository.value?.key ?? 'repository'}.git`)
const cloneHttpUrl = computed(() => `https://code.visslm.local/lighting/${repository.value?.key ?? 'repository'}.git`)

async function copyCloneUrl(protocol: 'ssh' | 'http', value: string): Promise<void> {
  if (!navigator.clipboard) return
  const copied = await navigator.clipboard.writeText(value).then(() => true).catch(() => false)
  if (!copied) return
  copiedCloneProtocol.value = protocol
  window.setTimeout(() => {
    if (copiedCloneProtocol.value === protocol) copiedCloneProtocol.value = ''
  }, 1600)
}

function treeIconType(row: { type?: unknown; extension?: unknown }): VisFileIconType {
  if (row.type === 'dir') return 'folder'
  return resolveVisFileIconType(String(row.extension ?? ''))
}

/* ---------- 文件树与目录导航 ---------- */

interface TreeRow {
  file: DemoRepositoryFile
  depth: number
  path: string
}

function resolveFolderPath(folder: DemoRepositoryFile): string {
  const path: string[] = []
  const find = (files: DemoRepositoryFile[]): boolean => {
    for (const file of files) {
      if (file === folder) {
        path.unshift(file.name)
        return true
      }
      if (file.type === 'dir' && find(file.children ?? [])) {
        path.unshift(file.name)
        return true
      }
    }
    return false
  }
  find(repositoryFiles.value)
  return path.join('/')
}

const visibleTreeRows = computed<TreeRow[]>(() => {
  const rows: TreeRow[] = []
  const walk = (files: DemoRepositoryFile[], depth: number, parentPath: string): void => {
    for (const file of files) {
      const path = parentPath ? `${parentPath}/${file.name}` : file.name
      rows.push({ file, depth, path })
      if (file.type === 'dir' && (expandedFolders.value.has(path) || fileSearch.value.trim())) {
        walk(file.children ?? [], depth + 1, path)
      }
    }
  }
  walk(repositoryFiles.value, 0, '')
  const query = fileSearch.value.trim().toLocaleLowerCase()
  return query
    ? rows.filter((row) => row.path.toLocaleLowerCase().includes(query))
    : rows
})

function isFolderExpanded(path: string): boolean {
  return expandedFolders.value.has(path)
}

function toggleTreeFolder(path: string): void {
  const next = new Set(expandedFolders.value)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  expandedFolders.value = next
}

function openFolder(folder: DemoRepositoryFile): void {
  const path = resolveFolderPath(folder)
  const next = new Set(expandedFolders.value)
  next.add(path)
  expandedFolders.value = next
  currentFolder.value = folder
  openedFile.value = null
}

function openFile(file: DemoRepositoryFile): void {
  openedFile.value = file
  fileTab.value = 'code'
}

function handleTreeClick(row: TreeRow): void {
  if (row.file.type === 'dir') openFolder(row.file)
  else openFile(row.file)
}

function handleTableClick(file: DemoRepositoryFile): void {
  if (file.type === 'dir') openFolder(file)
  else openFile(file)
}

function navigateToRoot(): void {
  currentFolder.value = null
  openedFile.value = null
}

function navigateToFolder(folder: DemoRepositoryFile): void {
  currentFolder.value = folder
  openedFile.value = null
}

const currentFolderFiles = computed<DemoRepositoryFile[]>(() =>
  currentFolder.value ? (currentFolder.value.children ?? []) : repositoryFiles.value,
)

const currentFolderPath = computed<DemoRepositoryFile[]>(() => {
  if (!currentFolder.value) return []
  const path: DemoRepositoryFile[] = []
  const find = (files: DemoRepositoryFile[]): boolean => {
    for (const file of files) {
      if (file === currentFolder.value) {
        path.unshift(file)
        return true
      }
      if (file.type === 'dir' && find(file.children ?? [])) {
        path.unshift(file)
        return true
      }
    }
    return false
  }
  find(repositoryFiles.value)
  return path
})

const repositoryPathItems = computed<VisBreadcrumbItem[]>(() => [
  {
    label: repository.value?.code ?? 'Plane-control',
    active: !currentFolder.value && !openedFile.value,
  },
  ...currentFolderPath.value.map((folder, index) => ({
    label: folder.name,
    active: !openedFile.value && index === currentFolderPath.value.length - 1,
  })),
  ...(openedFile.value ? [{ label: openedFile.value.name, active: true }] : []),
])

function handleRepositoryPathClick(_item: VisBreadcrumbItem, index: number): void {
  if (index === 0) {
    navigateToRoot()
    return
  }

  const folder = currentFolderPath.value[index - 1]
  if (folder) navigateToFolder(folder)
}

function handleRepositoryTabChange(value: string | number): void {
  if (value === 'code') {
    navigateToRoot()
    return
  }
  if (value === 'merge-requests') {
    void router.push({
      name: 'repository-merge-requests',
      params: {
        projectKey: String(route.params.projectKey ?? defaultProjectKey),
        repositoryId: String(route.params.repositoryId),
      },
    })
  }
}

function openCommitList(): void {
  void router.push({
    name: 'repository-commits',
    params: {
      projectKey: String(route.params.projectKey ?? defaultProjectKey),
      repositoryId: String(route.params.repositoryId),
    },
    query: { branch: selectedBranch.value },
  })
}

function openBranchList(): void {
  void router.push({
    name: 'repository-branches',
    params: {
      projectKey: String(route.params.projectKey ?? defaultProjectKey),
      repositoryId: String(route.params.repositoryId),
    },
  })
}

function openTagList(): void {
  void router.push({
    name: 'repository-tags',
    params: {
      projectKey: String(route.params.projectKey ?? defaultProjectKey),
      repositoryId: String(route.params.repositoryId),
    },
  })
}

/* ---------- 文件查看器 ---------- */

const fileTabs = computed<VisTabsItem[]>(() => [
  { value: 'code', label: openedFile.value?.name ?? '代码', count: openedFile.value ? pseudoFileSize(openedFile.value) : undefined },
  { value: 'trace', label: '修改追溯' },
  { value: 'history', label: '文件历史' },
])

const fileBlameGroups = computed<Array<Omit<DemoBlameGroup, 'lines'> & { lines: VisCodeLineData[] }>>(() =>
  (openedFile.value?.blame ?? []).map((group) => ({
    ...group,
    lines: group.lines.map((line, index) => ({
      key: `${group.id}-${line.lineNumber}-${index}`,
      content: line.content,
      lineNumber: line.lineNumber,
      number: 'default',
    })),
  })),
)

const codeBlameLegendRanks: VisCodeBlameRank[] = [
  'default',
  'rank2',
  'rank3',
  'rank4',
  'rank5',
  'rank6',
]

function pseudoFileSize(file: DemoRepositoryFile): string {
  return file.size ?? '0.00kb'
}

function resolveFilePath(target: DemoRepositoryFile): string {
  const visit = (files: DemoRepositoryFile[], parentPath: string): string | undefined => {
    for (const file of files) {
      const path = parentPath ? `${parentPath}/${file.name}` : file.name
      if (file === target) return path
      const childPath = visit(file.children ?? [], path)
      if (childPath) return childPath
    }
    return undefined
  }
  return visit(repositoryFiles.value, '') ?? target.name
}

const fileContent = computed(() => openedFile.value?.content ?? '')
const latestCommit = computed(() => {
  const headCommitId = repositoryData.value?.branchHeadCommitIds[selectedBranch.value]
  return repositoryData.value?.commits.find((commit) => commit.id === headCommitId)
    ?? repositoryData.value?.commits[0]
})
const fileHistory = computed<DemoCommit[]>(() => {
  if (!openedFile.value) return []
  const commitIds = new Set(openedFile.value.commitIds)
  return (repositoryData.value?.commits ?? []).filter((commit) => commitIds.has(commit.id))
})

const avatarVariantByAuthor: Record<string, VisAvatarImageVariant> = {
  张大山: '09',
  李思雨: '06',
  王建国: '03',
  孙工: '05',
  周工程师: '02',
}

function historyAvatarVariant(author: string): VisAvatarImageVariant {
  return avatarVariantByAuthor[author] ?? '09'
}

function historyMergeRequestStatusClass(mergeRequestId: number): string {
  const status = repositoryData.value?.mergeRequests.find((request) => request.id === mergeRequestId)?.status ?? 'open'
  if (status === 'merged') return 'is-success'
  if (status === 'rejected') return 'is-danger'
  if (status === 'closed') return 'is-closed'
  return 'is-active'
}

function toggleHistoryCommitDescription(commitId: string): void {
  const next = new Set(expandedHistoryCommitIds.value)
  if (next.has(commitId)) next.delete(commitId)
  else next.add(commitId)
  expandedHistoryCommitIds.value = next
}

function isHistoryCommitExpanded(commitId: string): boolean {
  return expandedHistoryCommitIds.value.has(commitId)
}

async function copyHistoryCommitId(commitId: string): Promise<void> {
  if (!navigator.clipboard) return
  const copied = await navigator.clipboard.writeText(commitId).then(() => true).catch(() => false)
  if (!copied) return
  copiedHistoryCommitId.value = commitId
  window.setTimeout(() => {
    if (copiedHistoryCommitId.value === commitId) copiedHistoryCommitId.value = ''
  }, 1600)
}

const repositoryStats = computed(() => {
  const data = repositoryData.value
  return {
    commits: data?.branchCommitIds[selectedBranch.value]?.length ?? 0,
    branches: data?.branches.length ?? 0,
    tags: data?.tags.length ?? 0,
  }
})

const mergeRequestStatusMeta: Record<DemoMergeRequest['status'], { label: string; color: VisBadgeColorType }> = {
  open: { label: '开启', color: 'brand' },
  merged: { label: '已合并', color: 'success' },
  draft: { label: '草稿', color: 'grey' },
  rejected: { label: '被拒绝', color: 'danger' },
  closed: { label: '已关闭', color: 'grey' },
}

function mergeRequestStatus(request: DemoMergeRequest): { label: string; color: VisBadgeColorType } {
  return mergeRequestStatusMeta[request.status]
}

async function copyFileContent(): Promise<void> {
  if (!fileContent.value || !navigator.clipboard) return
  await navigator.clipboard.writeText(fileContent.value).catch(() => undefined)
}

function downloadFileContent(): void {
  if (!openedFile.value) return
  const blob = new Blob([fileContent.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = openedFile.value.name
  anchor.click()
  URL.revokeObjectURL(url)
}

const readmeContent = computed(() =>
  repositoryFiles.value.find((file) => file.name.toLocaleLowerCase() === 'readme.md')?.content
  ?? repositoryData.value?.readme
  ?? '',
)
</script>

<template>
  <section class="repository-detail" :aria-label="`${repository?.name ?? '代码仓库'}详情`">
    <VisPageHeader
      class="repository-detail__header"
      :title="repository?.name ?? '代码仓库'"
      :description="repository?.description ?? ''"
      :breadcrumb-items="breadcrumbItems"
      :tabs="repositoryTabs"
      v-model:active-tab="activeTab"
      @tab-change="handleRepositoryTabChange"
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

    <div class="repository-detail__body">
      <aside
        v-if="!asideCollapsed && activeTab === 'code'"
        class="repository-detail__aside"
        aria-label="仓库文件树"
      >
        <div class="repository-detail__aside-toolbar">
          <VisButton
            variant="secondary"
            size="md"
            icon-only
            icon-name="layout-left"
            label="收起文件树"
            @click="asideCollapsed = true"
          />
          <RepositoryRefDropdown
            v-model="selectedBranch"
            :branches="repositoryData?.branches ?? []"
            :tags="repositoryData?.tags ?? []"
          />
        </div>

        <VisInputSearchBox
          v-model="fileSearch"
          class="repository-detail__file-search"
          placeholder="查找文件"
          aria-label="查找文件"
        />

        <div class="repository-detail__file-tree">
          <button
            v-for="row in visibleTreeRows"
            :key="row.path"
            type="button"
            class="repository-detail__tree-item"
            :class="{
              'is-opened': row.file.type === 'dir' && isFolderExpanded(row.path),
              'is-active': openedFile ? openedFile === row.file : currentFolder === row.file,
            }"
            :style="{ paddingInlineStart: `${4 + row.depth * 20}px` }"
            :title="row.file.name"
            @click="handleTreeClick(row)"
          >
            <VisButton
              v-if="row.file.type === 'dir'"
              class="repository-detail__tree-chevron"
              variant="text"
              size="sm"
              icon-only
              :icon-name="isFolderExpanded(row.path) ? 'chevron-down' : 'chevron-right'"
              :label="`${isFolderExpanded(row.path) ? '收起' : '展开'}${row.file.name}`"
              @click.stop="toggleTreeFolder(row.path)"
            />
            <span v-else class="repository-detail__tree-chevron" aria-hidden="true" />
            <VisFileIcon
              v-if="row.file.extension !== 'vue'"
              class="repository-detail__tree-icon"
              :type="treeIconType(row.file)"
              :size="16"
            />
            <span v-else class="repository-detail__tree-icon repository-detail__vue-icon" aria-hidden="true">
              <img :src="figmaVueIconSrc" alt="">
            </span>
            <span class="repository-detail__tree-name">{{ row.file.name }}</span>
          </button>
        </div>
      </aside>

      <main
        class="repository-detail__main"
        :class="{ 'is-settings': activeTab === 'settings' }"
        :aria-label="activeTab === 'settings' ? '仓库设置' : '仓库代码内容'"
      >
        <template v-if="activeTab === 'code'">
          <div class="repository-detail__meta">
            <template v-if="asideCollapsed">
              <VisButton
                variant="secondary"
                size="md"
                icon-only
                icon-name="flex-align-left"
                label="展开文件树"
                @click="asideCollapsed = false"
              />
              <RepositoryRefDropdown
                v-model="selectedBranch"
                :branches="repositoryData?.branches ?? []"
                :tags="repositoryData?.tags ?? []"
              />
            </template>

            <div class="repository-detail__meta-path">
              <VisBreadcrumb
                :items="repositoryPathItems"
                size="lg"
                aria-label="仓库路径"
                @click="handleRepositoryPathClick"
              />
              <VisButton
                class="repository-detail__path-copy"
                variant="text"
                size="md"
                icon-only
                icon-name="copy-04"
                label="复制路径"
              />
            </div>

            <VisButton
              variant="text"
              size="md"
              prefix
              icon-name="git-commit"
              label="查看提交列表"
              aria-label="查看提交列表"
              @click="openCommitList"
            >
              {{ repositoryStats.commits }} 提交
            </VisButton>
            <VisButton
              variant="text"
              size="md"
              prefix
              icon-name="git-branch-02"
              label="查看分支列表"
              aria-label="查看分支列表"
              @click="openBranchList"
            >
              {{ repositoryStats.branches }} 分支
            </VisButton>
            <VisButton
              variant="text"
              size="md"
              prefix
              icon-name="tag-01"
              label="查看标签列表"
              aria-label="查看标签列表"
              @click="openTagList"
            >
              {{ repositoryStats.tags }} 标签
            </VisButton>
            <VisButton variant="secondary" size="md" icon-only icon-name="plus" label="新建（演示）" disabled />
            <VisDropdown v-model:open="codeDropdownOpen" class="repository-code-dropdown">
              <template #trigger="{ toggle }">
                <VisButton
                  size="md"
                  suffix
                  suffix-icon-name="chevron-down"
                  label="代码"
                  aria-haspopup="menu"
                  :aria-expanded="codeDropdownOpen"
                  @click="toggle"
                >
                  代码
                </VisButton>
              </template>

              <div class="repository-code-menu">
                <VisDropdownItem label="克隆" type="icon" icon-name="code-square-02" />

                <div class="repository-code-menu__field">
                  <span class="repository-code-menu__label">SSH</span>
                  <div class="repository-code-menu__input-group">
                    <span :title="cloneSshUrl">{{ cloneSshUrl }}</span>
                    <VisButton
                      variant="text"
                      size="sm"
                      icon-only
                      :icon-name="copiedCloneProtocol === 'ssh' ? 'check' : 'copy-04'"
                      :label="copiedCloneProtocol === 'ssh' ? '已复制 SSH 地址' : '复制 SSH 地址'"
                      @click="copyCloneUrl('ssh', cloneSshUrl)"
                    />
                  </div>
                </div>

                <div class="repository-code-menu__field">
                  <span class="repository-code-menu__label">HTTP</span>
                  <div class="repository-code-menu__input-group">
                    <span :title="cloneHttpUrl">{{ cloneHttpUrl }}</span>
                    <VisButton
                      variant="text"
                      size="sm"
                      icon-only
                      :icon-name="copiedCloneProtocol === 'http' ? 'check' : 'copy-04'"
                      :label="copiedCloneProtocol === 'http' ? '已复制 HTTP 地址' : '复制 HTTP 地址'"
                      @click="copyCloneUrl('http', cloneHttpUrl)"
                    />
                  </div>
                </div>

                <VisDropdownDivider />
                <VisDropdownItem label="下载仓库（ZIP）" type="icon" icon-name="package" />
                <VisDropdownItem label="下载当前目录" type="icon" icon-name="folder-download" />
              </div>
            </VisDropdown>
          </div>

          <div v-if="latestCommit" class="repository-detail__commit-card">
            <div class="repository-detail__commit-owner">
              <VisAvatar
                size="sm"
                type="image"
                :image-src="figmaAvatarImageSrc"
                :image-alt="latestCommit.author"
              />
              <span class="repository-detail__commit-author">{{ latestCommit.author }}</span>
            </div>
            <span class="repository-detail__commit-message">{{ latestCommit.message }}</span>
            <span class="repository-detail__commit-time">{{ latestCommit.relativeTime }}</span>
            <span class="repository-detail__commit-spacer" aria-hidden="true" />
            <VisButtonSplit color="grey">
              <VisButton variant="text" size="md" prefix icon-name="git-commit">
                {{ latestCommit.id }}
              </VisButton>
              <VisButton variant="text" size="md" icon-only icon-name="copy-04" label="复制提交号" />
            </VisButtonSplit>
          </div>

          <template v-if="openedFile">
            <div class="repository-detail__file-viewer">
              <div class="repository-detail__file-viewer-header">
                <div class="repository-detail__file-tabs-frame">
                  <VisTabs
                    class="repository-detail__file-tabs"
                    :items="fileTabs"
                    :model-value="fileTab"
                    align="horizontal"
                    aria-label="文件查看标签页"
                    @update:model-value="fileTab = $event"
                  >
                    <template #label="{ item }">
                      <span v-if="item.value === 'code'" class="repository-detail__file-tab-label">
                        <span v-if="openedFile?.extension === 'vue'" class="repository-detail__vue-icon" aria-hidden="true">
                          <img :src="figmaVueIconSrc" alt="">
                        </span>
                        <VisFileIcon v-else :type="treeIconType(openedFile ?? {})" :size="16" decorative />
                        <span>{{ item.label }}</span>
                      </span>
                      <span v-else>{{ item.label }}</span>
                    </template>
                  </VisTabs>
                </div>
                <span class="repository-detail__file-viewer-spacer" aria-hidden="true" />
                <div
                  v-if="fileTab === 'trace' && fileBlameGroups.length > 0"
                  class="repository-detail__blame-legend"
                  aria-label="代码修改时间由旧到新"
                >
                  <span>旧</span>
                  <span class="repository-detail__blame-legend-bars" aria-hidden="true">
                    <VisCodeBlameBar
                      v-for="rank in codeBlameLegendRanks"
                      :key="rank"
                      class="repository-detail__blame-legend-bar"
                      :rank="rank"
                    />
                  </span>
                  <span>新</span>
                </div>
                <div class="repository-detail__file-actions">
                  <VisButton variant="text" size="sm" icon-only icon-name="copy-04" label="复制文件内容" @click="copyFileContent" />
                  <VisButton variant="text" size="sm" icon-only icon-name="edit-03" label="编辑文件（演示）" disabled />
                  <VisButton variant="text" size="sm" icon-only icon-name="download-02" label="下载文件" @click="downloadFileContent" />
                  <VisButton variant="text" size="sm" icon-only icon-name="dots-horizontal" label="更多文件操作" />
                </div>
              </div>
              <div v-if="fileTab === 'code'" class="repository-detail__file-code">
                <pre><code>{{ fileContent }}</code></pre>
              </div>
              <div
                v-else-if="fileTab === 'trace'"
                class="repository-detail__file-trace"
                role="table"
                aria-label="文件修改追溯"
              >
                <VisCodeBlame
                  v-for="group in fileBlameGroups"
                  :key="group.id"
                  :author="group.author"
                  :avatar-image-src="figmaAvatarImageSrc"
                  :commit="group.commit"
                  :time="group.time"
                  :rank="group.rank"
                  :lines="group.lines"
                />
                <div v-if="fileBlameGroups.length === 0" class="repository-detail__file-trace-empty">
                  该文件暂无修改追溯数据
                </div>
              </div>
              <div v-else class="repository-detail__file-history" aria-label="文件提交历史">
                <VisCard
                  v-for="commit in fileHistory"
                  :key="commit.id"
                  class="repository-detail__history-item"
                  :show-action="false"
                  body-class="repository-detail__history-body"
                >
                  <article class="repository-detail__history-content">
                    <div class="repository-detail__history-top">
                      <VisLink class="repository-detail__history-title" :label="commit.message">
                        {{ commit.message }}
                      </VisLink>
                      <VisButton
                        v-if="commit.description"
                        variant="text"
                        size="sm"
                        icon-only
                        icon-name="annotation-dots"
                        :label="`${isHistoryCommitExpanded(commit.id) ? '收起' : '展开'}${commit.message}的提交描述`"
                        :aria-expanded="isHistoryCommitExpanded(commit.id)"
                        @click="toggleHistoryCommitDescription(commit.id)"
                      />
                      <span class="repository-detail__history-spacer" aria-hidden="true" />
                      <VisBadge
                        v-if="commit.verified"
                        class="repository-detail__history-verified"
                        type="default"
                        color="aqua"
                        label="已验证"
                      />
                      <VisButtonSplit class="repository-detail__history-hash" color="grey" size="sm">
                        <VisButton variant="text" size="sm" prefix icon-name="git-commit" :label="commit.id">
                          {{ commit.id }}
                        </VisButton>
                        <VisButton
                          variant="text"
                          size="sm"
                          icon-only
                          :icon-name="copiedHistoryCommitId === commit.id ? 'check' : 'copy-04'"
                          :label="copiedHistoryCommitId === commit.id ? '已复制提交号' : `复制提交号 ${commit.id}`"
                          @click="copyHistoryCommitId(commit.id)"
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

                    <p v-if="isHistoryCommitExpanded(commit.id)" class="repository-detail__history-description">
                      {{ commit.description }}
                    </p>

                    <div class="repository-detail__history-meta">
                      <span class="repository-detail__history-author">
                        <VisAvatar
                          size="xs"
                          type="image"
                          :image-variant="historyAvatarVariant(commit.author)"
                          :image-alt="commit.author"
                        />
                        <span>{{ commit.author }}</span>
                      </span>
                      <span class="repository-detail__history-muted">提交于</span>
                      <time :datetime="commit.time.replace(' ', 'T')">{{ commit.time }}</time>
                      <VisDivider
                        v-if="commit.mergeRequestId"
                        class="repository-detail__history-divider"
                        type="vertical"
                        length="12px"
                      />
                      <VisLink
                        v-if="commit.mergeRequestId"
                        class="repository-detail__history-merge-request"
                        :class="historyMergeRequestStatusClass(commit.mergeRequestId)"
                        prefix
                        :label="`合并请求 #${commit.mergeRequestId}`"
                      >
                        <template #prefix>
                          <Icon name="git-pull-request" :size="16" decorative />
                        </template>
                        #{{ commit.mergeRequestId }}
                      </VisLink>
                    </div>
                  </article>
                </VisCard>
                <div v-if="fileHistory.length === 0" class="repository-detail__file-history-empty">
                  暂无文件历史
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="repository-detail__file-table" aria-label="仓库文件列表">
              <div class="repository-detail__table-head">
                <VisTableHeader label="名称" class="repository-detail__table-cell--name" />
                <VisTableHeader label="最近提交" class="repository-detail__table-cell--commit" />
                <VisTableHeader label="提交时间" class="repository-detail__table-cell--time" />
              </div>
              <VisTableRow
                v-for="file in currentFolderFiles"
                :key="file.name"
                class="repository-detail__table-row"
                @click="handleTableClick(file)"
              >
                <VisTableItem class="repository-detail__table-cell--name">
                  <VisFileIcon :type="treeIconType(file)" :size="20" />
                  <span class="repository-detail__file-name">{{ file.name }}</span>
                </VisTableItem>
                <VisTableItem :value="file.lastCommit" class="repository-detail__table-cell--commit" />
                <VisTableItem :value="file.updatedAt" class="repository-detail__table-cell--time" />
              </VisTableRow>
            </div>

            <VisCard
              v-if="!currentFolder"
              class="repository-detail__readme"
              :interactive="false"
              :show-action="false"
            >
              <div class="repository-detail__readme-header">README.md</div>
              <div class="repository-detail__readme-content">
                <VisMarkdown :content="readmeContent" />
              </div>
            </VisCard>
          </template>
        </template>

        <section
          v-else-if="activeTab === 'merge-requests'"
          class="repository-detail__merge-requests"
          aria-label="合并请求列表"
        >
          <header class="repository-detail__merge-header">
            <div>
              <h2>合并请求</h2>
              <p>{{ repositoryData?.mergeRequests.length ?? 0 }} 条合并请求</p>
            </div>
            <VisButton variant="primary" size="md" prefix icon-name="plus" label="新建合并请求（演示）" disabled>
              新建合并请求
            </VisButton>
          </header>

          <div class="repository-detail__merge-list">
            <article
              v-for="request in repositoryData?.mergeRequests ?? []"
              :key="request.id"
              class="repository-detail__merge-item"
            >
              <div class="repository-detail__merge-icon" aria-hidden="true">
                <Icon name="git-pull-request" :size="20" decorative />
              </div>
              <div class="repository-detail__merge-content">
                <div class="repository-detail__merge-title-row">
                  <strong>!{{ request.id }} {{ request.title }}</strong>
                  <VisBadge
                    type="status"
                    :color-type="mergeRequestStatus(request).color"
                    :label="mergeRequestStatus(request).label"
                  />
                </div>
                <p>{{ request.description }}</p>
                <div class="repository-detail__merge-meta">
                  <span>{{ request.author }} · {{ request.updatedAt }}</span>
                  <code>{{ request.sourceBranch }}</code>
                  <Icon name="arrow-right" :size="14" decorative />
                  <code>{{ request.targetBranch }}</code>
                  <span>{{ request.commits }} 提交</span>
                  <span>{{ request.comments }} 评论</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <RepositoryWebhooksView v-else-if="activeTab === 'settings'" />

        <div v-else class="repository-detail__placeholder">
          <VisFeaturedIcon size="xl" type="modern" color="grey" icon="dataflow-04" />
          <p>「{{ tabPlaceholderLabel }}」功能建设中</p>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
.repository-detail {
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

.repository-detail__header {
  flex: 0 0 auto;
  background: var(--color-bg-canvas);
}

.repository-detail__body {
  min-block-size: 0;
  display: flex;
  align-items: stretch;
  flex: 1 1 0;
  overflow: hidden;
}

/* ---------- 左侧文件树面板 ---------- */

.repository-detail__aside {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  inline-size: 256px;
  min-inline-size: 256px;
  border-inline-end: 1px solid var(--color-border-default);
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-12);
  overflow: visible;
  background: var(--color-bg-canvas);
}

.repository-detail__aside-toolbar {
  inline-size: 100%;
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.repository-detail__file-search {
  inline-size: 100%;
}

.repository-detail__file-tree {
  min-block-size: 0;
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
  flex: 1 1 0;
}

.repository-detail__tree-item {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-32);
  border: 0;
  border-radius: var(--radius-sm);
  padding-inline-end: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  background: transparent;
  font: inherit;
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  text-align: start;
  cursor: pointer;
}

.repository-detail__tree-item:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.repository-detail__tree-item.is-active {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.repository-detail__tree-item.is-active .repository-detail__tree-name {
  font-weight: 500;
}

.repository-detail__tree-chevron {
  inline-size: var(--space-24);
  flex: 0 0 var(--space-24);
}

.repository-detail__tree-icon {
  flex: 0 0 var(--space-16);
}

.repository-detail__vue-icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 var(--space-16);
}

.repository-detail__vue-icon img {
  inline-size: 14px;
  block-size: 12px;
  display: block;
}

.repository-detail__tree-name {
  min-inline-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 右侧主区 ---------- */

.repository-detail__main {
  position: relative;
  z-index: 1;
  min-inline-size: 0;
  min-block-size: 0;
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  overflow-y: auto;
  flex: 1 1 0;
  background: var(--color-bg-canvas);
}

.repository-detail__main.is-settings {
  padding: 0;
  overflow: hidden;
}

.repository-detail__meta {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-shrink: 0;
}

.repository-detail__meta-path {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex: 1 1 0;
}

.repository-code-dropdown :deep(.vis-dropdown) {
  inset-block-start: calc(100% + var(--space-4));
  inset-inline-start: auto;
  inset-inline-end: 0;
  inline-size: 320px;
  z-index: 50;
}

.repository-code-dropdown :deep(.vis-dropdown__list) {
  padding-block: var(--space-6);
}

.repository-code-menu {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
}

.repository-code-menu__field {
  padding: var(--space-4) var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.repository-code-menu__label {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
}

.repository-code-menu__input-group {
  box-sizing: border-box;
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--color-bg-surface);
}

.repository-code-menu__input-group > span {
  min-inline-size: 0;
  padding-inline: var(--space-12);
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 0;
}

.repository-code-menu__input-group :deep(.vis-button) {
  border-inline-start: 1px solid var(--color-border-default);
  border-radius: 0;
  flex: 0 0 auto;
}


.repository-detail__path-item {
  min-inline-size: 0;
  border: 0;
  padding: 0 var(--space-4);
  display: inline-flex;
  align-items: center;
  max-inline-size: 180px;
  overflow: hidden;
  color: var(--color-text-tertiary);
  background: transparent;
  font: inherit;
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.repository-detail__path-item:hover:not(.is-active) {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.repository-detail__path-item.is-active {
  color: var(--color-text-primary);
  font-weight: 500;
  cursor: default;
}

.repository-detail__path-sep {
  inline-size: 12px;
  block-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-tertiary);
  flex: 0 0 12px;
}

.repository-detail__path-copy {
  margin-inline-start: var(--space-4);
  flex: 0 0 auto;
}

/* ---------- 最近提交卡片 ---------- */

.repository-detail__commit-card {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-56);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding-inline: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-16);
  background: var(--color-bg-primary);
  flex-shrink: 0;
}

.repository-detail__commit-author {
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
}

.repository-detail__commit-owner {
  inline-size: 74px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 74px;
}

.repository-detail__commit-message {
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
}

.repository-detail__commit-time {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  white-space: nowrap;
}

.repository-detail__commit-spacer {
  flex: 1 1 0;
}

/* ---------- 文件表格 ---------- */

.repository-detail__table-head {
  display: flex;
  align-items: stretch;
}

.repository-detail__table-row {
  cursor: pointer;
}

.repository-detail__table-row:hover :deep(.vis-table-item) {
  background: var(--color-bg-secondary);
}

.repository-detail__table-cell--name,
.repository-detail__table-cell--commit {
  flex: 1 1 0;
}

.repository-detail__table-cell--time {
  flex: 0 0 200px;
}

.repository-detail__file-table {
  box-sizing: border-box;
  inline-size: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.repository-detail__file-table :deep(.vis-table-row:last-child .vis-table-item) {
  border-block-end: 0;
}

.repository-detail__file-name {
  min-inline-size: 0;
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 文件查看器 ---------- */

.repository-detail__file-viewer {
  position: relative;
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 0;
  border: 0;
  border-radius: var(--radius-md);
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  overflow: hidden;
}

.repository-detail__file-viewer::after {
  content: '';
  position: absolute;
  z-index: 2;
  inset: 0;
  border: 1px solid var(--color-border-default);
  border-radius: inherit;
  box-sizing: border-box;
  pointer-events: none;
}

.repository-detail__file-tabs-frame {
  box-sizing: border-box;
  inline-size: 318px;
  block-size: 48px;
  flex: 0 0 318px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
}

.repository-detail__file-tabs {
  inline-size: 318px;
  block-size: 40px;
  flex: 0 0 40px;
}

.repository-detail__file-tab-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
}

.repository-detail__file-viewer-header {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 48px;
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding-inline: var(--space-8) var(--space-12);
  background: var(--color-bg-surface);
  border-block-end: 1px solid var(--color-border-default);
}

.repository-detail__file-viewer-header :deep(.vis-tabs.align-horizontal) {
  box-shadow: none;
}

.repository-detail__file-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.repository-detail__blame-legend {
  block-size: var(--space-24);
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  white-space: nowrap;
  flex: 0 0 auto;
}

.repository-detail__blame-legend-bars {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.repository-detail__blame-legend-bar {
  block-size: 12px;
  min-block-size: 12px;
  align-self: auto;
}

.repository-detail__file-viewer-spacer {
  min-inline-size: 0;
  flex: 1 1 auto;
}

.repository-detail__file-code {
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 320px;
  flex: 1 1 0;
  padding: var(--space-16);
  overflow: auto;
  background: var(--color-bg-surface);
}

.repository-detail__file-trace {
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 0;
  flex: 1 1 0;
  overflow: hidden;
  background: var(--color-bg-surface);
}

.repository-detail__file-trace-empty {
  min-block-size: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.repository-detail__file-history {
  min-block-size: 0;
  flex: 1 1 0;
  overflow-y: auto;
  background: var(--color-bg-surface);
}

.repository-detail__history-item {
  border: 0;
  border-radius: 0;
}

.repository-detail__history-item + .repository-detail__history-item {
  border-block-start: 1px solid var(--color-border-default);
}

.repository-detail__history-item:last-child {
  border-block-end: 1px solid var(--color-border-default);
}

.repository-detail__history-content {
  box-sizing: border-box;
  min-block-size: 82px;
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.repository-detail__history-top,
.repository-detail__history-meta,
.repository-detail__history-author {
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.repository-detail__history-top {
  gap: var(--space-8);
}

.repository-detail__history-title {
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

.repository-detail__history-spacer {
  min-inline-size: var(--space-8);
  flex: 1 1 0;
}

.repository-detail__history-verified,
.repository-detail__history-hash {
  flex: 0 0 auto;
}

.repository-detail__history-verified {
  block-size: var(--space-24) !important;
}

.repository-detail__history-description {
  max-inline-size: 724px;
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  white-space: pre-line;
}

.repository-detail__history-meta {
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.repository-detail__history-author {
  gap: var(--space-6);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.repository-detail__history-meta time {
  color: var(--color-text-primary);
}

.repository-detail__history-muted {
  color: var(--color-text-tertiary);
}

.repository-detail__history-divider {
  flex: 0 0 auto;
}

.repository-detail__history-merge-request {
  --el-link-font-size: var(--font-text-md-size);

  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.repository-detail__history-merge-request.is-success :deep(.vis-link__icon) {
  color: var(--color-fg-success-primary);
}

.repository-detail__history-merge-request.is-danger :deep(.vis-link__icon) {
  color: var(--color-fg-danger-primary);
}

.repository-detail__history-merge-request.is-closed :deep(.vis-link__icon) {
  color: var(--color-fg-tertiary);
}

.repository-detail__history-merge-request.is-active :deep(.vis-link__icon) {
  color: var(--color-fg-brand-primary);
}

.repository-detail__file-history-empty {
  min-block-size: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.repository-detail__file-code pre {
  margin: 0;
  color: #000;
  font-family: Inter, var(--font-family-sans);
  font-size: var(--font-text-sm-size);
  line-height: normal;
  tab-size: 2;
}

/* ---------- README ---------- */

.repository-detail__readme {
  --el-card-border-radius: var(--radius-md);
  flex-shrink: 0;
}

.repository-detail__readme :deep(.vis-card__body) {
  padding: 0;
}

.repository-detail__readme-header {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-48);
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-16);
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.repository-detail__readme-content {
  min-inline-size: 0;
  padding: var(--space-16);
}

/* ---------- 合并请求 ---------- */

.repository-detail__merge-requests {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.repository-detail__merge-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
}

.repository-detail__merge-header h2,
.repository-detail__merge-header p,
.repository-detail__merge-item p {
  margin: 0;
}

.repository-detail__merge-header h2 {
  color: var(--color-text-primary);
  font-size: var(--font-heading-h5-size);
  line-height: var(--font-heading-h5-line-height);
}

.repository-detail__merge-header p {
  margin-block-start: var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.repository-detail__merge-list {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-surface);
}

.repository-detail__merge-item {
  padding: var(--space-16);
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
}

.repository-detail__merge-item + .repository-detail__merge-item {
  border-block-start: 1px solid var(--color-border-default);
}

.repository-detail__merge-icon {
  inline-size: var(--space-40);
  block-size: var(--space-40);
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-brand-primary);
  background: var(--color-fg-brand-secondary);
  flex: 0 0 var(--space-40);
}

.repository-detail__merge-content {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  flex: 1 1 0;
}

.repository-detail__merge-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.repository-detail__merge-title-row strong {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repository-detail__merge-content > p,
.repository-detail__merge-meta {
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.repository-detail__merge-meta {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.repository-detail__merge-meta code {
  border-radius: var(--radius-sm);
  padding-inline: var(--space-4);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  font-family: var(--font-family-mono);
}

/* ---------- 占位 ---------- */

.repository-detail__placeholder {
  min-block-size: 0;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.repository-detail__placeholder p {
  margin: 0;
}

@media (max-width: 1280px) {
  .repository-detail__aside {
    inline-size: 232px;
    min-inline-size: 232px;
  }
}

@media (max-width: 900px) {
  .repository-detail__aside {
    inline-size: 220px;
    min-inline-size: 220px;
    padding: var(--space-16);
  }

  .repository-detail__main {
    padding: var(--space-16);
  }

  .repository-detail__meta {
    flex-wrap: wrap;
  }

  .repository-detail__meta-path {
    flex-basis: 100%;
    order: -1;
  }

  .repository-detail__commit-card {
    overflow-x: auto;
  }
}
</style>
