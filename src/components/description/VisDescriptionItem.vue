<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../icons/Icon.vue'
import VisTag from '../tag/VisTag.vue'
import type { VisDescriptionItemProps, VisDescriptionTag } from './description.types'

defineOptions({ name: 'VisDescriptionItem' })

const props = withDefaults(defineProps<VisDescriptionItemProps>(), {
  label: '字段名',
  value: '字段值',
  type: 'text',
  tags: undefined,
  border: undefined,
  direction: undefined,
  icon: false,
  iconName: 'user-01',
  span: 1,
  labelWidth: undefined,
})

const defaultTags: VisDescriptionTag[] = [
  { label: '标签', iconName: 'archive' },
  { label: '标签', iconName: 'archive' },
  { label: '+2', iconName: 'archive' },
]

const resolvedTags = computed(() => props.tags ?? defaultTags)
const itemStyle = computed(() => {
  const style: Record<string, string> = {
    '--vis-description-item-span': String(Math.max(1, Math.floor(props.span))),
  }

  if (props.labelWidth !== undefined) {
    style['--vis-description-item-label-width'] =
      typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
  }

  return style
})
</script>

<template>
  <div
    class="vis-description-item"
    :class="[
      `type-${type}`,
      direction ? `direction-${direction}` : undefined,
      border === true ? 'is-bordered' : border === false ? 'is-borderless' : undefined,
    ]"
    :style="itemStyle"
  >
    <div class="vis-description-item__label">
      <slot name="label-icon">
        <Icon v-if="icon" :name="iconName" :size="16" decorative />
      </slot>
      <span class="vis-description-item__label-text">
        <slot name="label">{{ label }}</slot>
      </span>
    </div>

    <div class="vis-description-item__value">
      <slot v-if="type === 'customize'" />
      <div v-else-if="type === 'tag'" class="vis-description-item__tags">
        <slot name="tags">
          <VisTag
            v-for="(tag, index) in resolvedTags"
            :key="`${tag.label}-${index}`"
            type="icon"
            :label="tag.label"
            :icon-name="tag.iconName ?? 'archive'"
          />
        </slot>
      </div>
      <span v-else class="vis-description-item__text">
        <slot>{{ value }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
.vis-description-item {
  --vis-description-item-label-width: var(--vis-description-label-width, 84px);

  box-sizing: border-box;
  min-inline-size: 0;
  min-block-size: var(--space-48);
  grid-column: span var(--vis-description-item-span);
  display: flex;
  align-items: center;
  gap: var(--space-16);
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-description-item__label,
.vis-description-item__value {
  box-sizing: border-box;
  min-inline-size: 0;
  display: flex;
  align-items: center;
}

.vis-description-item__label {
  inline-size: var(--vis-description-item-label-width);
  block-size: var(--space-24);
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  flex: 0 0 var(--vis-description-item-label-width);
}

.vis-description-item__value {
  block-size: var(--space-24);
  flex: 1 1 0;
}

.vis-description-item__label-text,
.vis-description-item__text {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-description-item__label-text {
  flex: 1 1 0;
}

.vis-description-item__tags {
  min-inline-size: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.vis-description-item.direction-vertical {
  min-block-size: 88px;
  padding-block: var(--space-16);
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: var(--space-8);
}

.vis-description-item.direction-vertical .vis-description-item__label {
  inline-size: 100%;
  flex-basis: auto;
}

.vis-description-item.direction-vertical .vis-description-item__value {
  inline-size: 100%;
  flex: 0 0 var(--space-24);
}

.vis-description-item.is-bordered {
  --vis-description-item-label-width: var(--vis-description-label-width, 120px);

  gap: 1px;
  background: var(--color-border-default);
}

.vis-description-item.is-bordered .vis-description-item__label,
.vis-description-item.is-bordered .vis-description-item__value {
  block-size: 100%;
  padding-inline: var(--space-12);
}

.vis-description-item.is-bordered .vis-description-item__label {
  background: var(--color-bg-secondary);
}

.vis-description-item.is-bordered .vis-description-item__value {
  background: var(--color-bg-surface);
}

.vis-description-item.is-bordered.direction-vertical {
  min-block-size: 96px;
  padding-block: 0;
}

.vis-description-item.is-bordered.direction-vertical .vis-description-item__label,
.vis-description-item.is-bordered.direction-vertical .vis-description-item__value {
  min-block-size: 0;
  flex: 1 1 0;
}

.vis-description-item.type-customize .vis-description-item__value {
  overflow: visible;
}
</style>
