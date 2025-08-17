import { webContents } from 'electron'
import { watch } from 'fs'
import { readdir, readFile, stat } from 'fs/promises'
import { join, extname } from 'path'
import type { AppConfig } from '@shared/types/configTypes'
import { ConfigManager } from '../configManager'
import { EventProcessor, WebhookService } from './utils'

interface MonitoringState {
  isMonitoring: boolean
  watchedFiles: Map<string, ReturnType<typeof watch>>
  botFolders: string[]
  lastProcessedContent: Map<string, string> // Track last processed content hash per file
}

export class MonitoringManager {
  private state: MonitoringState = {
    isMonitoring: false,
    watchedFiles: new Map(),
    botFolders: [],
    lastProcessedContent: new Map()
  }
  private eventProcessor: EventProcessor
  private webhookService: WebhookService | null = null

  constructor() {
    this.eventProcessor = new EventProcessor()
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

      // Initialize webhook service with current config
      this.webhookService = new WebhookService(currentConfig)
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
      this.state.lastProcessedContent.clear()
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

          // Process the new content for events
          await this.processNewLogContent(newContent, botName, fileName)

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

  private async processNewLogContent(newContent: string, botName: string, fileName: string) {
    if (!this.webhookService) {
      console.log('Webhook service not initialized, skipping event processing')
      return
    }

    // Create a content hash to prevent duplicate processing
    const contentHash = this.createContentHash(newContent)
    const fileKey = `${botName}/${fileName}`

    // Check if we've already processed this exact content
    if (this.state.lastProcessedContent.get(fileKey) === contentHash) {
      console.log(`Skipping duplicate content for ${fileKey}`)
      return
    }

    // Split content into lines and process each line
    const lines = newContent.split('\n').filter((line) => line.trim())
    const timestamp = new Date().toISOString()

    // Process all lines for events
    const events = this.eventProcessor.processLogLines(lines, botName, fileName, timestamp)

    // Send webhooks for detected events
    for (const event of events) {
      console.log(`Detected ${event.type} event from ${botName}:`, event)

      // Send webhook asynchronously (don't wait for it to complete)
      this.webhookService.sendWebhook(event, botName).catch((error) => {
        console.error(`Failed to send webhook for ${event.type} event:`, error)
      })
    }

    if (events.length > 0) {
      console.log(`Processed ${events.length} events from ${botName}/${fileName}`)
      // Store the content hash to prevent duplicate processing
      this.state.lastProcessedContent.set(fileKey, contentHash)
    }
  }

  private createContentHash(content: string): string {
    // Simple hash function to identify duplicate content
    let hash = 0
    if (content.length === 0) return hash.toString()

    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    return hash.toString()
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
