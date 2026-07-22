<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import VisButton from '../button/VisButton.vue'
import { visionConfigKey } from '../config-provider/config-provider.context'
import VisDropdownDivider from '../dropdown/VisDropdownDivider.vue'
import VisDropdownItem from '../dropdown/VisDropdownItem.vue'
import VisScrollShadow from '../scroll-shadow/VisScrollShadow.vue'
import VisMenuBrandMark from './VisMenuBrandMark.vue'
import VisMenuGroup from './VisMenuGroup.vue'
import VisMenuItem from './VisMenuItem.vue'
import VisProjectLogo from './VisProjectLogo.vue'
import VisProjectCell from './VisProjectCell.vue'
import type {
  VisMenuItemData,
  VisMenuKey,
  VisMenuProject,
  VisMenuProps,
  VisMenuSection,
  VisMenuSelectPayload,
} from './menu.types'

defineOptions({ name: 'VisMenu' })

const props = withDefaults(defineProps<VisMenuProps>(), {
  type: 'project',
  items: () => [],
  sections: () => [],
  activeKey: undefined,
  openKey: undefined,
  collapsed: false,
  project: () => ({ key: 'project', label: '飞机照明系统', logoVariant: 'logo_003' }),
  projects: () => [],
  projectSwitcherOpen: undefined,
  brandTitle: 'VISSLM DevOps',
  showFooter: true,
  helpLabel: '帮助',
  moreProjectsLabel: '查看更多项目',
})

const emit = defineEmits<{
  'update:openKey': [value: VisMenuKey | null]
  'update:collapsed': [value: boolean]
  'update:projectSwitcherOpen': [value: boolean]
  select: [payload: VisMenuSelectPayload]
  'project-change': [project: VisMenuProject]
  'request-more-projects': []
  help: []
}>()

const config = inject(visionConfigKey, undefined)
const rootRef = ref<HTMLElement | null>(null)
const flyoutRef = ref<HTMLElement | null>(null)
const internalOpenKey = ref<VisMenuKey | null>(null)
const internalProjectSwitcherOpen = ref(false)
const hoverParent = ref<VisMenuItemData | null>(null)
const flyoutTop = ref(0)
const flyoutLeft = ref(0)
let hoverOpenTimer: ReturnType<typeof setTimeout> | undefined
let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined

const isMain = computed(() => props.type === 'main')
const isCollapsed = computed(() => props.type === 'project' && props.collapsed)
const currentOpenKey = computed(() => (props.openKey === undefined ? internalOpenKey.value : props.openKey))
const isProjectSwitcherOpen = computed(() =>
  props.projectSwitcherOpen === undefined ? internalProjectSwitcherOpen.value : props.projectSwitcherOpen,
)
const teleportTarget = computed(() => config?.value.teleportTo ?? 'body')
const teleportedTheme = computed(() => config?.value.theme ?? 'light')
const resolvedSections = computed<VisMenuSection[]>(() => {
  if (props.sections.length > 0) return props.sections
  return [{ key: 'default', items: props.items }]
})
const helpItem = computed<VisMenuItemData>(() => ({
  key: '__vis-menu-help',
  label: props.helpLabel,
  iconName: 'help-square',
}))

function hasChildren(item: VisMenuItemData): boolean {
  return Boolean(item.children?.length)
}

function containsKey(item: VisMenuItemData, key: VisMenuKey | undefined): boolean {
  if (key === undefined) return false
  return item.key === key || Boolean(item.children?.some((child) => containsKey(child, key)))
}

function isActive(item: VisMenuItemData): boolean {
  return item.key === props.activeKey
}

function findParentKey(key: VisMenuKey | undefined): VisMenuKey | null {
  if (key === undefined) return null
  for (const section of resolvedSections.value) {
    for (const item of section.items) {
      if (item.children?.some((child) => containsKey(child, key))) return item.key
    }
  }
  return null
}

