export interface AppConfig {
  BASE_LOG_DIRECTORY: string
  DREAMBOT_VIP_FEATURES: boolean
  BOT_CONFIG: Record<string, BotConfig>
}

export interface BotConfig {
  webhookUrl: string
  launchScript: string
}
