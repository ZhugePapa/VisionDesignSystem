<script setup lang="ts">
import Icon from '../icons/Icon.vue'
import type { VisTableTrendIconProps } from './table.types'

withDefaults(defineProps<VisTableTrendIconProps>(), {
  trend: 'up',
})
</script>

<template>
  <Icon
    class="vis-table-trend-icon"
    :class="`trend-${trend}`"
    :name="trend === 'up' ? 'trend-up-01' : 'trend-down-01'"
    :size="16"
    decorative
  />
</template>

<style scoped>
.vis-table-trend-icon.trend-up {
  color: var(--color-fg-success-primary);
}

.vis-table-trend-icon.trend-down {
  color: var(--color-fg-danger-primary);
}
</style>
