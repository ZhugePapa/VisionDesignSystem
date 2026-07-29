<script setup lang="ts">
import { ref } from 'vue'

import { VisAvatarLabel } from '../../../components/avatar'
import { VisBadge } from '../../../components/badge'
import VisButton from '../../../components/button/VisButton.vue'
import { VisCard } from '../../../components/card'
import { VisDivider } from '../../../components/divider'
import { VisDropdown, type VisDropdownEntry } from '../../../components/dropdown'
import { VisFeaturedIcon, type VisFeaturedIconColor } from '../../../components/featured-icon'
import type { IconName } from '../../../components/icons/generated/registry.generated'
import VisInputSearchBox from '../../../components/input-search-box/VisInputSearchBox.vue'
import { VisTag } from '../../../components/tag'

interface EnvironmentCard {
  id: string
  name: string
  description: string
  icon: IconName
  iconColor: VisFeaturedIconColor
  status: string
  statusTone: 'brand' | 'warning' | 'danger'
  createdAt: string
  version: string
  artifact: string
}

const openMenuId = ref<string | null>(null)

const environments: EnvironmentCard[] = [
  {
    id: 'development',
    name: '开发环境',
    description: '用于开发人员日常联调和功能验证，代码合并后可自动部署。',
    icon: 'code-02',
    iconColor: 'warning',
    status: '运行中',
    statusTone: 'brand',
    createdAt: '07月23日 16:45:23',
    version: 'v2.8.0-dev.l26',
    artifact: 'registry.example.com/devops/repository-service:v2.8.0-dev.l26',
  },
  {
    id: 'testing',
    name: '测试环境',
    description: '用于系统测试、接口测试和版本发布前的质量验证。',
    icon: 'beaker-01',
    iconColor: 'success',
    status: '部署中',
    statusTone: 'warning',
    createdAt: '07月23日 16:45:23',
    version: 'v2.8.0-rc.3',
    artifact: 'repository-service-2.8.0-rc.3.jar',
  },
  {
    id: 'production',
    name: '生产环境',
    description: '面向正式用户提供稳定服务，发布操作需要经过审批和验证。',
    icon: 'cube-01',
    iconColor: 'brand',
    status: '运行异常',
    statusTone: 'danger',
    createdAt: '07月23日 16:45:23',
    version: 'v2.7.6',
    artifact: 'registry.example.com/devops/repository-service:v2.7.6',
  },
]

const environmentMenuItems: VisDropdownEntry[] = [
  { type: 'item', itemType: 'icon', iconName: 'play', label: '部署' },
  { type: 'item', itemType: 'icon', iconName: 'clock', label: '历史记录' },
  { type: 'divider' },
  { type: 'item', itemType: 'icon', iconName: 'trash-01', label: '删除环境' },
]

function setMenuOpen(environmentId: string, value: boolean): void {
  openMenuId.value = value ? environmentId : null
}
</script>

<template>
  <section class="environment-planning" aria-label="环境规划">
    <div class="environment-toolbar" aria-label="环境筛选">
      <VisInputSearchBox
        class="environment-toolbar__search"
        placeholder="请输入标题/编号/描述关键字"
        aria-label="搜索环境"
      />
      <VisButton variant="secondary" size="md" suffix suffix-icon-name="chevron-down">
        类型
      </VisButton>
      <VisButton variant="secondary" size="md" suffix suffix-icon-name="chevron-down">
        创建人
      </VisButton>
      <span class="environment-toolbar__spacer" />
      <VisButton size="md" prefix icon-name="plus">新建环境</VisButton>
    </div>

    <div class="environment-card-grid">
      <VisCard
        v-for="environment in environments"
        :key="environment.id"
        class="environment-card"
        :class="{ 'is-menu-open': openMenuId === environment.id }"
        :state="openMenuId === environment.id ? 'hover' : 'default'"
        :show-action="false"
      >
        <VisDropdown
          class="environment-card__menu"
          :class="{ 'is-open': openMenuId === environment.id }"
          :items="environmentMenuItems"
          :open="openMenuId === environment.id"
          @update:open="setMenuOpen(environment.id, $event)"
          @select="openMenuId = null"
        >
          <template #trigger="{ open, toggle }">
            <VisButton
              variant="text"
              size="md"
              icon-only
              icon-name="dots-horizontal"
              :state="open ? 'hover' : 'default'"
              :label="`${environment.name}更多操作`"
              @click.stop="toggle"
            />
          </template>
        </VisDropdown>

        <div class="environment-card__summary">
          <VisFeaturedIcon
            size="lg"
            type="solid-square"
            :color="environment.iconColor"
            :icon="environment.icon"
          />
          <div>
            <h2>{{ environment.name }}</h2>
            <p>{{ environment.description }}</p>
          </div>
        </div>

        <VisDivider class="environment-card__divider" />

        <dl class="environment-card__details">
          <div>
            <dt>环境类型</dt>
            <dd><VisTag label="标签" /></dd>
          </div>
          <div>
            <dt>环境状态</dt>
            <dd>
              <VisBadge
                type="text"
                :color-type="environment.statusTone"
                :label="environment.status"
              />
            </dd>
          </div>
          <div>
            <dt>创建人</dt>
            <dd>
              <VisAvatarLabel
                size="xs"
                :addition="false"
                title="张大山"
                avatar-image-variant="09"
              />
            </dd>
          </div>
          <div>
            <dt>创建时间</dt>
            <dd>{{ environment.createdAt }}</dd>
          </div>
          <div>
            <dt>当前版本</dt>
            <dd>{{ environment.version }}</dd>
          </div>
          <div>
            <dt>当前部署制品</dt>
            <dd class="environment-card__artifact">
              <VisBadge type="text" color-type="grey" :label="environment.artifact" />
            </dd>
          </div>
        </dl>
      </VisCard>
    </div>
  </section>
