<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type VisScrollShadowVariant = 'surface' | 'secondary'
export type VisScrollShadowOrientation = 'vertical' | 'horizontal'

const props = withDefaults(
  defineProps<{
    variant?: VisScrollShadowVariant
    orientation?: VisScrollShadowOrientation
    /** Height of the fade/edge overlay region in px (the 80px "blur area" from the Figma spec) */
    size?: number
    hideScrollBar?: boolean
  }>(),
  {
    variant: 'surface',
    orientation: 'vertical',
    size: 80,
    hideScrollBar: true,
  },
)

const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const startOverflow = ref(false) // content beyond the start (top / left)
const endOverflow = ref(false) // content beyond the end (bottom / right)

function updateOverflow(): void {
  const el = containerRef.value
  if (!el) return
  if (props.orientation === 'vertical') {
    startOverflow.value = el.scrollTop > 0
    endOverflow.value = el.scrollTop + el.clientHeight < el.scrollHeight - 1
  } else {
    startOverflow.value = el.scrollLeft > 0
    endOverflow.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  }
}

let ro: ResizeObserver | null = null

function attachObservers(): void {
  const el = containerRef.value
  if (!el) return
  el.addEventListener('scroll', updateOverflow, { passive: true })
  ro = new ResizeObserver(updateOverflow)
  ro.observe(el)
  if (contentRef.value) {
    ro.observe(contentRef.value)
  }
}

function detachObservers(): void {
  const el = containerRef.value
  if (el) el.removeEventListener('scroll', updateOverflow)
  ro?.disconnect()
  ro = null
}

onMounted(() => {
  nextTick(attachObservers)
  nextTick(updateOverflow)
})

onBeforeUnmount(detachObservers)

watch(() => props.orientation, () => nextTick(updateOverflow))

const rootClass = computed(() => [
  'vis-scrollshadow',
  `variant-${props.variant}`,
  `orientation-${props.orientation}`,
  {
    'hide-scrollbar': props.hideScrollBar,
    'show-start': startOverflow.value,
    'show-end': endOverflow.value,
  },
])

const edgeStyle = computed(() => ({
  '--vis-ss-size': `${props.size}px`,
}))
</script>

<template>
  <div
    ref="containerRef"
    :class="rootClass"
    :style="edgeStyle"
  >
    <div
      class="vis-scrollshadow__edge vis-scrollshadow__edge--start"
      :class="{ 'is-visible': startOverflow }"
      aria-hidden="true"
    />
    <div ref="contentRef" class="vis-scrollshadow__content">
      <slot />
    </div>
    <div
      class="vis-scrollshadow__edge vis-scrollshadow__edge--end"
      :class="{ 'is-visible': endOverflow }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.vis-scrollshadow {
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.vis-scrollshadow.hide-scrollbar {
  scrollbar-width: none;
}

.vis-scrollshadow.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.vis-scrollshadow__content {
  min-inline-size: 0;
}

/*
 * Edge overlays — solid color fading to transparent via a gradient,
 * matching the Figma design (layer mask). No backdrop blur.
 * The two variants use different color tokens:
 *   surface   → --color-component-scrollshadow-surface
 *   secondary → --color-component-scrollshadow-secondary
 */
.vis-scrollshadow__edge {
  position: sticky;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms ease;
  flex: 0 0 auto;
}

.vis-scrollshadow__edge.is-visible {
  opacity: 1;
}

/* ---------- Vertical orientation ---------- */

.orientation-vertical {
  display: block;
}

.orientation-vertical .vis-scrollshadow__edge--start {
  top: 0;
  left: 0;
  right: 0;
  height: var(--vis-ss-size);
  margin-bottom: calc(var(--vis-ss-size) * -1);
  background: linear-gradient(
    to bottom,
    var(--color-component-scrollshadow-surface) 0%,
    transparent 100%
  );
}

.orientation-vertical.variant-secondary .vis-scrollshadow__edge--start {
  background: linear-gradient(
    to bottom,
    var(--color-component-scrollshadow-secondary) 0%,
    transparent 100%
  );
}

.orientation-vertical .vis-scrollshadow__edge--end {
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--vis-ss-size);
  margin-top: calc(var(--vis-ss-size) * -1);
  background: linear-gradient(
    to top,
    var(--color-component-scrollshadow-surface) 0%,
    transparent 100%
  );
}

.orientation-vertical.variant-secondary .vis-scrollshadow__edge--end {
  background: linear-gradient(
    to top,
    var(--color-component-scrollshadow-secondary) 0%,
    transparent 100%
  );
}

/* ---------- Horizontal orientation ---------- */

.orientation-horizontal {
  display: flex;
  align-items: stretch;
}

.orientation-horizontal .vis-scrollshadow__content {
  display: flex;
  align-items: stretch;
  flex: 0 0 auto;
}

.orientation-horizontal .vis-scrollshadow__edge--start {
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--vis-ss-size);
  margin-right: calc(var(--vis-ss-size) * -1);
  position: sticky;
  background: linear-gradient(
    to right,
    var(--color-component-scrollshadow-surface) 0%,
    transparent 100%
  );
}

.orientation-horizontal.variant-secondary .vis-scrollshadow__edge--start {
  background: linear-gradient(
    to right,
    var(--color-component-scrollshadow-secondary) 0%,
    transparent 100%
  );
}

.orientation-horizontal .vis-scrollshadow__edge--end {
  right: 0;
  top: 0;
  bottom: 0;
  width: var(--vis-ss-size);
  margin-left: calc(var(--vis-ss-size) * -1);
  position: sticky;
  background: linear-gradient(
    to left,
    var(--color-component-scrollshadow-surface) 0%,
    transparent 100%
  );
}

.orientation-horizontal.variant-secondary .vis-scrollshadow__edge--end {
  background: linear-gradient(
    to left,
    var(--color-component-scrollshadow-secondary) 0%,
    transparent 100%
  );
}
</style>
