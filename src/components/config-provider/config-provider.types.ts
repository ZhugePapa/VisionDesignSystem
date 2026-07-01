import type { Language } from 'element-plus/es/locale'

export type VisTheme = 'light' | 'dark'

export interface VisConfigProviderProps {
  namespace?: string
  zIndex?: number
  locale?: Language
  theme?: VisTheme
  teleportTo?: string | HTMLElement
}

export interface ResolvedVisConfig {
  namespace: string
  zIndex: number
  teleportTo: string | HTMLElement
  theme: VisTheme
}
