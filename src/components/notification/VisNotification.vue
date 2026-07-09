<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'

import VisAvatar from '../avatar/VisAvatar.vue'
import VisButton from '../button/VisButton.vue'
import VisFeaturedIcon from '../featured-icon/VisFeaturedIcon.vue'
import type { VisFeaturedIconColor } from '../featured-icon/featured-icon.types'
import type { IconName } from '../icons/generated/registry.generated'
import type { VisNotificationProps, VisNotificationType } from './notification.types'

type SemanticNotificationType = Extract<VisNotificationType, 'info' | 'success' | 'warning' | 'danger'>

const AUTO_CLOSE_DURATION_MS = 10000

const props = withDefaults(defineProps<VisNotificationProps>(), {
  type: 'info',
  title: undefined,
  description: undefined,
  actions: true,
  closeable: true,
  modelValue: true,
  width: 384,
  iconName: 'download-cloud-01',
  avatarImageVariant: '09',
  avatarName: '张大山',
  avatarTime: '2分钟前',
  actionPrimaryText: '查看',
  actionSecondaryText: '忽略',
  autoClose: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  'action-primary': []
  'action-secondary': []
}>()

const semanticVisualMap: Record<SemanticNotificationType, { color: VisFeaturedIconColor; iconName: IconName }> = {
  info: { color: 'brand', iconName: 'info' },
  success: { color: 'success', iconName: 'check' },
  warning: { color: 'warning', iconName: 'alert' },
  danger: { color: 'danger', iconName: 'x-close' },
}

const defaultTitleMap: Record<VisNotificationType, string> = {
  info: '对话框标题',
  success: '成功对话框标题',
  warning: '警告对话框标题',
  danger: '错误对话框标题',
  avatar: '张大山',
  icon: '下载完成',
  no_icon: '对话框标题',
}

const defaultDescriptionMap: Record<VisNotificationType, string> = {
  info: '对话框的内容',
  success: '成功对话框的内容',
  warning: '警告对话框的内容',
  danger: '错误对话框的内容',
  avatar: '我已经添加完我的笔记了。等你方便的时候我们可以一起复习！',
  icon: '下载任务已完成！',
  no_icon: '对话框的内容',
}

let autoCloseTimer: number | undefined
const remainingMs = ref(AUTO_CLOSE_DURATION_MS)
let timerStartedAt = 0

const isAvatarType = computed(() => props.type === 'avatar')
const isIconType = computed(() => props.type === 'icon')
const isDefaultSemanticType = computed(() =>
  ['info', 'success', 'warning', 'danger'].includes(props.type),
)
const hasLeading = computed(() => props.type !== 'no_icon')
const resolvedVisual = computed(() => (isDefaultSemanticType.value ? semanticVisualMap[props.type as SemanticNotificationType] : null))
const resolvedTitle = computed(() => props.title ?? defaultTitleMap[props.type])
const resolvedDescription = computed(() => props.description ?? defaultDescriptionMap[props.type])
const rootStyle = computed<CSSProperties>(() => ({
  inlineSize: typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

function clearAutoCloseTimer() {
  if (autoCloseTimer === undefined) return
  window.clearTimeout(autoCloseTimer)
  autoCloseTimer = undefined
}

function startAutoCloseTimer(duration = AUTO_CLOSE_DURATION_MS) {
  clearAutoCloseTimer()
  if (!props.modelValue || !props.autoClose || duration <= 0) return
  remainingMs.value = duration
  timerStartedAt = Date.now()
  autoCloseTimer = window.setTimeout(() => {
    onClose()
  }, duration)
}

function pauseAutoClose() {
  if (autoCloseTimer === undefined) return
  const elapsed = Date.now() - timerStartedAt
  remainingMs.value = Math.max(0, remainingMs.value - elapsed)
  clearAutoCloseTimer()
}

function resumeAutoClose() {
  if (!props.autoClose || !props.modelValue || remainingMs.value <= 0) return
  startAutoCloseTimer(remainingMs.value)
}

function resetAutoClose() {
  remainingMs.value = AUTO_CLOSE_DURATION_MS
  startAutoCloseTimer()
}

function onClose() {
  clearAutoCloseTimer()
  emit('update:modelValue', false)
  emit('close')
}

function onActionPrimary() {
  emit('action-primary')
}

function onActionSecondary() {
  emit('action-secondary')
}

watch(
  () => [props.modelValue, props.autoClose] as const,
  ([visible]) => {
    clearAutoCloseTimer()
    if (visible) resetAutoClose()
  },
  { immediate: true },
)

onBeforeUnmount(clearAutoCloseTimer)
</script>

<template>
  <div
    v-if="modelValue"
    class="vis-notification"
    :class="[`type-${type}`]"
    :style="rootStyle"
    role="status"
    aria-live="polite"
    @mouseenter="pauseAutoClose"
    @mouseleave="resumeAutoClose"
  >
    <div class="vis-notification__top">
      <div v-if="hasLeading" class="vis-notification__leading" aria-hidden="true">
        <div v-if="isAvatarType" class="vis-notification__avatar-wrap">
          <VisAvatar type="image" size="xl" badge="state" :image-variant="avatarImageVariant" />
        </div>
        <VisFeaturedIcon v-else-if="isIconType" type="modern" size="xl" color="grey" :icon="iconName" decorative />
        <div v-else-if="resolvedVisual" class="vis-notification__featured-icon-wrap">
          <VisFeaturedIcon
            type="solid-round"
            size="xs"
            :color="resolvedVisual.color"
            :icon="resolvedVisual.iconName"
            decorative
          />
        </div>
      </div>

      <div class="vis-notification__content" :class="{ 'is-avatar': isAvatarType }">
        <div v-if="isAvatarType" class="vis-notification__avatar-head">
          <p class="vis-notification__title">{{ avatarName }}</p>
          <p class="vis-notification__time">{{ avatarTime }}</p>
        </div>
        <p v-else class="vis-notification__title">{{ resolvedTitle }}</p>

        <p class="vis-notification__description" :class="{ 'is-icon': isIconType, 'is-avatar': isAvatarType }">
          {{ resolvedDescription }}
        </p>

        <div v-if="actions" class="vis-notification__actions">
          <slot name="actions">
            <VisButton size="md" variant="link-color" @click="onActionPrimary">{{ actionPrimaryText }}</VisButton>
            <VisButton size="md" variant="link-grey" @click="onActionSecondary">{{ actionSecondaryText }}</VisButton>
          </slot>
        </div>
      </div>

      <VisButton
        v-if="closeable"
        variant="text"
        size="md"
        icon-only
        icon-name="x-close"
        label="关闭通知"
        class="vis-notification__close"
        @click="onClose"
      />
    </div>
  </div>
</template>

<style scoped>
.vis-notification {
  box-sizing: border-box;
  block-size: auto;
  border-radius: var(--radius-md);
  background: var(--color-bg-canvas);
  box-shadow: var(--shadow-default-md);
  font-family: var(--font-family-sans);
}

.vis-notification__top {
  box-sizing: border-box;
  position: relative;
  inline-size: 100%;
  padding: var(--space-20);
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
}

.vis-notification:is(.type-info, .type-success, .type-warning, .type-danger) .vis-notification__top {
  gap: var(--space-8);
}

.vis-notification__leading {
  flex: 0 0 auto;
  display: inline-flex;
}

.vis-notification__featured-icon-wrap {
  inline-size: 22px;
  block-size: 22px;
  padding: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.vis-notification__avatar-wrap {
  inline-size: var(--space-48);
  block-size: var(--space-48);
  display: inline-flex;
}

.vis-notification__content {
  min-inline-size: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

.vis-notification__content.is-avatar {
  padding-inline-end: calc(var(--space-24) + var(--space-4));
}

.vis-notification__avatar-head {
  inline-size: 100%;
  display: flex;
  align-items: flex-end;
  gap: var(--space-8);
}

.vis-notification__title {
  margin: 0;
  max-inline-size: 100%;
  color: var(--color-text-primary);
  font-size: var(--font-text-lg-size);
  line-height: var(--font-text-lg-line-height);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-notification__time {
  margin: 0;
  min-inline-size: 0;
  flex: 1 1 auto;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-notification__description {
  margin: 0;
  inline-size: 100%;
  color: var(--color-fg-secondary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-notification__description.is-icon,
.vis-notification__description.is-avatar {
  white-space: normal;
}

.vis-notification__actions {
  inline-size: 100%;
  padding-block-start: var(--space-12);
  display: inline-flex;
  align-items: center;
  gap: var(--space-16);
}

.vis-notification__close {
  position: absolute;
  inset-inline-end: var(--space-16);
  inset-block-start: var(--space-16);
}
</style>
