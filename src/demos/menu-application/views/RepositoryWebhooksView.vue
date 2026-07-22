<script setup lang="ts">
import { ref } from 'vue'

import { VisBadge } from '../../../components/badge'
import VisButton from '../../../components/button/VisButton.vue'
import { VisDivider } from '../../../components/divider'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import Icon from '../../../components/icons/Icon.vue'
import type { IconName } from '../../../components/icons/generated/registry.generated'
import { VisTable, type VisTableColumn } from '../../../components/table'
import { VisTabs, type VisTabsItem } from '../../../components/tabs'
import { VisTag } from '../../../components/tag'

interface WebhookIntegration {
  id: string
  name: string
  url: string
  events: string[]
  description: string
}

interface WebhookRecord extends Record<string, unknown> {
  id: number
  triggeredAt: string
  event: string
  target: string
  httpStatus: string
  duration: string
  result: string
}

interface SettingsItem {
  label: string
  icon?: IconName
  active?: boolean
}

interface SettingsGroup {
  label: string
  items: SettingsItem[]
}

const repositoryTabs: VisTabsItem[] = [
  { value: 'code', label: '代码', iconName: 'code-02' },
  { value: 'merge-requests', label: '合并请求', iconName: 'git-merge', count: 4 },
  { value: 'reviews', label: '评审记录', iconName: 'notification-message' },
  { value: 'work-items', label: '关联工作项', iconName: 'clipboard-check' },
  { value: 'archive', label: '入库记录', iconName: 'arrow-square-right' },
  { value: 'statistics', label: '统计', iconName: 'bar-chart-square-02' },
  { value: 'settings', label: '设置', iconName: 'settings-01' },
]

const settingsGroups: SettingsGroup[] = [
  {
    label: '基本设置',
    items: [
      { label: '仓库信息', icon: 'bar-chart-square-02' },
      { label: '通知设置', icon: 'bar-chart-square-02' },
    ],
  },
  {
    label: '仓库管理',
    items: [
      { label: '仓库加速', icon: 'bar-chart-square-02' },
      { label: '同步设置', icon: 'bar-chart-square-02' },
      { label: '子模块', icon: 'bar-chart-square-02' },
      { label: '仓库备份', icon: 'bar-chart-square-02' },
    ],
  },
  {
    label: '服务集成',
    items: [
      { label: 'E2E 设置', icon: 'bar-chart-square-02' },
      { label: 'Webhook 设置', icon: 'webhook', active: true },
    ],
  },
]

const integrations: WebhookIntegration[] = [
  {
    id: 'jenkins',
    name: 'Jenkins 持续集成',
    url: 'https://ci.example.com/webhook/repository',
    events: ['代码推送', '合并请求'],
    description: '代码推送或合并请求更新后，自动触发 Jenkins 构建和测试任务。',
  },
  {
    id: 'wechat',
    name: '企业微信研发通知',
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?...',
    events: ['合并请求', '版本发布'],
    description: '代码推送或创建版本标签后，自动提交代码安全扫描任务。',
  },
  {
    id: 'security',
    name: '代码安全扫描平台',
    url: 'https://security.example.com/api/hooks/code-scan',
    events: ['代码推送', '合并请求'],
    description: '代码推送或创建版本标签后，自动提交代码安全扫描任务。',
  },
]

const records: WebhookRecord[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  triggeredAt: '2026-07-22 13:42:16',
  event: '代码推送',
  target: 'develop',
  httpStatus: '200',
  duration: '324 ms',
  result: '成功',
}))

const historyColumns: VisTableColumn[] = [
  { key: 'triggeredAt', label: '触发时间', minWidth: 240 },
  { key: 'event', label: '事件', minWidth: 240 },
  { key: 'target', label: '触发对象', width: 160 },
  { key: 'httpStatus', label: 'HTTP 状态', width: 160 },
  { key: 'duration', label: '耗时', width: 160 },
  { key: 'result', label: '结果', width: 160 },
  { key: 'actions', label: '操作', width: 160 },
]

const expandedIntegrationId = ref<string | null>(null)

function toggleIntegration(id: string): void {
  expandedIntegrationId.value = expandedIntegrationId.value === id ? null : id
}
</script>

