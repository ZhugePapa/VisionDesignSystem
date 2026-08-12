<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { VisAvatar, type VisAvatarImageVariant } from '../../../components/avatar'
import { VisBadge } from '../../../components/badge'
import type { VisBreadcrumbItem } from '../../../components/breadcrumb'
import VisButton from '../../../components/button/VisButton.vue'
import { VisCard } from '../../../components/card'
import { VisDivider } from '../../../components/divider'
import { VisFeaturedIcon } from '../../../components/featured-icon'
import { VisInputSearchBox } from '../../../components/input-search-box'
import { VisLink } from '../../../components/link'
import { VisPageHeader } from '../../../components/page-header'
import type { VisTabsItem, VisTabsValue } from '../../../components/tabs'
import { VisTooltip } from '../../../components/tooltip'
import { defaultProjectKey, projects } from '../navigation'
import { createRepositoryTabs } from '../repository-tabs'
import {
  findRepositoryByKey,
  type DemoCommit,
  type DemoTag,
} from '../repositories'
import RepositoryCreateRefModal from './RepositoryCreateRefModal.vue'

interface TagListItem {
  tag: DemoTag
  commit?: DemoCommit
}

const route = useRoute()
const router = useRouter()

const repository = computed(() => findRepositoryByKey(String(route.params.repositoryId)))
const repositoryData = computed(() => repository.value?.data)
const searchValue = ref('')
const expandedTagNames = ref<Set<string>>(new Set())
const createTagModalOpen = ref(false)

const currentProject = computed(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})

const repositoryTabs = computed<VisTabsItem[]>(() =>
  createRepositoryTabs(repositoryData.value?.mergeRequests.length ?? 0),
)

const breadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目' },
  { label: currentProject.value.label },
  { label: '代码仓库', active: true },
])

const tagItems = computed<TagListItem[]>(() => {
  const data = repositoryData.value
  if (!data) return []
  const query = searchValue.value.trim().toLocaleLowerCase()

  return data.tags
    .map((tag) => ({
      tag,
      commit: data.commits.find((commit) => commit.id === tag.commitId),
    }))
    .filter(({ tag, commit }) => !query
      || `${tag.name} ${tag.commitId} ${commit?.message ?? ''} ${commit?.author ?? ''}`
        .toLocaleLowerCase()
        .includes(query))
})

const avatarVariantByAuthor: Record<string, VisAvatarImageVariant> = {
  张大山: '09',
  李思雨: '06',
  王建国: '03',
  孙工: '05',
  周工程师: '02',
}

function avatarVariant(author: string): VisAvatarImageVariant {
  return avatarVariantByAuthor[author] ?? '09'
}

function toggleTagDescription(tagName: string): void {
  const next = new Set(expandedTagNames.value)
  if (next.has(tagName)) next.delete(tagName)
  else next.add(tagName)
  expandedTagNames.value = next
}

function isTagExpanded(tagName: string): boolean {
  return expandedTagNames.value.has(tagName)
}

function openRepositoryDetail(tab: VisTabsValue = 'code'): void {
  if (tab === 'merge-requests') {
    void router.push({
      name: 'repository-merge-requests',
      params: {
        projectKey: String(route.params.projectKey ?? defaultProjectKey),
        repositoryId: String(route.params.repositoryId),
      },
    })
    return
  }
  void router.push({
    name: 'repository-detail',
    params: {
      projectKey: String(route.params.projectKey ?? defaultProjectKey),
      repositoryId: String(route.params.repositoryId),
    },
    query: tab !== 'code' ? { tab: String(tab) } : undefined,
  })
}

function syncDocumentTitle(): void {
  document.title = `标签 - ${repository.value?.name ?? '代码仓库'} - Vision Application`
}

watch(repository, () => {
  searchValue.value = ''
  expandedTagNames.value = new Set()
  syncDocumentTitle()
})
onMounted(syncDocumentTitle)
</script>

