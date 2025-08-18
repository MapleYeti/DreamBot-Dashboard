import { contextBridge, ipcRenderer } from 'electron'
import type { AppConfig } from '@shared/types/configTypes'
import type { MonitoringStatus, LogUpdate } from '@shared/types/monitoringTypes'

const api = {
  config: {
    getConfig: (): Promise<{ config: AppConfig; errors: string[] }> =>
      ipcRenderer.invoke('config:get'),
    saveConfig: (config: AppConfig): Promise<{ success: boolean; errors: string[] }> =>
      ipcRenderer.invoke('config:save', config),
    onChanged: (callback: (data: { config: AppConfig }) => void) => {
      console.log('Preload: Setting up config:changed listener')
      ipcRenderer.on('config:changed', (_event, data) => {
        console.log('Preload: Received config:changed event:', data)
        callback(data)
      })
    },
    offChanged: () => {
      ipcRenderer.removeAllListeners('config:changed')
    }
  },
  monitoring: {
    startMonitoring: (): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('monitoring:start'),
    stopMonitoring: (): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('monitoring:stop'),
    getStatus: (): Promise<MonitoringStatus> => ipcRenderer.invoke('monitoring:get-status'),
    onStatusUpdate: (callback: (data: MonitoringStatus) => void) => {
      ipcRenderer.on('monitoring:status-update', (_event, data) => callback(data))
    },
    onLogUpdate: (callback: (data: LogUpdate) => void) => {
      ipcRenderer.on('monitoring:log-update', (_event, data) => callback(data))
    },
    offStatusUpdate: () => {
      ipcRenderer.removeAllListeners('monitoring:status-update')
    },
    offLogUpdate: () => {
      ipcRenderer.removeAllListeners('monitoring:log-update')
    }
  },
  botLaunch: {
    launchBot: (botName: string): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('bot:launch', botName),
    stopBot: (botName: string): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('bot:stop', botName),
    getBotStatus: (
      botName: string
    ): Promise<{ isRunning: boolean; pid?: number; startTime?: Date; command?: string }> =>
      ipcRenderer.invoke('bot:status', botName),
    getAllBotStatuses: (): Promise<
      Record<string, { isRunning: boolean; pid?: number; startTime?: Date; command?: string }>
    > => ipcRenderer.invoke('bot:all-statuses'),
    onStatusUpdate: (
      callback: (
        data: Record<
          string,
          { isRunning: boolean; pid?: number; startTime?: Date; command?: string }
        >
      ) => void
    ) => {
      ipcRenderer.on('bot:status-update', (_event, data) => callback(data))
    },
    offStatusUpdate: () => {
      ipcRenderer.removeAllListeners('bot:status-update')
    }
  },
  dialog: {
    selectDirectory: (): Promise<string | null> => ipcRenderer.invoke('dialog:select-directory')
  }
}

declare global {
  interface Window {
    api: typeof api
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    console.log('Preload script loaded successfully, API exposed to renderer')
    console.log('API structure:', JSON.stringify(api, null, 2))
  } catch (error) {
    console.error('Failed to expose API to renderer:', error)
  }
} else {
  window.api = api
  console.log('Preload script loaded in non-isolated context, API assigned to window')
  console.log('API structure:', JSON.stringify(api, null, 2))
}
