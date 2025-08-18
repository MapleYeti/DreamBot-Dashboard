import { ipcMain, webContents } from 'electron'
import { configService } from '../application/configService'
import type { AppConfig } from '@shared/types/configTypes'

export function registerConfigHandlers(): void {
  ipcMain.handle('config:get', async (): Promise<{ config: AppConfig; errors: string[] }> => {
    try {
      const config = await configService.getConfig()
      const validation = await configService.validateConfig(config)
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
        const validation = await configService.validateConfig(data)
        if (validation.success) {
          await configService.saveConfig(data)

          // Emit config change event to all renderer processes
          const webContentsList = webContents.getAllWebContents()
          webContentsList.forEach((webContent) => {
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
