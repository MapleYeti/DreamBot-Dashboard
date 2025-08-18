import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { validateConfig } from './utils/configValidator'
import type { AppConfig, ConfigValidationResult } from '@shared/types/configTypes'

export class ConfigService {
  private static instance: ConfigService
  private config: AppConfig | null = null
  private configPath: string

  private constructor() {
    this.configPath = join(process.cwd(), 'config.json')
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  async loadConfig(): Promise<void> {
    try {
      console.log('Loading config from:', this.configPath)
      const configData = await readFile(this.configPath, 'utf-8')
      this.config = JSON.parse(configData)
      console.log('Config loaded successfully:', this.config)
    } catch (error) {
      console.error('Failed to load config:', error)
      // Load default config if file doesn't exist
      this.config = {
        BASE_LOG_DIRECTORY: '',
        DREAMBOT_VIP_FEATURES: false,
        BASE_WEBHOOK_URL: '',
        BOT_CONFIG: {}
      }
      console.log('Using default config:', this.config)
    }
  }

  async getConfig(): Promise<AppConfig> {
    if (!this.config) {
      throw new Error('No configuration available')
    }
    return this.config
  }

  async validateConfig(config: AppConfig): Promise<ConfigValidationResult> {
    return validateConfig(config)
  }

  async saveConfig(config: AppConfig): Promise<void> {
    try {
      console.log('Saving config to:', this.configPath)
      await writeFile(this.configPath, JSON.stringify(config, null, 2))
      this.config = config
      console.log('Config saved successfully')
    } catch (error) {
      console.error('Failed to save config:', error)
      throw error
    }
  }
}
