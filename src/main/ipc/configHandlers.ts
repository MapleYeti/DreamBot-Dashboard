import { ipcMain, webContents } from 'electron'
import { ConfigService } from '../application'
import type { AppConfig } from '@shared/types/configTypes'

export function registerConfigHandlers(): void {
  ipcMain.handle('config:get', async (): Promise<{ config: AppConfig; errors: string[] }> => {
    console.log('config:get IPC handler called')
    try {
      const configService = ConfigService.getInstance()
      console.log('Got config service instance')

      const config = await configService.getConfig()
      console.log('Retrieved config:', config)

      const validation = await configService.validateConfig(config)
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
        const configService = ConfigService.getInstance()
        const validation = await configService.validateConfig(data)
        if (validation.success) {
          await configService.saveConfig(data)

          // Emit config change event to all renderer processes
          console.log('Emitting config:changed event to renderer processes')
          const webContentsList = webContents.getAllWebContents()
          console.log(`Found ${webContentsList.length} web contents to notify`)
          webContentsList.forEach((webContent) => {
            console.log('Sending config:changed event to webContent:', webContent.id)
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
