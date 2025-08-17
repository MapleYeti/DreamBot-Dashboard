import type { AppConfig } from '@shared/types/configTypes'

export interface ConfigApi {
  getConfig(): Promise<{ config: AppConfig; errors: string[] }>
  saveConfig(data: AppConfig): Promise<{ success: boolean; errors: string[] }>
  onConfigChanged(callback: (data: { config: AppConfig }) => void): void
  offConfigChanged(): void
}

export interface MonitoringApi {
  startMonitoring(): Promise<{ success: boolean; message: string }>
  stopMonitoring(): Promise<{ success: boolean; message: string }>
  getStatus(): Promise<{ isMonitoring: boolean; botFolders: string[]; watchedFilesCount: number }>
  onStatusChanged(callback: (data: { isMonitoring: boolean }) => void): void
  onLogUpdate(
    callback: (data: {
      botName: string
      fileName: string
      filePath: string
      newContent: string
      timestamp: string
    }) => void
  ): void
  offStatusChanged(): void
  offLogUpdate(): void
}

export interface Api {
  config: ConfigApi
  monitoring: MonitoringApi
}

declare global {
  interface Window {
    api: Api
  }
}
