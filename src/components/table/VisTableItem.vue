<script setup lang="ts">
import { computed } from 'vue'

import VisAvatarLabel from '../avatar/VisAvatarLabel.vue'
import VisBadge from '../badge/VisBadge.vue'
import VisButton from '../button/VisButton.vue'
import VisCheckbox from '../checkbox/VisCheckbox.vue'
import Icon from '../icons/Icon.vue'
import VisRadio from '../radio/VisRadio.vue'
import VisRate from '../rate/VisRate.vue'
import VisTag from '../tag/VisTag.vue'
import VisTableLink from './VisTableLink.vue'
import VisTableTreePrefix from './VisTableTreePrefix.vue'
import VisTableTrendIcon from './VisTableTrendIcon.vue'
import type { VisTableAction, VisTableItemProps } from './table.types'

const props = withDefaults(defineProps<VisTableItemProps>(), {
  type: 'text',
  appearance: 'horizontal',
  state: 'default',
  value: undefined,
  prefix: false,
  suffix: false,
  prefixIcon: 'zap',
  suffixLabel: 'Hot!',
  href: undefined,
  checked: false,
  radioChecked: false,
  rateValue: 3.5,
  numberValue: undefined,
  trend: 'up',
  badgeType: 'status',
  badgeColorType: 'success',
  badgeSolid: false,
  badgeSubtle: false,
  tagLabel: '菜单',
  avatarTitle: '张大山',
  avatarSubtitle: 'zhangdashan',
  avatarImageVariant: '09',
  avatarAddition: true,
  treeLevel: 1,
  treeWithFolder: true,
  treeExpanded: false,
  actions: () => [
    { icon: 'edit-03', label: '编辑' },
    { icon: 'trash-01', label: '删除' },
    { icon: 'dots-horizontal', label: '更多' },
  ],
})

const emit = defineEmits<{
  'update:checked': [checked: boolean]
  'update:radioChecked': [checked: boolean]
  'tree-toggle': [expanded: boolean]
  'action-click': [action: VisTableAction, index: number]
  shortcut: []
  drag: [event: PointerEvent]
}>()

const textValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') return '-'
  return String(props.value)
})

const resolvedNumber = computed(() => props.numberValue ?? textValue.value)
</script>

<template>
  <div
    class="vis-table-item"
    :class="[`type-${type}`, `appearance-${appearance}`, `state-${state}`]"
  >
    <slot>
      <template v-if="type === 'tree'">
        <VisTableTreePrefix
          :level="treeLevel"
          :with-folder="treeWithFolder"
          :expanded="treeExpanded"
          @toggle="emit('tree-toggle', $event)"
        />
        <span v-if="prefix" class="vis-table-item__issue-icon" aria-hidden="true">
          <Icon :name="prefixIcon" :size="12" decorative />
        </span>
        <span class="vis-table-item__primary-text">{{ textValue }}</span>
        <VisBadge
          v-if="suffix"
          type="text"
          color-type="warning"
          :label="suffixLabel"
        />
      </template>

      <template v-else-if="type === 'heading'">
        <span v-if="prefix" class="vis-table-item__issue-icon" aria-hidden="true">
          <Icon :name="prefixIcon" :size="12" decorative />
        </span>
        <VisTableLink :text="textValue" :href="href" />
        <VisBadge
          v-if="suffix"
          type="text"
          color-type="warning"
          :label="suffixLabel"
        />
      </template>

      <span v-else-if="type === 'text'" class="vis-table-item__text">{{ textValue }}</span>

      <VisCheckbox
        v-else-if="type === 'checkbox'"
        :model-value="checked"
        :label="false"
        aria-label="选择行"
        @update:model-value="emit('update:checked', $event)"
      />

      <VisRadio
        v-else-if="type === 'radio'"
        :model-value="radioChecked"
        :label="false"
        aria-label="选择行"
        @update:model-value="emit('update:radioChecked', $event)"
      />

      <VisButton
        v-else-if="type === 'drag'"
        class="vis-table-item__drag"
        variant="text"
        size="sm"
        icon-only
        icon-name="dots-grid2"
        label="拖动排序"
        @pointerdown="emit('drag', $event)"
      />

      <VisButton
        v-else-if="type === 'shortcuts'"
        variant="text"
        size="sm"
        icon-only
        icon-name="star-01"
        label="快捷操作"
        @click="emit('shortcut')"
      />

      <VisRate
        v-else-if="type === 'rate'"
        :model-value="rateValue"
        allow-half
        readonly
      />

      <template v-else-if="type === 'actions'">
        <VisButton
          v-for="(action, index) in actions"
          :key="`${action.icon}-${index}`"
          variant="text"
          size="sm"
          icon-only
          :icon-name="action.icon"
          :label="action.label"
          :disabled="action.disabled"
          @click="emit('action-click', action, index)"
        />
      </template>

      <template v-else-if="type === 'number'">
        <strong class="vis-table-item__number">{{ resolvedNumber }}</strong>
        <VisTableTrendIcon :trend="trend" />
      </template>

      <VisBadge
        v-else-if="type === 'badge'"
        class="vis-table-item__badge"
        :type="badgeType"
        :color-type="badgeColorType"
        :solid="badgeSolid"
        :subtle="badgeSubtle"
        :label="textValue"
      />

      <VisTag v-else-if="type === 'tag'" :label="value == null ? tagLabel : textValue" />

      <VisAvatarLabel
        v-else-if="type === 'avatar'"
        class="vis-table-item__avatar"
        size="sm"
        :addition="avatarAddition"
        :title="avatarTitle || textValue"
        :subtitle="avatarSubtitle"
        :avatar-image-variant="avatarImageVariant"
      />
    </slot>
  </div>
</template>

<style scoped>
.vis-table-item {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: var(--space-48);
  min-inline-size: 0;
  border-block-end: 1px solid var(--color-border-default);
  padding-inline: var(--space-16);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 400;
  line-height: var(--font-text-md-line-height);
  letter-spacing: 0;
}

.vis-table-item:is(.type-tree, .type-heading) {
  gap: var(--space-4);
}

.vis-table-item.appearance-grid {
  border-inline-start: 1px solid var(--color-border-default);
}

.vis-table-item.appearance-grid:is(:hover, .state-hover) {
  background: var(--color-bg-tertiary);
}

.vis-table-item:is(.type-checkbox, .type-radio, .type-drag, .type-shortcuts) {
  inline-size: var(--space-48);
  padding: 0;
  justify-content: center;
  flex: 0 0 var(--space-48);
}

.vis-table-item.type-number {
  justify-content: flex-end;
}

.vis-table-item__text,
.vis-table-item__primary-text {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vis-table-item__primary-text {
  color: var(--color-text-primary);
  flex: 1 1 auto;
}

.vis-table-item__issue-icon {
  inline-size: var(--space-20);
  block-size: var(--space-20);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-white);
  background: var(--utility-purple-500);
  flex: 0 0 var(--space-20);
}

.vis-table-item__number {
  color: var(--color-text-primary);
  font-family: var(--font-family-data);
  font-size: var(--font-data-display-lg-size);
  font-weight: 700;
  line-height: var(--font-data-display-lg-line-height);
}

:deep(.vis-badge.vis-table-item__badge) {
  block-size: var(--space-24);
}

.vis-table-item__avatar {
  min-inline-size: 0;
  flex: 1 1 auto;
}

:deep(.vis-table-item__avatar .vis-avatar-label__title) {
  font-weight: 400 !important;
}

.vis-table-item__drag {
  cursor: grab;
}

.vis-table-item__drag:active {
  cursor: grabbing;
}
</style>
