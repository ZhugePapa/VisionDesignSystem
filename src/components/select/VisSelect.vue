<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { VisAvatarLabel } from '../avatar'
import VisDropdownItem from '../dropdown/VisDropdownItem.vue'
import Icon from '../icons/Icon.vue'
import { VisLoading } from '../loading'
import VisTag from '../tag/VisTag.vue'
import type { VisSelectModelValue, VisSelectOption, VisSelectProps, VisSelectValue } from './select.types'

const props = withDefaults(defineProps<VisSelectProps>(), {
  modelValue: undefined,
  options: undefined,
  type: 'default',
  state: 'default',
  placeholder: '请选择',
  prefix: true,
  prefixIcon: 'user-01',
  multiSelect: false,
  filterable: false,
  disabled: false,
  loading: false,
  open: undefined,
  searchValue: undefined,
  width: 240,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: VisSelectModelValue | undefined): void
  (event: 'update:open', value: boolean): void
  (event: 'update:searchValue', value: string): void
  (event: 'change', value: VisSelectModelValue | undefined): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
}>()

const defaultOptions: VisSelectOption[] = [
  { label: '选项一', value: 'option-1', title: '张大山', subtitle: 'zhangdashan', avatarImageVariant: '09' },
  { label: '选项二', value: 'option-2', title: '李小川', subtitle: 'lixiaochuan', avatarImageVariant: '01' },
  { label: '选项三', value: 'option-3', title: '王北辰', subtitle: 'wangbeichen', avatarImageVariant: '04' },
]

const rootEl = ref<HTMLDivElement | null>(null)
const searchInputEl = ref<HTMLInputElement | null>(null)
const internalOpen = ref(false)
const internalSearch = ref(props.searchValue ?? '')
const isFocused = ref(false)

const isOpenControlled = computed(() => props.open !== undefined)
const isSearchControlled = computed(() => props.searchValue !== undefined)
const resolvedOpen = computed(() => (isOpenControlled.value ? Boolean(props.open) : internalOpen.value))
const resolvedOptions = computed(() => props.options ?? defaultOptions)
const selectedValues = computed<VisSelectValue[]>(() => {
  if (props.modelValue === undefined) return []
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
})
const selectedOptions = computed(() =>
  selectedValues.value
    .map((value) => resolvedOptions.value.find((option) => option.value === value))
    .filter((option): option is VisSelectOption => Boolean(option)),
)
const firstSelectedOption = computed(() => selectedOptions.value[0])
const hasSelection = computed(() => selectedOptions.value.length > 0)
const visibleSearchValue = computed(() => (isSearchControlled.value ? (props.searchValue ?? '') : internalSearch.value))
const normalizedSearchValue = computed(() => visibleSearchValue.value.trim().toLowerCase())
const filteredOptions = computed(() => {
  if (!props.filterable || !normalizedSearchValue.value) return resolvedOptions.value

  return resolvedOptions.value.filter((option) => {
    const text = [option.label, option.title, option.subtitle].filter(Boolean).join(' ').toLowerCase()
    return text.includes(normalizedSearchValue.value)
  })
})
const isDisabled = computed(() => props.disabled)
const isFocusPreview = computed(() => (props.state === 'focus' || isFocused.value || resolvedOpen.value) && !isDisabled.value)
const isHoverPreview = computed(() => props.state === 'hover' && !isDisabled.value)
const isDanger = computed(() => props.state === 'danger' && !isDisabled.value)
const showSearchInput = computed(() => props.filterable && resolvedOpen.value && !isDisabled.value)
const selectStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  return { inlineSize: width }
})
const rootClasses = computed(() => ({
  [`type-${props.type}`]: true,
  'is-open': resolvedOpen.value,
  'is-filled': hasSelection.value,
  'is-disabled': isDisabled.value,
  'is-hover': isHoverPreview.value,
  'is-focus': isFocusPreview.value,
  'is-danger': isDanger.value,
  'is-multi': props.multiSelect,
  'is-filterable': props.filterable,
  'is-loading': props.loading,
}))
const prefixColor = computed(() => (isDisabled.value ? 'var(--color-fg-disabled)' : 'var(--color-fg-tertiary)'))
const textColor = computed(() => {
  if (isDisabled.value) return 'var(--color-text-disabled)'
  if (!hasSelection.value && !showSearchInput.value) return 'var(--color-text-tertiary)'
  if (isFocusPreview.value && !showSearchInput.value) return 'var(--color-text-tertiary)'
  return 'var(--color-text-primary)'
})

