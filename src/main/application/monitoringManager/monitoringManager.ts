import { webContents } from 'electron'
import { watch } from 'fs'
import { readdir, readFile, stat } from 'fs/promises'
import { join, extname } from 'path'
import type { AppConfig } from '@shared/types/configTypes'
import { ConfigManager } from '../configManager'

interface MonitoringState {
  isMonitoring: boolean
  watchedFiles: Map<string, ReturnType<typeof watch>>
  botFolders: string[]
}

export class MonitoringManager {
  private state: MonitoringState = {
    isMonitoring: false,
    watchedFiles: new Map(),
    botFolders: []
  }

  async startMonitoring(): Promise<{ success: boolean; message: string }> {
    if (this.state.isMonitoring) {
      return { success: false, message: 'Monitoring is already active' }
    }

    // Always get the current config from configManager singleton
    let currentConfig: AppConfig
    try {
      const configManager = ConfigManager.getInstance()
      currentConfig = await configManager.getConfig()
    } catch (error) {
      console.error('Failed to get current config for monitoring:', error)
      return { success: false, message: 'Failed to get current configuration' }
    }

    if (!currentConfig.BASE_LOG_DIRECTORY) {
      return { success: false, message: 'No log directory configured' }
    }

    try {
      await this.setupFileWatching(currentConfig)
      this.state.isMonitoring = true

      // Notify all renderer processes that monitoring has started
      webContents.getAllWebContents().forEach((webContent) => {
        webContent.send('monitoring:status-changed', { isMonitoring: true })
      })

      return { success: true, message: 'Monitoring started successfully' }
    } catch (error) {
      console.error('Failed to start monitoring:', error)
      return {
        success: false,
        message: `Failed to start monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async stopMonitoring(): Promise<{ success: boolean; message: string }> {
    if (!this.state.isMonitoring) {
      return { success: false, message: 'Monitoring is not active' }
    }

    try {
      // Stop watching all files
      for (const [filePath, watcher] of this.state.watchedFiles) {
        watcher.close()
        console.log(`Stopped watching: ${filePath}`)
      }

      this.state.watchedFiles.clear()
      this.state.botFolders = []
      this.state.isMonitoring = false

      // Notify all renderer processes that monitoring has stopped
      webContents.getAllWebContents().forEach((webContent) => {
        webContent.send('monitoring:status-changed', { isMonitoring: false })
      })

      return { success: true, message: 'Monitoring stopped successfully' }
    } catch (error) {
      console.error('Failed to stop monitoring:', error)
      return {
        success: false,
        message: `Failed to stop monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  private async setupFileWatching(config: AppConfig) {
    const logDir = config.BASE_LOG_DIRECTORY
    const botNames = Object.keys(config.BOT_CONFIG)

    console.log(`Setting up monitoring for log directory: ${logDir}`)
    console.log(`Bot names to monitor: ${botNames.join(', ')}`)

    // Only look for folders that exactly match bot names from BOT_CONFIG
    for (const botName of botNames) {
      const botFolderPath = join(logDir, botName)

      try {
        // Check if this bot folder exists
        const stats = await stat(botFolderPath)
        if (stats.isDirectory()) {
          console.log(`Found bot folder: ${botFolderPath}`)
          await this.watchBotFolder(botFolderPath, botName)
          this.state.botFolders.push(botName)
        } else {
          console.log(`Bot folder ${botName} exists but is not a directory, skipping`)
        }
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          console.log(`Bot folder ${botName} does not exist, skipping`)
        } else {
          console.error(`Error checking bot folder ${botName}:`, error)
        }
      }
    }

    console.log(`Monitoring setup complete. Watching ${this.state.botFolders.length} bot folders`)
  }

  private async watchBotFolder(folderPath: string, botName: string) {
    try {
      // Get all files in the bot folder
      const entries = await readdir(folderPath, { withFileTypes: true })
      const files = entries.filter((entry) => entry.isFile())

      for (const file of files) {
        const filePath = join(folderPath, file.name)

        // Check if it's a log file (you can customize this logic)
        if (this.isLogFile(file.name)) {
          await this.watchLogFile(filePath, botName, file.name)
        }
      }

      // Watch the folder for new files
      this.watchFolderForNewFiles(folderPath, botName)
    } catch (error) {
      console.error(`Failed to watch bot folder ${folderPath}:`, error)
    }
  }

  private async watchLogFile(filePath: string, botName: string, fileName: string) {
    try {
      // Get initial file size for change detection
      const stats = await stat(filePath)
      let lastSize = stats.size

      console.log(`Watching log file: ${filePath} (${botName}/${fileName})`)

      const watcher = watch(filePath, (eventType) => {
        if (eventType === 'change') {
          this.handleLogFileChange(filePath, botName, fileName, lastSize)
            .then((newSize) => {
              if (newSize !== null) {
                lastSize = newSize
              }
            })
            .catch((error) => {
              console.error(`Error handling log file change for ${filePath}:`, error)
            })
        }
      })

      this.state.watchedFiles.set(filePath, watcher)
    } catch (error) {
      console.error(`Failed to watch log file ${filePath}:`, error)
    }
  }

  private watchFolderForNewFiles(folderPath: string, botName: string) {
    console.log(`Watching folder ${folderPath} for new log files (${botName})`)

    const watcher = watch(folderPath, (eventType, _filename) => {
      if (eventType === 'rename' && _filename) {
        const filePath = join(folderPath, _filename)

        // Check if it's a new log file
        stat(filePath)
          .then((stats) => {
            if (stats.isFile() && this.isLogFile(_filename)) {
              console.log(`New log file detected in ${botName}: ${_filename}`)
              this.watchLogFile(filePath, botName, _filename)
            }
          })
          .catch(() => {
            // File might have been deleted, ignore
          })
      }
    })

    this.state.watchedFiles.set(folderPath, watcher)
  }

  private async handleLogFileChange(
    filePath: string,
    botName: string,
    fileName: string,
    lastSize: number
  ): Promise<number | null> {
    try {
      const stats = await stat(filePath)
      const currentSize = stats.size

      if (currentSize > lastSize) {
        // Read the new content
        const fileHandle = await readFile(filePath, 'utf8')
        const newContent = fileHandle.slice(lastSize)

        if (newContent.trim()) {
          console.log(`[${botName}/${fileName}] New log content:`, newContent.trim())

          // Notify renderer processes of new log content
          webContents.getAllWebContents().forEach((webContent) => {
            webContent.send('monitoring:log-update', {
              botName,
              fileName,
              filePath,
              newContent: newContent.trim(),
              timestamp: new Date().toISOString()
            })
          })
        }

        return currentSize
      }

      return null
    } catch (error) {
      console.error(`Error reading log file ${filePath}:`, error)
      return null
    }
  }

  private isLogFile(fileName: string): boolean {
    // Customize this logic based on your log file naming conventions
    const logExtensions = ['.log', '.txt']
    const extension = extname(fileName).toLowerCase()

    return logExtensions.includes(extension) || fileName.includes('log') || fileName.includes('Log')
  }

  getStatus() {
    return {
      isMonitoring: this.state.isMonitoring,
      botFolders: this.state.botFolders,
      watchedFilesCount: this.state.watchedFiles.size
    }
  }
}
