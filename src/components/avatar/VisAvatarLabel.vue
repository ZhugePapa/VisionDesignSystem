<script setup lang="ts">
import { computed } from 'vue'

import VisAvatar from './VisAvatar.vue'
import type { VisAvatarLabelProps } from './avatar.types'

const props = withDefaults(defineProps<VisAvatarLabelProps>(), {
  align: 'horizontal',
  size: 'sm',
  addition: true,
  title: '张大山',
  subtitle: 'zhangdashan',
  avatarType: 'image',
  avatarText: '张',
  avatarIcon: 'user-03',
  avatarImageSrc: undefined,
  avatarImageVariant: '09',
  avatarImageAlt: undefined,
  shapeSquare: false,
})

const isStacked = computed(() => props.align === 'vertical' || ['lg', 'xl', 'xxl'].includes(props.size))
</script>

<template>
  <div class="vis-avatar-label" :class="[`align-${align}`, `size-${size}`]">
    <VisAvatar
      class="vis-avatar-label__avatar"
      :size="size"
      :type="avatarType"
      :shape-square="shapeSquare"
      :text="avatarText"
      :icon="avatarIcon"
      :image-src="avatarImageSrc"
      :image-variant="avatarImageVariant"
      :image-alt="avatarImageAlt"
      :decorative="!avatarImageAlt"
    />

    <div class="vis-avatar-label__content" :class="{ stacked: isStacked }">
      <p class="vis-avatar-label__title">{{ title }}</p>
      <p v-if="addition" class="vis-avatar-label__subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.vis-avatar-label {
  display: inline-flex;
  align-items: center;
  min-inline-size: 0;
}

.vis-avatar-label.align-horizontal.size-xs,
.vis-avatar-label.align-horizontal.size-sm,
.vis-avatar-label.align-horizontal.size-md {
  gap: var(--space-8);
}

.vis-avatar-label.align-horizontal.size-lg {
  gap: var(--space-12);
}

.vis-avatar-label.align-horizontal.size-xl {
  gap: var(--space-16);
}

.vis-avatar-label.align-horizontal.size-xxl {
  gap: var(--space-12);
}

.vis-avatar-label.align-vertical.size-xs,
.vis-avatar-label.align-vertical.size-sm,
.vis-avatar-label.align-vertical.size-md,
.vis-avatar-label.align-vertical.size-lg {
  flex-direction: column;
  justify-content: center;
  gap: var(--space-4);
}

.vis-avatar-label.align-vertical.size-xl,
.vis-avatar-label.align-vertical.size-xxl {
  flex-direction: column;
  justify-content: center;
  gap: var(--space-8);
}

.vis-avatar-label__content {
  min-inline-size: 0;
  flex: 1 1 auto;
}

.vis-avatar-label__content.stacked {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
}

.vis-avatar-label.size-xxl .vis-avatar-label__content.stacked {
  gap: 2px;
}

.vis-avatar-label.align-horizontal .vis-avatar-label__content:not(.stacked) {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.vis-avatar-label.align-vertical .vis-avatar-label__content {
  align-items: center;
  text-align: center;
}

.vis-avatar-label__title,
.vis-avatar-label__subtitle {
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.vis-avatar-label__title {
  flex: 0 0 auto;
}

.vis-avatar-label__subtitle {
  flex: 1 1 0;
}

.vis-avatar-label.size-xs .vis-avatar-label__title,
.vis-avatar-label.size-sm .vis-avatar-label__title,
.vis-avatar-label.size-md .vis-avatar-label__title {
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 500;
  color: var(--color-text-primary);
}

.vis-avatar-label.size-lg .vis-avatar-label__title,
.vis-avatar-label.size-xl .vis-avatar-label__title,
.vis-avatar-label.size-xxl .vis-avatar-label__title {
  font-family: var(--font-family-sans);
  font-size: var(--font-text-lg-size);
  line-height: var(--font-text-lg-line-height);
  font-weight: 500;
  color: var(--color-text-primary);
}

.vis-avatar-label__subtitle {
  font-family: var(--font-family-sans);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
  font-weight: 400;
  color: var(--color-text-tertiary);
}

.vis-avatar-label.size-xl .vis-avatar-label__subtitle,
.vis-avatar-label.size-xxl .vis-avatar-label__subtitle {
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}
</style>
