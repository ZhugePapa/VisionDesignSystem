import type { ComputedRef, InjectionKey } from 'vue'

import type { ResolvedVisConfig } from './config-provider.types'

export const visionConfigKey: InjectionKey<ComputedRef<ResolvedVisConfig>> = Symbol('vision-config')
