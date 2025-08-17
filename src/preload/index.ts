import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AppConfig } from '../shared/types/configTypes'

// Custom APIs for renderer
const api = {
  config: {
    read: () => electronAPI.ipcRenderer.invoke('config:read'),
    write: (data: AppConfig) => electronAPI.ipcRenderer.invoke('config:write', data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
