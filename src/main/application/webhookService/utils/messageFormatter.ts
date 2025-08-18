import type { LogEvent } from '@shared/types/monitoringTypes'
import { getSkillEmoji } from './skillEmojis'

interface DiscordEmbed {
  title: string
  description: string
  color: number
  timestamp: string
  footer: {
    text: string
  }
  fields?: Array<{
    name: string
    value: string
    inline: boolean
  }>
}

export class MessageFormatter {
  static createDiscordEmbed(event: LogEvent, botName: string): DiscordEmbed {
    const embed: DiscordEmbed = {
      title: this.getEventTitle(event.type),
      description: this.getEventDescription(event),
      color: this.getEventColor(event.type),
      timestamp: event.timestamp,
      footer: {
        text: `${botName} - ${event.fileName}`
      }
    }

    // Add fields based on event type
    // const fields = this.getEventFields(event)
    // if (fields.length > 0) {
    //   embed.fields = fields
    // }

    return embed
  }

  private static getEventTitle(eventType: string): string {
    const titles: Record<string, string> = {
      CHAT: '💬 Chat Message',
      RESPONSE: '⌨️ Bot Response',
      LEVEL_UP: '📈 Level Up!',
      QUEST: '🏆 Quest Completed!',
      BREAK: '💤 Break Started',
      BREAK_OVER: '⏰ Break Over',
      DEATH: '💀  Died',
      VALUABLE_DROP: '💰 Valuable Drop!'
    }
    return titles[eventType] || '📝 Log Event'
  }

  private static getEventDescription(event: LogEvent): string {
    switch (event.type) {
      case 'CHAT':
        return `**${event.data.message || 'Unknown message'}**`
      case 'RESPONSE':
        return `**${event.data.response || 'Unknown response'}**`
      case 'LEVEL_UP':
        return `${getSkillEmoji(event.data.skill)} **${event.data.skill || 'Unknown skill'}** is now level **${event.data.level || 'Unknown'}**!`
      case 'QUEST':
        return `**${event.data.quest || 'Unknown quest'}** has been completed!`
      case 'BREAK': {
        const duration = event.data.duration
        if (duration) {
          const formattedDuration = this.formatDuration(parseInt(duration))
          return `Taking a break for **${formattedDuration}**`
        }
        return 'Taking a break for **Unknown duration**'
      }
      case 'BREAK_OVER':
        return 'Break is over, back to work!'
      case 'DEATH':
        return 'Bot has died'
      case 'VALUABLE_DROP':
        return `**${event.data.item || 'Unknown item'}** worth **${event.data.value || 'Unknown'}** coins!`
      default:
        return event.rawLine
    }
  }

  private static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes % 60} minute${
        minutes % 60 !== 1 ? 's' : ''
      }`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${
        seconds % 60
      } second${seconds % 60 !== 1 ? 's' : ''}`
    } else {
      return `${seconds} second${seconds % 60 !== 1 ? 's' : ''}`
    }
  }

  private static getEventColor(eventType: string): number {
    const colors: Record<string, number> = {
      CHAT: 0x0099ff, // Blue
      RESPONSE: 0x0099ff, // Blue
      LEVEL_UP: 0x88e788, // Light Green
      QUEST: 0x87ceeb, // Light Blue
      BREAK: 0x808080, // Dark Gray
      BREAK_OVER: 0x90ee90, // Light Green
      DEATH: 0xff0000, // Red
      VALUABLE_DROP: 0xffd700 // Gold
    }
    return colors[eventType] || 0x808080 // Default gray
  }

  private static getEventFields(
    event: LogEvent
  ): Array<{ name: string; value: string; inline: boolean }> {
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
          const duration = parseInt(event.data.duration)
          if (!isNaN(duration)) {
            const formattedDuration = this.formatDuration(duration)
            fields.push({ name: 'Duration', value: formattedDuration, inline: true })
          }
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
