<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { ElFormItem, type FormItemInstance, type FormItemRule, type FormRules } from 'element-plus'

import Icon from '../icons/Icon.vue'
import VisTooltip from '../tooltip/VisTooltip.vue'
import { visFormContextKey } from './form.context'
import type { VisFormItemProps } from './form.types'

defineOptions({
  name: 'VisFormItem',
})

const props = withDefaults(defineProps<VisFormItemProps>(), {
  prop: undefined,
  label: '输入框',
  type: 'input',
  alignLeft: undefined,
  labelWidth: undefined,
  span: 1,
  required: undefined,
  optional: false,
  tooltip: false,
  tooltipText: '提示信息',
  description: false,
  rules: undefined,
  error: '',
  showMessage: undefined,
  validateStatus: undefined,
  for: undefined,
})

const formContext = inject(visFormContextKey, undefined)
const itemRef = ref<FormItemInstance>()

const isAlignLeft = computed(() => props.alignLeft ?? formContext?.alignLeft.value ?? false)
const resolvedLabelWidth = computed(() => props.labelWidth ?? formContext?.labelWidth.value ?? 84)
const labelWidthStyle = computed(() => {
  const value = resolvedLabelWidth.value
  return typeof value === 'number' ? `${value}px` : value
})
const resolvedDescription = computed(() => {
  if (props.description === true) return '表单的提示文字'
  return props.description || ''
})
const resolvedShowMessage = computed(() => props.showMessage ?? formContext?.showMessage.value ?? true)
const validateState = computed(() => itemRef.value?.validateState ?? props.validateStatus ?? '')
const validateMessage = computed(() => itemRef.value?.validateMessage ?? '')
const resolvedError = computed(() => {
  if (!resolvedShowMessage.value) return ''
  return props.error || (validateState.value === 'error' ? validateMessage.value : '')
})

function toRuleList(value: FormItemRule | FormItemRule[] | undefined): FormItemRule[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function getFormRulesForProp(rules: FormRules | undefined): FormItemRule[] {
  if (!rules || !props.prop) return []
  const key = Array.isArray(props.prop) ? props.prop.join('.') : props.prop
  return toRuleList(rules[key])
}

const isRequired = computed(() => {
  if (props.required !== undefined) return props.required
  return [
    ...toRuleList(props.rules),
    ...getFormRulesForProp(formContext?.rules.value),
  ].some((rule) => rule.required)
})

const itemStyle = computed(() => ({
  '--vis-form-item-label-width': labelWidthStyle.value,
  '--vis-form-item-span': String(props.span),
}))

function validateTrigger(trigger: 'blur' | 'change'): void {
  const result = itemRef.value?.validate(trigger)
  if (result) void result.catch(() => undefined)
}

function resetField(): void {
  itemRef.value?.resetField()
}

function clearValidate(): void {
  itemRef.value?.clearValidate()
}

function validate(trigger = '') {
  return itemRef.value?.validate(trigger) ?? Promise.resolve(false)
}

defineExpose({
  itemRef,
  validate,
  resetField,
  clearValidate,
})
</script>

<template>
  <ElFormItem
    ref="itemRef"
    class="vis-form-item"
    :class="[
      `is-type-${type}`,
      {
        'is-align-left': isAlignLeft,
        'is-error': Boolean(resolvedError),
      },
    ]"
    :style="itemStyle"
    :prop="prop"
    :required="required"
    :rules="rules"
    :error="error"
    :show-message="false"
    :validate-status="validateStatus"
  >
    <div
      class="vis-form-item__layout"
      :role="props.for ? undefined : 'group'"
      @focusout.capture="validateTrigger('blur')"
      @change.capture="validateTrigger('change')"
      @input.capture="validateTrigger('change')"
    >
      <div class="vis-form-item__label-row">
        <slot name="label">
          <component :is="props.for ? 'label' : 'span'" class="vis-form-item__label" :for="props.for">
            {{ label }}
          </component>
        </slot>

        <span v-if="isRequired" class="vis-form-item__required" aria-hidden="true">*</span>

        <VisTooltip v-if="tooltip" :content="tooltipText" position="top">
          <button class="vis-form-item__tooltip" type="button" :aria-label="tooltipText">
            <Icon name="help-circle" :size="16" decorative />
          </button>
        </VisTooltip>

        <span v-if="optional" class="vis-form-item__optional">(选填)</span>
      </div>

      <div class="vis-form-item__body">
        <div class="vis-form-item__control">
          <slot />
        </div>

        <div v-if="resolvedDescription" class="vis-form-item__description">
          <slot name="description">{{ resolvedDescription }}</slot>
        </div>

        <div class="vis-form-item__message" :class="{ 'is-error': Boolean(resolvedError) }" aria-live="polite">
          <slot name="error" :error="resolvedError">
            <span v-if="resolvedError">{{ resolvedError }}</span>
          </slot>
        </div>
      </div>
    </div>
  </ElFormItem>
