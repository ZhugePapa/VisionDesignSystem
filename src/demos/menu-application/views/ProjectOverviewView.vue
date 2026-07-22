<script setup lang="ts">
import VisBadge from '../../../components/badge/VisBadge.vue'
import VisButton from '../../../components/button/VisButton.vue'
import Icon from '../../../components/icons/Icon.vue'

const overviewMetrics = [
  { label: '本周新增需求', value: '24', change: '+12%', icon: 'clipboard-check' as const },
  { label: '进行中的流水线', value: '8', change: '3 个等待', icon: 'dataflow-03' as const },
  { label: '待处理缺陷', value: '17', change: '-8%', icon: 'check-square-broken' as const },
  { label: '在线环境', value: '6', change: '运行正常', icon: 'server-01' as const },
]

const recentTasks = [
  { title: '照明控制器接口联调', owner: '陈晓', status: '进行中', tone: 'brand' as const },
  { title: '机舱灯光场景回归测试', owner: '李文', status: '待验证', tone: 'warning' as const },
  { title: '发布 release/2.8.0', owner: '王可', status: '已完成', tone: 'success' as const },
  { title: '修复 CAN 总线超时问题', owner: '赵敏', status: '待处理', tone: 'grey' as const },
]

const deployments = [
  { name: 'lighting-web', environment: '生产环境', version: 'v2.8.0', progress: 100 },
  { name: 'lighting-service', environment: '预发布环境', version: 'v2.9.0-rc.3', progress: 72 },
  { name: 'device-adapter', environment: '测试环境', version: 'v1.14.2', progress: 46 },
]
</script>

<template>
  <div class="application-page-content overview-page">
    <section class="metric-grid" aria-label="项目指标">
      <article v-for="metric in overviewMetrics" :key="metric.label" class="metric-card">
        <span class="metric-card__icon"><Icon :name="metric.icon" :size="20" decorative /></span>
        <div class="metric-card__copy">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.change }}</small>
        </div>
      </article>
    </section>

    <div class="application-grid">
      <section class="application-panel task-panel">
        <div class="application-panel__heading">
          <div>
            <h2>近期任务</h2>
            <p>项目成员最近更新的工作项</p>
          </div>
          <VisButton variant="text" size="sm" suffix icon-name="arrow-up-right">查看全部</VisButton>
        </div>
        <div class="task-table" role="table" aria-label="近期任务">
          <div class="task-table__row task-table__header" role="row">
            <span role="columnheader">任务</span>
            <span role="columnheader">负责人</span>
            <span role="columnheader">状态</span>
          </div>
          <div v-for="task in recentTasks" :key="task.title" class="task-table__row" role="row">
            <strong role="cell">{{ task.title }}</strong>
            <span role="cell">{{ task.owner }}</span>
            <span role="cell">
              <VisBadge type="text" :color-type="task.tone" :label="task.status" />
            </span>
          </div>
        </div>
      </section>

      <section class="application-panel deployment-panel">
        <div class="application-panel__heading">
          <div>
            <h2>部署进度</h2>
            <p>今日环境发布状态</p>
          </div>
        </div>
        <div class="deployment-list">
          <article v-for="deployment in deployments" :key="deployment.name" class="deployment-item">
            <div class="deployment-item__heading">
              <div>
                <strong>{{ deployment.name }}</strong>
                <span>{{ deployment.environment }} · {{ deployment.version }}</span>
              </div>
              <small>{{ deployment.progress }}%</small>
            </div>
            <span class="deployment-progress" aria-hidden="true">
              <span :style="{ width: `${deployment.progress}%` }" />
            </span>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.overview-page,
.metric-grid,
.application-grid {
  display: grid;
  gap: var(--space-16);
}

.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card,
.application-panel {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-bg-canvas);
  box-shadow: var(--shadow-default-xs);
}

.metric-card {
  min-inline-size: 0;
  padding: var(--space-20);
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
}

.metric-card__icon {
  inline-size: var(--space-40);
  block-size: var(--space-40);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-brand-primary);
  background: var(--color-fg-brand-subtle);
  flex: 0 0 auto;
}

.metric-card__copy {
  min-inline-size: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: var(--space-4) var(--space-8);
  flex: 1 1 0;
}

.metric-card__copy > span {
  grid-column: 1 / -1;
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.metric-card__copy strong {
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

.metric-card__copy small {
  color: var(--color-text-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.application-grid {
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);
}

.application-panel {
  min-inline-size: 0;
  overflow: hidden;
}

.application-panel__heading {
  min-block-size: 76px;
  padding: var(--space-16) var(--space-20);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-16);
}

.application-panel__heading h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 600;
  line-height: var(--font-text-lg-line-height);
}

.application-panel__heading p {
  margin: var(--space-4) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.task-table {
  border-block-start: 1px solid var(--color-border-default);
}

.task-table__row {
  min-block-size: 52px;
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-20);
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 72px 88px;
  align-items: center;
  gap: var(--space-16);
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.task-table__row:last-child {
  border-block-end: 0;
}

.task-table__row:not(.task-table__header):hover {
  background: var(--color-bg-secondary);
}

.task-table__row strong {
  overflow: hidden;
  color: var(--color-text-primary);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-table__header {
  min-block-size: var(--space-40);
  color: var(--color-text-tertiary);
  background: var(--color-bg-tertiary);
  font-size: 12px;
  font-weight: 500;
}

.deployment-list {
  border-block-start: 1px solid var(--color-border-default);
  padding: 0 var(--space-20);
}

.deployment-item {
  padding-block: var(--space-16);
  display: grid;
  gap: var(--space-12);
}

.deployment-item + .deployment-item {
  border-block-start: 1px solid var(--color-border-default);
}

.deployment-item__heading {
  display: flex;
  justify-content: space-between;
  gap: var(--space-12);
}

.deployment-item__heading div {
  min-inline-size: 0;
  display: grid;
  gap: 2px;
}

.deployment-item__heading strong {
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-text-sm-size);
  font-weight: 500;
  line-height: var(--font-text-sm-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deployment-item__heading span,
.deployment-item__heading small {
  color: var(--color-text-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.deployment-progress {
  inline-size: 100%;
  block-size: 6px;
  border-radius: var(--radius-full);
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.deployment-progress > span {
  block-size: 100%;
  border-radius: inherit;
  display: block;
  background: var(--color-fg-brand-primary);
}

@media (max-width: 1040px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .application-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 720px) {
  .metric-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .task-table__row {
    grid-template-columns: minmax(140px, 1fr) 72px;
  }

  .task-table__row > :nth-child(2) {
    display: none;
  }
}
</style>
