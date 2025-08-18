import { watch, readFile } from 'fs'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'
import { ConfigService } from '../configService'
import { EventProcessor } from './utils/eventProcessor'
import { WebhookService } from './utils/webhookService'
import type { AppConfig } from '@shared/types/configTypes'
import type { MonitoringStatus } from '@shared/types/monitoringTypes'

interface MonitoringState {
  isMonitoring: boolean
  watchedFiles: Map<string, ReturnType<typeof watch>>
  watchedFolders: Map<string, ReturnType<typeof watch>>
  lastProcessedContent: Map<string, string>
}

export class MonitoringService {
  private static instance: MonitoringService
  private state: MonitoringState
  private eventProcessor: EventProcessor
  private webhookService: WebhookService | null = null

  private constructor() {
    this.state = {
      isMonitoring: false,
      watchedFiles: new Map(),
      watchedFolders: new Map(),
      lastProcessedContent: new Map()
    }
    this.eventProcessor = new EventProcessor()
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  async startMonitoring(): Promise<void> {
    if (this.state.isMonitoring) {
      console.log('Monitoring is already active')
      return
    }

    try {
      const configService = ConfigService.getInstance()
      const config = await configService.getConfig()

      this.webhookService = new WebhookService(config)
      await this.setupFileWatching(config)

      this.state.isMonitoring = true
      console.log('Monitoring started successfully')
    } catch (error) {
      console.error('Failed to start monitoring:', error)
      throw error
    }
  }

  async stopMonitoring(): Promise<void> {
    if (!this.state.isMonitoring) {
      console.log('Monitoring is not active')
      return
    }

    // Clear all file watchers
    this.state.watchedFiles.forEach((watcher) => watcher.close())
    this.state.watchedFolders.forEach((watcher) => watcher.close())

    this.state.watchedFiles.clear()
    this.state.watchedFolders.clear()
    this.state.lastProcessedContent.clear()

    this.state.isMonitoring = false
    this.webhookService = null

    console.log('Monitoring stopped successfully')
  }

  getStatus(): MonitoringStatus {
    const watchedFiles = Array.from(this.state.watchedFiles.keys())
    const watchedFolders = Array.from(this.state.watchedFolders.keys())

    return {
      isMonitoring: this.state.isMonitoring,
      watchedFiles: watchedFiles,
      watchedFolders: watchedFolders
    }
  }

  private async setupFileWatching(config: AppConfig): Promise<void> {
    const { BASE_LOG_DIRECTORY, BOT_CONFIG } = config

    if (!BASE_LOG_DIRECTORY) {
      throw new Error('BASE_LOG_DIRECTORY not configured')
    }

    try {
      const botFolders = await readdir(BASE_LOG_DIRECTORY)

      for (const folderName of botFolders) {
        // Only watch folders that match bot names from config
        if (BOT_CONFIG[folderName]) {
          const botFolderPath = join(BASE_LOG_DIRECTORY, folderName)
          const folderStat = await stat(botFolderPath)

          if (folderStat.isDirectory()) {
            await this.watchBotFolder(botFolderPath, folderName)
          }
        }
      }
    } catch (error) {
      console.error('Failed to setup file watching:', error)
      throw error
    }
  }

  private async watchBotFolder(folderPath: string, botName: string): Promise<void> {
    try {
      const files = await readdir(folderPath)

      for (const fileName of files) {
        if (this.isLogFile(fileName)) {
          const filePath = join(folderPath, fileName)
          this.watchLogFile(filePath, botName, fileName)
        }
      }

      // Watch the folder for new files
      const folderWatcher = watch(folderPath, (eventType: string, filename: string | Buffer) => {
        if (filename && typeof filename === 'string' && this.isLogFile(filename)) {
          const newFilePath = join(folderPath, filename)
          this.watchLogFile(newFilePath, botName, filename)
        }
      })

      this.state.watchedFolders.set(folderPath, folderWatcher)
      console.log(`Watching bot folder: ${folderPath}`)
    } catch (error) {
      console.error(`Failed to watch bot folder ${folderPath}:`, error)
    }
  }

  private watchLogFile(filePath: string, botName: string, fileName: string): void {
    if (this.state.watchedFiles.has(filePath)) {
      return // Already watching this file
    }

    const fileWatcher = watch(filePath, (eventType: string) => {
      if (eventType === 'change') {
        this.handleLogFileChange(filePath, botName, fileName)
      }
    })

    this.state.watchedFiles.set(filePath, fileWatcher)
    console.log(`Watching log file: ${filePath}`)
  }

  private async handleLogFileChange(
    filePath: string,
    botName: string,
    fileName: string
  ): Promise<void> {
    try {
      const content = await readFile(filePath, 'utf-8')
      const contentHash = this.createContentHash(content)

      // Check if we've already processed this content
      if (this.state.lastProcessedContent.get(filePath) === contentHash) {
        return
      }

      this.state.lastProcessedContent.set(filePath, contentHash)
      await this.processNewLogContent(content, botName, fileName)
    } catch (error) {
      console.error(`Error reading log file ${filePath}:`, error)
    }
  }

  private async processNewLogContent(
    content: string,
    botName: string,
    fileName: string
  ): Promise<void> {
    if (!this.webhookService) {
      console.error('Webhook service not initialized')
      return
    }

    const lines = content.split('\n').filter((line) => line.trim())
    const lastLine = lines[lines.length - 1]

    if (lastLine) {
      const timestamp = new Date().toISOString()
      const event = this.eventProcessor.processLogLine(lastLine, botName, fileName, timestamp)
      if (event) {
        await this.webhookService.sendWebhook(event, botName)
      }
    }
  }

  private isLogFile(fileName: string): boolean {
    const ext = extname(fileName).toLowerCase()
    return ext === '.txt' || ext === '.log'
  }

  private createContentHash(content: string): string {
    // Simple hash for deduplication
    return Buffer.from(content).toString('base64').substring(0, 16)
  }
}