<template>
  <section class="repository-page" aria-label="Software-Factory 仓库 Webhook 设置">
    <header class="repository-header">
      <div class="repository-summary">
        <VisFeaturedIcon size="xl" type="modern" color="grey" icon="code-02" />
        <div class="repository-summary__copy">
          <div class="repository-summary__title-row">
            <h1>Software-Factory</h1>
            <VisButton
              class="repository-switcher"
              variant="text"
              size="sm"
              icon-only
              icon-name="chevron-down"
              label="切换代码仓库"
            />
          </div>
          <p>Repository ID: 3034893</p>
        </div>
      </div>

      <VisTabs
        class="repository-tabs"
        :model-value="'settings'"
        :items="repositoryTabs"
        aria-label="仓库导航"
      />
    </header>

    <div class="repository-settings">
      <aside class="settings-sidebar" aria-label="仓库设置导航">
        <h2>仓库设置</h2>
        <nav class="settings-navigation">
          <template v-for="(group, groupIndex) in settingsGroups" :key="group.label">
            <VisDivider v-if="groupIndex > 0" class="settings-navigation__divider" dashed />
            <section class="settings-group">
              <h3>{{ group.label }}</h3>
              <button
                v-for="item in group.items"
                :key="item.label"
                class="settings-item"
                :class="{ 'is-active': item.active }"
                type="button"
                :aria-current="item.active ? 'page' : undefined"
              >
                <Icon v-if="item.icon" :name="item.icon" :size="16" decorative />
                <span>{{ item.label }}</span>
              </button>
            </section>
          </template>
        </nav>
      </aside>

      <main class="webhook-content">
        <header class="webhook-heading">
          <div class="webhook-heading__title-row">
            <h2>Webhook</h2>
            <VisButton size="md" prefix icon-name="plus">新建 webhook</VisButton>
          </div>
          <p>
            Webhook 可以在代码仓库发生指定事件时，自动向外部系统发送 HTTP 请求。您可以通过 Webhook
            连接持续集成、消息通知、项目管理、安全扫描等系统，实现跨平台的自动化协作。
          </p>
        </header>

        <div class="webhook-list">
          <article
            v-for="integration in integrations"
            :key="integration.id"
            class="webhook-integration"
            :class="{ 'is-expanded': expandedIntegrationId === integration.id }"
          >
            <div class="webhook-integration__row">
              <div class="webhook-integration__topline">
                <div class="webhook-integration__identity">
                  <VisButton
                    class="webhook-integration__toggle"
                    variant="text"
                    size="sm"
                    icon-only
                    :icon-name="expandedIntegrationId === integration.id ? 'chevron-down' : 'chevron-right'"
                    :label="`${expandedIntegrationId === integration.id ? '收起' : '展开'}${integration.name}触发记录`"
                    :aria-expanded="expandedIntegrationId === integration.id"
                    @click="toggleIntegration(integration.id)"
                  />
                  <strong>{{ integration.name }}</strong>
                </div>

                <VisButton
                  class="webhook-integration__url"
                  variant="link-color"
                  size="md"
                  :label="integration.url"
                />

                <div class="webhook-tags" aria-label="触发事件">
                  <VisTag v-for="event in integration.events" :key="event" :label="event" />
                </div>

                <VisButton
                  class="webhook-integration__more"
                  variant="text"
                  size="sm"
                  icon-only
                  icon-name="dots-horizontal"
                  :label="`${integration.name}更多操作`"
                />
              </div>
              <p class="webhook-integration__description">{{ integration.description }}</p>
            </div>

            <div v-if="expandedIntegrationId === integration.id" class="webhook-history">
              <VisTable
                class="webhook-history__table"
                :data="records"
                :columns="historyColumns"
                row-key="id"
                aria-label="Webhook 触发记录"
              >
                <template #cell-event="{ value }">
                  <VisTag :label="String(value)" />
                </template>
                <template #cell-result="{ value }">
                  <VisBadge type="text" color-type="success" :label="String(value)" />
                </template>
                <template #cell-actions>
                  <div class="webhook-history__actions">
                    <VisButton variant="link-color" size="sm">查看详情</VisButton>
                    <VisButton variant="link-color" size="sm">重试</VisButton>
                  </div>
                </template>
              </VisTable>
            </div>
          </article>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
.repository-page {
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

.repository-header {
  box-sizing: border-box;
  block-size: 124px;
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-20);
  flex: 0 0 124px;
  background: var(--color-bg-canvas);
}

.repository-summary {
  block-size: 76px;
  display: flex;
  align-items: center;
  gap: var(--space-12);
  transform: translateY(var(--space-8));
}

