<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import VisAvatar from './VisAvatar.vue'
import type { VisAvatarGroupItem, VisAvatarGroupProps, VisAvatarImageVariant, VisAvatarSize } from './avatar.types'
import { visAvatarImageVariants } from './defaultImages'

const props = withDefaults(defineProps<VisAvatarGroupProps>(), {
  size: 'sm',
  shape: 'round',
  items: () => [],
  addition: true,
  additionLabel: '+2',
})

const defaultItems: VisAvatarGroupItem[] = [{ variant: '01' }, { variant: '02' }, { variant: '03' }]

const normalizedSize = computed<VisAvatarSize>(() => {
  if (props.size === 'large') return 'lg'
  return props.size
})

const visibleItems = computed(() => (props.items.length ? props.items : defaultItems))

const groupMetrics = computed(() => {
  if (normalizedSize.value === 'md') return { overlap: '10px', paddingEnd: '0px' }
  if (normalizedSize.value === 'lg') return { overlap: '12px', paddingEnd: '0px' }
  if (normalizedSize.value === 'xl') return { overlap: '14px', paddingEnd: '0px' }
  if (normalizedSize.value === 'xxl') return { overlap: '16px', paddingEnd: '0px' }
  return { overlap: '8px', paddingEnd: '0px' }
})

const groupStyles = computed<CSSProperties>(() => ({
  '--vis-avatar-group-overlap': groupMetrics.value.overlap,
  '--vis-avatar-group-padding-end': groupMetrics.value.paddingEnd,
} as CSSProperties))

function getFallbackVariant(index: number): VisAvatarImageVariant {
  return visAvatarImageVariants[index % visAvatarImageVariants.length]
}
</script>

<template>
  <div class="vis-avatar-group" :style="groupStyles">
    <VisAvatar
      v-for="(item, index) in visibleItems"
      :key="`avatar-${index}`"
      class="vis-avatar-group__item"
      :style="{ zIndex: index + 1 }"
      :size="normalizedSize"
      :shape-square="shape === 'square'"
      :group-outlined="true"
      type="image"
      :image-src="item.src"
      :image-variant="item.variant ?? getFallbackVariant(index)"
      :image-alt="item.alt"
      :decorative="!item.alt"
    />

    <VisAvatar
      v-if="addition"
      class="vis-avatar-group__item vis-avatar-group__addition"
      :style="{ zIndex: visibleItems.length + 1 }"
      :size="normalizedSize"
      :shape-square="shape === 'square'"
      type="text"
      :text="additionLabel"
    />
  </div>
</template>

<style scoped>
.vis-avatar-group {
  display: inline-flex;
  align-items: center;
  padding-inline-end: var(--vis-avatar-group-padding-end);
}

.vis-avatar-group__item {
  margin-inline-start: calc(var(--vis-avatar-group-overlap) * -1);
}

.vis-avatar-group__item:first-child {
  margin-inline-start: 0;
}
</style>
