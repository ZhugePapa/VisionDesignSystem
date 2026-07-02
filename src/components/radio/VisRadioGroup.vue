<script setup lang="ts">
import VisRadio from './VisRadio.vue'
import type { VisRadioGroupProps, VisRadioValue } from './radio.types'

const props = withDefaults(defineProps<VisRadioGroupProps>(), {
  modelValue: null,
  options: () => [],
  align: 'horizontal',
  disabled: false,
  name: undefined,
  radioButton: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisRadioValue): void
  (event: 'change', value: VisRadioValue): void
}>()

const generatedName = `vis-radio-group-${Math.random().toString(36).slice(2, 10)}`

function handleOptionUpdate(optionValue: VisRadioValue, checked: boolean): void {
  if (!checked) return
  emit('update:modelValue', optionValue)
  emit('change', optionValue)
}
</script>

<template>
  <div class="vis-radio-group" :class="[`is-${align}`, { 'is-button-group': radioButton }]" role="radiogroup">
    <VisRadio
      v-for="option in options"
      :key="String(option.value)"
      :model-value="modelValue === option.value"
      :disabled="disabled || option.disabled"
      :state="option.state ?? 'default'"
      :name="name ?? generatedName"
      :value="option.value"
      :radio-button="radioButton"
      :label="!radioButton"
      @update:model-value="(checked) => handleOptionUpdate(option.value, checked)"
    >
      {{ option.label }}
    </VisRadio>
  </div>
</template>

<style scoped>
.vis-radio-group {
  display: inline-flex;
  align-items: flex-start;
}

.vis-radio-group.is-horizontal {
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.vis-radio-group.is-vertical {
  flex-direction: column;
  gap: 8px;
}

.vis-radio-group.is-button-group {
  inline-size: fit-content;
  border-radius: var(--radius-sm);
  padding: 2px;
  background: var(--color-bg-secondary);
  gap: 0;
}

.vis-radio-group.is-button-group.is-horizontal {
  block-size: var(--space-32);
  align-items: center;
  flex-wrap: nowrap;
}

.vis-radio-group.is-button-group.is-vertical {
  block-size: fit-content;
}
</style>
