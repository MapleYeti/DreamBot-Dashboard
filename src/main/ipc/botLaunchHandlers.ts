import { ipcMain } from 'electron'
import { BotLaunchService } from '../application/botLaunchService'
import { ConfigService } from '../application/configService'

export function registerBotLaunchHandlers() {
  ipcMain.handle(
    'bot:launch',
    async (_event, botName: string): Promise<{ success: boolean; message: string }> => {
      try {
        const configService = ConfigService.getInstance()
        const config = await configService.getConfig()

        const botLaunchService = BotLaunchService.getInstance()
        return await botLaunchService.launchBot(botName, config)
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
        const botLaunchService = BotLaunchService.getInstance()
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
        const botLaunchService = BotLaunchService.getInstance()
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
        const botLaunchService = BotLaunchService.getInstance()
        return botLaunchService.getAllBotStatuses()
      } catch (error) {
        console.error('Failed to get all bot statuses:', error)
        return {}
      }
    }
  )
}
