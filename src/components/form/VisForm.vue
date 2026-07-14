<script setup lang="ts">
import { computed, provide, ref, useSlots } from 'vue'
import {
  ElForm,
  type FormInstance,
  type FormItemProp,
  type FormValidateCallback,
  type FormValidationResult,
} from 'element-plus'

import VisButton from '../button/VisButton.vue'
import { visFormContextKey } from './form.context'
import type { VisFormProps } from './form.types'

defineOptions({
  name: 'VisForm',
})

const props = withDefaults(defineProps<VisFormProps>(), {
  model: () => ({}),
  rules: undefined,
  alignLeft: false,
  column: 1,
  button: false,
  width: undefined,
  labelWidth: 84,
  submitText: '确认',
  cancelText: '取消',
  disabled: false,
  showMessage: true,
  validateOnRuleChange: true,
  scrollToError: false,
  scrollIntoViewOptions: true,
})

const emit = defineEmits<{
  (event: 'submit', value: Event): void
  (event: 'cancel'): void
  (event: 'validate', prop: FormItemProp, isValid: boolean, message: string): void
}>()

const slots = useSlots()
const formRef = ref<FormInstance>()

const alignLeftContext = computed(() => props.alignLeft)
const labelWidthContext = computed(() => props.labelWidth)
const showMessageContext = computed(() => props.showMessage)
const rulesContext = computed(() => props.rules)
const resolvedWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  if (props.width) return props.width
  return props.column === 2 ? '800px' : '400px'
})
const formStyle = computed(() => ({
  '--vis-form-width': resolvedWidth.value,
  '--vis-form-columns': String(props.column),
}))
const hasActions = computed(() => props.button || Boolean(slots.actions))

provide(visFormContextKey, {
  alignLeft: alignLeftContext,
  labelWidth: labelWidthContext,
  showMessage: showMessageContext,
  rules: rulesContext,
})

function onSubmit(event: Event): void {
  event.preventDefault()
  emit('submit', event)
}

function validate(callback?: FormValidateCallback): FormValidationResult {
  return formRef.value?.validate(callback) ?? Promise.resolve(false)
}

function validateField(
  prop?: FormItemProp | FormItemProp[],
  callback?: FormValidateCallback,
): FormValidationResult {
  return formRef.value?.validateField(prop, callback) ?? Promise.resolve(false)
}

function resetFields(prop?: FormItemProp | FormItemProp[]): void {
  formRef.value?.resetFields(prop)
}

function clearValidate(prop?: FormItemProp | FormItemProp[]): void {
  formRef.value?.clearValidate(prop)
}

function scrollToField(prop: FormItemProp): void {
  formRef.value?.scrollToField(prop)
}

function getField(prop: FormItemProp) {
  return formRef.value?.getField(prop)
}

function setInitialValues(model: Record<string, any>): void {
  formRef.value?.setInitialValues(model)
}

defineExpose({
  formRef,
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
  getField,
  setInitialValues,
})
</script>

<template>
  <ElForm
    ref="formRef"
    class="vis-form"
    :class="[`is-column-${column}`, { 'is-align-left': alignLeft }]"
    :style="formStyle"
    :model="model"
    :rules="rules"
    :disabled="disabled"
    :show-message="showMessage"
    :validate-on-rule-change="validateOnRuleChange"
    :scroll-to-error="scrollToError"
    :scroll-into-view-options="scrollIntoViewOptions"
    label-position="top"
    @submit="onSubmit"
    @validate="(prop, isValid, message) => emit('validate', prop, isValid, message)"
  >
    <div class="vis-form__grid">
      <slot />
    </div>

    <div v-if="hasActions" class="vis-form__actions">
      <slot name="actions">
        <VisButton html-type="submit">{{ submitText }}</VisButton>
        <VisButton variant="secondary" @click="emit('cancel')">{{ cancelText }}</VisButton>
      </slot>
    </div>
  </ElForm>
</template>

<style scoped>
.vis-form {
  box-sizing: border-box;
  inline-size: var(--vis-form-width);
  max-inline-size: 100%;
  color: var(--color-text-primary);
  font-family: var(--font-family-text);
}

.vis-form__grid {
  display: grid;
  grid-template-columns: repeat(var(--vis-form-columns), minmax(0, 1fr));
  column-gap: var(--space-16);
  align-items: start;
}

.vis-form__actions {
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

@media (max-width: 720px) {
  .vis-form__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