function setOpen(value: boolean): void {
  if (isDisabled.value) return
  if (!isOpenControlled.value) internalOpen.value = value
  emit('update:open', value)

  if (value && props.filterable) {
    void nextTick(() => searchInputEl.value?.focus())
  }
}

function toggleOpen(): void {
  setOpen(!resolvedOpen.value)
}

function setSearchValue(value: string): void {
  if (!isSearchControlled.value) internalSearch.value = value
  emit('update:searchValue', value)
}

function onSearchInput(event: Event): void {
  setSearchValue((event.target as HTMLInputElement).value)
}

function setModelValue(value: VisSelectModelValue | undefined): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function isOptionActive(option: VisSelectOption): boolean {
  return selectedValues.value.includes(option.value)
}

function selectOption(option: VisSelectOption): void {
  if (option.disabled || isDisabled.value) return

  if (props.multiSelect) {
    const next = new Set(selectedValues.value)
    if (next.has(option.value)) next.delete(option.value)
    else next.add(option.value)
    setModelValue([...next])
  } else {
    setModelValue(option.value)
    setOpen(false)
  }

  if (props.filterable) setSearchValue('')
}

function onControlMouseDown(event: MouseEvent): void {
  if (isDisabled.value) return
  if (event.target instanceof HTMLInputElement) return
  event.preventDefault()
}

function onControlClick(): void {
  toggleOpen()
}

function onRootFocus(event: FocusEvent): void {
  if (isFocused.value) return
  isFocused.value = true
  emit('focus', event)
}

function onRootBlur(event: FocusEvent): void {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && rootEl.value?.contains(nextTarget)) return

  isFocused.value = false
  emit('blur', event)
}

function onKeydown(event: KeyboardEvent): void {
  if (isDisabled.value) return
  if (event.key === 'Escape') {
    setOpen(false)
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    if (event.target instanceof HTMLInputElement && event.key === ' ') return
    event.preventDefault()
    toggleOpen()
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!resolvedOpen.value) return
  const rootElement = rootEl.value
  if (!rootElement || !(event.target instanceof Node)) return
  if (rootElement.contains(event.target)) return
  setOpen(false)
}

watch(
  () => props.open,
  (value) => {
    if (value !== undefined) internalOpen.value = value
  },
)

watch(
  () => props.searchValue,
  (value) => {
    if (value !== undefined) internalSearch.value = value
  },
)

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <div
    ref="rootEl"
    class="vis-select"
    :class="rootClasses"
    :style="selectStyle"
    @focusin="onRootFocus"
    @focusout="onRootBlur"
    @keydown="onKeydown"
  >
    <div
      class="vis-select__control"
      role="combobox"
      :tabindex="isDisabled ? -1 : 0"
      :aria-expanded="resolvedOpen ? 'true' : 'false'"
      :aria-disabled="isDisabled ? 'true' : undefined"
      aria-haspopup="listbox"
      @mousedown="onControlMouseDown"
      @click="onControlClick"
    >
      <Icon
        v-if="prefix"
        class="vis-select__prefix"
        :name="prefixIcon"
        :size="16"
        decorative
      />

      <div class="vis-select__value" :class="{ 'is-placeholder': !hasSelection && !showSearchInput }">
        <input
          v-if="showSearchInput"
          ref="searchInputEl"
          class="vis-select__search"
          type="text"
          :value="visibleSearchValue"
          :placeholder="hasSelection ? '' : placeholder"
          @input="onSearchInput"
          @click.stop
        >

        <template v-else-if="multiSelect && selectedOptions.length">
          <VisTag
            v-for="option in selectedOptions.slice(0, 2)"
            :key="option.value"
            class="vis-select__tag"
            :label="option.label"
          />
          <span v-if="selectedOptions.length > 2" class="vis-select__more">+{{ selectedOptions.length - 2 }}</span>
        </template>

        <VisAvatarLabel
          v-else-if="type === 'avatar' && firstSelectedOption"
          class="vis-select__avatar"
          size="xs"
          :title="firstSelectedOption.title ?? firstSelectedOption.label"
          :subtitle="firstSelectedOption.subtitle"
          :avatar-image-variant="firstSelectedOption.avatarImageVariant"
        />

        <span v-else class="vis-select__text">
          {{ firstSelectedOption?.label ?? placeholder }}
        </span>
      </div>

      <VisLoading v-if="loading" class="vis-select__loading" size="xs" decorative />
      <Icon
        class="vis-select__chevron"
        :name="resolvedOpen ? 'chevron-up' : 'chevron-down'"
        :size="16"
        decorative
      />
    </div>

    <div v-if="resolvedOpen" class="vis-select__dropdown" role="listbox">
      <div v-if="filteredOptions.length" class="vis-select__list">
        <VisDropdownItem
          v-for="option in filteredOptions"
          :key="option.value"
          :label="option.label"
          :type="type === 'avatar' ? 'avatar' : option.iconName ? 'icon' : 'default'"
          :icon-name="option.iconName"
          :title="option.title ?? option.label"
          :subtitle="option.subtitle"
          :avatar-image-variant="option.avatarImageVariant"
          :active="isOptionActive(option)"
          :checkable="multiSelect"
          :disabled="option.disabled"
          @select="selectOption(option)"
        />
      </div>
      <div v-else class="vis-select__empty">暂无选项</div>
    </div>
  </div>
