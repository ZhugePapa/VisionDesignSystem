<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import { VisAvatar } from '../../../components/avatar'
import type { VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisButtonSplit } from '../../../components/button-split'
import { VisCard } from '../../../components/card'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import { VisFileIcon, resolveVisFileIconType, type VisFileIconType } from '../../../components/file-icon'
import Icon from '../../../components/icons/Icon.vue'
import { VisInputSearchBox } from '../../../components/input-search-box'
import { VisMarkdown } from '../../../components/markdown'
import { VisPageHeader } from '../../../components/page-header'
import { VisTableHeader, VisTableItem, VisTableRow } from '../../../components/table'
import VisTabs from '../../../components/tabs/VisTabs.vue'
import type { VisTabsItem } from '../../../components/tabs'
import { defaultProjectKey, projects } from '../navigation'
import { findRepositoryByKey, type DemoRepositoryFile } from '../repositories'
import RepositoryWebhooksView from './RepositoryWebhooksView.vue'

const route = useRoute()

const repository = computed(() => findRepositoryByKey(String(route.params.repositoryId)))

const asideCollapsed = ref(false)
const activeTab = ref('code')
const currentFolder = shallowRef<DemoRepositoryFile | null>(null)
const expandedFolders = ref<Set<string>>(new Set())
const openedFile = shallowRef<DemoRepositoryFile | null>(null)
const fileTab = ref<string | number>('code')

const tabPlaceholderLabel = computed(() => {
  const tab = repositoryTabs.find((item) => item.value === activeTab.value)
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
  currentFolder.value = null
  expandedFolders.value = new Set()
  openedFile.value = null
  fileTab.value = 'code'
})

const repositoryTabs: VisTabsItem[] = [
  { value: 'code', label: '代码', iconName: 'code-circle-02' },
  { value: 'merge-requests', label: '合并请求', iconName: 'git-pull-request' },
  { value: 'reviews', label: '评审记录', iconName: 'notification-message' },
  { value: 'work-items', label: '关联工作项', iconName: 'clipboard-check' },
  { value: 'archive', label: '入库记录', iconName: 'arrow-square-right' },
  { value: 'statistics', label: '统计', iconName: 'bar-chart-square-02' },
  { value: 'settings', label: '设置', iconName: 'settings-01' },
]

const branchItems: VisDropdownEntry[] = [
  { type: 'item', label: 'master', active: true },
  { type: 'item', label: 'develop' },
  { type: 'item', label: 'release/v1.2' },
  { type: 'item', label: 'feature/attitude-fusion' },
]

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
  find(repository.value?.files ?? [])
  return path.join('/')
}

const visibleTreeRows = computed<TreeRow[]>(() => {
  const rows: TreeRow[] = []
  const walk = (files: DemoRepositoryFile[], depth: number, parentPath: string): void => {
    for (const file of files) {
      const path = parentPath ? `${parentPath}/${file.name}` : file.name
      rows.push({ file, depth, path })
      if (file.type === 'dir' && expandedFolders.value.has(path)) {
        walk(file.children ?? [], depth + 1, path)
      }
    }
  }
  walk(repository.value?.files ?? [], 0, '')
  return rows
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
  currentFolder.value ? (currentFolder.value.children ?? []) : (repository.value?.files ?? []),
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
  find(repository.value?.files ?? [])
  return path
})

/* ---------- 文件查看器 ---------- */

const fileTabs = computed<VisTabsItem[]>(() => [
  { value: 'code', label: '代码', count: openedFile.value ? pseudoFileSize(openedFile.value) : undefined },
  { value: 'trace', label: '修改追溯' },
  { value: 'history', label: '文件历史' },
])

function pseudoFileSize(file: DemoRepositoryFile): string {
  const size = ((file.name.length * 137 + 311) % 850 + 150) / 100
  return `${size.toFixed(2)}kb`
}

