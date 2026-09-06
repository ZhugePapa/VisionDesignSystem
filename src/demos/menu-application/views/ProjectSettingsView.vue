<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { VisBadge, type VisBadgeColorType } from '../../../components/badge'

type SettingsKey =
  | 'settings-general'
  | 'settings-members'
  | 'settings-roles'
  | 'settings-notifications'
  | 'settings-integrations'
  | 'settings-approvals'
  | 'settings-audit'
  | 'settings-lifecycle'

interface SettingRow {
  label: string
  description: string
  value: string
  tone?: VisBadgeColorType
}

interface SettingGroup {
  title: string
  description: string
  rows: SettingRow[]
}

const route = useRoute()

const settingsContent: Record<SettingsKey, SettingGroup[]> = {
  'settings-general': [
    {
      title: '项目信息',
      description: '用于识别项目并明确项目的默认责任人。',
      rows: [
        { label: '项目名称', description: '在项目选择器和页面标题中显示', value: '飞机照明系统' },
        { label: '项目标识', description: '用于 URL、接口和自动化脚本', value: 'lighting' },
        { label: '项目负责人', description: '接收项目级审批和异常通知', value: '张大山' },
        { label: '项目状态', description: '当前项目可正常协作和交付', value: '活跃', tone: 'success' },
      ],
    },
    {
      title: '默认规则',
      description: '统一项目内时间、日期和可见范围。',
      rows: [
        { label: '默认时区', description: '用于展示提交、运行和审计时间', value: 'Asia/Shanghai' },
        { label: '日期格式', description: '适用于项目内所有时间字段', value: 'YYYY-MM-DD HH:mm:ss' },
        { label: '项目可见范围', description: '仅项目成员可以访问', value: '私有', tone: 'grey' },
      ],
    },
  ],
  'settings-members': [
    {
      title: '成员概况',
      description: '成员统一从组织目录添加，离开项目后立即失去访问权限。',
      rows: [
        { label: '项目成员', description: '已加入项目并拥有至少一个角色', value: '12 人', tone: 'brand' },
        { label: '待加入成员', description: '已邀请但尚未加入项目', value: '0 人', tone: 'grey' },
        { label: '默认角色', description: '新成员加入项目时自动分配', value: '开发者' },
      ],
    },
    {
      title: '成员来源',
      description: '控制项目成员的同步方式和外部协作范围。',
      rows: [
        { label: '组织成员同步', description: '成员信息跟随组织目录更新', value: '已启用', tone: 'success' },
        { label: '外部成员', description: '是否允许组织外账号加入项目', value: '不允许', tone: 'grey' },
      ],
    },
  ],
  'settings-roles': [
    {
      title: '预置角色',
      description: '角色描述权限集合，成员通过角色获得项目资源访问权。',
      rows: [
        { label: '项目管理员', description: '管理成员、权限和全部项目设置', value: '3 人', tone: 'brand' },
        { label: '开发者', description: '维护需求、代码、流水线、制品和测试资源', value: '8 人' },
        { label: '访客', description: '只读访问项目内已授权资源', value: '1 人', tone: 'grey' },
      ],
    },
    {
      title: '权限策略',
      description: '项目权限在组织策略基础上进一步收敛。',
      rows: [
        { label: '继承组织权限', description: '自动应用组织级安全和访问策略', value: '已启用', tone: 'success' },
        { label: '最小权限原则', description: '默认拒绝未明确授予的资源操作', value: '已启用', tone: 'success' },
        { label: '分支保护策略', description: '限制关键分支的推送和合并权限', value: '已配置', tone: 'brand' },
      ],
    },
  ],
  'settings-notifications': [
    {
      title: '通知事件',
      description: '选择需要在项目范围内主动通知成员的关键事件。',
      rows: [
        { label: '需求变更', description: '需求状态、负责人或计划时间发生变化', value: '已启用', tone: 'success' },
        { label: '合并请求', description: '创建、评审、合并或关闭合并请求', value: '已启用', tone: 'success' },
        { label: '发布结果', description: '发布成功、失败或被中止', value: '已启用', tone: 'success' },
        { label: '审批提醒', description: '审批待处理、即将超时或已完成', value: '已启用', tone: 'success' },
      ],
    },
    {
      title: '通知渠道',
      description: '设置项目事件的默认送达方式。',
      rows: [
        { label: '站内通知', description: '在工作台和消息中心接收', value: '已启用', tone: 'success' },
        { label: '企业微信', description: '发送至成员账号和项目群', value: '已启用', tone: 'success' },
        { label: '邮件', description: '发送至成员组织邮箱', value: '已禁用', tone: 'grey' },
      ],
    },
  ],
  'settings-integrations': [
    {
      title: '项目集成',
      description: '集中管理项目与外部系统的连接和同步关系。',
      rows: [
        { label: '代码仓库', description: '为流水线、发布和审计提供源代码数据', value: '已连接 6 个', tone: 'success' },
        { label: 'Webhook', description: '向外部系统推送项目事件', value: '已启用 3 个', tone: 'brand' },
        { label: '安全扫描', description: '在代码和制品阶段执行安全检查', value: '已启用', tone: 'success' },
        { label: '需求同步', description: '与外部需求系统双向同步', value: '未配置', tone: 'grey' },
      ],
    },
    {
      title: '集成安全',
      description: '凭据仅用于授权的项目任务，不向项目成员展示明文。',
      rows: [
        { label: '凭据托管', description: '由组织凭据中心加密保存', value: '已启用', tone: 'success' },
        { label: '连接健康检查', description: '最近一次自动检查结果', value: '全部正常', tone: 'success' },
      ],
    },
  ],
  'settings-approvals': [
    {
      title: '交付审批',
      description: '审批流程用于重要交付动作，不替代资源访问权限。',
      rows: [
        { label: '需求基线审核', description: '基线生效前需要需求负责人和项目负责人确认', value: '2 级审批', tone: 'brand' },
        { label: '发布审批', description: '发布进入验证环境前由发布负责人确认', value: '负责人审批' },
        { label: '生产部署审批', description: '生产环境部署需要两名授权成员确认', value: '双人审批', tone: 'warning' },
        { label: '紧急发布', description: '允许跳过常规审批并补录审计原因', value: '已禁用', tone: 'grey' },
      ],
    },
    {
      title: '超时与转交',
      description: '避免审批任务因成员不可用而长期阻塞。',
      rows: [
        { label: '默认处理时限', description: '到期前 2 小时提醒审批人', value: '24 小时' },
        { label: '超时处理', description: '超时后转交项目管理员', value: '自动转交', tone: 'brand' },
      ],
    },
  ],
  'settings-audit': [
    {
      title: '审计策略',
      description: '审计日志记录谁在何时对项目资源执行了什么操作。',
      rows: [
        { label: '日志保留期', description: '覆盖配置、权限、审批和交付操作', value: '365 天' },
        { label: '导出权限', description: '可下载项目审计日志的角色', value: '项目管理员' },
        { label: '敏感操作校验', description: '导出和删除操作需要再次验证身份', value: '已启用', tone: 'success' },
      ],
    },
    {
      title: '记录概况',
      description: '展示当前项目最近产生的审计记录。',
      rows: [
        { label: '今日记录', description: '今天 00:00 至当前时间', value: '28 条', tone: 'brand' },
        { label: '最近导出', description: '最近一次审计日志导出时间', value: '2026-08-18 16:42:09' },
      ],
    },
  ],
  'settings-lifecycle': [
    {
      title: '项目归档',
      description: '归档后项目保留全部数据，但仅允许查看和导出。',
      rows: [
        { label: '当前状态', description: '项目可以正常协作和交付', value: '活跃', tone: 'success' },
        { label: '归档后权限', description: '所有项目资源转为只读', value: '只读' },
        { label: '恢复项目', description: '项目管理员可在保留期内恢复', value: '允许' },
      ],
    },
    {
      title: '删除项目',
      description: '删除属于高风险操作，需要确认项目标识并经过保护期。',
      rows: [
        { label: '删除保护', description: '阻止项目被立即永久删除', value: '已启用', tone: 'success' },
        { label: '数据保留期', description: '删除申请通过后的可恢复时间', value: '30 天', tone: 'warning' },
        { label: '永久删除', description: '保留期结束后清除项目及其关联数据', value: '高风险操作', tone: 'danger' },
      ],
    },
  ],
}

