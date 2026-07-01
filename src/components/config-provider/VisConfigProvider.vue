<script setup lang="ts">
import { computed, provide } from 'vue'
import { ElConfigProvider } from 'element-plus'

import { visionConfigKey } from './config-provider.context'
import type { ResolvedVisConfig, VisConfigProviderProps } from './config-provider.types'

defineOptions({
  name: 'VisConfigProvider',
})

const props = withDefaults(defineProps<VisConfigProviderProps>(), {
  namespace: 'vis-el',
  zIndex: 3000,
  locale: undefined,
  theme: 'light',
  teleportTo: 'body',
})

const resolvedConfig = computed<ResolvedVisConfig>(() => ({
  namespace: props.namespace,
  zIndex: props.zIndex,
  teleportTo: props.teleportTo,
  theme: props.theme,
}))

provide(visionConfigKey, resolvedConfig)
</script>

<template>
  <ElConfigProvider :namespace="namespace" :z-index="zIndex" :locale="locale">
    <div class="vision-theme" :data-theme="theme">
      <slot />
    </div>
  </ElConfigProvider>
</template>