</template>

<style scoped>
.vis-select {
  position: relative;
  box-sizing: border-box;
  min-inline-size: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  color: v-bind(textColor);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
  vertical-align: middle;
}

.vis-select__control {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding-block: 0;
  padding-inline: var(--space-12);
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  background: var(--color-bg-surface);
  cursor: pointer;
  outline: 0;
}

.vis-select.is-multi .vis-select__control,
.vis-select.type-avatar .vis-select__control {
  padding-inline: var(--space-8) var(--space-12);
}

.vis-select:is(.is-hover, :hover):not(.is-disabled):not(.is-focus):not(.is-danger) .vis-select__control {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
}

.vis-select.is-focus:not(.is-disabled) .vis-select__control {
  border-color: var(--color-border-brand);
  background: var(--color-bg-surface);
}

.vis-select.is-danger:not(.is-disabled) .vis-select__control {
  border-color: var(--color-border-danger);
  background: var(--color-bg-surface);
}

.vis-select.is-disabled .vis-select__control {
  border-color: var(--color-border-default);
  background: var(--color-bg-secondary);
  cursor: not-allowed;
}

.vis-select__prefix,
.vis-select__chevron,
.vis-select__loading {
  inline-size: var(--space-16);
  block-size: var(--space-16);
  flex: 0 0 auto;
}

.vis-select__prefix,
.vis-select__chevron {
  color: v-bind(prefixColor);
}

.vis-select__loading {
  color: var(--color-fg-brand-primary);
}

.vis-select__value {
  min-inline-size: 0;
  block-size: 100%;
  flex: 1 1 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  overflow: hidden;
}

.vis-select__text,
.vis-select__more {
  min-inline-size: 0;
  overflow: hidden;
  color: currentColor;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-select__search {
  min-inline-size: 0;
  inline-size: 100%;
  border: 0;
  padding: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text-primary);
  font: inherit;
  letter-spacing: 0;
}

.vis-select__search::placeholder {
  color: var(--color-text-tertiary);
  opacity: 1;
}

.vis-select__avatar {
  min-inline-size: 0;
  flex: 1 1 0;
}

.vis-select__tag {
  max-inline-size: 72px;
  flex: 0 1 auto;
}

.vis-select__tag :deep(.vis-tag__label) {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vis-select__more {
  color: var(--color-text-tertiary);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.vis-select__dropdown {
  position: absolute;
  inset-block-start: calc(var(--space-32) + var(--space-4));
  inset-inline-start: 0;
  z-index: 30;
  box-sizing: border-box;
  inline-size: 100%;
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  box-shadow:
    0 0 3px 0 var(--color-effect-shadow-grey),
    0 8px 20px -1px var(--color-effect-shadow-grey);
}

.vis-select__list {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-block: var(--space-6);
}

.vis-select__empty {
  box-sizing: border-box;
  block-size: 36px;
  display: flex;
  align-items: center;
  padding-inline: var(--space-16);
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.vis-select.is-disabled .vis-select__value,
.vis-select.is-disabled .vis-select__prefix,
.vis-select.is-disabled .vis-select__chevron {
  color: var(--color-text-disabled);
}
</style>
