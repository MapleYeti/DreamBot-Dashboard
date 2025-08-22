import { createContext } from 'react'
import type { AppConfig } from '@shared/types/configTypes'
import type { ThemeMode } from '@shared/types/themeTypes'

export interface AppConfigContextType {
  config: AppConfig | null
  isLoading: boolean
  errors: string[]
  refreshConfig: () => Promise<void>
  updateConfig: (updates: Partial<AppConfig>) => void
  updateThemeMode: (themeMode: ThemeMode) => Promise<void>
}

export const AppConfigContext = createContext<AppConfigContextType>({
  config: null,
  isLoading: true,
  errors: [],
  refreshConfig: async () => {},
  updateConfig: () => {},
  updateThemeMode: async () => {}
})
