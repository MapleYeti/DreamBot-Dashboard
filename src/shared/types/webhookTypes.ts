import { LOG_PATTERNS } from './monitoringTypes'

export type WebhookEventType = keyof typeof LOG_PATTERNS | 'BOT_STARTED' | 'BOT_STOPPED'

export interface WebhookEvent {
  type: WebhookEventType
  botName: string
  fileName: string
  timestamp: string
  data: Record<string, string>
  rawLine: string
}
