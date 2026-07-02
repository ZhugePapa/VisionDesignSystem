<script setup lang="ts">
import { computed } from 'vue'

import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import type { IconName } from '../icons/generated/registry.generated'
import type { VisAlertProps, VisAlertType } from './alert.types'

const props = withDefaults(defineProps<VisAlertProps>(), {
  type: 'info',
  title: undefined,
  description: false,
  descriptionText: '这里是提示的描述内容',
  actions: false,
  closeable: false,
  detailLabel: '查看详情',
  ignoreLabel: '忽略',
})

const emit = defineEmits<{
  close: [event: MouseEvent]
  ignore: [event: MouseEvent]
  detail: [event: MouseEvent]
}>()

const iconNameMap: Record<VisAlertType, IconName> = {
  info: 'info-circle',
  primary: 'info-circle',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
}

const defaultTitleMap: Record<VisAlertType, string> = {
  info: '信息提示',
  primary: '信息提示',
  success: '成功提示',
  warning: '警告提示',
  danger: '错误提示',
}

const semanticAlertVarsMap: Record<Exclude<VisAlertType, 'info' | 'primary' | 'danger'>, Record<string, string>> = {
  success: {
    '--vis-alert-bg': 'var(--color-fg-success-subtle)',
    '--vis-alert-border': 'var(--color-border-success-subtle)',
    '--vis-alert-icon': 'var(--color-text-success-primary)',
    '--vis-alert-title': 'var(--color-text-success-primary)',
    '--vis-alert-description': 'var(--color-text-success-primary)',
  },
  warning: {
    '--vis-alert-bg': 'var(--color-fg-warning-subtle)',
    '--vis-alert-border': 'var(--color-border-warning-subtle)',
    '--vis-alert-icon': 'var(--color-text-warning-primary)',
    '--vis-alert-title': 'var(--color-text-warning-primary)',
    '--vis-alert-description': 'var(--color-text-warning-primary)',
  },
}

const resolvedIconName = computed(() => iconNameMap[props.type])
const resolvedTitle = computed(() => props.title ?? defaultTitleMap[props.type])

const alertVars = computed((): Record<string, string> => {
  if (props.type === 'info') {
    return {
      '--vis-alert-bg': 'var(--color-bg-secondary)',
      '--vis-alert-border': 'var(--color-border-default)',
      '--vis-alert-icon': 'var(--color-text-secondary)',
      '--vis-alert-title': props.description ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      '--vis-alert-description': 'var(--color-text-secondary)',
    }
  }

  if (props.type === 'primary') {
    return {
      '--vis-alert-bg': 'var(--color-fg-brand-subtle)',
      '--vis-alert-border': 'var(--color-border-brand-subtle)',
      '--vis-alert-icon': 'var(--color-text-brand-primary)',
      '--vis-alert-title': 'var(--color-text-brand-primary)',
      '--vis-alert-description': 'var(--color-text-brand-primary)',
    }
  }

  if (props.type === 'danger') {
    return {
      '--vis-alert-bg': 'var(--color-fg-danger-subtle)',
      '--vis-alert-border': 'var(--color-border-danger-subtle)',
      '--vis-alert-icon': 'var(--color-text-danger-primary)',
      '--vis-alert-title': 'var(--color-text-danger-primary)',
      '--vis-alert-description': 'var(--color-text-danger-primary)',
    }
  }

  return {
    ...semanticAlertVarsMap[props.type],
  }
})

function onClose(event: MouseEvent): void {
  emit('close', event)
}

function onIgnore(event: MouseEvent): void {
  emit('ignore', event)
}

function onDetail(event: MouseEvent): void {
  emit('detail', event)
}
</script>

<template>
  <div class="vis-alert" :class="[`type-${type}`, { 'has-description': description }]" :style="alertVars" role="alert">
    <span class="vis-alert__icon-wrap" aria-hidden="true">
      <slot name="icon">
        <Icon :name="resolvedIconName" :size="20" decorative />
      </slot>
    </span>

    <div class="vis-alert__content">
      <p class="vis-alert__title">
        <slot>{{ resolvedTitle }}</slot>
      </p>

      <p v-if="description" class="vis-alert__description">
        <slot name="description">{{ descriptionText }}</slot>
      </p>

      <div v-if="description && actions" class="vis-alert__actions vis-alert__actions--stacked">
        <slot name="actions">
          <VisButton variant="link-grey" size="md" class="vis-alert__action" @click="onIgnore">
            {{ ignoreLabel }}
          </VisButton>
          <VisButton variant="link-color" size="md" class="vis-alert__action" @click="onDetail">
            {{ detailLabel }}
          </VisButton>
        </slot>
      </div>
    </div>

    <div v-if="!description && actions" class="vis-alert__actions">
      <slot name="actions">
        <VisButton variant="link-grey" size="md" class="vis-alert__action" @click="onIgnore">
          {{ ignoreLabel }}
        </VisButton>
        <VisButton variant="link-color" size="md" class="vis-alert__action" @click="onDetail">
          {{ detailLabel }}
        </VisButton>
      </slot>
    </div>

    <slot v-if="closeable" name="close">
      <VisButton
        variant="text"
        size="md"
        icon-only
        icon-name="x-close"
        label="关闭提示"
        class="vis-alert__close"
        @click="onClose"
      />
    </slot>
  </div>
</template>

<style scoped>
.vis-alert {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 690px;
  min-block-size: 52px;
  border: 1px solid var(--vis-alert-border);
  border-radius: var(--radius-md);
  padding: 15px var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--vis-alert-title);
  background: var(--vis-alert-bg);
  font-family: var(--font-family-sans);
}

.vis-alert.has-description {
  min-block-size: 78px;
  align-items: flex-start;
}

.vis-alert__icon-wrap {
  inline-size: var(--space-20);
  block-size: var(--space-20);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vis-alert-icon);
  flex: 0 0 auto;
}

.vis-alert.has-description .vis-alert__icon-wrap {
  inline-size: 22px;
  block-size: 22px;
}

.vis-alert__content {
  min-inline-size: 0;
  flex: 1 1 0;
}

.vis-alert.has-description .vis-alert__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.vis-alert__title,
.vis-alert__description {
  margin: 0;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  letter-spacing: 0;
}

.vis-alert:not(.has-description) .vis-alert__title {
  color: var(--vis-alert-title);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-alert.has-description .vis-alert__title {
  color: var(--vis-alert-title);
  font-size: var(--font-text-lg-size);
  font-weight: 500;
  line-height: var(--font-text-lg-line-height);
}

.vis-alert__description {
  color: var(--vis-alert-description);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
}

.vis-alert__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-alert__actions--stacked {
  align-self: stretch;
  padding-block-start: var(--space-12);
  gap: var(--space-16);
}

.vis-alert__action,
.vis-alert__close {
  flex: 0 0 auto;
}

@media (max-width: 640px) {
  .vis-alert,
  .vis-alert.has-description {
    align-items: flex-start;
  }

  .vis-alert__actions:not(.vis-alert__actions--stacked) {
    display: none;
  }
}
</style>
