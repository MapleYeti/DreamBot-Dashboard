import { contextBridge, ipcRenderer } from 'electron'
import type { AppConfig } from '@shared/types/configTypes'

interface ConfigApi {
  read: () => Promise<AppConfig>
  write: (data: AppConfig) => Promise<void>
}

const api = {
  config: {
    read: (): Promise<AppConfig> => ipcRenderer.invoke('config:read'),
    write: (data: AppConfig): Promise<void> => ipcRenderer.invoke('config:write', data)
  } as ConfigApi
}

declare global {
  interface Window {
    api: typeof api
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