</template>

<style scoped>
.environment-planning {
  inline-size: 100%;
  min-block-size: 100%;
  padding: var(--space-20);
  padding-block-start: 21px;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
}

.environment-toolbar {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.environment-toolbar__search {
  flex: 0 0 240px;
}

.environment-toolbar__spacer {
  min-inline-size: var(--space-16);
  flex: 1 1 0;
}

.environment-card-grid {
  margin-block-start: var(--space-16);
  display: grid;
  grid-template-columns: repeat(3, 317px);
  align-items: start;
  gap: var(--space-20);
}

.environment-card {
  box-sizing: border-box;
  block-size: 377px;
  min-block-size: 0;
  overflow: visible;
}

.environment-card :deep(.vis-card__body) {
  padding: 19px;
  overflow: visible;
}

.environment-card__menu {
  position: absolute;
  z-index: 4;
  inset-block-start: 19px;
  inset-inline-end: 19px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 120ms ease,
    visibility 120ms ease;
}

.environment-card:is(:hover, :focus-within) .environment-card__menu,
.environment-card__menu.is-open {
  opacity: 1;
  visibility: visible;
}

.environment-card__menu :deep(.vis-dropdown) {
  inset-block-start: calc(var(--space-32) + var(--space-4));
  inset-inline: auto 0;
  inline-size: var(--space-192);
}

.environment-card__summary {
  display: grid;
  gap: var(--space-12);
}

.environment-card__summary > div {
  min-inline-size: 0;
  display: grid;
  gap: var(--space-4);
}

.environment-card__summary h2,
.environment-card__summary p {
  margin: 0;
}

.environment-card__summary h2 {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h5-size);
  font-weight: 600;
  line-height: var(--font-heading-h5-line-height);
}

.environment-card__summary p {
  min-block-size: var(--space-40);
  color: var(--color-text-secondary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.environment-card__divider {
  margin-block: var(--space-16);
}

.environment-card__details {
  margin: 0;
  display: grid;
  gap: var(--space-8);
}

.environment-card__details > div {
  min-inline-size: 0;
  block-size: var(--space-24);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-24);
}

.environment-card__details dt,
.environment-card__details dd {
  margin: 0;
  min-inline-size: 0;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.environment-card__details dt {
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.environment-card__details dd {
  overflow: hidden;
  color: var(--color-text-primary);
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.environment-card__artifact {
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
}

.environment-card__artifact :deep(.vis-badge) {
  max-inline-size: 100%;
}

.environment-card__artifact :deep(.vis-badge__text) {
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1320px) {
  .environment-card-grid {
    grid-template-columns: repeat(2, minmax(280px, 317px));
  }
}

@media (max-width: 900px) {
  .environment-toolbar {
    flex-wrap: wrap;
  }

  .environment-toolbar__spacer {
    display: none;
  }

  .environment-card-grid {
    grid-template-columns: minmax(280px, 317px);
  }
}
</style>
