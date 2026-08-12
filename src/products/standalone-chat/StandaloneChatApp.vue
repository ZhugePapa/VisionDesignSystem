<script setup lang="ts">
import VisConfigProvider from '../../components/config-provider/VisConfigProvider.vue'
import StandaloneChatWorkspace from './StandaloneChatWorkspace.vue'
</script>

<template>
  <VisConfigProvider theme="light" namespace="vis-el" :z-index="3200">
    <main class="standalone-chat" aria-label="小 VI 智能助理会话工具">
      <StandaloneChatWorkspace mode="independent" mode-locked />
    </main>
  </VisConfigProvider>
</template>

<style scoped>
.standalone-chat {
  inline-size: 100%;
  block-size: 100dvh;
  overflow: hidden;
  background: var(--color-bg-canvas);
}

.standalone-chat :deep(.ai-assistant.mode-independent) {
  border-inline-start: 0;
}
</style>
