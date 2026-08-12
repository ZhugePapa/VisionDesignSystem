import type { VisTabsItem } from '../../components/tabs'

export function createRepositoryTabs(mergeRequestCount: number): VisTabsItem[] {
  return [
    { value: 'code', label: '代码', iconName: 'code-circle-02' },
    {
      value: 'merge-requests',
      label: '合并请求',
      iconName: 'git-pull-request',
      count: mergeRequestCount,
      ariaLabel: `合并请求 ${mergeRequestCount}`,
    },
    { value: 'reviews', label: '评审记录', iconName: 'notification-message' },
    { value: 'work-items', label: '关联工作项', iconName: 'clipboard-check' },
    { value: 'archive', label: '入库记录', iconName: 'arrow-square-right' },
    { value: 'statistics', label: '统计', iconName: 'bar-chart-square-02' },
    { value: 'settings', label: '设置', iconName: 'settings-01' },
  ]
}
