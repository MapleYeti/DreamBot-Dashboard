import type { AppConfig } from '@shared/types/configTypes'
import type { MonitoringStatus, LogUpdate } from '@shared/types/monitoringTypes'

export interface ConfigApi {
  getConfig(): Promise<{ config: AppConfig; errors: string[] }>
  saveConfig(config: AppConfig): Promise<{ success: boolean; errors: string[] }>
  onChanged(callback: (data: { config: AppConfig }) => void): void
  offChanged(): void
}

export interface MonitoringApi {
  startMonitoring(): Promise<{ success: boolean; message: string }>
  stopMonitoring(): Promise<{ success: boolean; message: string }>
  getStatus(): Promise<MonitoringStatus>
  onStatusUpdate(callback: (data: MonitoringStatus) => void): void
  onLogUpdate(callback: (data: LogUpdate) => void): void
  offStatusUpdate(): void
  offLogUpdate(): void
}

export interface DialogApi {
  selectDirectory(): Promise<string | null>
}

export interface Api {
  config: ConfigApi
  monitoring: MonitoringApi
  dialog: DialogApi
}

declare global {
  interface Window {
    api: Api
  }
}
