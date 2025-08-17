export interface MonitoringStatus {
  isMonitoring: boolean
  watchedFiles: string[]
  watchedFolders: string[]
}

export interface LogUpdate {
  botName: string
  fileName: string
  filePath: string
  newContent: string
  timestamp: string
}
