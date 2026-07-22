<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import type { VisMenuBrandMarkProps } from './menu.types'

defineOptions({ name: 'VisMenuBrandMark' })

const props = withDefaults(defineProps<VisMenuBrandMarkProps>(), {
  size: 32,
})

const markStyle = computed<CSSProperties>(() => ({
  inlineSize: `${props.size}px`,
  blockSize: `${props.size}px`,
}))
</script>

<template>
  <svg
    class="vis-menu-brand-mark"
    :style="markStyle"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M15.7695 7.4179C15.7695 6.82764 15.4239 6.29207 14.886 6.04895L5.12108 1.63508C4.1267 1.18561 3 1.91278 3 3.00402V12.8717C3 13.4619 3.34565 13.9975 3.88352 14.2406L13.6485 18.6545C14.6428 19.104 15.7695 18.3768 15.7695 17.2856V7.4179Z" fill="#00bdba" />
    <path d="M8.00919 6.4179C8.00919 5.82764 8.35484 5.29207 8.8927 5.04895L18.6576 0.63508C19.652 0.18561 20.7787 0.912785 20.7787 2.00402V17.5821C20.7787 18.1724 20.4331 18.7079 19.8952 18.9511L10.1303 23.3649C9.13589 23.8144 8.00919 23.0872 8.00919 21.996V6.4179Z" fill="#1c63fc" />
    <path d="M14.8863 6.04883C15.4241 6.29199 15.7691 6.82779 15.7691 7.41797V17.2852C15.7691 18.3764 14.6424 19.1038 13.648 18.6543L8.00937 16.1045V6.41797C8.00937 5.82771 8.35529 5.29195 8.89316 5.04883L10.7828 4.19336L14.8863 6.04883Z" fill="#0021b7" />
  </svg>
</template>

<style scoped>
.vis-menu-brand-mark {
  display: block;
  flex: 0 0 auto;
}
</style>
