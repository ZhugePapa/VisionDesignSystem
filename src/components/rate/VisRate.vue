<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    count?: number
    allowHalf?: boolean
    disabled?: boolean
    readonly?: boolean
    ariaLabel?: string
  }>(),
  {
    modelValue: 0,
    count: 5,
    allowHalf: false,
    disabled: false,
    readonly: false,
    ariaLabel: '评分',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'change', value: number): void
}>()

const hoverValue = ref<number | null>(null)
const hoverIndex = ref<number | null>(null)

const normalizedCount = computed(() => Math.max(1, Math.trunc(props.count)))

function quantizeValue(value: number): number {
  const clamped = Math.min(Math.max(value, 0), normalizedCount.value)
  if (!props.allowHalf) return Math.round(clamped)
  return Math.round(clamped * 2) / 2
}

const currentValue = computed(() => quantizeValue(props.modelValue))
const displayValue = computed(() => (hoverValue.value == null ? currentValue.value : hoverValue.value))
const itemIndexes = computed(() => Array.from({ length: normalizedCount.value }, (_, index) => index + 1))

function fillRatioAt(index: number): number {
  const diff = displayValue.value - (index - 1)
  if (diff >= 1) return 1
  if (diff <= 0) return 0
  return diff >= 0.5 ? 0.5 : diff
}

function isInteractive(): boolean {
  return !(props.disabled || props.readonly)
}

function resolveItemValue(index: number, event?: MouseEvent): number {
  if (!props.allowHalf || !event) return index
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const relative = event.clientX - rect.left
  return relative <= rect.width / 2 ? index - 0.5 : index
}

function onItemMove(index: number, event: MouseEvent): void {
  if (!isInteractive()) return
  hoverIndex.value = index
  hoverValue.value = quantizeValue(resolveItemValue(index, event))
}

function onItemClick(index: number, event: MouseEvent): void {
  if (!isInteractive()) return
  const value = quantizeValue(resolveItemValue(index, event))
  emit('update:modelValue', value)
  emit('change', value)
}

function onMouseLeave(): void {
  hoverValue.value = null
  hoverIndex.value = null
}
</script>

<template>
  <div
    class="vis-rate"
    :class="{ 'is-disabled': disabled, 'is-readonly': readonly }"
    role="radiogroup"
    :aria-label="ariaLabel"
    @mouseleave="onMouseLeave"
  >
    <button
      v-for="index in itemIndexes"
      :key="`rate-${index}`"
      type="button"
      class="vis-rate__item"
      :class="{ 'is-hovered': hoverIndex !== null && index <= hoverIndex }"
      :disabled="disabled || readonly"
      :aria-label="`评分 ${index}`"
      :aria-checked="displayValue >= index"
      role="radio"
      @mousemove="onItemMove(index, $event)"
      @click="onItemClick(index, $event)"
    >
      <span class="vis-rate__star">
        <span
          class="vis-rate__fill"
          :style="{ '--vis-rate-fill-clip': `${(1 - fillRatioAt(index)) * 100}%` }"
        />
      </span>
    </button>
  </div>
</template>

<style scoped>
.vis-rate {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  block-size: var(--space-24);
}

.vis-rate__item {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vis-rate.is-disabled .vis-rate__item,
.vis-rate.is-readonly .vis-rate__item {
  cursor: default;
}

.vis-rate__star {
  --vis-rate-star-graphic-size: 20px;
  --vis-rate-star-mask: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22%3E%3Cpath fill=%22black%22 d=%22M9.99806 1.25C10.2412 1.24965 10.4644 1.38716 10.5727 1.60515L13.0634 6.62973L18.6194 7.44256C18.8597 7.47787 19.06 7.64653 19.1353 7.87774C19.2102 8.10872 19.1486 8.36294 18.9754 8.53301L14.9333 12.4947L15.8939 18.0007C15.9355 18.2413 15.8365 18.485 15.6391 18.6284C15.4413 18.7719 15.1789 18.7895 14.9633 18.6747L9.99931 16.0261L5.03784 18.6747C4.8222 18.7898 4.55874 18.7718 4.36082 18.6284C4.16302 18.4847 4.06382 18.2404 4.106 17.9994L5.07281 12.4934L1.02568 8.53301C0.852104 8.3629 0.789535 8.10902 0.864548 7.87774C0.939938 7.64615 1.1409 7.47752 1.38168 7.44256L6.96771 6.62973L9.42472 1.6089L9.47094 1.53012C9.58856 1.35702 9.78511 1.25055 9.99806 1.25Z%22/%3E%3C/svg%3E');

  position: relative;
  inline-size: var(--space-24);
  block-size: var(--space-24);
}

.vis-rate__item.is-hovered .vis-rate__star {
  --vis-rate-star-graphic-size: 22px;
}

.vis-rate.is-disabled .vis-rate__item.is-hovered .vis-rate__star,
.vis-rate.is-readonly .vis-rate__item.is-hovered .vis-rate__star {
  --vis-rate-star-graphic-size: 20px;
}

.vis-rate__star::before,
.vis-rate__fill::before {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: var(--vis-rate-star-graphic-size);
  block-size: var(--vis-rate-star-graphic-size);
  transform: translate(-50%, -50%);
  -webkit-mask-image: var(--vis-rate-star-mask);
  mask-image: var(--vis-rate-star-mask);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  content: '';
  transition:
    inline-size 120ms ease,
    block-size 120ms ease;
}

.vis-rate__star::before {
  background: var(--color-bg-tertiary);
}

.vis-rate__fill {
  position: absolute;
  inset: 0;
  block-size: var(--space-24);
  clip-path: inset(0 var(--vis-rate-fill-clip, 100%) 0 0);
  overflow: hidden;
}

.vis-rate__fill::before {
  background: var(--utility-orange-500);
}
</style>
