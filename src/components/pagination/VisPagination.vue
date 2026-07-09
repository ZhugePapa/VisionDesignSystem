<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import type { VisPaginationProps, VisPaginationSize } from './pagination.types'

type PageItem = number | 'ellipsis'

const props = withDefaults(defineProps<VisPaginationProps>(), {
  modelValue: 1,
  total: 196,
  pageSize: 20,
  pageSizeOptions: () => [10, 20, 50, 100],
  pageCount: undefined,
  size: 'md',
  simple: false,
  count: true,
  quantity: true,
  goto: true,
  disabled: false,
  ariaLabel: '分页器',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  'update:pageSize': [value: number]
  pageSizeChange: [value: number]
}>()

const gotoValue = ref(String(props.modelValue))

const resolvedPageCount = computed(() => {
  if (props.pageCount !== undefined) return Math.max(1, Math.trunc(props.pageCount))
  return Math.max(1, Math.ceil(props.total / Math.max(1, props.pageSize)))
})

const currentPage = computed(() => clampPage(props.modelValue))
const isSmaller = computed(() => props.size === 'sm')
const pageSizeButtonSize = computed<VisPaginationSize>(() => (isSmaller.value ? 'sm' : 'md'))
const navigatorIconSize = computed(() => (isSmaller.value ? 12 : 16))

const visiblePages = computed<PageItem[]>(() => {
  const totalPages = resolvedPageCount.value
  const page = currentPage.value

  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (page >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages]
})

function clampPage(value: number): number {
  const normalized = Number.isFinite(value) ? Math.trunc(value) : 1
  return Math.min(Math.max(normalized, 1), resolvedPageCount.value)
}

function setPage(value: number): void {
  if (props.disabled) return
  const nextPage = clampPage(value)
  if (nextPage === currentPage.value) return
  emit('update:modelValue', nextPage)
  emit('change', nextPage)
}

function goPrevious(): void {
  setPage(currentPage.value - 1)
}

function goNext(): void {
  setPage(currentPage.value + 1)
}

function onGotoInput(event: Event): void {
  gotoValue.value = (event.target as HTMLInputElement).value.replace(/[^\d]/g, '')
}

function commitGoto(): void {
  if (!gotoValue.value) {
    gotoValue.value = String(currentPage.value)
    return
  }

  setPage(Number(gotoValue.value))
  gotoValue.value = String(clampPage(Number(gotoValue.value)))
}

function switchPageSize(): void {
  if (props.disabled || props.pageSizeOptions.length === 0) return
  const currentIndex = props.pageSizeOptions.indexOf(props.pageSize)
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % props.pageSizeOptions.length
  const nextPageSize = props.pageSizeOptions[nextIndex]
  emit('update:pageSize', nextPageSize)
  emit('pageSizeChange', nextPageSize)
}

watch(
  () => props.modelValue,
  (value) => {
    gotoValue.value = String(clampPage(value))
  },
)
</script>

<template>
  <nav
    class="vis-pagination"
    :class="[
      `size-${size}`,
      {
        'is-simple': simple,
        'is-disabled': disabled,
      },
    ]"
    :aria-label="ariaLabel"
  >
    <div v-if="count" class="vis-pagination__count" aria-live="polite">
      <span>总计</span>
      <strong>{{ total }}</strong>
      <span>条</span>
    </div>

    <span class="vis-pagination__spacer" aria-hidden="true" />

    <div class="vis-pagination__pager">
      <button
        class="vis-pagination__navigator"
        :disabled="disabled || currentPage <= 1"
        type="button"
        aria-label="上一页"
        @click="goPrevious"
      >
        <Icon name="chevron-left" :size="navigatorIconSize" decorative />
      </button>

      <template v-if="simple">
        <input
          class="vis-pagination__simple-input"
          inputmode="numeric"
          :value="gotoValue"
          :disabled="disabled"
          aria-label="当前页"
          @input="onGotoInput"
          @blur="commitGoto"
          @keydown.enter.prevent="commitGoto"
        >
        <Icon class="vis-pagination__separator" name="slash-divider" :size="16" decorative />
        <button
          class="vis-pagination__page"
          :class="{ 'is-disabled': disabled }"
          type="button"
          :disabled="disabled"
          @click="setPage(resolvedPageCount)"
        >
          {{ resolvedPageCount }}
        </button>
      </template>

      <template v-else>
        <button
          v-for="(page, index) in visiblePages"
          :key="`${page}-${index}`"
          class="vis-pagination__page"
          :class="{
            'is-active': page === currentPage,
            'is-ellipsis': page === 'ellipsis',
          }"
          type="button"
          :disabled="disabled || page === 'ellipsis'"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="typeof page === 'number' ? setPage(page) : undefined"
        >
          {{ page === 'ellipsis' ? '...' : page }}
        </button>
      </template>

      <button
        class="vis-pagination__navigator"
        :disabled="disabled || currentPage >= resolvedPageCount"
        type="button"
        aria-label="下一页"
        @click="goNext"
      >
        <Icon name="chevron-right" :size="navigatorIconSize" decorative />
      </button>
    </div>

    <VisButton
      v-if="quantity"
      class="vis-pagination__quantity"
      variant="secondary"
      :size="pageSizeButtonSize"
      suffix
      suffix-icon-name="chevron-down"
      :disabled="disabled"
      :label="`${pageSize} 条/页`"
      @click="switchPageSize"
    />

    <div v-if="goto && !simple" class="vis-pagination__goto">
      <span>前往</span>
      <input
        class="vis-pagination__goto-input"
        inputmode="numeric"
        :value="gotoValue"
        :disabled="disabled"
        aria-label="跳转页码"
        @input="onGotoInput"
        @blur="commitGoto"
        @keydown.enter.prevent="commitGoto"
      >
      <span>页</span>
    </div>
  </nav>
