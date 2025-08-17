import { readFile, writeFile, access } from 'fs/promises'
import { join } from 'path'
import type { AppConfig } from '@shared/types/configTypes'
import { validateAppConfig } from './utils/configValidator'

export class appConfigManager {
  private configFilePath: string
  private config: AppConfig | null = null

  constructor() {
    this.configFilePath = join(process.resourcesPath, 'config.json')
  }

  async loadConfig(): Promise<AppConfig> {
    try {
      await access(this.configFilePath)
      const data = await readFile(this.configFilePath, 'utf8')
      const parsedConfig = JSON.parse(data)

      const validation = validateAppConfig(parsedConfig)
      if (validation.valid) {
        this.config = parsedConfig
        return parsedConfig
      } else {
        throw new Error(`Invalid config format: ${validation.errors.join(', ')}`)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        const defaultConfig = this.getDefaultConfig()
        await this.saveConfig(defaultConfig)
        this.config = defaultConfig
        return defaultConfig
      }
      throw error
    }
  }

  async saveConfig(config: AppConfig): Promise<void> {
    try {
      const validation = validateAppConfig(config)
      if (!validation.valid) {
        throw new Error(`Invalid config format: ${validation.errors.join(', ')}`)
      }

      const configString = JSON.stringify(config, null, 2)
      await writeFile(this.configFilePath, configString, 'utf8')
      this.config = config
    } catch (error) {
      throw new Error(
        `Failed to save config: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async getConfig(): Promise<AppConfig> {
    if (this.config === null) {
      return await this.loadConfig()
    }
    return this.config
  }

  async updateConfig(updates: Partial<AppConfig>): Promise<AppConfig> {
    const currentConfig = await this.getConfig()
    const updatedConfig = { ...currentConfig, ...updates }
    await this.saveConfig(updatedConfig)
    return updatedConfig
  }

  private getDefaultConfig(): AppConfig {
    return {
      BASE_LOG_DIRECTORY: './logs',
      DREAMBOT_VIP_FEATURES: false,
      BOT_CONFIG: {}
    }
  }

  getConfigPath(): string {
    return this.configFilePath
  }
}
