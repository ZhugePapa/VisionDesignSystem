<script setup lang="ts">
import { computed, ref } from 'vue'

import VisBreadcrumb from '../breadcrumb/VisBreadcrumb.vue'
import type { VisBreadcrumbItem } from '../breadcrumb/breadcrumb.types'
import VisButton from '../button/VisButton.vue'
import VisFeaturedIcon from '../featured-icon/VisFeaturedIcon.vue'
import VisTabs from '../tabs/VisTabs.vue'
import type { VisTabsItem, VisTabsValue } from '../tabs/tabs.types'
import VisTag from '../tag/VisTag.vue'
import type {
  VisPageHeaderAction,
  VisPageHeaderActionPayload,
  VisPageHeaderProps,
} from './page-header.types'

const props = withDefaults(defineProps<VisPageHeaderProps>(), {
  title: '这里是页面的标题',
  description: undefined,
  descriptionText: '这里是描述',
  showDescription: undefined,
  breadcrumbs: undefined,
  breadcrumbItems: () => [
    { label: '项目', href: '#' },
    { label: '飞机照明系统', href: '#' },
    { label: '概览', active: true },
  ],
  showBreadcrumb: undefined,
  breadcrumb: true,
  parentLink: false,
  tabs: false,
  tabItems: () => [
    { value: 'tab-1', label: '标签' },
    { value: 'tab-2', label: '标签' },
    { value: 'tab-3', label: '标签' },
    { value: 'tab-4', label: '标签' },
  ],
  activeTab: undefined,
  icon: true,
  iconName: 'dataflow-04',
  tag: undefined,
  headerSuffix: false,
  tagLabel: '标签',
  tagIconName: 'archive',
  actions: false,
  secondaryActionLabel: '按钮',
  primaryActionLabel: '按钮',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  back: [event: MouseEvent]
  secondaryAction: [event: MouseEvent]
  primaryAction: [event: MouseEvent]
  action: [payload: VisPageHeaderActionPayload]
  breadcrumbClick: [item: VisBreadcrumbItem, index: number]
  'update:activeTab': [value: VisTabsValue]
  tabChange: [value: VisTabsValue, item: VisTabsItem]
}>()

const internalActiveTab = ref<VisTabsValue>()

const resolvedDescription = computed(() =>
  typeof props.description === 'string' ? props.description : props.descriptionText,
)
const hasDescription = computed(() =>
  props.showDescription ?? (typeof props.description === 'boolean' ? props.description : true),
)
const resolvedBreadcrumbs = computed(() => props.breadcrumbs ?? props.breadcrumbItems)
const hasBreadcrumb = computed(() => {
  if (props.showBreadcrumb !== undefined) return props.showBreadcrumb
  if (props.breadcrumb) return true
  return props.breadcrumbs !== undefined
})
const resolvedTabs = computed(() => (Array.isArray(props.tabs) ? props.tabs : props.tabItems))
const hasTabs = computed(() => Array.isArray(props.tabs) || props.tabs === true)
const selectedTab = computed(
  () => props.activeTab ?? internalActiveTab.value ?? resolvedTabs.value[0]?.value,
)
const resolvedIconName = computed(() =>
  typeof props.icon === 'string' ? props.icon : props.iconName,
)
const hasIcon = computed(() => props.icon === true || typeof props.icon === 'string')
const featuredIconSize = computed(() =>
  hasDescription.value && !props.parentLink ? 'xl' : 'md',
)
const resolvedTag = computed(() => {
  if (props.tag === false) return undefined
  if (props.tag) return props.tag
  if (!props.headerSuffix) return undefined
  return {
    type: 'icon' as const,
    label: props.tagLabel,
    iconName: props.tagIconName,
  }
})
const resolvedActions = computed<VisPageHeaderAction[]>(() => {
  if (Array.isArray(props.actions)) return props.actions
  if (!props.actions) return []
  return [
    { key: 'secondary', label: props.secondaryActionLabel, variant: 'secondary' },
    { key: 'primary', label: props.primaryActionLabel, variant: 'primary' },
  ]
})

function handleTabUpdate(value: VisTabsValue): void {
  if (props.activeTab === undefined) internalActiveTab.value = value
  emit('update:activeTab', value)
}

function handleTabChange(value: VisTabsValue, item: VisTabsItem): void {
  emit('tabChange', value, item)
}

function handleBreadcrumbClick(item: VisBreadcrumbItem, index: number): void {
  emit('breadcrumbClick', item, index)
}

function handleAction(action: VisPageHeaderAction, event: MouseEvent): void {
  emit('action', { key: action.key, action, event })
  if (action.key === 'secondary') emit('secondaryAction', event)
  if (action.key === 'primary') emit('primaryAction', event)
}
</script>

<template>
  <section
    class="vis-page-header"
    :class="{
      'has-breadcrumb': hasBreadcrumb,
      'has-parent-link': parentLink,
      'has-tabs': hasTabs,
      'has-icon': hasIcon,
      'has-description': hasDescription,
    }"
    :aria-label="ariaLabel"
  >
    <div v-if="hasBreadcrumb" class="vis-page-header__navigation">
      <slot name="breadcrumb" :items="resolvedBreadcrumbs">
        <VisBreadcrumb
          type="link"
          size="md"
          separator="slash"
          :items="resolvedBreadcrumbs"
          @click="handleBreadcrumbClick"
        />
      </slot>
    </div>

    <div class="vis-page-header__content">
      <slot name="back">
        <VisButton
          v-if="parentLink"
          class="vis-page-header__back"
          variant="text"
          size="md"
          icon-only
          icon-name="arrow-left"
          label="返回上级页面"
          @click="emit('back', $event)"
        />
      </slot>

      <slot name="icon" :icon-name="resolvedIconName">
        <VisFeaturedIcon
          v-if="hasIcon"
          :size="featuredIconSize"
          color="grey"
          type="modern"
          :icon="resolvedIconName"
        />
      </slot>

      <div class="vis-page-header__body">
        <div class="vis-page-header__main">
          <div class="vis-page-header__heading">
            <h1 class="vis-page-header__title">
              <slot name="title">{{ title }}</slot>
            </h1>

            <slot name="suffix" :tag="resolvedTag">
              <VisTag v-if="resolvedTag" v-bind="resolvedTag" />
            </slot>
          </div>

          <span class="vis-page-header__spacer" aria-hidden="true" />

          <div
            v-if="$slots.actions || resolvedActions.length"
            class="vis-page-header__actions"
          >
            <slot name="actions" :actions="resolvedActions">
              <VisButton
                v-for="action in resolvedActions"
                :key="action.key"
                :variant="action.variant ?? 'secondary'"
                size="md"
                :label="action.label"
                :icon-name="action.iconName"
                :prefix="action.prefix"
                :suffix="action.suffix"
                :disabled="action.disabled"
                :loading="action.loading"
                @click="handleAction(action, $event)"
              />
            </slot>
          </div>
        </div>

        <p v-if="hasDescription" class="vis-page-header__description">
          <slot name="description">{{ resolvedDescription }}</slot>
        </p>
      </div>
    </div>

    <div v-if="hasTabs" class="vis-page-header__tabs">
      <slot name="tabs" :items="resolvedTabs" :active-tab="selectedTab">
        <VisTabs
          :items="resolvedTabs"
          :model-value="selectedTab"
          aria-label="页头标签页"
          @update:model-value="handleTabUpdate"
          @change="handleTabChange"
        />
      </slot>
    </div>
  </section>
