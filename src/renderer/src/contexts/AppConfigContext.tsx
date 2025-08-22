import { useState, useEffect, ReactNode } from 'react'
import type { AppConfig } from '@shared/types/configTypes'
import type { ThemeMode } from '@shared/types/themeTypes'
import { useConfigApi } from '../hooks/useConfigApi'
import { useConfigEvents } from '../hooks/useConfigEvents'
import { AppConfigContext, type AppConfigContextType } from './AppConfigContextDef'

interface AppConfigProviderProps {
  children: ReactNode
}

export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const { getConfig, saveConfig } = useConfigApi()
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  const refreshConfig = async () => {
    setIsLoading(true)
    try {
      const result = await getConfig()
      if (result) {
        setConfig(result.config)
        setErrors(result.errors)
      } else {
        setErrors(['Failed to load configuration'])
      }
    } catch (error) {
      console.error('Failed to refresh config:', error)
      setErrors(['Failed to load configuration'])
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = (updates: Partial<AppConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates })
    }
  }

  const updateThemeMode = async (themeMode: ThemeMode) => {
    if (config) {
      const updatedConfig = { ...config, THEME_MODE: themeMode }
      try {
        const result = await saveConfig(updatedConfig)
        if (result.success) {
          setConfig(updatedConfig)
        } else {
          console.error('Failed to save theme mode:', result.errors)
        }
      } catch (error) {
        console.error('Failed to save theme mode:', error)
      }
    }
  }

  useEffect(() => {
    refreshConfig()
  }, [])

  // Listen for config change events from the backend
  useConfigEvents((data) => {
    console.log('AppConfigContext: Received config change event:', data)
    setConfig(data.config)
    setErrors([]) // Clear errors when config is successfully updated
    setIsLoading(false)
  })

  const value: AppConfigContextType = {
    config,
    isLoading,
    errors,
    refreshConfig,
    updateConfig,
    updateThemeMode
  }

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>
}
