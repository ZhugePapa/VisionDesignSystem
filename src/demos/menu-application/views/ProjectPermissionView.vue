<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

import { VisBreadcrumb, type VisBreadcrumbItem } from '../../../components/breadcrumb'
import { VisButton } from '../../../components/button'
import { VisCheckbox } from '../../../components/checkbox'
import Icon from '../../../components/icons/Icon.vue'
import { VisMessage } from '../../../components/message'
import { VisSegmented, type VisSegmentedOption, type VisSegmentedValue } from '../../../components/segmented'
import { defaultProjectKey, projects } from '../navigation'

interface PermissionGroup {
  key: string
  label: string
  actions: Array<{ key: string; label: string; checked: boolean }>
}

interface PermissionDomain {
  key: string
  label: string
  groups: PermissionGroup[]
}

interface PermissionSubject {
  key: string
  label: string
}

const route = useRoute()

const subjectType = ref<VisSegmentedValue>('roles')
const selectedRoleKey = ref('measurement-analyst')
const selectedGroupKey = ref('flight-control')
const expandedDomains = ref(new Set<string>(['pipelines']))
const isEditing = ref(false)
const editSnapshot = ref('')
const successVisible = ref(false)

const roleOptions: PermissionSubject[] = [
  { key: 'config-manager', label: '项目配置管理人员.CM' },
  { key: 'measurement-analyst', label: '软件测量分析人员.MA' },
  { key: 'project-manager', label: '项目经理.DM' },
  { key: 'process-engineer', label: '软件工程过程人员.EPG' },
  { key: 'technology-manager', label: '科技部经理.TDM' },
  { key: 'technology-reviewer', label: '科技部经理.TDM' },
]

const groupOptions: PermissionSubject[] = [
  { key: 'flight-control', label: '飞控核心模块组' },
  { key: 'quality', label: '质量保障组' },
  { key: 'release', label: '发布管理组' },
  { key: 'observer', label: '项目观察者组' },
]

const segmentedOptions: VisSegmentedOption[] = [
  { value: 'roles', label: '角色' },
  { value: 'groups', label: '用户组' },
]

const permissionDomains = ref<PermissionDomain[]>([
  {
    key: 'pipelines',
    label: '流水线',
    groups: [
      {
        key: 'pipeline-instance',
        label: '流水线实例',
        actions: [
          { key: 'create', label: '新建流水线', checked: true },
          { key: 'edit', label: '修改流水线', checked: true },
          { key: 'run', label: '运行流水线', checked: false },
          { key: 'view', label: '查看流水线', checked: true },
        ],
      },
    ],
  },
  {
    key: 'repositories',
    label: '代码仓库',
    groups: [
      {
        key: 'repository-group',
        label: '代码仓库组',
        actions: [
          { key: 'create', label: '新建仓库组', checked: true },
          { key: 'edit', label: '修改仓库组', checked: true },
          { key: 'delete', label: '删除仓库组', checked: true },
          { key: 'view', label: '查看仓库组', checked: true },
          { key: 'transfer', label: '转移仓库组', checked: true },
        ],
      },
      {
        key: 'repository-instance',
        label: '仓库实例',
        actions: [
          { key: 'create', label: '新建仓库', checked: true },
          { key: 'edit', label: '修改仓库', checked: true },
          { key: 'delete', label: '删除仓库', checked: false },
          { key: 'view', label: '查看仓库', checked: false },
        ],
      },
      {
        key: 'branch',
        label: '分支',
        actions: [
          { key: 'create', label: '新建分支', checked: true },
          { key: 'edit', label: '修改分支', checked: true },
          { key: 'delete', label: '删除分支', checked: false },
          { key: 'merge', label: '合并分支', checked: false },
          { key: 'view', label: '查看分支', checked: false },
        ],
      },
      {
        key: 'commit',
        label: '提交',
        actions: [
          { key: 'view', label: '查看提交', checked: false },
          { key: 'revert', label: '撤回提交', checked: false },
        ],
      },
    ],
  },
  {
    key: 'artifacts',
    label: '制品库',
    groups: [
      {
        key: 'artifact-instance',
        label: '制品实例',
        actions: [
          { key: 'publish', label: '发布制品', checked: true },
          { key: 'download', label: '下载制品', checked: true },
          { key: 'delete', label: '删除制品', checked: false },
        ],
      },
    ],
  },
  {
    key: 'deployments',
    label: '部署管理',
    groups: [
      {
        key: 'deployment-instance',
        label: '部署实例',
        actions: [
          { key: 'create', label: '新建部署', checked: true },
          { key: 'approve', label: '审批部署', checked: false },
          { key: 'view', label: '查看部署', checked: true },
        ],
      },
    ],
  },
])

