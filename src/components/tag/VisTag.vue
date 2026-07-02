<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import VisBadge from '../badge/VisBadge.vue'
import VisCheckbox from '../checkbox/VisCheckbox.vue'
import Icon from '../icons/Icon.vue'
import type { VisTagProps } from './tag.types'

const props = withDefaults(defineProps<VisTagProps>(), {
  type: 'default',
  checkable: false,
  checked: false,
  closable: false,
  closeState: 'default',
  label: '标签',
  iconName: 'archive',
  avatarSrc: undefined,
  avatarVariant: '09',
  avatarAlt: '',
})

const emit = defineEmits<{
  (event: 'update:checked', value: boolean): void
  (
    event: 'change',
    payload: {
      checked: boolean
      nativeEvent?: Event | MouseEvent
    },
  ): void
  (event: 'close', value: MouseEvent): void
}>()

const internalChecked = ref(props.checked)

const tagClass = computed(() => [
  `type-${props.type}`,
  {
    'is-checkable': props.checkable,
    'is-closable': props.closable,
  },
])

function setChecked(value: boolean, nativeEvent?: Event | MouseEvent): void {
  internalChecked.value = value
  emit('update:checked', value)
  emit('change', {
    checked: value,
    nativeEvent,
  })
}

function handleTagClick(event: MouseEvent): void {
  if (!props.checkable) return
  setChecked(!internalChecked.value, event)
}

function handleClose(event: MouseEvent): void {
  emit('close', event)
}

watch(
  () => props.checked,
  (value) => {
    internalChecked.value = value
  },
)
</script>

<template>
  <span
    class="vis-tag"
    :class="tagClass"
    :role="checkable ? 'checkbox' : undefined"
    :aria-checked="checkable ? internalChecked : undefined"
    :tabindex="checkable ? 0 : undefined"
    @click="handleTagClick"
    @keydown.space.prevent="checkable && setChecked(!internalChecked)"
    @keydown.enter.prevent="checkable && setChecked(!internalChecked)"
  >
    <VisCheckbox
      v-if="checkable"
      class="vis-tag__checkbox"
      :model-value="internalChecked"
      :label="false"
      aria-label="tag checked"
      @click.stop
      @update:model-value="setChecked"
    />

    <slot name="leading">
      <Icon v-if="type === 'icon'" class="vis-tag__icon" :name="iconName" :size="16" decorative />
      <span v-else-if="type === 'avatar'" class="vis-tag__avatar" aria-hidden="true">
        <img v-if="avatarSrc" class="vis-tag__avatar-image" :src="avatarSrc" :alt="avatarAlt" />
        <span v-else class="vis-tag__avatar-fallback" :class="`variant-${avatarVariant}`" />
      </span>
      <VisBadge v-else-if="type === 'dot'" class="vis-tag__dot" type="dot" color-type="danger" />
    </slot>

    <span class="vis-tag__label">
      <slot>{{ label }}</slot>
    </span>

    <button
      v-if="closable"
      class="vis-tag__close"
      :class="`state-${closeState}`"
      type="button"
      aria-label="关闭标签"
      @click.stop="handleClose"
    >
      <Icon name="x-close" :size="12" decorative />
    </button>
  </span>
</template>

<style scoped>
.vis-tag {
  box-sizing: border-box;
  block-size: var(--space-24);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  background: var(--color-bg-surface);
  color: var(--color-text-secondary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  letter-spacing: 0;
  white-space: nowrap;
  vertical-align: middle;
}

.vis-tag:not(.is-checkable):not(.is-closable) {
  padding-inline: var(--space-8);
}

.vis-tag.is-checkable:not(.is-closable) {
  padding-inline: var(--space-4) var(--space-8);
}

.vis-tag.is-closable:not(.is-checkable) {
  padding-inline: var(--space-8) var(--space-4);
}

.vis-tag.is-checkable.is-closable {
  padding-inline: var(--space-4);
}

.vis-tag__label {
  block-size: var(--font-text-sm-line-height);
  display: inline-flex;
  align-items: center;
  color: currentColor;
  line-height: inherit;
}

.vis-tag__checkbox {
  flex: 0 0 auto;
}

.vis-tag.is-checkable {
  cursor: pointer;
}

.vis-tag:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-effect-focus-ring-bg),
    0 0 0 4px var(--color-effect-focus-ring-brand);
}

.vis-tag__icon,
.vis-tag__dot,
.vis-tag__avatar {
  flex: 0 0 auto;
}

.vis-tag__icon {
  color: var(--color-fg-tertiary);
}

.vis-tag__avatar {
  position: relative;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  overflow: hidden;
  border-radius: var(--radius-full);
}

.vis-tag__avatar-image,
.vis-tag__avatar-fallback {
  inline-size: 100%;
  block-size: 100%;
  display: block;
  object-fit: cover;
}

.vis-tag__avatar-fallback {
  background:
    radial-gradient(circle at 35% 32%, var(--primitive-grey-100) 0 18%, transparent 19%),
    radial-gradient(circle at 50% 84%, var(--primitive-grey-100) 0 34%, transparent 35%),
    var(--color-fg-brand-primary);
}

.vis-tag__avatar-fallback.variant-02,
.vis-tag__avatar-fallback.variant-05,
.vis-tag__avatar-fallback.variant-08 {
  background-color: var(--color-fg-success-primary);
}

.vis-tag__avatar-fallback.variant-03,
.vis-tag__avatar-fallback.variant-06,
.vis-tag__avatar-fallback.variant-09 {
  background-color: var(--color-fg-warning-primary);
}

.vis-tag__close {
  box-sizing: border-box;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  border: 0;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  color: var(--color-fg-tertiary);
  cursor: pointer;
}

.vis-tag__close:is(:hover, .state-hover) {
  background: var(--color-bg-tertiary);
}
</style>