function setOpenKey(value: VisMenuKey | null): void {
  if (props.openKey === undefined) internalOpenKey.value = value
  emit('update:openKey', value)
}

function setProjectSwitcherOpen(value: boolean): void {
  if (props.projectSwitcherOpen === undefined) internalProjectSwitcherOpen.value = value
  emit('update:projectSwitcherOpen', value)
}

function resolveDefaultChild(item: VisMenuItemData): VisMenuItemData | undefined {
  const enabledChildren = item.children?.filter((child) => !child.disabled) ?? []
  return enabledChildren.find((child) => child.key === item.defaultChildKey) ?? enabledChildren[0]
}

function emitSelection(
  item: VisMenuItemData,
  source: VisMenuSelectPayload['source'],
  parent?: VisMenuItemData,
): void {
  emit('select', {
    key: item.key,
    item,
    route: item.route,
    source,
    parent,
  })
}

function selectItem(item: VisMenuItemData): void {
  if (item.disabled) return
  if (hasChildren(item)) {
    const child = resolveDefaultChild(item)
    setOpenKey(item.key)
    if (child) emitSelection(child, 'parent', item)
  } else {
    emitSelection(item, 'item')
  }
  closeFlyoutImmediately()
}

function selectChild(child: VisMenuItemData, parent: VisMenuItemData, source: 'item' | 'flyout'): void {
  if (child.disabled) return
  setOpenKey(parent.key)
  emitSelection(child, source, parent)
  closeFlyoutImmediately()
}

function clearHoverTimers(): void {
  if (hoverOpenTimer) clearTimeout(hoverOpenTimer)
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer)
  hoverOpenTimer = undefined
  hoverCloseTimer = undefined
}

function placeFlyout(anchor: HTMLElement): void {
  const rect = anchor.getBoundingClientRect()
  flyoutTop.value = Math.max(8, Math.min(rect.top, window.innerHeight - 96))
  flyoutLeft.value = Math.min(rect.right + 4, window.innerWidth - 200)
}

function openFlyout(item: VisMenuItemData, anchor: HTMLElement, immediate = false): void {
  if (!hasChildren(item) || item.disabled) return
  if (!isCollapsed.value && currentOpenKey.value === item.key) {
    closeFlyoutImmediately()
    return
  }
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer)
  const show = () => {
    placeFlyout(anchor)
    hoverParent.value = item
  }
  if (immediate) {
    show()
    nextTick(() => flyoutRef.value?.querySelector<HTMLElement>('[role="menuitem"]')?.focus())
  } else {
    if (hoverOpenTimer) clearTimeout(hoverOpenTimer)
    hoverOpenTimer = setTimeout(show, 80)
  }
}

function scheduleFlyoutClose(): void {
  if (hoverOpenTimer) clearTimeout(hoverOpenTimer)
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer)
  hoverCloseTimer = setTimeout(() => {
    hoverParent.value = null
  }, 140)
}

function keepFlyoutOpen(): void {
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer)
}

function closeFlyoutImmediately(): void {
  clearHoverTimers()
  hoverParent.value = null
}

function toggleProjectSwitcher(): void {
  closeFlyoutImmediately()
  setProjectSwitcherOpen(!isProjectSwitcherOpen.value)
}

function selectProject(project: VisMenuProject): void {
  if (project.disabled) return
  setProjectSwitcherOpen(false)
  setOpenKey(null)
  emit('project-change', project)
}

function onRequestMoreProjects(): void {
  setProjectSwitcherOpen(false)
  emit('request-more-projects')
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!(event.target instanceof Node)) return
  if (rootRef.value?.contains(event.target) || flyoutRef.value?.contains(event.target)) return
  setProjectSwitcherOpen(false)
  closeFlyoutImmediately()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return
  setProjectSwitcherOpen(false)
  closeFlyoutImmediately()
}

watch(
  () => props.activeKey,
  (activeKey) => {
    if (props.openKey !== undefined || isCollapsed.value) return
    const parentKey = findParentKey(activeKey)
    if (parentKey !== null) internalOpenKey.value = parentKey
  },
  { immediate: true },
)