const currentProject = computed(() => {
  const projectKey = String(route.params.projectKey ?? defaultProjectKey)
  return projects.find((project) => String(project.key) === projectKey) ?? projects[0]
})

const breadcrumbItems = computed<VisBreadcrumbItem[]>(() => [
  { label: '项目' },
  { label: currentProject.value.label },
  { label: '权限', active: true },
])

const visibleSubjects = computed(() => (subjectType.value === 'roles' ? roleOptions : groupOptions))
const selectedSubjectKey = computed({
  get: () => (subjectType.value === 'roles' ? selectedRoleKey.value : selectedGroupKey.value),
  set: (value: string) => {
    if (subjectType.value === 'roles') selectedRoleKey.value = value
    else selectedGroupKey.value = value
  },
})
const selectedSubject = computed(
  () => visibleSubjects.value.find((subject) => subject.key === selectedSubjectKey.value) ?? visibleSubjects.value[0],
)
const allExpanded = computed(() => expandedDomains.value.size === permissionDomains.value.length)
const hasChanges = computed(
  () => isEditing.value && serializePermissionDomains(permissionDomains.value) !== editSnapshot.value,
)

function serializePermissionDomains(domains: PermissionDomain[]): string {
  return JSON.stringify(domains)
}

function restorePermissionDomains(snapshot: string): void {
  permissionDomains.value = JSON.parse(snapshot) as PermissionDomain[]
}

function startEditing(): void {
  editSnapshot.value = serializePermissionDomains(permissionDomains.value)
  isEditing.value = true
}

function cancelEditing(): void {
  restorePermissionDomains(editSnapshot.value)
  isEditing.value = false
  editSnapshot.value = ''
}

function savePermissions(): void {
  if (!hasChanges.value) return

  isEditing.value = false
  editSnapshot.value = ''
  successVisible.value = false
  void nextTick(() => {
    successVisible.value = true
  })
}

function isDomainExpanded(domainKey: string): boolean {
  return expandedDomains.value.has(domainKey)
}

function toggleDomain(domainKey: string): void {
  const next = new Set(expandedDomains.value)
  if (next.has(domainKey)) next.delete(domainKey)
  else next.add(domainKey)
  expandedDomains.value = next
}

function toggleAllDomains(): void {
  expandedDomains.value = allExpanded.value
    ? new Set()
    : new Set(permissionDomains.value.map((domain) => domain.key))
}

function isGroupChecked(group: PermissionGroup): boolean {
  return group.actions.every((action) => action.checked)
}

function isGroupIndeterminate(group: PermissionGroup): boolean {
  const checkedCount = group.actions.filter((action) => action.checked).length
  return checkedCount > 0 && checkedCount < group.actions.length
}

function setGroupChecked(group: PermissionGroup, checked: boolean): void {
  group.actions.forEach((action) => {
    action.checked = checked
  })
}
</script>

