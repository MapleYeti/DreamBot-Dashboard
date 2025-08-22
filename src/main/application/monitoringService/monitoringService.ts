import { webContents } from 'electron'
import { createReadStream, statSync } from 'fs'
import { readdir, stat } from 'fs/promises'
import { createInterface } from 'readline'
import { join, extname, basename, dirname } from 'path'
import chokidar from 'chokidar'
import type { AppConfig } from '@shared/types/configTypes'
import { configService } from '../configService'
import { getLogEventFromLine } from './utils/processLogEvents'
import { webhookService } from '../webhookService'
import type { MonitoringStatus } from '@shared/types/monitoringTypes'

interface MonitoringState {
  isMonitoring: boolean
  watchedFiles: Map<string, ReturnType<typeof chokidar.watch>>
  watchedFolders: Map<string, ReturnType<typeof chokidar.watch>>
  fileOffsets: Map<string, number> // Track file positions for reading new content
}

const DEFAULT_DREAMBOT_FOLDER = 'DreamBot'

// Standardized chokidar configuration for consistent file watching behavior
const CHOKIDAR_CONFIG = {
  persistent: true, // Keep the watcher open
  ignoreInitial: true, // Ignore initial file content
  usePolling: true, // Use polling for more reliable detection on all platforms
  interval: 100, // Polling interval - 100ms for responsive updates
  binaryInterval: 300 // Polling interval for binary files
}

export default class MonitoringService {
  private state: MonitoringState = {
    isMonitoring: false,
    watchedFiles: new Map(),
    watchedFolders: new Map(),
    fileOffsets: new Map()
  }

  constructor() {
    // Constructor for singleton pattern
  }

