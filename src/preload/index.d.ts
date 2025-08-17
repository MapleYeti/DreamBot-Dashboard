import { ElectronAPI } from '@electron-toolkit/preload'

interface ConfigAPI {
  config: {
    read: () => Promise<unknown>
    write: (data: unknown) => Promise<void>
    update: (updates: unknown) => Promise<unknown>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ConfigAPI
  }
}