<template>
  <section class="permission-page" aria-labelledby="permission-page-title">
    <header class="permission-page__header">
      <VisBreadcrumb type="link" size="md" :items="breadcrumbItems" />
      <h1 id="permission-page-title">权限管理</h1>
      <p>定义项目角色和用户组，及其身份下资源的访问权限。</p>
    </header>

    <div class="permission-page__workspace">
      <aside class="permission-subjects" aria-label="权限主体">
        <VisSegmented
          v-model="subjectType"
          class="permission-subjects__tabs"
          :options="segmentedOptions"
          :icon="false"
          aria-label="权限主体类型"
        />

        <div class="permission-subjects__list" role="list">
          <button
            v-for="subject in visibleSubjects"
            :key="subject.key"
            class="permission-subject"
            :class="{ 'is-active': selectedSubjectKey === subject.key }"
            type="button"
            role="listitem"
            @click="selectedSubjectKey = subject.key"
          >
            <span class="permission-subject__icon" aria-hidden="true">
              <Icon :name="subjectType === 'roles' ? 'user-02' : 'users-01'" :size="16" decorative />
            </span>
            <span>{{ subject.label }}</span>
          </button>
        </div>

        <button class="permission-subjects__add" type="button">
          <Icon name="plus" :size="16" decorative />
          <span>{{ subjectType === 'roles' ? '添加角色' : '添加用户组' }}</span>
        </button>
      </aside>

      <main class="permission-detail">
        <header class="permission-detail__header">
          <h2>{{ selectedSubject?.label }}</h2>
          <div class="permission-detail__actions">
            <VisButton
              variant="text"
              size="md"
              prefix
              icon-name="chevron-selector-vertical"
              @click="toggleAllDomains"
            >
              {{ allExpanded ? '全部收起' : '全部展开' }}
            </VisButton>
            <template v-if="isEditing">
              <VisButton variant="text" size="md" @click="cancelEditing">取消</VisButton>
              <VisButton variant="primary" size="md" :disabled="!hasChanges" @click="savePermissions">
                保存
              </VisButton>
            </template>
            <VisButton v-else variant="primary" size="md" @click="startEditing">编辑</VisButton>
          </div>
        </header>

        <div class="permission-domains">
          <section v-for="domain in permissionDomains" :key="domain.key" class="permission-domain">
            <button
              class="permission-domain__trigger"
              type="button"
              :aria-expanded="isDomainExpanded(domain.key)"
              :aria-controls="`permission-domain-${domain.key}`"
              @click="toggleDomain(domain.key)"
            >
              <Icon
                :name="isDomainExpanded(domain.key) ? 'chevron-down' : 'chevron-right'"
                :size="16"
                decorative
              />
              <span>{{ domain.label }}</span>
            </button>

            <div
              v-if="isDomainExpanded(domain.key)"
              :id="`permission-domain-${domain.key}`"
              class="permission-domain__content"
            >
              <div v-for="group in domain.groups" :key="group.key" class="permission-group">
                <VisCheckbox
                  class="permission-group__parent"
                  :model-value="isGroupChecked(group)"
                  :indeterminate="isGroupIndeterminate(group)"
                  :disabled="!isEditing"
                  @change="setGroupChecked(group, $event.checked)"
                >
                  {{ group.label }}
                </VisCheckbox>

                <div class="permission-group__actions">
                  <VisCheckbox
                    v-for="action in group.actions"
                    :key="action.key"
                    v-model="action.checked"
                    :disabled="!isEditing"
                  >
                    {{ action.label }}
                  </VisCheckbox>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <Teleport to="body">
      <div class="permission-page__message-host" aria-live="polite">
        <VisMessage
          v-model="successVisible"
          type="success"
          text="修改已生效"
          auto-close
          :duration="3000"
        />
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.permission-page {
  min-inline-size: 0;
  block-size: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
}

.permission-page__header {
  min-block-size: 124px;
  border-block-end: 1px solid var(--color-border-default);
  padding: var(--space-24) var(--space-20) var(--space-20);
  flex: 0 0 auto;
}

.permission-page__header h1 {
  margin: var(--space-8) 0 0;
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h3-size);
  font-weight: 600;
  line-height: var(--font-heading-h3-line-height);
}

