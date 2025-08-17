export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateAppConfig(config: unknown): ValidationResult {
  const errors: string[] = []

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Config must be a valid object'] }
  }

  const configObj = config as Record<string, unknown>

  if (!configObj.BASE_LOG_DIRECTORY || typeof configObj.BASE_LOG_DIRECTORY !== 'string') {
    errors.push('BASE_LOG_DIRECTORY must be a non-empty string')
  }

  if (typeof configObj.DREAMBOT_VIP_FEATURES !== 'boolean') {
    errors.push('DREAMBOT_VIP_FEATURES must be a boolean')
  }

  // BASE_WEBHOOK_URL is optional, but if provided must be a string
  if (configObj.BASE_WEBHOOK_URL !== undefined && typeof configObj.BASE_WEBHOOK_URL !== 'string') {
    errors.push('BASE_WEBHOOK_URL must be a string if provided')
  }

  if (!configObj.BOT_CONFIG || typeof configObj.BOT_CONFIG !== 'object') {
    errors.push('BOT_CONFIG must be a valid object')
  } else {
    const botConfigErrors = validateBotConfigs(configObj.BOT_CONFIG as Record<string, unknown>)
    errors.push(...botConfigErrors)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

function validateBotConfigs(botConfigs: Record<string, unknown>): string[] {
  const errors: string[] = []

  for (const [botName, botConfig] of Object.entries(botConfigs)) {
    if (!botConfig || typeof botConfig !== 'object') {
      errors.push(`BOT_CONFIG.${botName} must be a valid object`)
      continue
    }

    const botValidationResult = validateBotConfig(botConfig)
    if (!botValidationResult.valid) {
      botValidationResult.errors.forEach((error) => {
        errors.push(`BOT_CONFIG.${botName}: ${error}`)
      })
    }
  }

  return errors
}

export function validateBotConfig(botConfig: unknown): ValidationResult {
  const errors: string[] = []

  if (!botConfig || typeof botConfig !== 'object') {
    return { valid: false, errors: ['BotConfig must be a valid object'] }
  }

  const botConfigObj = botConfig as Record<string, unknown>

  // webhookUrl is optional, but if provided must be a string (empty string is valid)
  if (botConfigObj.webhookUrl !== undefined && typeof botConfigObj.webhookUrl !== 'string') {
    errors.push('webhookUrl must be a string if provided')
  }

  // launchScript is optional, but if provided must be a string (empty string is valid)
  if (botConfigObj.launchScript !== undefined && typeof botConfigObj.launchScript !== 'string') {
    errors.push('launchScript must be a string if provided')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
