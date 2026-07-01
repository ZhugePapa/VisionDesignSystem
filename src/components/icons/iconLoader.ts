import type { Component } from 'vue'

import type { IconName } from './generated/registry.generated'

type IconModule = Record<string, Component>

const iconComponentLoaders = import.meta.glob<IconModule>('./generated/icons/*Icon.ts')

export function getIconComponentName(name: IconName): string {
  return `${name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')}Icon`
}

export async function loadIconComponent(name: IconName): Promise<Component | undefined> {
  const componentName = getIconComponentName(name)
  const loader = iconComponentLoaders[`./generated/icons/${componentName}.ts`]

  if (!loader) return undefined

  const iconModule = await loader()
  return iconModule[componentName]
}
