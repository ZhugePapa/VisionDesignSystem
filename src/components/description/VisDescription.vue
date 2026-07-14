<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import VisAlert from '../alert/VisAlert.vue'
import type { VisDescriptionProps } from './description.types'
import VisDescriptionTitle from './VisDescriptionTitle.vue'

defineOptions({ name: 'VisDescription' })

const props = withDefaults(defineProps<VisDescriptionProps>(), {
  border: false,
  direction: 'horizontal',
  columns: 3,
  title: true,
  titleText: '基本信息',
  foldable: false,
  collapsed: undefined,
  alert: false,
  alertText: '信息提示',
  labelWidth: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  toggle: [value: boolean]
}>()

const internalCollapsed = ref(false)
const resolvedCollapsed = computed(() => props.collapsed ?? internalCollapsed.value)
const resolvedColumns = computed(() => Math.max(1, Math.floor(props.columns)))
const descriptionStyle = computed(() => {
  const style: Record<string, string> = {
    '--vis-description-columns': String(resolvedColumns.value),
  }

  if (props.labelWidth !== undefined) {
    style['--vis-description-label-width'] =
      typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
  }

  return style
})

function toggleCollapsed(): void {
  const value = !resolvedCollapsed.value
  internalCollapsed.value = value
  emit('update:collapsed', value)
  emit('toggle', value)
}

watch(
  () => props.collapsed,
  (value) => {
    if (value !== undefined) internalCollapsed.value = value
  },
  { immediate: true },
)
</script>

<template>
  <section
    class="vis-description"
    :class="[`direction-${direction}`, { 'is-bordered': border, 'is-collapsed': resolvedCollapsed }]"
    :style="descriptionStyle"
    :aria-label="ariaLabel ?? titleText"
  >
    <VisDescriptionTitle
      v-if="title"
      :title="titleText"
      :foldable="foldable"
      :collapsed="resolvedCollapsed"
      @toggle="toggleCollapsed"
    >
      <template #default><slot name="title">{{ titleText }}</slot></template>
      <template #extra><slot name="extra" /></template>
    </VisDescriptionTitle>

    <template v-if="!resolvedCollapsed">
      <slot name="alert">
        <VisAlert v-if="alert" class="vis-description__alert" type="primary" :title="alertText" />
      </slot>

      <div class="vis-description__content">
        <slot />
      </div>
    </template>
  </section>
</template>

<style scoped>
.vis-description {
  --vis-description-label-width: 84px;

  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-12);
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
}

.vis-description > :deep(.vis-description-title) {
  min-block-size: var(--space-32);
}

.vis-description__alert {
  max-inline-size: none;
}

.vis-description__content {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  border-radius: var(--radius-md);
  padding-inline: var(--space-16);
  display: grid;
  grid-template-columns: repeat(var(--vis-description-columns), minmax(0, 1fr));
  column-gap: var(--space-16);
}

.vis-description.is-bordered .vis-description__content {
  gap: 1px;
  padding: 1px;
  background: var(--color-border-default);
}

.vis-description.is-bordered {
  --vis-description-label-width: 120px;
}

.vis-description.direction-vertical :deep(.vis-description-item) {
  min-block-size: 88px;
  padding-block: var(--space-16);
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: var(--space-8);
}

.vis-description.direction-vertical :deep(.vis-description-item__label) {
  inline-size: 100%;
  flex-basis: auto;
}

.vis-description.direction-vertical :deep(.vis-description-item__value) {
  inline-size: 100%;
  flex: 0 0 var(--space-24);
}

.vis-description.is-bordered :deep(.vis-description-item) {
  gap: 1px;
  background: var(--color-border-default);
}

.vis-description.is-bordered :deep(.vis-description-item__label),
.vis-description.is-bordered :deep(.vis-description-item__value) {
  block-size: 100%;
  padding-inline: var(--space-12);
}

.vis-description.is-bordered :deep(.vis-description-item__label) {
  background: var(--color-bg-secondary);
}

.vis-description.is-bordered :deep(.vis-description-item__value) {
  background: var(--color-bg-surface);
}

.vis-description.is-bordered.direction-vertical :deep(.vis-description-item) {
  min-block-size: 96px;
  padding-block: 0;
}

.vis-description.is-bordered.direction-vertical :deep(.vis-description-item__label),
.vis-description.is-bordered.direction-vertical :deep(.vis-description-item__value) {
  min-block-size: 0;
  flex: 1 1 0;
}

@media (max-width: 720px) {
  .vis-description__content {
    grid-template-columns: minmax(0, 1fr);
  }

  .vis-description :deep(.vis-description-item) {
    grid-column: 1;
  }
}
</style>