</template>

<style scoped>
.vis-page-header {
  box-sizing: border-box;
  inline-size: 100%;
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-8);
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  font-family: var(--font-family-sans);
}

.vis-page-header.has-tabs {
  padding-block-end: 0;
  box-shadow: inset 0 -1px 0 var(--color-border-default);
}

.vis-page-header__navigation {
  min-inline-size: 0;
  block-size: var(--font-text-md-line-height);
  display: flex;
  align-items: center;
}

.vis-page-header__content {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: 0;
}

.vis-page-header.has-parent-link .vis-page-header__content {
  align-items: flex-start;
  gap: var(--space-8);
}

.vis-page-header.has-icon:not(.has-parent-link) .vis-page-header__content {
  gap: var(--space-12);
}

.vis-page-header.has-icon:not(.has-parent-link):not(.has-description) .vis-page-header__content {
  gap: var(--space-8);
}

.vis-page-header__back {
  flex: 0 0 auto;
}

.vis-page-header__body {
  min-inline-size: 0;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 0;
}

.vis-page-header__main {
  min-inline-size: 0;
  block-size: var(--space-32);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.vis-page-header__heading {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.vis-page-header__title {
  min-inline-size: 0;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h4-size);
  font-weight: 600;
  line-height: var(--font-heading-h4-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-page-header.has-parent-link .vis-page-header__title {
  font-size: var(--font-heading-h5-size);
  line-height: var(--font-heading-h5-line-height);
}

.vis-page-header__spacer {
  min-inline-size: 0;
  flex: 1 1 auto;
}

.vis-page-header__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-page-header__description {
  block-size: var(--font-text-md-line-height);
  max-inline-size: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-page-header__tabs {
  min-inline-size: 0;
  display: flex;
}

.vis-page-header__tabs :deep(.vis-tabs.align-horizontal) {
  gap: var(--space-16);
}

@media (max-width: 680px) {
  .vis-page-header__content {
    align-items: flex-start;
  }

  .vis-page-header__main {
    flex-wrap: wrap;
  }

  .vis-page-header__spacer {
    flex-basis: 100%;
    block-size: 0;
  }
}
</style>
