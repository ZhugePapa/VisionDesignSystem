<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import type { Component } from 'vue'

import './icon.css'
import type { IconName } from './generated/registry.generated'
import { normalizeIconSize, resolveIconStrokeWidth } from './createIconComponent'
import { loadIconComponent } from './iconLoader'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
    strokeWidth?: number | string
    label?: string
    decorative?: boolean
  }>(),
  {
    size: 16,
    label: undefined,
    decorative: true,
  },
)

const warnedMissingIcons = new Set<string>()
const resolvedIconComponent = shallowRef<Component>()

function warnMissingIcon(name: string): void {
  if (warnedMissingIcons.has(name)) return
  warnedMissingIcons.add(name)
  console.warn(`[vision-design-system] Unknown icon name "${name}".`)
}

const resolvedSize = computed(() => normalizeIconSize(props.size))

// SVG icons use a 16x16 viewBox; this converts the desired rendered stroke
// mapping into the user-unit stroke width consumed by the SVG.
const resolvedStrokeWidth = computed(() => resolveIconStrokeWidth(props.size, props.strokeWidth))

const ariaHidden = computed(() => (props.decorative ? 'true' : undefined))
const ariaLabel = computed(() => (props.decorative ? undefined : props.label ?? props.name))
const iconStyle = computed(() => ({
  width: resolvedSize.value,
  height: resolvedSize.value,
  '--vis-icon-stroke-width': resolvedStrokeWidth.value,
}))

watch(
  () => props.name,
  async (name) => {
    resolvedIconComponent.value = undefined

    const component = await loadIconComponent(name)
    if (name !== props.name) return

    if (!component) {
      warnMissingIcon(String(name))
      return
    }

    resolvedIconComponent.value = component
  },
  { immediate: true },
)
</script>

<template>
  <component
    :is="resolvedIconComponent"
    v-if="resolvedIconComponent"
    :size="size"
    :stroke-width="resolvedStrokeWidth"
    :label="label"
    :decorative="decorative"
  />
  <span
    v-else
    class="vis-icon"
    :style="iconStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="decorative ? undefined : 'img'"
  />
</template>
