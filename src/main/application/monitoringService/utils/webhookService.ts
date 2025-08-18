import type { AppConfig } from '@shared/types/configTypes'
import type { LogEvent } from './logPatterns'
import { MessageFormatter } from './messageFormatter'

export class WebhookService {
  private config: AppConfig

  constructor(config: AppConfig) {
    this.config = config
  }

  async sendWebhook(event: LogEvent, botName: string): Promise<void> {
    try {
      // Determine which webhook URL to use
      const webhookUrl = this.getWebhookUrl(botName)

      if (!webhookUrl) {
        console.log(`No webhook configured for ${botName}, skipping webhook for ${event.type}`)
        return
      }

      const embed = MessageFormatter.createDiscordEmbed(event, botName)

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          embeds: [embed]
        })
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
      }

      console.log(`Webhook sent successfully for ${event.type} event from ${botName}`)
    } catch (error) {
      console.error(`Failed to send webhook for ${event.type} event from ${botName}:`, error)
    }
  }

  private getWebhookUrl(botName: string): string | null {
    // First try to get the bot-specific webhook
    const botConfig = this.config.BOT_CONFIG[botName]
    if (botConfig?.webhookUrl) {
      return botConfig.webhookUrl
    }

    // Fall back to base webhook URL
    if (this.config.BASE_WEBHOOK_URL) {
      return this.config.BASE_WEBHOOK_URL
    }

    return null
  }
}
