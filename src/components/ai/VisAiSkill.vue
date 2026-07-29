<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import Icon from '../icons/Icon.vue'
import type { VisAiSkillColor, VisAiSkillProps } from './ai.types'

defineOptions({ name: 'VisAiSkill' })

const props = withDefaults(defineProps<VisAiSkillProps>(), {
  label: 'Generator-Skill',
  color: 'blue',
  icon: true,
  iconName: 'book-open-01',
  state: 'default',
})

const normalizedColor = computed<Exclude<VisAiSkillColor, 'acarlet'>>(
  () => (props.color === 'acarlet' ? 'scarlet' : props.color),
)

const rootStyle = computed<CSSProperties>(() => {
  if (normalizedColor.value === 'grey') return {}

  return {
    '--vis-ai-skill-fg': `var(--utility-${normalizedColor.value}-500)`,
    '--vis-ai-skill-hover-bg': `var(--utility-${normalizedColor.value}-50)`,
  }
})
</script>

<template>
  <span
    class="vis-ai-skill"
    :class="[`color-${normalizedColor}`, `state-${state}`]"
    :style="rootStyle"
  >
    <slot name="icon">
      <Icon v-if="icon" :name="iconName" :size="16" decorative />
    </slot>
    <span class="vis-ai-skill__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.vis-ai-skill {
  --vis-ai-skill-fg: var(--color-fg-tertiary);
  --vis-ai-skill-hover-bg: var(--color-bg-secondary);

  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--space-20);
  border-radius: var(--radius-sm);
  padding-inline: var(--space-4);
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  color: var(--vis-ai-skill-fg);
  background: transparent;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  white-space: nowrap;
  transition:
    color 120ms ease,
    background-color 120ms ease;
}

.vis-ai-skill:hover,
.vis-ai-skill.state-hover {
  color: color-mix(in srgb, var(--vis-ai-skill-fg) 91%, black);
  background: var(--vis-ai-skill-hover-bg);
}

.vis-ai-skill__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (prefers-reduced-motion: reduce) {
  .vis-ai-skill {
    transition: none;
  }
}
</style>
