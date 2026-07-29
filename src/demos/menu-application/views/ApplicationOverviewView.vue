<script setup lang="ts">
import { VisAvatarLabel } from '../../../components/avatar'
import { VisBadge } from '../../../components/badge'
import { VisCard } from '../../../components/card'
import { VisProjectLogo } from '../../../components/menu'
</script>

<template>
  <section class="application-overview" aria-label="应用概览">
    <VisCard
      class="application-overview__card"
      :interactive="false"
      :show-action="false"
    >
      <h2>基本信息</h2>

      <dl class="application-information">
        <div class="application-information__row">
          <dt>名称</dt>
          <dd>Conan_demo</dd>
        </div>
        <div class="application-information__row">
          <dt>项目</dt>
          <dd class="application-information__inline">
            <VisProjectLogo variant="logo_003" :size="20" />
            <span>飞机照明系统</span>
          </dd>
        </div>
        <div class="application-information__row">
          <dt>负责人</dt>
          <dd>
            <VisAvatarLabel
              size="xs"
              title="张大山"
              subtitle="zhangdashan"
              avatar-image-variant="09"
            />
          </dd>
        </div>
        <div class="application-information__row">
          <dt>状态</dt>
          <dd>
            <VisBadge type="status" color-type="brand" label="运行中" />
          </dd>
        </div>
        <div class="application-information__row">
          <dt>描述</dt>
          <dd>提供代码托管、分支管理、合并请求及 Webhook 能力。</dd>
        </div>
        <div class="application-information__row">
          <dt>创建时间</dt>
          <dd>2026/06/09 19:20:34</dd>
        </div>
        <div class="application-information__row">
          <dt>更新时间</dt>
          <dd>2026/06/09 19:20:34</dd>
        </div>
      </dl>
    </VisCard>
  </section>
</template>

<style scoped>
.application-overview {
  inline-size: 100%;
  min-block-size: 100%;
  padding: var(--space-20);
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
}

.application-overview__card {
  --el-card-border-radius: var(--radius-md);

  min-block-size: 330px;
}

.application-overview__card :deep(.vis-card__body) {
  padding: 19px;
}

.application-overview h2 {
  margin: 0 0 var(--space-16);
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-text-lg-size);
  font-weight: 600;
  line-height: var(--font-text-lg-line-height);
}

.application-information {
  margin: 0;
  display: grid;
  gap: var(--space-8);
}

.application-information__row {
  min-block-size: var(--space-24);
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-8);
}

.application-information dt,
.application-information dd {
  margin: 0;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.application-information dt {
  color: var(--color-text-tertiary);
}

.application-information dd {
  min-inline-size: 0;
  color: var(--color-text-primary);
}

.application-information__inline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}
</style>
