import type { AppConfig } from '@shared/types/configTypes'

export interface ConfigApi {
  read: () => Promise<AppConfig>
  write: (data: AppConfig) => Promise<void>
}

export interface Api {
  config: ConfigApi
}

declare global {
  interface Window {
    api: Api
  }
}
