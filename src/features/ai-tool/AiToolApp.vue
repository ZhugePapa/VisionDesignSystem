<script setup lang="ts">
import VisConfigProvider from '../../components/config-provider/VisConfigProvider.vue'
import AiAssistantWorkspace from '../../demos/menu-application/AiAssistantWorkspace.vue'
</script>

<template>
  <VisConfigProvider theme="light" namespace="vis-el" :z-index="3200">
    <main class="ai-tool" aria-label="小 VI 智能助理会话工具">
      <AiAssistantWorkspace mode="independent" mode-locked />
    </main>
  </VisConfigProvider>
</template>

<style scoped>
.ai-tool {
  inline-size: 100%;
  block-size: 100dvh;
  overflow: hidden;
  background: var(--color-bg-canvas);
}

.ai-tool :deep(.ai-assistant.mode-independent) {
  border-inline-start: 0;
}
</style>
