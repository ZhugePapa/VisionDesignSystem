<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisBadge } from '../../../components/badge'
import VisButton from '../../../components/button/VisButton.vue'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import VisInputSearchBox from '../../../components/input-search-box/VisInputSearchBox.vue'
import { VisPageHeader } from '../../../components/page-header'
import { VisTable, type VisTableColumn } from '../../../components/table'
import { VisTag } from '../../../components/tag'

interface ApplicationRow extends Record<string, unknown> {
  id: string
  title: string
  disabled: boolean
  status: string
  statusTone: 'brand' | 'grey'
  lastDeployment: string
  deploymentTime: string
}

const route = useRoute()
const router = useRouter()
const openMenuId = ref<string | null>(null)

const applicationRows: ApplicationRow[] = [
  {
    id: 'test-deploy-active',
    title: 'test-deploy',
    disabled: false,
    status: '已部署',
    statusTone: 'brand',
    lastDeployment: '2026/06/09 19:20:34',
    deploymentTime: '–',
  },
  {
    id: 'test-deploy-disabled',
    title: 'test-deploy',
    disabled: true,
    status: '初始化',
    statusTone: 'grey',
    lastDeployment: '应用未部署',
    deploymentTime: '–',
  },
  {
    id: 'repository-service',
    title: '代码仓库服务',
    disabled: false,
    status: '初始化',
    statusTone: 'grey',
    lastDeployment: '应用未部署',
    deploymentTime: '–',
  },
]

const columns: VisTableColumn[] = [
  { key: 'title', label: '标题', minWidth: 320, showOverflowTooltip: false },
  { key: 'status', label: '状态', minWidth: 320, showOverflowTooltip: false },
  { key: 'lastDeployment', label: '最近一次部署', minWidth: 320 },
  { key: 'deploymentTime', label: '开始时间 & 部署时长', minWidth: 320 },
  { key: 'actions', label: '操作', width: 200, showOverflowTooltip: false },
]

const rowMenuItems: VisDropdownEntry[] = [
  { type: 'item', itemType: 'icon', iconName: 'edit-03', label: '编辑' },
  { type: 'item', itemType: 'icon', iconName: 'copy-01', label: '复制' },
  { type: 'item', itemType: 'icon', iconName: 'clock', label: '操作历史' },
  { type: 'item', itemType: 'icon', iconName: 'minus-circle', label: '禁用' },
  { type: 'item', itemType: 'icon', iconName: 'trash-01', label: '删除' },
]

function openApplication(row: ApplicationRow): void {
  if (row.disabled) return

  void router.push({
    name: 'application-overview',
    params: {
      projectKey: route.params.projectKey,
      applicationId: row.id,
    },
  })
}

function setMenuOpen(rowId: string, value: boolean): void {
  openMenuId.value = value ? rowId : null
}

function applicationRow(row: Record<string, unknown>): ApplicationRow {
  return row as ApplicationRow
}
</script>

<template>
  <section class="application-list-page" aria-label="应用管理">
    <VisPageHeader
      class="application-list-page__header"
      title="应用列表"
      description="集中管理应用的创建、配置、部署与运行状态，帮助团队统一维护应用全生命周期及其关联资源。"
      aria-label="应用列表"
    />

    <div class="application-list-page__content">
      <div class="application-list-toolbar" aria-label="应用筛选">
        <VisInputSearchBox
          class="application-list-toolbar__search"
          placeholder="请输入标题/编号/描述关键字"
          aria-label="搜索应用"
        />
        <VisButton variant="secondary" size="md" suffix suffix-icon-name="chevron-down">
          状态
        </VisButton>
        <VisButton variant="secondary" size="md" suffix suffix-icon-name="chevron-down">
          创建人
        </VisButton>
        <VisButton variant="secondary" size="md" prefix icon-name="filter-lines">
          更多筛选
        </VisButton>
        <span class="application-list-toolbar__spacer" />
        <VisButton size="md" prefix icon-name="plus">新建应用</VisButton>
      </div>

      <VisTable
        class="application-list-table"
        :data="applicationRows"
        :columns="columns"
        row-key="id"
        selectable
        aria-label="应用列表"
      >
        <template #cell-title="{ row }">
          <div
            class="application-title-cell"
            :class="{ 'is-disabled': applicationRow(row).disabled }"
          >
            <VisButton
              class="application-title-cell__link"
              variant="link-grey"
              size="md"
              :disabled="applicationRow(row).disabled"
              @click.stop="openApplication(applicationRow(row))"
            >
              {{ applicationRow(row).title }}
            </VisButton>
            <VisTag v-if="applicationRow(row).disabled" label="已禁用" />
          </div>
        </template>

        <template #cell-status="{ row }">
          <VisBadge
            type="text"
            :color-type="applicationRow(row).statusTone"
            :label="applicationRow(row).status"
          />
        </template>

        <template #cell-lastDeployment="{ row }">
          <span :class="{ 'application-table-muted': applicationRow(row).disabled }">
            {{ applicationRow(row).lastDeployment }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <div class="application-row-actions">
            <VisButton
              variant="text"
              size="sm"
              icon-only
              icon-name="play"
              :disabled="applicationRow(row).disabled"
              :label="`部署${applicationRow(row).title}`"
            />
            <VisDropdown
              class="application-row-menu"
              :items="rowMenuItems"
              :open="openMenuId === applicationRow(row).id"
              @update:open="setMenuOpen(applicationRow(row).id, $event)"
              @select="openMenuId = null"
            >
              <template #trigger="{ open, toggle }">
                <VisButton
                  variant="text"
                  size="sm"
                  icon-only
                  icon-name="dots-horizontal"
                  :state="open ? 'hover' : 'default'"
                  :disabled="applicationRow(row).disabled"
                  :label="`${applicationRow(row).title}更多操作`"
                  @click.stop="toggle"
                />
              </template>
            </VisDropdown>
          </div>
        </template>
      </VisTable>
    </div>
  </section>
</template>

<style scoped>
.application-list-page {
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 0;
  overflow: auto;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
}

.application-list-page__header {
  padding-block-end: 0;
}

.application-list-page__content {
  padding: var(--space-20);
}

.application-list-toolbar {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.application-list-toolbar__search {
  flex: 0 0 240px;
}

.application-list-toolbar__spacer {
  min-inline-size: var(--space-16);
  flex: 1 1 0;
}

.application-list-table {
  margin-block-start: var(--space-16);
  overflow: visible;
}

.application-list-table :deep(.vis-el-table__inner-wrapper),
.application-list-table :deep(.vis-el-table__body-wrapper),
.application-list-table :deep(.vis-el-scrollbar),
.application-list-table :deep(.vis-el-scrollbar__wrap),
.application-list-table :deep(.vis-el-scrollbar__view) {
  overflow: visible !important;
}

.application-title-cell,
.application-row-actions {
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.application-title-cell {
  gap: var(--space-8);
}

.application-title-cell__link {
  min-inline-size: 0;
  justify-content: flex-start;
}

.application-title-cell.is-disabled {
  color: var(--color-text-disabled);
}

.application-row-actions {
  gap: var(--space-8);
}

.application-table-muted {
  color: var(--color-text-disabled);
}

.application-row-menu {
  z-index: 12;
}

.application-row-menu :deep(.vis-dropdown) {
  inset-block-start: var(--space-32);
  inset-inline: auto 0;
  inline-size: var(--space-128);
}

@media (max-width: 900px) {
  .application-list-toolbar {
    flex-wrap: wrap;
  }

  .application-list-toolbar__spacer {
    display: none;
  }
}
</style>