  async startMonitoring(): Promise<{ success: boolean; message: string }> {
    if (this.state.isMonitoring) {
      return { success: false, message: 'Monitoring is already active' }
    }

    // Always get the current config from configService singleton
    let currentConfig: AppConfig
    try {
      currentConfig = await configService.getConfig()
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
      this.emitStatusUpdate()
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
      for (const [filePath, watcher] of this.state.watchedFiles) {
        watcher.close()
        console.log(`Stopped watching file: ${filePath}`)
      }

      for (const [folderPath, watcher] of this.state.watchedFolders) {
        watcher.close()
        console.log(`Stopped watching folder: ${folderPath}`)
      }

      this.state.watchedFiles.clear()
      this.state.watchedFolders.clear()
      this.state.fileOffsets.clear()
      this.state.isMonitoring = false

      this.emitStatusUpdate()
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
    const { BASE_LOG_DIRECTORY, BOT_CONFIG, DREAMBOT_VIP_FEATURES } = config
    const logDir = BASE_LOG_DIRECTORY

    console.log(`Setting up monitoring for log directory: ${logDir}`)

    let hasWatchedFolders = false

    if (DREAMBOT_VIP_FEATURES) {
      const botNames = Object.keys(BOT_CONFIG)
      console.log(`VIP features enabled. Bot names to monitor: ${botNames.join(', ')}`)

      for (const botName of botNames) {
        const botFolderPath = join(logDir, botName)

        try {
          const stats = await stat(botFolderPath)
          if (stats.isDirectory()) {
            console.log(`Found bot folder: ${botFolderPath}`)
            await this.watchBotFolder(botFolderPath, botName)
            hasWatchedFolders = true
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
    }

    if (!hasWatchedFolders) {
      const defaultFolderPath = join(logDir, DEFAULT_DREAMBOT_FOLDER)
      try {
        const defaultFolderStat = await stat(defaultFolderPath)
        if (defaultFolderStat.isDirectory()) {
          console.log(`Watching default DreamBot log folder: ${defaultFolderPath}`)
          await this.watchBotFolder(defaultFolderPath, DEFAULT_DREAMBOT_FOLDER)
          hasWatchedFolders = true
        }
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          console.log('Default DreamBot folder not found, no monitoring setup')
        } else {
          console.error('Error checking default DreamBot folder:', error)
        }
      }
    }

    console.log(`Monitoring setup complete. Watching ${this.state.watchedFolders.size} bot folders`)
    this.emitStatusUpdate()
  }

  private async watchBotFolder(folderPath: string, botName: string) {
    try {
      const entries = await readdir(folderPath, { withFileTypes: true })
      const files = entries.filter((entry) => entry.isFile())

      for (const file of files) {
        const filePath = join(folderPath, file.name)

        if (this.isLogFile(file.name)) {
          await this.watchLogFile(filePath, file.name)
        }
      }

      this.watchFolderForNewFiles(folderPath, botName)
    } catch (error) {
      console.error(`Failed to watch bot folder ${folderPath}:`, error)
    }
  }

  private async watchLogFile(filePath: string, fileName: string) {
    try {
      const stats = await stat(filePath)
      const initialSize = stats.size

      this.state.fileOffsets.set(filePath, initialSize)

      console.log(`Watching log file: ${filePath} (initial size: ${initialSize})`)

      const watcher = chokidar.watch(filePath, CHOKIDAR_CONFIG)

      watcher.on('change', async () => {
        console.log(`🔍 File change detected: ${filePath}`)

        // Add a small delay to ensure the file is fully written
        await new Promise((resolve) => setTimeout(resolve, 10))

        await this.processLogFile(filePath)
      })

      // Handle file truncation/rotation
      watcher.on('unlink', () => {
        console.log(`File was removed/rotated: ${filePath}`)
        // Reset the offset since the file was rotated
        this.state.fileOffsets.set(filePath, 0)
      })

      // Handle file recreation (common in log rotation)
      watcher.on('add', () => {
        console.log(`File was recreated: ${filePath}`)
        // Get the new file size and set it as the offset
        try {
          const stats = statSync(filePath)
          this.state.fileOffsets.set(filePath, stats.size)
          console.log(`Updated offset for recreated file: ${filePath} -> ${stats.size}`)
        } catch (error) {
          console.error(`Failed to get stats for recreated file ${filePath}:`, error)
        }
      })

      // Handle watcher errors
      watcher.on('error', (error) => {
        console.error(`Watcher error for ${filePath}:`, error)
      })

      this.state.watchedFiles.set(filePath, watcher)
      console.log(
        `Added ${fileName} to watched files. Total watched files: ${this.state.watchedFiles.size}`
      )

      this.emitStatusUpdate()
    } catch (error) {
      console.error(`Failed to watch log file ${filePath}:`, error)
    }
  }

  private async processLogFile(filePath: string) {
    try {
      const previousSize = this.state.fileOffsets.get(filePath) || 0
      const currentSize = statSync(filePath).size

      console.log(`🔍 Processing file: ${filePath}`)
      console.log(`   Previous size: ${previousSize}, Current size: ${currentSize}`)

      if (currentSize <= previousSize) {
        console.log(`   ⏭️ File size hasn't increased, skipping processing`)
        return
      }

      const stream = createReadStream(filePath, {
        start: previousSize,
        end: currentSize - 1,
        encoding: 'utf8'
      })

      const rl = createInterface({ input: stream })
      const botName = basename(dirname(filePath))

      let lineCount = 0
      let nonEmptyLineCount = 0
      for await (const line of rl) {
        lineCount++
        const trimmedLine = line.trim()
        if (trimmedLine) {
          nonEmptyLineCount++
          console.log(
            `📝 Processing line ${lineCount} (non-empty: ${nonEmptyLineCount}): ${line.substring(0, 100)}${
              line.length > 100 ? '...' : ''
            }`
          )
          await this.processLogLine(line, filePath, botName)
        } else {
          console.log(`📝 Skipping empty line ${lineCount}`)
        }
      }

      console.log(
        `✅ Processed ${lineCount} total lines (${nonEmptyLineCount} non-empty) from ${filePath}`
      )
      this.state.fileOffsets.set(filePath, currentSize)
      console.log(`   📊 Updated file offset to: ${currentSize}`)

      // Notify renderer processes
      webContents.getAllWebContents().forEach((webContent) => {
        webContent.send('monitoring:log-update', {
          botName,
          fileName: basename(filePath),
          filePath,
          lineCount,
          timestamp: new Date().toISOString()
        })
      })
    } catch (err) {
      console.error(
        `Error processing log file ${filePath}: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
      throw err
    }
  }

  private async processLogLine(line: string, filePath: string, botName: string) {
    const trimmedLine = line.trim()
    if (!trimmedLine) return

    const timestamp = new Date().toISOString()
    const fileName = basename(filePath)

    const event = getLogEventFromLine(trimmedLine, botName, fileName, timestamp)

    if (event) {
      console.log(`Detected ${event.type} event from ${botName}:`, event)

      webhookService.sendWebhook(event, botName).catch((error) => {
        console.error(`Failed to send webhook for ${event.type} event:`, error)
      })
    }
  }

  private watchFolderForNewFiles(folderPath: string, botName: string) {
    console.log(`Watching folder ${folderPath} for new log files (${botName})`)

    const watcher = chokidar.watch(folderPath, CHOKIDAR_CONFIG)

    watcher.on('add', (filePath) => {
      if (this.isLogFile(basename(filePath))) {
        console.log(`New log file detected in ${botName}: ${basename(filePath)}`)
        this.watchLogFile(filePath, basename(filePath))
      }
    })

    watcher.on('unlink', (filePath) => {
      if (this.isLogFile(basename(filePath))) {
        console.log(`Log file removed in ${botName}: ${basename(filePath)}`)
        // Stop watching the file and clean up
        const fileWatcher = this.state.watchedFiles.get(filePath)
        if (fileWatcher) {
          fileWatcher.close()
          this.state.watchedFiles.delete(filePath)
          this.state.fileOffsets.delete(filePath)
          console.log(`Stopped watching removed file: ${filePath}`)
        }
      }
    })

    // Handle folder watcher errors
    watcher.on('error', (error) => {
      console.error(`Folder watcher error for ${folderPath}:`, error)
    })

    this.state.watchedFolders.set(folderPath, watcher)
    console.log(
      `Added ${botName} folder to watched folders. Total watched folders: ${this.state.watchedFolders.size}`
    )
  }

  private isLogFile(fileName: string): boolean {
    const logExtensions = ['.log', '.txt']
    const extension = extname(fileName).toLowerCase()

    return logExtensions.includes(extension) || fileName.includes('log') || fileName.includes('Log')
  }

  private emitStatusUpdate() {
    const status = this.getStatus()
    webContents.getAllWebContents().forEach((webContent) => {
      webContent.send('monitoring:status-update', status)
    })
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
}

// Export a single instance (singleton)
const monitoringService = new MonitoringService()
export { monitoringService }
