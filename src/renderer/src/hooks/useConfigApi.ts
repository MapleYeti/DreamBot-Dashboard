import { useCallback } from 'react'
import type { AppConfig } from '@shared/types/configTypes'

export function useConfigApi() {
  const readConfig = useCallback(async (): Promise<AppConfig | null> => {
    try {
      return await window.api.config.read()
    } catch (error) {
      console.error('Failed to read config:', error)
      return null
    }
  }, [])

  const writeConfig = useCallback(async (data: AppConfig): Promise<boolean> => {
    try {
      await window.api.config.write(data)
      return true
    } catch (error) {
      console.error('Failed to write config:', error)
      return false
    }
  }, [])

  return {
    readConfig,
    writeConfig
  }
}