function sampleFileContent(file: DemoRepositoryFile): string {
  const ext = file.extension ?? ''
  if (ext === 'vue') {
    return `<template>\n  <div class="app-container">\n    <h1>{{ title }}</h1>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\n\nconst title = ref('${repository.value?.code ?? 'Plane-control'}')\n<\/script>\n\n<style scoped>\n.app-container {\n  padding: 24px;\n}\n</style>\n`
  }
  if (ext === 'ts') {
    return `import { createApp } from 'vue'\nimport App from './App.vue'\n\ncreateApp(App).mount('#app')\n`
  }
  if (ext === 'md') {
    return `# ${file.name}\n\n## Overview\n\nThis module powers the ${repository.value?.code ?? 'Plane-control'} system.\n`
  }
  if (ext === 'yml') {
    return `version: '3'\n\nservices:\n  control:\n    build: .\n    ports:\n      - "3100:3100"\n`
  }
  if (ext === 'json') {
    return `{\n  "name": "${repository.value?.key ?? 'repo'}",\n  "version": "1.0.0"\n}\n`
  }
  if (ext === 'cpp' || ext === 'c' || ext === 'go' || ext === 'h') {
    return `// ${file.name}\n#include <stdio.h>\n\nint main(void) {\n  printf("${repository.value?.code ?? 'Plane-control'} initialized\\n");\n  return 0;\n}\n`
  }
  return `// ${file.name}\n`
}

const fileContent = computed(() => (openedFile.value ? sampleFileContent(openedFile.value) : ''))