watch(isCollapsed, (value) => {
  if (value) closeFlyoutImmediately()
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  clearHoverTimers()
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <nav
    ref="rootRef"
    class="vis-menu"
    :class="[`type-${type}`, { 'is-collapsed': isCollapsed }]"
    :aria-label="isMain ? '主导航' : '项目导航'"
  >
    <div v-if="isMain" class="vis-menu__brand">
      <slot name="brand">
        <VisMenuBrandMark :size="32" />
        <strong class="vis-menu__brand-title">{{ brandTitle }}</strong>
      </slot>
    </div>

    <div v-else class="vis-menu__project-wrap">
      <VisProjectCell
        :project="project"
        :collapsed="isCollapsed"
        :active="isProjectSwitcherOpen"
        @toggle="toggleProjectSwitcher"
      >
        <template v-if="$slots['project-logo']" #logo="slotProps">
          <slot name="project-logo" v-bind="slotProps" />
        </template>
      </VisProjectCell>

      <Transition name="vis-menu-popover">
        <div v-if="isProjectSwitcherOpen" class="vis-menu__project-dropdown" role="menu">
          <VisDropdownItem
            v-for="projectOption in projects"
            :key="projectOption.key"
            type="icon"
            :label="projectOption.label"
            :active="projectOption.key === project.key"
            :disabled="projectOption.disabled"
            @select="selectProject(projectOption)"
          >
            <template #icon>
              <VisProjectLogo :variant="projectOption.logoVariant ?? 'logo_001'" :size="16" />
            </template>
          </VisDropdownItem>
          <VisDropdownDivider v-if="projects.length > 0" />
          <VisDropdownItem
            type="icon"
            icon-name="file-06"
            :label="moreProjectsLabel"
            @select="onRequestMoreProjects"
          />
        </div>
      </Transition>
    </div>

    <VisScrollShadow class="vis-menu__scroll" :size="32" hide-scroll-bar>
      <div class="vis-menu__sections">
        <section
          v-for="(section, sectionIndex) in resolvedSections"
          :key="section.key"
          class="vis-menu__section"
        >
          <div v-if="isMain && sectionIndex > 0" class="vis-menu__section-space" />
          <VisMenuGroup v-if="section.label && !isCollapsed" :label="section.label" />

          <div class="vis-menu__items">
            <template v-for="item in section.items" :key="item.key">
              <VisMenuItem
                :item="item"
                :active="isActive(item)"
                :open="currentOpenKey === item.key"
                :collapsed="isCollapsed"
                @select="selectItem(item)"
                @hover-open="openFlyout(item, $event)"
                @hover-close="scheduleFlyoutClose"
                @keyboard-open="openFlyout(item, $event, true)"
                @keyboard-close="closeFlyoutImmediately"
              />

              <div
                v-if="!isCollapsed && currentOpenKey === item.key && item.children?.length"
                class="vis-menu__subitems"
              >
                <VisMenuItem
                  v-for="child in item.children"
                  :key="child.key"
                  :item="child"
                  :active="child.key === activeKey"
                  sub-level
                  @select="selectChild(child, item, 'item')"
                />
              </div>
            </template>
          </div>
        </section>
      </div>
    </VisScrollShadow>

    <div v-if="!isMain && showFooter" class="vis-menu__footer">
      <VisMenuItem
        class="vis-menu__footer-action"
        :item="helpItem"
        :collapsed="isCollapsed"
        @select="emit('help')"
      />
      <VisButton
        class="vis-menu__collapse"
        variant="text"
        size="md"
        icon-only
        icon-name="layout-left"
        :label="isCollapsed ? '展开项目导航' : '折叠项目导航'"
        @click="emit('update:collapsed', !collapsed)"
      />
    </div>

    <Teleport :to="teleportTarget">
      <Transition name="vis-menu-popover">
        <div
          v-if="hoverParent"
          ref="flyoutRef"
          class="vis-menu-flyout"
          :data-theme="teleportedTheme"
          :style="{ top: `${flyoutTop}px`, left: `${flyoutLeft}px` }"
          role="menu"
          :aria-label="`${hoverParent.label} 子菜单`"
          @mouseenter="keepFlyoutOpen"
          @mouseleave="scheduleFlyoutClose"
          @keydown.esc="closeFlyoutImmediately"
        >
          <VisDropdownItem
            v-for="child in hoverParent.children"
            :key="child.key"
            :label="child.label"
            :active="child.key === activeKey"
            :disabled="child.disabled"
            @select="selectChild(child, hoverParent, 'flyout')"
          />
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<style scoped>
.vis-menu {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  inline-size: 216px;
  min-block-size: 0;
  block-size: 100%;
  border-inline-end: 0;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
  box-shadow: inset -1px 0 0 var(--color-border-default);
  font-family: var(--font-family-sans);
  overflow: visible;
  transition: inline-size 160ms ease;
}

.vis-menu.type-main {
  inline-size: var(--space-256);
  box-shadow: var(--shadow-default-md);
}

.vis-menu.is-collapsed {
  inline-size: var(--space-64);
  align-items: center;
}

.vis-menu__brand {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 72px;
  padding: var(--space-20) var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex: 0 0 auto;
}

.vis-menu__brand-title {
  min-inline-size: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-menu__project-wrap {
  position: relative;
  z-index: 4;
  inline-size: 100%;
  flex: 0 0 auto;
}

.vis-menu__project-dropdown {
  position: absolute;
  inset-block-start: 60px;
  inset-inline-start: 0;
  z-index: 20;
  box-sizing: border-box;
  inline-size: var(--space-256);
  border: 0;
  border-radius: var(--radius-md);
  padding-block: var(--space-6);
  background: var(--color-bg-surface);
  box-shadow:
    inset 0 0 0 1px var(--color-border-default),
    var(--shadow-default-md);
  overflow: hidden;
}

.vis-menu__scroll {
  inline-size: 100%;
  min-block-size: 0;
  flex: 1 1 0;
}

.vis-menu__sections {
  box-sizing: border-box;
  inline-size: 100%;
  padding: var(--space-12);
}

.vis-menu.is-collapsed .vis-menu__sections {
  padding-inline: var(--space-12);
}

.vis-menu__section,
.vis-menu__items,
.vis-menu__subitems {
  inline-size: 100%;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
}

.vis-menu.is-collapsed .vis-menu__section,
.vis-menu.is-collapsed .vis-menu__items {
  align-items: center;
}

.vis-menu__section-space {
  block-size: var(--space-8);
}

.vis-menu__footer {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-56);
  padding: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 0 0 auto;
}

.vis-menu.is-collapsed .vis-menu__footer {
  block-size: auto;
  flex-direction: column;
}

:deep(.vis-menu__footer-action) {
  inline-size: auto;
  block-size: var(--space-32);
  min-inline-size: 0;
  padding: 0 var(--space-12);
  flex: 1 1 0;
}

.vis-menu__collapse {
  flex: 0 0 var(--space-32);
}

.vis-menu.is-collapsed :deep(.vis-menu__footer-action) {
  inline-size: var(--space-32);
  flex-basis: var(--space-32);
  padding: 0;
}

.vis-menu-popover-enter-active,
.vis-menu-popover-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}

.vis-menu-popover-enter-from,
.vis-menu-popover-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>

<style>
.vis-menu-flyout {
  position: fixed;
  z-index: 3600;
  box-sizing: border-box;
  inline-size: var(--space-192);
  max-block-size: calc(100vh - var(--space-16));
  border: 0;
  border-radius: var(--radius-md);
  padding-block: var(--space-6);
  overflow-y: auto;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  box-shadow:
    inset 0 0 0 1px var(--color-border-default),
    var(--shadow-default-md);
  font-family: var(--font-family-sans);
}
</style>
