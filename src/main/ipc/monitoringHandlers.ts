import { ipcMain, webContents } from 'electron'
import { monitoringService } from '../application/monitoringService'

export function registerMonitoringHandlers(): void {
  ipcMain.handle('monitoring:start', async () => {
    try {
      await monitoringService.startMonitoring()

      // Emit status update to all renderer processes
      const status = monitoringService.getStatus()
      webContents.getAllWebContents().forEach((webContent) => {
        webContent.send('monitoring:status-update', status)
      })

      return { success: true, message: 'Monitoring started successfully' }
    } catch (error) {
      console.error('Failed to start monitoring:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start monitoring'
      }
    }
  })

  ipcMain.handle('monitoring:stop', async () => {
    try {
      await monitoringService.stopMonitoring()

      // Emit status update to all renderer processes
      const status = monitoringService.getStatus()
      webContents.getAllWebContents().forEach((webContent) => {
        webContent.send('monitoring:status-update', status)
      })

      return { success: true, message: 'Monitoring stopped successfully' }
    } catch (error) {
      console.error('Failed to stop monitoring:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to stop monitoring'
      }
    }
  })

  ipcMain.handle('monitoring:get-status', async () => {
    try {
      return monitoringService.getStatus()
    } catch (error) {
      console.error('Failed to get monitoring status:', error)
      return { isMonitoring: false, watchedFiles: [], watchedFolders: [] }
    }
  })
}
