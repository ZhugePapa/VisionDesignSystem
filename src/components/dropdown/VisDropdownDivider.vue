<script setup lang="ts">
import VisDivider from '../divider/VisDivider.vue'
</script>

<template>
  <div class="vis-dropdown-divider" role="separator">
    <VisDivider class="vis-dropdown-divider__line" length="100%" decorative />
  </div>
</template>

<style scoped>
.vis-dropdown-divider {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 9px;
  padding-block: var(--space-4);
  padding-inline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vis-dropdown-divider__line {
  inline-size: 100%;
}
</style>
