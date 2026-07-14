<script setup lang="ts">
import { computed } from 'vue'

import VisButton from '../button/VisButton.vue'
import type { VisTableTreePrefixProps } from './table.types'

const props = withDefaults(defineProps<VisTableTreePrefixProps>(), {
  level: 1,
  withFolder: true,
  expanded: false,
})

const emit = defineEmits<{
  toggle: [expanded: boolean]
}>()

const spacerCount = computed(() => Math.max(0, props.level - 1))
</script>

<template>
  <span class="vis-table-tree-prefix" :style="{ '--vis-table-tree-level': spacerCount }">
    <VisButton
      v-if="withFolder"
      class="vis-table-tree-prefix__button"
      variant="text"
      size="sm"
      icon-only
      icon-name="chevron-right"
      :label="expanded ? '收起' : '展开'"
      :aria-expanded="expanded"
      @click="emit('toggle', !expanded)"
    />
    <span v-else class="vis-table-tree-prefix__spacer" aria-hidden="true" />
  </span>
</template>

<style scoped>
.vis-table-tree-prefix {
  box-sizing: border-box;
  inline-size: calc((var(--vis-table-tree-level) + 1) * var(--space-24));
  block-size: var(--space-24);
  padding-inline-start: calc(var(--vis-table-tree-level) * var(--space-24));
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}

.vis-table-tree-prefix__button,
.vis-table-tree-prefix__spacer {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  flex: 0 0 var(--space-24);
}

.vis-table-tree-prefix__button :deep(.vis-icon) {
  transition: transform 120ms ease;
}

.vis-table-tree-prefix__button[aria-expanded='true'] :deep(.vis-icon) {
  transform: rotate(90deg);
}
</style>
