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

  // Listen for config changes (but we don't store them anymore)
  ipcMain.on('config:changed', () => {
    console.log('Config changed, monitoring manager will use fresh config on next start')
  })
}
