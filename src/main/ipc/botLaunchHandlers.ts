import { ipcMain } from 'electron'
import { botLaunchService } from '../application/botLaunchService'

export function registerBotLaunchHandlers() {
  ipcMain.handle(
    'bot:launch',
    async (_event, botName: string): Promise<{ success: boolean; message: string }> => {
      try {
        return await botLaunchService.launchBot(botName)
      } catch (error) {
        console.error(`Failed to launch bot ${botName}:`, error)
        return {
          success: false,
          message: `Failed to launch bot ${botName}: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }
    }
  )

  ipcMain.handle(
    'bot:stop',
    async (_event, botName: string): Promise<{ success: boolean; message: string }> => {
      try {
        return await botLaunchService.stopBot(botName)
      } catch (error) {
        console.error(`Failed to stop bot ${botName}:`, error)
        return {
          success: false,
          message: `Failed to stop bot ${botName}: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }
    }
  )

  ipcMain.handle(
    'bot:status',
    async (
      _event,
      botName: string
    ): Promise<{ isRunning: boolean; pid?: number; startTime?: Date; command?: string }> => {
      try {
        return botLaunchService.getBotStatus(botName)
      } catch (error) {
        console.error(`Failed to get status for bot ${botName}:`, error)
        return { isRunning: false }
      }
    }
  )

  ipcMain.handle(
    'bot:all-statuses',
    async (): Promise<
      Record<string, { isRunning: boolean; pid?: number; startTime?: Date; command?: string }>
    > => {
      try {
        return botLaunchService.getAllBotStatuses()
      } catch (error) {
        console.error('Failed to get all bot statuses:', error)
        return {}
      }
    }
  )
}
