import type { ThemeMode } from './themeTypes'

export interface AppConfig {
  BASE_LOG_DIRECTORY: string
  DREAMBOT_VIP_FEATURES: boolean
  BASE_WEBHOOK_URL: string
  BOT_CONFIG: Record<string, BotConfig>
  THEME_MODE: ThemeMode
}

export interface BotConfig {
  webhookUrl: string
  launchScript: string
}

export interface ConfigValidationResult {
  success: boolean
  errors: string[]
}

export interface ConfigWithValidation {
  config: AppConfig
  errors: string[]
}
