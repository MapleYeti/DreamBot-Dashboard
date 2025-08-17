import { contextBridge, ipcRenderer } from 'electron'
import type { AppConfig } from '@shared/types/configTypes'

const api = {
  config: {
    getConfig: (): Promise<{ config: AppConfig; errors: string[] }> =>
      ipcRenderer.invoke('config:get'),
    saveConfig: (data: AppConfig): Promise<{ success: boolean; errors: string[] }> =>
      ipcRenderer.invoke('config:save', data)
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
