import { ipcMain, webContents } from 'electron'
import { appConfigManager } from '../appConfigManager/appConfigManager'
import type { AppConfig } from '@shared/types/configTypes'

const configManager = new appConfigManager()

export function registerConfigHandlers(): void {
  ipcMain.handle('config:get', async (): Promise<{ config: AppConfig; errors: string[] }> => {
    try {
      const config = await configManager.getConfig()
      const validation = await configManager.validateConfig(config)
      return {
        config,
        errors: validation.errors
      }
    } catch (error) {
      console.error('Failed to get config:', error)
      throw error
    }
  })

  ipcMain.handle(
    'config:save',
    async (_event, data: AppConfig): Promise<{ success: boolean; errors: string[] }> => {
      try {
        const validation = await configManager.validateConfig(data)
        if (validation.valid) {
          await configManager.saveConfig(data)

          // Emit config change event to all renderer processes
          webContents.getAllWebContents().forEach((webContent) => {
            webContent.send('config:changed', { config: data })
          })

          return { success: true, errors: [] }
        } else {
          return { success: false, errors: validation.errors }
        }
      } catch (error) {
        console.error('Failed to save config:', error)
        return {
          success: false,
          errors: [error instanceof Error ? error.message : 'Failed to save config']
        }
      }
    }
  )
}
