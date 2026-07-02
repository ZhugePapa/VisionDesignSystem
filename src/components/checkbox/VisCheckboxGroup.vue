<script setup lang="ts">
import { computed } from 'vue'

import VisCheckbox from './VisCheckbox.vue'
import type { VisCheckboxGroupProps, VisCheckboxValue } from './checkbox.types'

const props = withDefaults(defineProps<VisCheckboxGroupProps>(), {
  modelValue: () => [],
  options: () => [],
  align: 'horizontal',
  disabled: false,
  name: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisCheckboxValue[]): void
  (event: 'change', value: VisCheckboxValue[]): void
}>()

const selectedSet = computed(() => new Set(props.modelValue))

function handleOptionUpdate(optionValue: VisCheckboxValue, checked: boolean): void {
  const next = new Set(selectedSet.value)

  if (checked) {
    next.add(optionValue)
  } else {
    next.delete(optionValue)
  }

  const nextValue = Array.from(next)
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<template>
  <div class="vis-checkbox-group" :class="`is-${align}`" role="group">
    <VisCheckbox
      v-for="option in options"
      :key="String(option.value)"
      :model-value="selectedSet.has(option.value)"
      :indeterminate="option.indeterminate"
      :disabled="disabled || option.disabled"
      :state="option.state ?? 'default'"
      :name="name"
      :value="option.value"
      @update:model-value="(checked) => handleOptionUpdate(option.value, checked)"
    >
      {{ option.label }}
    </VisCheckbox>
  </div>
</template>

<style scoped>
.vis-checkbox-group {
  display: inline-flex;
  align-items: flex-start;
}

.vis-checkbox-group.is-horizontal {
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.vis-checkbox-group.is-vertical {
  flex-direction: column;
  gap: 6px;
}
</style>
