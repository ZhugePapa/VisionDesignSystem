<script setup lang="ts">
import { computed } from 'vue'
import { ElLink } from 'element-plus'

import Icon from '../icons/Icon.vue'
import { resolveElementLinkProps } from './link.adapter'
import type { VisLinkProps } from './link.types'

defineOptions({
  name: 'VisLink',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<VisLinkProps>(), {
  type: 'default',
  state: 'default',
  prefix: false,
  suffix: false,
  label: 'link',
  href: undefined,
  target: '_self',
  disabled: false,
  iconName: 'share-07',
  suffixIconName: 'chevron-down',
  elProps: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const elementLinkProps = computed(() => resolveElementLinkProps(props))
</script>

<template>
  <ElLink
    v-bind="{ ...$attrs, ...elementLinkProps }"
    class="vis-link"
    :class="[`type-${type}`, `state-${state}`]"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="emit('click', $event)"
  >
    <span class="vis-link__content">
      <span v-if="prefix" class="vis-link__icon" aria-hidden="true">
        <slot name="prefix">
          <Icon :name="iconName" :size="16" decorative />
        </slot>
      </span>

      <span class="vis-link__label">
        <slot>{{ label }}</slot>
      </span>

      <span v-if="suffix" class="vis-link__icon" aria-hidden="true">
        <slot name="suffix">
          <Icon :name="suffixIconName" :size="16" decorative />
        </slot>
      </span>
    </span>
  </ElLink>
</template>

<style scoped>
.vis-link {
  --vis-link-color: var(--color-text-primary);
  --vis-link-hover-color: var(--color-text-primary);
  --vis-link-hover-color: color-mix(in srgb, var(--color-text-primary) 90%, var(--primitive-grey-975) 10%);
  --el-link-font-size: var(--font-text-md-size);
  --el-link-font-weight: 400;
  --el-link-text-color: var(--vis-link-color);
  --el-link-hover-text-color: var(--vis-link-hover-color);
  --el-link-disabled-text-color: var(--color-text-disabled);

  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
  min-block-size: var(--font-text-md-line-height);
  border-radius: var(--radius-sm);
  padding: 0;
  color: var(--vis-link-color);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  text-decoration: none;
  vertical-align: middle;
  transition: color 150ms ease;
}

.vis-link.type-brand {
  --vis-link-color: var(--color-text-brand-primary);
  --vis-link-hover-color: var(--color-text-brand-primary);
  --vis-link-hover-color: color-mix(in srgb, var(--color-text-brand-primary) 90%, var(--primitive-grey-975) 10%);
}

.vis-link.type-subtle {
  --vis-link-color: var(--color-text-tertiary);
  --vis-link-hover-color: var(--color-text-tertiary);
  --vis-link-hover-color: color-mix(in srgb, var(--color-text-tertiary) 90%, var(--primitive-grey-975) 10%);
}

.vis-link :deep(.el-link__inner),
.vis-link :deep([class$='-link__inner']) {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vis-link__content {
  min-inline-size: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  color: inherit;
}

.vis-link__label {
  min-inline-size: 0;
  line-height: var(--font-text-md-line-height);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-link__icon {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: currentColor;
  overflow: hidden;
}

.vis-link:not(.is-disabled):is(:hover, .state-hover) {
  color: var(--vis-link-hover-color);
}

.vis-link:not(.is-disabled):is(:hover, .state-hover) .vis-link__label {
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  text-underline-position: from-font;
}

.vis-link.is-disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-link:focus-visible {
  outline: 2px solid var(--color-effect-focus-ring-brand);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .vis-link {
    transition: none;
  }
}
</style>
