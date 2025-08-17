import { useState, useEffect, ReactNode } from 'react'
import type { AppConfig } from '@shared/types/configTypes'
import { useConfigApi } from '../hooks/useConfigApi'
import { useConfigEvents } from '../hooks/useConfigEvents'
import { AppConfigContext, type AppConfigContextType } from './AppConfigContextDef'

interface AppConfigProviderProps {
  children: ReactNode
}

export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const { getConfig } = useConfigApi()
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

  useEffect(() => {
    refreshConfig()
  }, [])

  // Listen for config change events from the backend
  useConfigEvents((data) => {
    setConfig(data.config)
    setErrors([]) // Clear errors when config is successfully updated
    setIsLoading(false)
  })

  const value: AppConfigContextType = {
    config,
    isLoading,
    errors,
    refreshConfig,
    updateConfig
  }

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>
}