.repository-summary__copy {
  min-inline-size: 0;
}

.repository-summary__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.repository-summary h1,
.webhook-heading h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
  letter-spacing: 0;
}

.repository-summary p {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.repository-switcher {
  flex: 0 0 auto;
}

.repository-tabs {
  block-size: var(--space-48);
}

.repository-tabs :deep(.vis-tabs__item) {
  margin-inline-end: var(--space-8);
}

.repository-settings {
  min-block-size: 0;
  display: flex;
  flex: 1 1 0;
  background: var(--color-bg-canvas);
}

.settings-sidebar {
  box-sizing: border-box;
  inline-size: 216px;
  min-inline-size: 216px;
  border-inline-end: 1px solid var(--color-border-default);
  overflow-y: auto;
  background: var(--color-bg-surface);
}

.settings-sidebar h2 {
  box-sizing: border-box;
  block-size: var(--space-64);
  margin: 0;
  padding-inline: var(--space-20);
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
}

.settings-navigation {
  padding: 0 var(--space-8) var(--space-16);
}

.settings-group {
  display: grid;
  gap: 0;
}

.settings-group h3 {
  box-sizing: border-box;
  block-size: var(--space-32);
  margin: 0;
  padding-inline: var(--space-12);
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
}

.settings-item {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-40);
  border: 0;
  border-radius: var(--radius-sm);
  padding-inline: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  background: transparent;
  font: inherit;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  text-align: start;
  cursor: pointer;
}

.settings-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.settings-item.is-active {
  color: var(--color-text-brand-primary);
  background: var(--color-fg-brand-subtle);
  font-weight: 500;
}

.settings-navigation__divider {
  margin-block: var(--space-8);
}

.webhook-content {
  min-inline-size: 0;
  min-block-size: 0;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  overflow: auto;
  background: var(--color-bg-canvas);
}

.webhook-heading {
  box-sizing: border-box;
  block-size: 100px;
  min-block-size: 100px;
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  flex: 0 0 auto;
  background: var(--color-bg-canvas);
}

.webhook-heading__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-20);
}

.webhook-heading p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.webhook-list {
  padding: 0 var(--space-20) var(--space-20);
  min-block-size: 0;
  flex: 1 1 0;
}

.webhook-integration {
  border-block-end: 1px solid var(--color-border-default);
}

.webhook-integration__row {
  box-sizing: border-box;
  block-size: 80px;
  padding-block: var(--space-16);
  padding-inline-end: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-4);
  background: var(--color-bg-canvas);
}

.webhook-integration__topline {
  min-inline-size: 0;
  block-size: var(--space-24);
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.webhook-integration__identity {
  min-inline-size: 0;
  block-size: var(--space-24);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex: 1 1 0;
}

.webhook-integration__identity strong {
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.webhook-integration__description {
  box-sizing: border-box;
  inline-size: fit-content;
  max-inline-size: 100%;
  block-size: var(--space-20);
  margin: 0;
  padding-inline-start: 36px;
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.webhook-integration__url {
  min-inline-size: 0;
  inline-size: auto;
  max-inline-size: none;
  overflow: hidden;
  justify-content: flex-start;
  flex: 1 1 0;
}

.webhook-tags {
  min-inline-size: 0;
  block-size: var(--space-20);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 1 1 0;
}

.webhook-tags :deep(.vis-tag) {
  block-size: var(--space-20);
  padding-inline: var(--space-8);
}

.webhook-integration__toggle,
.webhook-integration__more {
  align-self: center;
  flex: 0 0 var(--space-24);
}

.webhook-history {
  padding: var(--space-4) var(--space-20) var(--space-16) 36px;
}

.webhook-history__table {
  inline-size: 100%;
}

.webhook-history__table :deep(.vis-el-table__header-wrapper th.vis-el-table__cell) {
  block-size: var(--space-40);
}

.webhook-history__table :deep(.vis-el-table__header-wrapper .vis-el-table__cell .cell) {
  block-size: calc(var(--space-40) - 1px);
}

.webhook-history__actions {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

@media (max-width: 1280px) {
  .webhook-integration__topline {
    gap: var(--space-12);
  }
}

@media (max-width: 1024px) {
  .repository-header,
  .repository-settings {
    min-inline-size: 960px;
  }

  .repository-page {
    overflow: auto;
  }
}
</style>