.permission-page__header p {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
}

.permission-page__workspace {
  min-block-size: 0;
  flex: 1 1 0;
  display: flex;
  overflow: hidden;
}

.permission-subjects {
  inline-size: var(--space-256);
  min-inline-size: var(--space-256);
  border-inline-end: 1px solid var(--color-border-default);
  padding: var(--space-16) var(--space-20);
  display: flex;
  flex-direction: column;
  background: var(--color-bg-surface);
}

.permission-subjects__tabs {
  inline-size: 100%;
  flex: 0 0 auto;
}

.permission-subjects__tabs :deep(.vis-segmented__item) {
  inline-size: auto;
  flex: 1 1 0;
}

.permission-subjects__list {
  margin-block-start: var(--space-12);
  display: grid;
}

.permission-subject {
  inline-size: 100%;
  block-size: var(--space-40);
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  overflow: hidden;
  color: var(--color-text-secondary);
  background: transparent;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  text-align: start;
  cursor: pointer;
}

.permission-subject:hover {
  background: var(--color-bg-secondary);
}

.permission-subject.is-active {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
  font-weight: 500;
}

.permission-subject__icon {
  inline-size: var(--space-24);
  block-size: var(--space-24);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--color-fg-secondary);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-default-xs);
}

.permission-subject > span:last-child {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.permission-subjects__add {
  inline-size: 100%;
  block-size: var(--space-32);
  margin-block-start: auto;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  line-height: var(--font-text-md-line-height);
  cursor: pointer;
}

.permission-subjects__add:hover {
  border-color: var(--color-border-brand);
  color: var(--color-text-brand-primary);
}

.permission-detail {
  min-inline-size: 0;
  min-block-size: 0;
  flex: 1 1 0;
  padding-inline: var(--space-20);
  overflow: auto;
  background: var(--color-bg-surface);
}

.permission-detail__header {
  block-size: var(--space-64);
  min-block-size: var(--space-64);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
}

.permission-detail__header h2 {
  margin: 0;
  overflow: hidden;
  font-family: var(--font-family-heading);
  font-size: var(--font-heading-h6-size);
  font-weight: 600;
  line-height: var(--font-heading-h6-line-height);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.permission-detail__actions {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.permission-domain {
  border: 0;
}

.permission-domain__trigger {
  inline-size: 100%;
  block-size: var(--space-56);
  border: 0;
  padding: 0 var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-16);
  color: var(--color-text-primary);
  background: transparent;
  font-family: var(--font-family-text);
  font-size: var(--font-text-md-size);
  font-weight: 500;
  line-height: var(--font-text-md-line-height);
  text-align: start;
  cursor: pointer;
  box-shadow: inset 0 -1px var(--color-border-default);
}

.permission-domain__trigger:hover {
  background: var(--color-bg-surface-subtle);
}

.permission-domain__content {
  padding: var(--space-24) var(--space-40);
  display: grid;
  gap: var(--space-40);
  box-shadow: inset 0 -1px var(--color-border-default);
}

.permission-group {
  display: grid;
  gap: var(--space-8);
}

.permission-group__parent {
  color: var(--color-text-primary);
  font-weight: 500;
}

.permission-group__actions {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  flex-wrap: wrap;
}

.permission-page__message-host {
  position: fixed;
  inset-block-start: var(--space-20);
  inset-inline-start: 50%;
  z-index: 1100;
  transform: translateX(-50%);
  pointer-events: none;
}

@media (max-width: 960px) {
  .permission-subjects {
    inline-size: 220px;
    min-inline-size: 220px;
    padding-inline: var(--space-12);
  }

  .permission-domain__content {
    padding-inline: var(--space-24);
  }
}

@media (max-width: 720px) {
  .permission-page__workspace {
    overflow: auto;
  }

  .permission-subjects {
    inline-size: 200px;
    min-inline-size: 200px;
  }

  .permission-detail {
    min-inline-size: 640px;
  }
}
</style>
