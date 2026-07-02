<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { VisAvatar } from '../avatar'
import VisButton from '../button/VisButton.vue'
import Icon from '../icons/Icon.vue'
import VisDropdownDivider from './VisDropdownDivider.vue'
import VisDropdownHeader from './VisDropdownHeader.vue'
import VisDropdownItem from './VisDropdownItem.vue'
import type { VisDropdownEntry, VisDropdownProps } from './dropdown.types'

const props = withDefaults(defineProps<VisDropdownProps>(), {
  items: undefined,
  open: false,
  trigger: 'button',
  header: false,
  headerType: 'group',
  buttonLabel: '触发',
  searchValue: '',
  searchPlaceholder: '请输入关键字',
  avatarImageVariant: '09',
})

const emit = defineEmits<{
  select: [payload: { item: VisDropdownEntry; index: number }]
  'update:open': [value: boolean]
  'update:searchValue': [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const internalOpen = ref(props.open)
const isAvatarTrigger = computed(() => props.trigger === 'avatar')

const generatedItems = computed<VisDropdownEntry[]>(() => [
  { type: 'item', itemType: 'icon', iconName: 'settings-01', label: '菜单选项' },
  { type: 'item', label: '菜单选项' },
  { type: 'divider' },
  { type: 'item', itemType: 'icon', iconName: 'log-out-01', label: '登出' },
])
const resolvedItems = computed(() => props.items ?? generatedItems.value)

watch(
  () => props.open,
  (value) => {
    internalOpen.value = value
  },
)

function setOpen(value: boolean): void {
  internalOpen.value = value
  emit('update:open', value)
}

function toggleOpen(): void {
  setOpen(!internalOpen.value)
}

function onSelect(item: VisDropdownEntry, index: number): void {
  if (item.disabled) return
  emit('select', { item, index })
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!internalOpen.value) return
  const rootElement = rootRef.value
  if (!rootElement || !(event.target instanceof Node)) return
  if (rootElement.contains(event.target)) return
  setOpen(false)
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <div ref="rootRef" class="vis-dropdown-shell" :class="{ 'trigger-avatar': isAvatarTrigger }">
    <slot name="trigger" :open="internalOpen" :toggle="toggleOpen">
      <button
        v-if="isAvatarTrigger"
        class="vis-dropdown__avatar-trigger"
        type="button"
        :aria-expanded="internalOpen ? 'true' : 'false'"
        aria-haspopup="menu"
        @click="toggleOpen"
      >
        <VisAvatar size="lg" type="image" :image-variant="avatarImageVariant" decorative />
      </button>

      <VisButton
        v-else
        class="vis-dropdown__button-trigger"
        variant="secondary"
        size="md"
        suffix
        suffix-icon-name="chevron-down"
        :aria-expanded="internalOpen ? 'true' : 'false'"
        aria-haspopup="menu"
        @click="toggleOpen"
      >
        {{ buttonLabel }}
      </VisButton>
    </slot>

    <div v-if="internalOpen" class="vis-dropdown" role="menu">
      <VisDropdownHeader v-if="header" :type="headerType" />

      <div class="vis-dropdown__list">
        <slot>
          <template v-for="(item, index) in resolvedItems" :key="`${item.type ?? 'item'}-${index}`">
            <div v-if="item.type === 'search'" class="vis-dropdown__search-row">
              <div class="vis-dropdown__search">
                <Icon class="vis-dropdown__search-icon" name="search-lg" :size="16" decorative />
                <input
                  class="vis-dropdown__search-input"
                  type="search"
                  :value="searchValue"
                  :placeholder="searchPlaceholder"
                  @input="emit('update:searchValue', ($event.target as HTMLInputElement).value)"
                />
              </div>
            </div>

            <VisDropdownDivider v-else-if="item.type === 'divider'" />

            <VisDropdownItem
              v-else
              :label="item.label"
              :type="item.itemType"
              :active="item.active"
              :arrow="item.arrow"
              :checkable="item.checkable"
              :disabled="item.disabled"
              :icon-name="item.iconName"
              :state="item.state"
              :title="item.title"
              :subtitle="item.subtitle"
              :avatar-image-variant="item.avatarImageVariant"
              @select="onSelect(item, index)"
            />
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-dropdown-shell {
  position: relative;
  box-sizing: border-box;
  inline-size: max-content;
  display: inline-flex;
  align-items: flex-start;
  vertical-align: top;
}

.vis-dropdown__button-trigger,
.vis-dropdown__avatar-trigger {
  flex: 0 0 auto;
}

.vis-dropdown__avatar-trigger {
  box-sizing: border-box;
  inline-size: var(--space-40);
  block-size: var(--space-40);
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
}

.vis-dropdown {
  position: absolute;
  inset-block-start: var(--space-40);
  inset-inline-start: 0;
  z-index: 20;
  box-sizing: border-box;
  inline-size: var(--space-256);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  background: var(--color-bg-surface);
  box-shadow:
    0 0 3px 0 var(--color-effect-shadow-grey),
    0 8px 20px -1px var(--color-effect-shadow-grey);
}

.vis-dropdown-shell.trigger-avatar .vis-dropdown {
  inset-block-start: var(--space-48);
}

.vis-dropdown__list {
  inline-size: 100%;
  min-block-size: 0;
  padding-block: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.vis-dropdown__search-row {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-40);
  padding-block: var(--space-4);
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
}

.vis-dropdown__search {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-32);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-tertiary);
  background: var(--color-bg-surface);
}

.vis-dropdown__search:focus-within {
  border-color: var(--color-border-brand);
  box-shadow: 0 0 0 2px var(--color-effect-focus-ring-brand);
}

.vis-dropdown__search-icon {
  flex: 0 0 auto;
  color: var(--color-fg-tertiary);
}

.vis-dropdown__search-input {
  min-inline-size: 0;
  flex: 1 1 0;
  border: 0;
  padding: 0;
  outline: 0;
  color: var(--color-text-primary);
  background: transparent;
  font: inherit;
  font-family: var(--font-family-sans);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.vis-dropdown__search-input::placeholder {
  color: var(--color-text-tertiary);
}

.vis-dropdown__search-input::-webkit-search-cancel-button {
  appearance: none;
}
</style>
