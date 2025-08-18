import { getSkillEmoji } from './skillEmojis'
import type { WebhookEvent } from '@shared/types/webhookTypes'

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

export function createDiscordEmbed(event: WebhookEvent, botName: string): DiscordEmbed {
  const embed: DiscordEmbed = {
    title: getEventTitle(event.type),
    description: getEventDescription(event),
    color: getEventColor(event.type),
    timestamp: event.timestamp,
    footer: {
      text: `${botName} - ${event.fileName}`
    }
  }

  return embed
}

function getEventTitle(eventType: string): string {
  const titles: Record<string, string> = {
    CHAT: '💬 Chat Message',
    RESPONSE: '⌨️ Bot Response',
    LEVEL_UP: '📈 Level Up!',
    QUEST: '🏆 Quest Completed!',
    BREAK: '💤 Break Started',
    BREAK_OVER: '⏰ Break Over',
    DEATH: '💀  Died',
    VALUABLE_DROP: '💰 Valuable Drop!',
    BOT_STARTED: '🚀 Bot Started',
    BOT_STOPPED: '🛑 Bot Stopped'
  }
  return titles[eventType] || '📝 Log Event'
}

function getEventDescription(event: WebhookEvent): string {
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
        const formattedDuration = formatDuration(parseInt(duration))
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
    case 'BOT_STARTED':
      return `Bot **${event.botName}** has been launched`
    case 'BOT_STOPPED': {
      let stopMessage = `Bot **${event.botName}** has been stopped`
      if (event.data.runtime) {
        stopMessage += ` after running for **${event.data.runtime}**`
      }
      if (event.data.exitCode && event.data.exitCode !== 'Unknown') {
        stopMessage += ` (Exit code: **${event.data.exitCode}**)`
      }
      if (event.data.error) {
        stopMessage += ` due to error: **${event.data.error}**`
      }
      return stopMessage
    }
    default:
      return event.rawLine
  }
}

function formatDuration(milliseconds: number): string {
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

function getEventColor(eventType: string): number {
  const colors: Record<string, number> = {
    CHAT: 0x0099ff, // Blue
    RESPONSE: 0x0099ff, // Blue
    LEVEL_UP: 0x88e788, // Light Green
    QUEST: 0x87ceeb, // Light Blue
    BREAK: 0x808080, // Dark Gray
    BREAK_OVER: 0x90ee90, // Light Green
    DEATH: 0xff0000, // Red
    VALUABLE_DROP: 0xffd700, // Gold
    BOT_STARTED: 0x00ff00, // Green
    BOT_STOPPED: 0xff4500 // Orange Red
  }
  return colors[eventType] || 0x808080 // Default gray
}
