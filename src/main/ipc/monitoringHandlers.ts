import { ipcMain } from 'electron'
import { MonitoringManager } from '../application'

const monitoringManager = new MonitoringManager()

export function registerMonitoringHandlers(): void {
  ipcMain.handle('monitoring:start', async () => {
    return await monitoringManager.startMonitoring()
  })

  ipcMain.handle('monitoring:stop', async () => {
    return await monitoringManager.stopMonitoring()
  })

  ipcMain.handle('monitoring:get-status', () => {
    return monitoringManager.getStatus()
  })
}