const readmeContent = computed(() => `# ${repository.value?.name ?? '代码仓库'}

${repository.value?.description ?? ''}

## 模块定位

本仓库属于 ${repository.value?.path ?? ''} 中的核心组成部分，用于承载${repository.value?.name ?? '该模块'}的源码、构建脚本与单元测试。

## 快速开始

\`\`\`bash
git clone git@github.com:${repository.value?.key ?? 'repo'}.git
cd ${repository.value?.key ?? 'repo'}
make build
\`\`\`

## 目录结构

| 路径 | 说明 |
| --- | --- |
| \`src\` | 模块源码 |
| \`include\` | 对外头文件 |
| \`tests\` | 单元与回归测试 |

## 分支策略

- \`${repository.value?.defaultBranch ?? 'master'}\`：受保护主分支，仅接受合并请求合入
- 功能分支：\`feature/<业务名>\`
- 发布分支：\`release/v<主>.<次>\`
`)
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
          <VisDropdown :items="branchItems">
            <template #trigger="{ toggle }">
              <VisButton
                variant="secondary"
                size="md"
                prefix
                icon-name="git-branch-02"
                suffix
                suffix-icon-name="chevron-down"
                :label="repository?.defaultBranch ?? 'Master'"
                aria-haspopup="menu"
                @click="toggle"
              >
                {{ repository?.defaultBranch ?? 'Master' }}
              </VisButton>
            </template>
          </VisDropdown>
        </div>

        <VisInputSearchBox
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
              'is-active': currentFolder === row.file,
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
              class="repository-detail__tree-icon"
              :type="treeIconType(row.file)"
              :size="16"
            />
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
              <VisDropdown :items="branchItems">
                <template #trigger="{ toggle }">
                  <VisButton
                    variant="secondary"
                    size="md"
                    prefix
                    icon-name="git-branch-02"
                    suffix
                    suffix-icon-name="chevron-down"
                    :label="repository?.defaultBranch ?? 'Master'"
                    aria-haspopup="menu"
                    @click="toggle"
                  >
                    {{ repository?.defaultBranch ?? 'Master' }}
                  </VisButton>
                </template>
              </VisDropdown>
            </template>

            <div class="repository-detail__meta-path">
              <button
                type="button"
                class="repository-detail__path-item"
                :class="{ 'is-active': !currentFolder && !openedFile }"
                @click="navigateToRoot"
              >
                {{ repository?.code ?? 'Plane-control' }}
              </button>
              <template v-for="(folder, index) in currentFolderPath" :key="`f-${folder.name}`">
                <span class="repository-detail__path-sep" aria-hidden="true">
                  <Icon name="slash-divider" :size="12" decorative />
                </span>
                <button
                  type="button"
                  class="repository-detail__path-item"
                  :class="{ 'is-active': !openedFile && index === currentFolderPath.length - 1 }"
                  @click="navigateToFolder(folder)"
                >
                  {{ folder.name }}
                </button>
              </template>
              <template v-if="openedFile">
                <span class="repository-detail__path-sep" aria-hidden="true">
                  <Icon name="slash-divider" :size="12" decorative />
                </span>
                <span class="repository-detail__path-item is-active">{{ openedFile.name }}</span>
              </template>
              <VisButton
                class="repository-detail__path-copy"
                variant="text"
                size="sm"
                icon-only
                icon-name="copy-04"
                label="复制路径"
              />
            </div>

            <VisButton variant="text" size="md" prefix icon-name="git-commit">
              {{ repository?.commits.length ?? 0 }} 提交
            </VisButton>
            <VisButton variant="text" size="md" prefix icon-name="git-branch-02">
              {{ repository?.branches ?? 0 }} 分支
            </VisButton>
            <VisButton variant="text" size="md" prefix icon-name="tag-01">1 标签</VisButton>
            <VisButton variant="secondary" size="md" icon-only icon-name="plus" label="新建" />
            <VisButton size="md" suffix suffix-icon-name="chevron-down" label="代码">代码</VisButton>
          </div>

          <div v-if="repository" class="repository-detail__commit-card">
            <VisAvatar
              size="sm"
              type="image"
              image-variant="09"
              :image-alt="repository.latestCommit.author"
            />
            <span class="repository-detail__commit-author">{{ repository.latestCommit.author }}</span>
            <span class="repository-detail__commit-message">{{ repository.latestCommit.message }}</span>
            <span class="repository-detail__commit-time">{{ repository.latestCommit.time }}</span>
            <span class="repository-detail__commit-spacer" aria-hidden="true" />
            <VisButtonSplit color="grey">
              <VisButton variant="text" size="md" prefix icon-name="git-commit">
                {{ repository.latestCommit.hash }}
              </VisButton>
              <VisButton variant="text" size="md" icon-only icon-name="copy-04" label="复制提交号" />
            </VisButtonSplit>
          </div>

          <template v-if="openedFile">
            <div class="repository-detail__file-viewer">
              <VisTabs
                class="repository-detail__file-tabs"
                :items="fileTabs"
                :model-value="fileTab"
                align="horizontal"
                aria-label="文件查看标签页"
                @update:model-value="fileTab = $event"
              />
              <div class="repository-detail__file-code">
                <pre><code>{{ fileContent }}</code></pre>
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
  box-sizing: border-box;
  inline-size: 256px;
  min-inline-size: 256px;
  border-inline-end: 1px solid var(--color-border-default);
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-12);
  overflow-y: auto;
  background: var(--color-bg-canvas);
}

.repository-detail__aside-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.repository-detail__file-search {
  inline-size: 100%;
}

.repository-detail__file-tree {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  inline-size: var(--space-20);
  flex: 0 0 var(--space-20);
}

.repository-detail__tree-icon {
  flex: 0 0 var(--space-16);
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
  min-inline-size: 0;
  min-block-size: 0;
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
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
  background: var(--color-bg-surface-subtle);
  flex-shrink: 0;
}

.repository-detail__commit-author {
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
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
  box-sizing: border-box;
  inline-size: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.repository-detail__file-tabs {
  flex-shrink: 0;
}

.repository-detail__file-code {
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 320px;
  padding: var(--space-16);
  overflow: auto;
  background: var(--color-bg-surface);
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
