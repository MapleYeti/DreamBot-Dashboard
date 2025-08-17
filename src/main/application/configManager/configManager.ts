import { readFile, writeFile, access } from 'fs/promises'
import { join } from 'path'
import type { AppConfig } from '@shared/types/configTypes'
import { validateConfig } from './utils/configValidator'

export class ConfigManager {
  private static instance: ConfigManager | null = null
  private configFilePath: string
  private config: AppConfig | null = null

  constructor() {
    this.configFilePath = join(process.cwd(), 'config.json')
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  async loadConfig(): Promise<void> {
    try {
      // Check if config file exists
      await access(this.configFilePath)

      // Read and parse config file
      const configData = await readFile(this.configFilePath, 'utf8')
      this.config = JSON.parse(configData)

      console.log('Configuration loaded successfully')
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        // Config file doesn't exist, create default config
        console.log('Config file not found, creating default configuration')
        this.config = this.getDefaultConfig()
        await this.saveConfig(this.config)
      } else {
        console.error('Failed to load configuration:', error)
        throw error
      }
    }
  }

  async getConfig(): Promise<AppConfig> {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.')
    }
    return this.config
  }

  async saveConfig(newConfig: AppConfig): Promise<void> {
    try {
      await writeFile(this.configFilePath, JSON.stringify(newConfig, null, 2), 'utf8')
      this.config = newConfig
      console.log('Configuration saved successfully')
    } catch (error) {
      console.error('Failed to save configuration:', error)
      throw error
    }
  }

  async validateConfig(config: AppConfig): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const validation = await validateConfig(config)
      return validation
    } catch (error) {
      console.error('Failed to validate configuration:', error)
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed']
      }
    }
  }

  private getDefaultConfig(): AppConfig {
    return {
      BASE_LOG_DIRECTORY: 'C:\\Users\\brand\\DreamBot\\Logs',
      BASE_WEBHOOK_URL: '',
      DREAMBOT_VIP_FEATURES: false,
      BOT_CONFIG: {
        WoodcutterBot: {
          webhookUrl: '',
          launchScript: ''
        },
        FishingBot: {
          webhookUrl: '',
          launchScript: ''
        }
      }
    }
  }
}
