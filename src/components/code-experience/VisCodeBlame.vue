<script setup lang="ts">
import { computed } from 'vue'

import { VisAvatarLabel } from '../avatar'
import VisCodeBlameBar from './VisCodeBlameBar.vue'
import VisCodeLine from './VisCodeLine.vue'
import type { VisCodeBlameProps, VisCodeLineData } from './code-experience.types'

const designCode = 'export MAVEN_PROJECTBASEDIR=${MAVEN_BASEDIR:-"$BASE_DIR"}'
const defaultLines: VisCodeLineData[] = Array.from({ length: 5 }, (_, index) => ({
  key: index + 1,
  content: designCode,
  lineNumber: 1,
}))

const props = withDefaults(defineProps<VisCodeBlameProps>(), {
  author: '张大山',
  avatarImageSrc: undefined,
  avatarImageVariant: '09',
  avatarImageAlt: undefined,
  commit: '新增部分组件',
  time: '2个月前',
  rank: 'default',
  lines: () => [],
  ariaLabel: undefined,
})

const resolvedLines = computed(() => (props.lines.length > 0 ? props.lines : defaultLines))
const accessibleLabel = computed(() => props.ariaLabel ?? `${props.author}，${props.commit}，${props.time}`)

defineOptions({ name: 'VisCodeBlame' })
</script>

<template>
  <section class="vis-code-blame" :aria-label="accessibleLabel">
    <aside class="vis-code-blame__metadata">
      <VisCodeBlameBar :rank="rank" />
      <div class="vis-code-blame__summary">
        <slot name="author">
          <VisAvatarLabel
            class="vis-code-blame__author"
            size="xs"
            :addition="false"
            :title="author"
            :avatar-image-src="avatarImageSrc"
            :avatar-image-variant="avatarImageVariant"
            :avatar-image-alt="avatarImageAlt"
          />
        </slot>
        <slot name="commit" :commit="commit">
          <span class="vis-code-blame__commit">{{ commit }}</span>
        </slot>
        <slot name="time" :time="time">
          <time class="vis-code-blame__time">{{ time }}</time>
        </slot>
      </div>
    </aside>

    <div class="vis-code-blame__lines" role="rowgroup">
      <slot :lines="resolvedLines">
        <VisCodeLine
          v-for="(line, index) in resolvedLines"
          :key="line.key ?? index"
          v-bind="line"
          :active="false"
          :commentable="false"
          :interactive="false"
          state="default"
        />
      </slot>
    </div>
  </section>
</template>

<style scoped>
.vis-code-blame {
  display: flex;
  align-items: stretch;
  inline-size: 100%;
  min-inline-size: 0;
  border-block-end: 1px solid var(--color-border-default);
  box-sizing: border-box;
}

.vis-code-blame__metadata {
  display: flex;
  flex: 0 0 320px;
  align-items: stretch;
  gap: var(--space-12);
  inline-size: 320px;
  min-inline-size: 0;
  padding: 5px;
  overflow: hidden;
  box-sizing: border-box;
}

.vis-code-blame__summary {
  display: flex;
  flex: 1 1 0;
  align-self: flex-start;
  align-items: center;
  gap: var(--space-12);
  min-inline-size: 0;
}

.vis-code-blame__author {
  flex: 0 0 auto;
}

.vis-code-blame__commit,
.vis-code-blame__time {
  font-family: var(--font-family-text), sans-serif;
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-code-blame__commit {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  gap: var(--space-6);
  min-inline-size: 0;
  block-size: var(--space-20);
  border-radius: var(--radius-sm);
  overflow: hidden;
  color: var(--color-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-code-blame__time {
  flex: 0 0 auto;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.vis-code-blame__lines {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: stretch;
  min-inline-size: 0;
}

@media (max-width: 720px) {
  .vis-code-blame {
    overflow-x: auto;
  }

  .vis-code-blame__lines {
    flex-basis: 600px;
    min-inline-size: 600px;
  }
}
</style>