</template>

<style scoped>
.vis-form-item {
  position: relative;
  box-sizing: border-box;
  min-inline-size: 0;
  grid-column: span var(--vis-form-item-span);
  margin: 0;
  font-family: var(--font-family-text);
}

.vis-form-item:focus-within,
.vis-form-item:has(.vis-select.is-open),
.vis-form-item:has(.vis-date-picker.is-open),
.vis-form-item:has(.vis-time-picker.is-open) {
  z-index: 40;
}

.vis-form-item :deep(.el-form-item__content) {
  min-inline-size: 0;
  display: block;
  line-height: normal;
}

.vis-form-item__layout {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-4);
}

.vis-form-item__label-row {
  box-sizing: border-box;
  min-inline-size: 0;
  block-size: var(--space-24);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-form-item__label,
.vis-form-item__optional,
.vis-form-item__required {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-form-item__label {
  color: var(--color-text-primary);
}

.vis-form-item__required {
  color: var(--color-text-danger-primary);
}

.vis-form-item__optional {
  color: var(--color-text-tertiary);
}

.vis-form-item__tooltip {
  box-sizing: border-box;
  inline-size: var(--space-16);
  block-size: var(--space-16);
  border: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  background: transparent;
  cursor: help;
}

.vis-form-item__body,
.vis-form-item__control {
  min-inline-size: 0;
  inline-size: 100%;
}

.vis-form-item__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  isolation: isolate;
}

.vis-form-item__control {
  position: relative;
  z-index: 3;
}

.vis-form-item__description {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--font-text-sm-line-height);
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-form-item__message {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: var(--space-16);
  color: var(--color-text-danger-primary);
  font-size: var(--font-text-sm-size);
  font-weight: 400;
  line-height: var(--space-16);
  letter-spacing: 0;
}

.vis-form-item.is-align-left .vis-form-item__layout {
  flex-direction: row;
  align-items: flex-start;
  gap: var(--space-12);
}

.vis-form-item.is-align-left .vis-form-item__label-row {
  inline-size: var(--vis-form-item-label-width);
  min-inline-size: var(--vis-form-item-label-width);
  block-size: var(--space-32);
  flex: 0 0 var(--vis-form-item-label-width);
}

.vis-form-item.is-align-left.is-type-checkbox .vis-form-item__label-row,
.vis-form-item.is-align-left.is-type-radio .vis-form-item__label-row,
.vis-form-item.is-align-left.is-type-switch .vis-form-item__label-row,
.vis-form-item.is-align-left.is-type-rate .vis-form-item__label-row {
  block-size: var(--space-24);
}

.vis-form-item.is-align-left .vis-form-item__required {
  order: 4;
}

.vis-form-item.is-align-left .vis-form-item__body {
  min-inline-size: 0;
}

.vis-form-item.is-type-input :deep(.vis-input),
.vis-form-item.is-type-password :deep(.vis-input),
.vis-form-item.is-type-select :deep(.vis-select),
.vis-form-item.is-type-select_cascading :deep(.vis-select),
.vis-form-item.is-type-textarea :deep(.vis-input-textarea),
.vis-form-item.is-type-date_picker :deep(.vis-date-picker),
.vis-form-item.is-type-time_picker :deep(.vis-time-picker) {
  inline-size: 100% !important;
}

.vis-form-item.is-type-date_picker :deep(.vis-date-picker__control),
.vis-form-item.is-type-time_picker :deep(.vis-time-picker__control) {
  inline-size: 100% !important;
}

.vis-form-item.is-error :deep(.vis-input__field),
.vis-form-item.is-error :deep(.vis-input-number__field),
.vis-form-item.is-error :deep(.vis-input-textarea__field),
.vis-form-item.is-error :deep(.vis-select__control),
.vis-form-item.is-error :deep(.vis-date-picker__control),
.vis-form-item.is-error :deep(.vis-time-picker__control) {
  border-color: var(--color-border-danger) !important;
}

@media (max-width: 720px) {
  .vis-form-item {
    grid-column: span 1;
  }

  .vis-form-item.is-align-left .vis-form-item__layout {
    flex-direction: column;
    gap: var(--space-4);
  }

  .vis-form-item.is-align-left .vis-form-item__label-row {
    inline-size: auto;
    min-inline-size: 0;
    block-size: var(--space-24);
    flex-basis: auto;
  }
}
</style>
