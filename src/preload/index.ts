import { contextBridge, ipcRenderer } from 'electron'
import type { AppConfig } from '@shared/types/configTypes'

const api = {
  config: {
    getConfig: (): Promise<{ config: AppConfig; errors: string[] }> =>
      ipcRenderer.invoke('config:get'),
    saveConfig: (data: AppConfig): Promise<{ success: boolean; errors: string[] }> =>
      ipcRenderer.invoke('config:save', data),
    onConfigChanged: (callback: (data: { config: AppConfig }) => void) => {
      ipcRenderer.on('config:changed', (_event, data) => callback(data))
    },
    offConfigChanged: () => {
      // For now, we'll just remove all listeners since Electron doesn't expose the original callback
      ipcRenderer.removeAllListeners('config:changed')
    }
  },
  monitoring: {
    startMonitoring: (): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('monitoring:start'),
    stopMonitoring: (): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('monitoring:stop'),
    getStatus: (): Promise<{
      isMonitoring: boolean
      botFolders: string[]
      watchedFilesCount: number
    }> => ipcRenderer.invoke('monitoring:get-status'),
    onStatusChanged: (callback: (data: { isMonitoring: boolean }) => void) => {
      ipcRenderer.on('monitoring:status-changed', (_event, data) => callback(data))
    },
    onLogUpdate: (
      callback: (data: {
        botName: string
        fileName: string
        filePath: string
        newContent: string
        timestamp: string
      }) => void
    ) => {
      ipcRenderer.on('monitoring:log-update', (_event, data) => callback(data))
    },
    offStatusChanged: () => {
      ipcRenderer.removeAllListeners('monitoring:status-changed')
    },
    offLogUpdate: () => {
      ipcRenderer.removeAllListeners('monitoring:log-update')
    }
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
  } catch (error) {
    console.error('Failed to expose API to renderer:', error)
  }
} else {
  window.api = api
}
