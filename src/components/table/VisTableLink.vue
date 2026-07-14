<script setup lang="ts">
import type { VisTableLinkProps } from './table.types'

withDefaults(defineProps<VisTableLinkProps>(), {
  text: '这里是文本内容',
  href: undefined,
  state: 'default',
})
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    class="vis-table-link"
    :class="`state-${state}`"
    :href="href"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.vis-table-link {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-table-link:is(:hover, .state-hover) {
  color: var(--color-text-brand-primary);
  text-decoration: underline;
  text-underline-position: from-font;
}
</style>
