import type { AppConfig } from '@shared/types/configTypes'
import type { LogEvent } from './logPatterns'

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

      const embed = this.createDiscordEmbed(event, botName)

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

  private createDiscordEmbed(event: LogEvent, botName: string) {
    const embed: any = {
      title: this.getEventTitle(event.type),
      description: this.getEventDescription(event),
      color: this.getEventColor(event.type),
      timestamp: event.timestamp,
      footer: {
        text: `${botName} - ${event.fileName}`
      }
    }

    // Add fields based on event type
    const fields = this.getEventFields(event)
    if (fields.length > 0) {
      embed.fields = fields
    }

    return embed
  }

  private getEventTitle(eventType: string): string {
    const titles: Record<string, string> = {
      CHAT: '💬 Chat Message',
      RESPONSE: '⌨️ Bot Response',
      LEVEL_UP: '🎯 Level Up!',
      QUEST: '🏆 Quest Completed!',
      BREAK: '☕ Break Started',
      BREAK_OVER: '🚀 Break Over',
      DEATH: '💀 Player Died',
      VALUABLE_DROP: '💰 Valuable Drop!'
    }
    return titles[eventType] || '📝 Log Event'
  }

  private getEventDescription(event: LogEvent): string {
    switch (event.type) {
      case 'CHAT':
        return `**${event.data.message || 'Unknown message'}**`
      case 'RESPONSE':
        return `**${event.data.response || 'Unknown response'}**`
      case 'LEVEL_UP':
        return `**${event.data.skill || 'Unknown skill'}** is now level **${event.data.level || 'Unknown'}**!`
      case 'QUEST':
        return `**${event.data.quest || 'Unknown quest'}** has been completed!`
      case 'BREAK':
        return `Taking a break for **${event.data.duration || 'Unknown'}** minutes`
      case 'BREAK_OVER':
        return 'Break is over, back to work!'
      case 'DEATH':
        return 'The player has died and needs to respawn'
      case 'VALUABLE_DROP':
        return `**${event.data.item || 'Unknown item'}** worth **${event.data.value || 'Unknown'}** coins!`
      default:
        return event.rawLine
    }
  }

  private getEventColor(eventType: string): number {
    const colors: Record<string, number> = {
      CHAT: 0x00ff00, // Green
      RESPONSE: 0x0099ff, // Blue
      LEVEL_UP: 0xffd700, // Gold
      QUEST: 0xff69b4, // Pink
      BREAK: 0xffa500, // Orange
      BREAK_OVER: 0x32cd32, // Lime
      DEATH: 0xff0000, // Red
      VALUABLE_DROP: 0xffd700 // Gold
    }
    return colors[eventType] || 0x808080 // Default gray
  }

  private getEventFields(event: LogEvent): Array<{ name: string; value: string; inline: boolean }> {
    const fields: Array<{ name: string; value: string; inline: boolean }> = []

    // Add relevant fields based on event type
    switch (event.type) {
      case 'LEVEL_UP':
        if (event.data.skill && event.data.level) {
          fields.push(
            { name: 'Skill', value: event.data.skill, inline: true },
            { name: 'New Level', value: event.data.level, inline: true }
          )
        }
        break
      case 'VALUABLE_DROP':
        if (event.data.item && event.data.value) {
          fields.push(
            { name: 'Item', value: event.data.item, inline: true },
            { name: 'Value', value: event.data.value, inline: true }
          )
        }
        break
      case 'BREAK':
        if (event.data.duration) {
          fields.push({ name: 'Duration', value: `${event.data.duration} minutes`, inline: true })
        }
        break
    }

    // Always add timestamp field
    fields.push({
      name: 'Time',
      value: new Date(event.timestamp).toLocaleString(),
      inline: true
    })

    return fields
  }
}