const activeKey = computed<SettingsKey>(() => {
  const menuKey = String(route.meta.menuKey ?? 'settings-general')
  return menuKey in settingsContent ? (menuKey as SettingsKey) : 'settings-general'
})

const groups = computed(() => settingsContent[activeKey.value])
</script>

<template>
  <div class="application-page-content project-settings-view">
    <section
      v-for="group in groups"
      :key="group.title"
      class="settings-group"
      :aria-labelledby="`${activeKey}-${group.title}`"
    >
      <header class="settings-group__header">
        <h2 :id="`${activeKey}-${group.title}`">{{ group.title }}</h2>
        <p>{{ group.description }}</p>
      </header>

      <dl class="settings-group__list">
        <div v-for="row in group.rows" :key="row.label" class="settings-row">
          <dt>
            <strong>{{ row.label }}</strong>
            <span>{{ row.description }}</span>
          </dt>
          <dd>
            <VisBadge
              v-if="row.tone"
              type="text"
              :color-type="row.tone"
              :label="row.value"
            />
            <span v-else>{{ row.value }}</span>
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.project-settings-view {
  inline-size: min(100%, 960px);
  display: grid;
  gap: var(--space-16);
}

.settings-group {
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-bg-canvas);
  box-shadow: var(--shadow-default-xs);
}

.settings-group__header {
  padding: var(--space-20);
}

.settings-group__header h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 600;
  line-height: var(--font-text-lg-line-height);
}

.settings-group__header p {
  margin: var(--space-4) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.settings-group__list {
  margin: 0;
}

.settings-row {
  min-block-size: 72px;
  border-block-start: 1px solid var(--color-border-default);
  padding: var(--space-12) var(--space-20);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(112px, auto);
  align-items: center;
  gap: var(--space-24);
}

.settings-row dt,
.settings-row dd {
  margin: 0;
}

.settings-row dt {
  min-inline-size: 0;
  display: grid;
  gap: var(--space-2);
}

.settings-row dt strong {
  color: var(--color-text-primary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
}

.settings-row dt span,
.settings-row dd {
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.settings-row dd {
  text-align: end;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .settings-row {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .settings-row dd {
    text-align: start;
  }
}
</style>
