<script setup lang="ts">
import type { VisCodeBlameBarProps } from './code-experience.types'

withDefaults(defineProps<VisCodeBlameBarProps>(), {
  rank: 'default',
})

defineOptions({ name: 'VisCodeBlameBar' })
</script>

<template>
  <span class="vis-code-blame-bar" :class="`rank-${rank}`" aria-hidden="true" />
</template>

<style scoped>
.vis-code-blame-bar {
  display: block;
  flex: 0 0 4px;
  align-self: stretch;
  inline-size: 4px;
  min-block-size: 1px;
  border-radius: 1px;
  background: var(--utility-orange-50);
}

.vis-code-blame-bar.rank-rank2 { background: var(--utility-orange-100); }
.vis-code-blame-bar.rank-rank3 { background: var(--utility-orange-200); }
.vis-code-blame-bar.rank-rank4 { background: var(--utility-orange-300); }
.vis-code-blame-bar.rank-rank5 { background: var(--utility-orange-400); }
.vis-code-blame-bar.rank-rank6 { background: var(--utility-orange-500); }
</style>