</template>

<style scoped>
.vis-pagination {
  box-sizing: border-box;
  inline-size: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-16);
  color: var(--color-text-secondary);
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-pagination__count,
.vis-pagination__goto {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.vis-pagination__count strong {
  color: var(--color-text-primary);
  font-weight: 500;
}

.vis-pagination__spacer {
  min-inline-size: 0;
  block-size: 22px;
  flex: 1 1 0;
}

.vis-pagination__pager {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-pagination.is-simple .vis-pagination__pager {
  gap: var(--space-4);
}

.vis-pagination__navigator,
.vis-pagination__page {
  box-sizing: border-box;
  border: 0;
  border-radius: var(--radius-sm);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: transparent;
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
  cursor: pointer;
}

.vis-pagination__navigator {
  inline-size: var(--space-32);
  block-size: var(--space-32);
  padding: var(--space-8);
}

.vis-pagination__page {
  min-inline-size: 30px;
  block-size: var(--space-32);
  padding: 5px var(--space-8);
}

.vis-pagination__page:is(:hover, .is-hover):not(:disabled):not(.is-active),
.vis-pagination__navigator:hover:not(:disabled) {
  background: var(--color-bg-secondary);
}

.vis-pagination__page.is-active {
  color: var(--color-text-brand-primary);
  background: var(--color-fg-brand-subtle);
}

.vis-pagination__page.is-ellipsis {
  cursor: default;
}

.vis-pagination__navigator:disabled,
.vis-pagination__page:disabled,
.vis-pagination__simple-input:disabled,
.vis-pagination__goto-input:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.vis-pagination__quantity {
  flex: 0 0 auto;
}

.vis-pagination__goto-input,
.vis-pagination__simple-input {
  box-sizing: border-box;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  font: inherit;
  text-align: center;
  outline: 0;
}

.vis-pagination__goto-input {
  inline-size: var(--space-40);
  block-size: var(--space-32);
}

.vis-pagination__simple-input {
  inline-size: 58px;
  block-size: var(--space-32);
  padding-inline: var(--space-16);
}

.vis-pagination__separator {
  color: var(--color-text-tertiary);
}

.vis-pagination.size-sm {
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.vis-pagination.size-sm .vis-pagination__navigator {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  padding: var(--space-4);
}

.vis-pagination.size-sm .vis-pagination__page {
  min-inline-size: var(--space-24);
  block-size: 22px;
  padding: 2px var(--space-4);
  font-size: var(--font-text-sm-size);
  line-height: var(--font-text-sm-line-height);
}

.vis-pagination.size-sm .vis-pagination__goto-input {
  inline-size: var(--space-32);
  block-size: var(--space-24);
}

.vis-pagination.size-sm .vis-pagination__simple-input {
  inline-size: 50px;
  block-size: var(--space-24);
  padding-inline: var(--space-8);
}

.vis-pagination.size-sm .vis-pagination__quantity {
  --vis-button-gap: var(--space-4);
}

.vis-pagination.is-disabled {
  color: var(--color-text-disabled);
}
</style>
