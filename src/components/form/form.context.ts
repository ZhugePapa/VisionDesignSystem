import type { ComputedRef, InjectionKey } from 'vue'
import type { FormRules } from 'element-plus'

export interface VisFormContext {
  alignLeft: ComputedRef<boolean>
  labelWidth: ComputedRef<number | string>
  showMessage: ComputedRef<boolean>
  rules: ComputedRef<FormRules | undefined>
}

export const visFormContextKey: InjectionKey<VisFormContext> = Symbol('visFormContext')
