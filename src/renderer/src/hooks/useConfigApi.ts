import { useCallback } from 'react'
import type { AppConfig } from '@shared/types/configTypes'

export function useConfigApi() {
  const getConfig = useCallback(async (): Promise<{
    config: AppConfig
    errors: string[]
  } | null> => {
    try {
      console.log('getConfig useConfigApi')
      return await window.api.config.getConfig()
    } catch (error) {
      console.error('Failed to get config:', error)
      return null
    }
  }, [])

  const saveConfig = useCallback(
    async (data: AppConfig): Promise<{ success: boolean; errors: string[] }> => {
      try {
        return await window.api.config.saveConfig(data)
      } catch (error) {
        console.error('Failed to save config:', error)
        return {
          success: false,
          errors: [error instanceof Error ? error.message : 'Failed to save config']
        }
      }
    },
    []
  )

  return {
    getConfig,
    saveConfig
  }
}
