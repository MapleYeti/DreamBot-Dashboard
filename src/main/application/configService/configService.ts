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

      // Migrate existing config files that don't have THEME_MODE
      if (this.config && !this.config.THEME_MODE) {
        console.log('Migrating existing config: adding default THEME_MODE')

        // Check if old themeMode field exists and migrate it
        if ((this.config as any).themeMode) {
          console.log('Migrating old themeMode field to THEME_MODE')
          this.config.THEME_MODE = (this.config as any).themeMode
          // Remove the old field
          delete (this.config as any).themeMode
        } else {
          this.config.THEME_MODE = 'light'
        }

        // Save the migrated config
        await this.saveConfig(this.config)
      }
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

  async getConfig(): Promise<AppConfig> {
    // Lazy loading: automatically load config if not loaded yet
    // Fix this issue at some point
    if (!this.config) {
      console.log('Config not loaded, loading automatically...')
      await this.loadConfig()
    }

    if (!this.config) {
      throw new Error('Failed to load configuration')
    }

    console.log('Config not loaded, loading automatically...')
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
