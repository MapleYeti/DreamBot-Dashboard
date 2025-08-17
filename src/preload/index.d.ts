import type { AppConfig } from '@shared/types/configTypes'

export interface ConfigApi {
  getConfig(): Promise<{ config: AppConfig; errors: string[] }>
  saveConfig(data: AppConfig): Promise<{ success: boolean; errors: string[] }>
  onConfigChanged(callback: (data: { config: AppConfig }) => void): void
  offConfigChanged(): void
}

export interface Api {
  config: ConfigApi
}

declare global {
  interface Window {
    api: Api
  }
}
