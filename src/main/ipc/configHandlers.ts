import { ipcMain, webContents } from 'electron'
import { ConfigManager } from '../application'
import type { AppConfig } from '@shared/types/configTypes'

export function registerConfigHandlers(): void {
  ipcMain.handle('config:get', async (): Promise<{ config: AppConfig; errors: string[] }> => {
    console.log('config:get IPC handler called')
    try {
      const configManager = ConfigManager.getInstance()
      console.log('Got config manager instance')

      const config = await configManager.getConfig()
      console.log('Retrieved config:', config)

      const validation = await configManager.validateConfig(config)
      console.log('Config validation result:', validation)

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
      console.log('config:save IPC handler called with data:', data)
      try {
        const configManager = ConfigManager.getInstance()
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
