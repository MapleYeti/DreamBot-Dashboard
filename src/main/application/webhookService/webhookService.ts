import { configService } from '../configService'
import type { LogEvent } from '@shared/types/monitoringTypes'
import { MessageFormatter } from './utils/messageFormatter'

export default class WebhookService {
  async sendWebhook(event: LogEvent, botName: string): Promise<void> {
    try {
      console.log('Sending webhook for', event)
      // Determine which webhook URL to use
      const webhookUrl = await this.getWebhookUrl(botName)

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

  private async getWebhookUrl(botName: string): Promise<string | null> {
    const config = await configService.getConfig()
    // First try to get the bot-specific webhook
    const botConfig = config.BOT_CONFIG[botName]
    if (botConfig?.webhookUrl) {
      return botConfig.webhookUrl
    }

    // Fall back to base webhook URL
    if (config.BASE_WEBHOOK_URL) {
      return config.BASE_WEBHOOK_URL
    }

    return null
  }
}

// Export a single instance (singleton)
const webhookService = new WebhookService()
export { webhookService }