<template>
  <section class="repository-tags" :aria-label="`${repository?.name ?? '代码仓库'}标签列表`">
    <VisPageHeader
      class="repository-tags__header"
      :title="repository?.name ?? '代码仓库'"
      :description="repository?.description ?? ''"
      :breadcrumb-items="breadcrumbItems"
      :tabs="repositoryTabs"
      active-tab="code"
      @tab-change="openRepositoryDetail"
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

    <main class="repository-tags__scroll">
      <div class="repository-tags__content">
        <h1>标签</h1>

        <div class="repository-tags__toolbar" aria-label="标签操作">
          <VisInputSearchBox
            v-model="searchValue"
            class="repository-tags__search"
            placeholder="请输入标题/编号/描述关键字"
            aria-label="搜索标签"
          />
          <VisButton
            variant="primary"
            size="md"
            prefix
            icon-name="plus"
            label="新建标签"
            @click="createTagModalOpen = true"
          >
            新建标签
          </VisButton>
        </div>

        <div v-if="tagItems.length" class="repository-tags__list">
          <VisCard
            v-for="item in tagItems"
            :key="item.tag.name"
            class="tag-item"
            :show-action="false"
            body-class="tag-item__body"
          >
            <article class="tag-item__content">
              <div class="tag-item__top">
                <VisLink class="tag-item__title" :label="item.tag.name">
                  {{ item.tag.name }}
                </VisLink>
                <VisButton
                  v-if="item.tag.description"
                  variant="text"
                  size="sm"
                  icon-only
                  icon-name="annotation-dots"
                  :label="`${isTagExpanded(item.tag.name) ? '收起' : '展开'}${item.tag.name}的标签描述`"
                  :aria-expanded="isTagExpanded(item.tag.name)"
                  @click="toggleTagDescription(item.tag.name)"
                />
                <span class="tag-item__spacer" aria-hidden="true" />
                <VisBadge
                  v-if="item.commit?.verified"
                  class="tag-item__verified"
                  type="default"
                  color="aqua"
                  label="已验证"
                />
                <VisButton
                  variant="text"
                  size="sm"
                  icon-only
                  icon-name="dots-horizontal"
                  :label="`${item.tag.name}更多操作（演示）`"
                />
              </div>

              <p v-if="isTagExpanded(item.tag.name)" class="tag-item__description">
                {{ item.tag.description }}
              </p>

              <div class="tag-item__meta">
                <span v-if="item.commit" class="tag-item__author">
                  <VisAvatar
                    size="xs"
                    type="image"
                    :image-variant="avatarVariant(item.commit.author)"
                    :image-alt="item.commit.author"
                  />
                  <span>{{ item.commit.author }}</span>
                </span>
                <span>创建于</span>
                <time :datetime="item.tag.createdAt.replace(' ', 'T')">{{ item.tag.createdAt }}</time>
                <VisDivider class="tag-item__divider" type="vertical" length="12px" />
                <VisTooltip
                  v-if="item.commit"
                  class="tag-item__commit-tooltip"
                  :content="item.commit.message"
                  position="top"
                >
                  <VisLink prefix icon-name="git-commit" :label="`提交 ${item.tag.commitId}`">
                    {{ item.tag.commitId }}
                  </VisLink>
                </VisTooltip>
                <VisLink v-else prefix icon-name="git-commit" :label="`提交 ${item.tag.commitId}`">
                  {{ item.tag.commitId }}
                </VisLink>
                <VisDivider class="tag-item__divider" type="vertical" length="12px" />
                <VisLink type="subtle" prefix icon-name="download-02" :label="`下载 ${item.tag.name} Zip（演示）`">
                  Zip
                </VisLink>
              </div>
            </article>
          </VisCard>
        </div>

        <div v-else class="repository-tags__empty">
          <VisFeaturedIcon size="lg" type="modern" color="grey" icon="tag-01" decorative />
          <p>未找到符合条件的标签</p>
          <span>请尝试调整搜索关键字</span>
        </div>
      </div>
    </main>

    <RepositoryCreateRefModal
      v-model="createTagModalOpen"
      type="tag"
      :branches="repositoryData?.branches ?? []"
    />
  </section>
</template>

<style scoped>
.repository-tags {
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

.repository-tags__header {
  flex: 0 0 auto;
  background: var(--color-bg-canvas);
}

.repository-tags__scroll {
  min-block-size: 0;
  flex: 1 1 0;
  overflow-y: auto;
  background: var(--color-bg-canvas);
}

.repository-tags__content {
  box-sizing: border-box;
  inline-size: min(100%, 1200px);
  margin-inline: auto;
  padding: var(--space-16) 0 var(--space-32);
}

.repository-tags__content h1 {
  margin: 0 0 var(--space-12);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
}

.repository-tags__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
}

.repository-tags__search {
  inline-size: 240px;
}

.repository-tags__list {
  margin-block-start: var(--space-16);
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
}

.tag-item {
  border: 0;
  border-radius: 0;
}

.tag-item + .tag-item {
  border-block-start: 1px solid var(--color-border-default);
}

.tag-item__content {
  box-sizing: border-box;
  min-block-size: 82px;
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.tag-item__top,
.tag-item__meta,
.tag-item__author {
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.tag-item__top {
  gap: var(--space-8);
}

.tag-item__title {
  min-inline-size: 0;
  overflow: hidden;
  --el-link-font-size: var(--font-text-lg-size);
  --el-link-font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-item__title :deep(.vis-link__label) {
  line-height: var(--font-text-lg-line-height);
}

.tag-item__spacer {
  min-inline-size: var(--space-8);
  flex: 1 1 0;
}

.tag-item__verified {
  block-size: var(--space-24) !important;
  flex: 0 0 auto;
}

.tag-item__description {
  max-inline-size: 724px;
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  white-space: pre-line;
}

.tag-item__meta {
  gap: var(--space-12);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.tag-item__author {
  gap: var(--space-6);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.tag-item__meta time {
  color: var(--color-text-primary);
}

.tag-item__meta :deep(.vis-link) {
  --el-link-font-size: var(--font-text-md-size);

  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.tag-item__meta :deep(.vis-link__label) {
  line-height: var(--font-text-md-line-height);
}

.tag-item__commit-tooltip {
  flex: 0 0 auto;
}

.tag-item__divider {
  flex: 0 0 auto;
}

.repository-tags__empty {
  margin-block-start: var(--space-56);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  text-align: center;
}

.repository-tags__empty p,
.repository-tags__empty span {
  margin: 0;
}

.repository-tags__empty p {
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
}

.repository-tags__empty span {
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

@media (max-width: 1280px) {
  .repository-tags__content {
    inline-size: auto;
    margin-inline: var(--space-24);
  }
}

@media (max-width: 760px) {
  .repository-tags__content {
    margin-inline: var(--space-16);
  }

  .repository-tags__toolbar,
  .tag-item__top {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .repository-tags__search {
    inline-size: 100%;
  }

  .tag-item__spacer {
    display: none;
  }

  .tag-item__meta {
    flex-wrap: wrap;
  }
}
</style>
