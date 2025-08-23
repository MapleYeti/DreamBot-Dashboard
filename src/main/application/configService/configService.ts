import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { validateConfig } from './utils/configValidator'
import type { AppConfig, ConfigValidationResult } from '@shared/types/configTypes'

class ConfigService {
  private config: AppConfig | null = null
  private configPath = join(process.cwd(), 'config.json')

  async loadConfig(): Promise<void> {
    try {
      const configData = await readFile(this.configPath, 'utf-8')
      this.config = JSON.parse(configData)
    } catch (error) {
      console.error('Failed to load config:', error)
      // Load default config if file doesn't exist
      this.config = {
        BASE_LOG_DIRECTORY: '',
        DREAMBOT_VIP_FEATURES: false,
        BASE_WEBHOOK_URL: '',
        BOT_CONFIG: {},
        THEME_MODE: 'light'
      }
    }
  }

  async refreshConfig(): Promise<void> {
    await this.loadConfig()
  }

  async getConfig(): Promise<AppConfig> {
    // Always load the latest config from disk to ensure we have the most up-to-date version
    await this.refreshConfig()

    if (!this.config) {
      throw new Error('Failed to load configuration')
    }

    return this.config
  }

  async validateConfig(config: AppConfig): Promise<ConfigValidationResult> {
    return validateConfig(config)
  }

  async saveConfig(config: AppConfig): Promise<void> {
    try {
      await writeFile(this.configPath, JSON.stringify(config, null, 2))
      this.config = config
    } catch (error) {
      console.error('Failed to save config:', error)
      throw error
    }
  }
}

// Simple module singleton
export const configService = new ConfigService()
export default ConfigService
