import { ipcMain } from 'electron'
import { appConfigManager } from '../appConfigManager/appConfigManager'
import type { AppConfig } from '@shared/types/configTypes'

const configManager = new appConfigManager()

export function registerConfigHandlers(): void {
  ipcMain.handle('config:read', async (): Promise<AppConfig> => {
    try {
      return await configManager.getConfig()
    } catch (error) {
      console.error('Failed to read config:', error)
      throw error
    }
  })

  ipcMain.handle('config:write', async (_event, data: AppConfig): Promise<void> => {
    try {
      await configManager.saveConfig(data)
    } catch (error) {
      console.error('Failed to write config:', error)
      throw error
    }
  })
}
