<script setup lang="ts">
import { computed } from 'vue'

import sortDefaultUrl from './assets/sort-default.svg'
import sortDownUrl from './assets/sort-down.svg'
import sortUpUrl from './assets/sort-up.svg'
import type { VisTableSortIconProps } from './table.types'

const props = withDefaults(defineProps<VisTableSortIconProps>(), {
  state: 'default',
})

const iconUrl = computed(() => {
  if (props.state === 'up') return sortUpUrl
  if (props.state === 'down') return sortDownUrl
  return sortDefaultUrl
})
</script>

<template>
  <span class="vis-table-sort-icon" :class="`state-${state}`" aria-hidden="true">
    <img class="vis-table-sort-icon__image" :src="iconUrl" alt="">
  </span>
</template>

<style scoped>
.vis-table-sort-icon {
  position: relative;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-block;
  flex: 0 0 var(--space-16);
}

.vis-table-sort-icon__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}
</style>
