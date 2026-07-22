<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import VisBadge from '../../../components/badge/VisBadge.vue'
import VisButton from '../../../components/button/VisButton.vue'
import Icon from '../../../components/icons/Icon.vue'

const route = useRoute()
const router = useRouter()

const title = computed(() => (typeof route.meta.title === 'string' ? route.meta.title : '业务页面'))
const description = computed(() =>
  typeof route.meta.description === 'string' ? route.meta.description : '当前业务页面的内容区域。',
)

const records = computed(() => [
  { name: `${title.value}示例 A`, owner: '陈晓', updatedAt: '5 分钟前', status: '进行中', tone: 'brand' as const },
  { name: `${title.value}示例 B`, owner: '李文', updatedAt: '今天 10:24', status: '待验证', tone: 'warning' as const },
  { name: `${title.value}示例 C`, owner: '王可', updatedAt: '昨天 18:40', status: '已完成', tone: 'success' as const },
])

function returnToOverview(): void {
  void router.push({
    name: 'project-overview',
    params: { projectKey: route.params.projectKey },
  })
}
</script>

<template>
  <div class="application-page-content section-page">
    <section class="section-summary">
      <span class="section-summary__icon">
        <Icon name="file-02" :size="24" decorative />
      </span>
      <div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <VisButton variant="secondary" size="sm" @click="returnToOverview">返回概览</VisButton>
    </section>

    <section class="section-table" :aria-label="`${title}列表`">
      <div class="section-table__toolbar">
        <div>
          <h3>{{ title }}列表</h3>
          <p>该页面使用独立路由，可直接访问并支持浏览器前进、后退。</p>
        </div>
        <VisButton size="sm" prefix icon-name="plus">新建</VisButton>
      </div>
      <div class="section-table__row section-table__header" role="row">
        <span>名称</span>
        <span>负责人</span>
        <span>更新时间</span>
        <span>状态</span>
      </div>
      <div v-for="record in records" :key="record.name" class="section-table__row" role="row">
        <strong>{{ record.name }}</strong>
        <span>{{ record.owner }}</span>
        <span>{{ record.updatedAt }}</span>
        <VisBadge type="text" :color-type="record.tone" :label="record.status" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.section-page {
  display: grid;
  gap: var(--space-16);
}

.section-summary,
.section-table {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-bg-canvas);
  box-shadow: var(--shadow-default-xs);
}

.section-summary {
  min-block-size: 104px;
  padding: var(--space-20);
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.section-summary__icon {
  inline-size: var(--space-48);
  block-size: var(--space-48);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-brand-primary);
  background: var(--color-fg-brand-subtle);
  flex: 0 0 auto;
}

.section-summary > div {
  min-inline-size: 0;
  flex: 1 1 auto;
}

.section-summary h2,
.section-table h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 600;
  line-height: var(--font-text-lg-line-height);
}

.section-summary p,
.section-table__toolbar p {
  margin: var(--space-4) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.section-table {
  overflow: hidden;
}

.section-table__toolbar {
  min-block-size: 76px;
  padding: var(--space-16) var(--space-20);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-16);
}

.section-table__row {
  min-block-size: 52px;
  border-block-start: 1px solid var(--color-border-default);
  padding-inline: var(--space-20);
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 100px 120px 88px;
  align-items: center;
  gap: var(--space-16);
  color: var(--color-text-secondary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.section-table__row:not(.section-table__header):hover {
  background: var(--color-bg-secondary);
}

.section-table__row strong {
  color: var(--color-text-primary);
  font-weight: 500;
}

.section-table__header {
  min-block-size: var(--space-40);
  color: var(--color-text-tertiary);
  background: var(--color-bg-tertiary);
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 720px) {
  .section-summary {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .section-table__row {
    grid-template-columns: minmax(150px, 1fr) 88px;
  }

  .section-table__row > :nth-child(2),
  .section-table__row > :nth-child(3) {
    display: none;
  }
}
</style>
