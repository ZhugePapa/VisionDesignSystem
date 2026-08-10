<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import { VisAvatar } from '../../../components/avatar'
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

const figmaVueIconSrc = 'data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMTQgMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJ2dWUiPgo8cGF0aCBpZD0idmVjdG9yIiBkPSJNMCAwTDcgMTJMMTQgMEgxMS4yNUw3IDcuMjVMMi43NSAwSDBaIiBmaWxsPSIjNDFCODgzIiBzdHlsZT0iZmlsbDojNDFCODgzO2ZpbGw6Y29sb3IoZGlzcGxheS1wMyAwLjI1NDkgMC43MjE2IDAuNTEzNyk7ZmlsbC1vcGFjaXR5OjE7Ii8+CjxwYXRoIGlkPSJ2ZWN0b3JfMiIgZD0iTTIuNzUgMEw3IDcuMjVMMTEuMjUgMEg4Ljc1TDcuMDMyNjMgMy4wMDYzMUw1LjI1IDBIMi43NVoiIGZpbGw9IiMzNTQ5NUUiIHN0eWxlPSJmaWxsOiMzNTQ5NUU7ZmlsbDpjb2xvcihkaXNwbGF5LXAzIDAuMjA3OCAwLjI4NjMgMC4zNjg2KTtmaWxsLW9wYWNpdHk6MTsiLz4KPC9nPgo8L3N2Zz4K'
const figmaAvatarImageSrc = 'data:image/png;base64,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'

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
  if (value === 'code') navigateToRoot()
}

/* ---------- 文件查看器 ---------- */

const fileTabs = computed<VisTabsItem[]>(() => [
  { value: 'code', label: openedFile.value?.name ?? '代码', count: openedFile.value ? pseudoFileSize(openedFile.value) : undefined },
  { value: 'trace', label: '修改追溯' },
  { value: 'history', label: '文件历史' },
])

interface DemoBlameGroup {
  id: string
  time: string
  rank: VisCodeBlameRank
  lines: VisCodeLineData[]
}

function createBlameLines(contents: string[], lineNumbers: number[]): VisCodeLineData[] {
  return contents.map((content, index) => ({
    key: `${lineNumbers[index]}-${index}`,
    content,
    lineNumber: lineNumbers[index],
    number: 'default',
  }))
}

const appVueBlameGroups: DemoBlameGroup[] = [
  {
    id: 'import-vue-types',
    time: '2个月前',
    rank: 'rank3',
    lines: createBlameLines(["import type { App, Plugin } from 'vue'"], [1]),
  },
  {
    id: 'foundation-components',
    time: '2个月前',
    rank: 'rank3',
    lines: createBlameLines(
      [
        "import VisAlert from './components/alert/VisAlert.vue'",
        "import VisAccordion from './components/accordion/VisAccordion.vue'",
        "import VisAccordionItem from './components/accordion/VisAccordionItem.vue'",
        "import { VisAvatar, VisAvatarGroup, VisAvatarLabel } from './components/avatar'",
        "import VisBadge from './components/badge/VisBadge.vue'",
        "import VisBreadcrumb from './components/breadcrumb/VisBreadcrumb.vue'",
      ],
      [2, 3, 4, 5, 6, 7],
    ),
  },
  {
    id: 'form-components',
    time: '2个月前',
    rank: 'rank6',
    lines: createBlameLines(
      [
        "import VisButton from './components/button/VisButton.vue'",
        "import VisCheckbox from './components/checkbox/VisCheckbox.vue'",
        "import VisCheckboxGroup from './components/checkbox/VisCheckboxGroup.vue'",
      ],
      [8, 9, 10],
    ),
  },
  {
    id: 'table-components',
    time: '2个月前',
    rank: 'default',
    lines: createBlameLines(
      [
        'import {',
        '  VisTable,',
        '  VisTableHeader,',
        '  VisTableItem,',
        '  VisTableLink,',
        '  VisTableRow,',
        '  VisTableSortIcon,',
        '  VisTableTreePrefix,',
        '  VisTableTrendIcon,',
        "} from './components/table'",
      ],
      [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    ),
  },
  {
    id: 'tag-component',
    time: '2个月前',
    rank: 'rank5',
    lines: createBlameLines(["import VisTag from './components/tag/VisTag.vue'"], [21]),
  },
  {
    id: 'latest-components',
    time: '2个月前',
    rank: 'default',
    lines: createBlameLines(
      [
        "import VisButton from './components/button/VisButton.vue'",
        "import VisCheckbox from './components/checkbox/VisCheckbox.vue'",
        "import VisCheckboxGroup from './components/checkbox/VisCheckboxGroup.vue'",
      ],
      [22, 1, 1],
    ),
  },
]

const codeBlameLegendRanks: VisCodeBlameRank[] = [
  'default',
  'rank2',
  'rank3',
  'rank4',
  'rank5',
  'rank6',
]

function pseudoFileSize(file: DemoRepositoryFile): string {
  if (file.name === 'app.vue') return '6.02kb'
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
const displayedCommitCount = computed(() => (openedFile.value ? 3 : (repository.value?.commits.length ?? 0)))
const displayedBranchCount = computed(() => (openedFile.value ? 2 : (repository.value?.branches ?? 0)))

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

            <VisButton variant="text" size="md" prefix icon-name="git-commit">
              {{ displayedCommitCount }} 提交
            </VisButton>
            <VisButton variant="text" size="md" prefix icon-name="git-branch-02">
              {{ displayedBranchCount }} 分支
            </VisButton>
            <VisButton variant="text" size="md" prefix icon-name="tag-01">1 标签</VisButton>
            <VisButton variant="secondary" size="md" icon-only icon-name="plus" label="新建" />
            <VisButton size="md" suffix suffix-icon-name="chevron-down" label="代码">代码</VisButton>
          </div>

          <div v-if="repository" class="repository-detail__commit-card">
            <div class="repository-detail__commit-owner">
              <VisAvatar
                size="sm"
                type="image"
                :image-src="figmaAvatarImageSrc"
                :image-alt="repository.latestCommit.author"
              />
              <span class="repository-detail__commit-author">{{ repository.latestCommit.author }}</span>
            </div>
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
                  v-if="fileTab === 'trace'"
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
                  <VisButton variant="text" size="sm" icon-only icon-name="edit-03" label="编辑文件" />
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
                  v-for="group in appVueBlameGroups"
                  :key="group.id"
                  author="张大山"
                  :avatar-image-src="figmaAvatarImageSrc"
                  commit="添加新组件"
                  :time="group.time"
                  :rank="group.rank"
                  :lines="group.lines"
                />
              </div>
              <div v-else class="repository-detail__file-history-placeholder">
                暂无文件历史
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

.repository-detail__file-history-placeholder {
  min-block-size: 0;
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
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
