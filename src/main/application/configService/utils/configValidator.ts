import type { AppConfig, BotConfig, ConfigValidationResult } from '@shared/types/configTypes'

export async function validateConfig(config: AppConfig): Promise<ConfigValidationResult> {
  const errors: string[] = []

  // Validate BASE_LOG_DIRECTORY
  if (!config.BASE_LOG_DIRECTORY || typeof config.BASE_LOG_DIRECTORY !== 'string') {
    errors.push('BASE_LOG_DIRECTORY must be a non-empty string')
  }

  // Validate BASE_WEBHOOK_URL (optional)
  if (config.BASE_WEBHOOK_URL !== undefined && typeof config.BASE_WEBHOOK_URL !== 'string') {
    errors.push('BASE_WEBHOOK_URL must be a string')
  }

  // Validate DREAMBOT_VIP_FEATURES
  if (typeof config.DREAMBOT_VIP_FEATURES !== 'boolean') {
    errors.push('DREAMBOT_VIP_FEATURES must be a boolean')
  }

  // Validate BOT_CONFIG
  if (!config.BOT_CONFIG || typeof config.BOT_CONFIG !== 'object') {
    errors.push('BOT_CONFIG must be an object')
  } else {
    const botConfigErrors = validateBotConfig(config.BOT_CONFIG)
    errors.push(...botConfigErrors)
  }

  return {
    success: errors.length === 0,
    errors
  }
}

function validateBotConfig(botConfig: Record<string, BotConfig>): string[] {
  const errors: string[] = []

  for (const [botName, bot] of Object.entries(botConfig)) {
    if (!bot || typeof bot !== 'object') {
      errors.push(`BOT_CONFIG.${botName}: must be an object`)
      continue
    }

    // Validate webhookUrl (optional)
    if (bot.webhookUrl !== undefined && typeof bot.webhookUrl !== 'string') {
      errors.push(`BOT_CONFIG.${botName}: webhookUrl must be a string`)
    }

    // Validate launchScript (optional)
    if (bot.launchScript !== undefined && typeof bot.launchScript !== 'string') {
      errors.push(`BOT_CONFIG.${botName}: launchScript must be a string`)
    }
  }

  return errors
}
