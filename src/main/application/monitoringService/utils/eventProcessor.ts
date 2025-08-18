import { LOG_PATTERNS, type LogEvent } from './logPatterns'

export default class EventProcessor {
  processLogLine(
    line: string,
    botName: string,
    fileName: string,
    timestamp: string
  ): LogEvent | null {
    // Trim the line and skip empty lines
    const trimmedLine = line.trim()
    if (!trimmedLine) {
      return null
    }

    // Try to match each pattern
    for (const [eventType, pattern] of Object.entries(LOG_PATTERNS)) {
      const match = trimmedLine.match(pattern)
      if (match) {
        return this.createLogEvent(
          eventType as keyof typeof LOG_PATTERNS,
          botName,
          fileName,
          timestamp,
          trimmedLine,
          match
        )
      }
    }

    return null
  }

  private createLogEvent(
    eventType: keyof typeof LOG_PATTERNS,
    botName: string,
    fileName: string,
    timestamp: string,
    rawLine: string,
    match: RegExpMatchArray
  ): LogEvent {
    const data: Record<string, string> = {}

    // Extract data based on event type
    switch (eventType) {
      case 'CHAT':
        data.message = match[1] || ''
        break
      case 'RESPONSE':
        data.response = match[1] || ''
        break
      case 'LEVEL_UP':
        data.skill = match[1] || ''
        data.level = match[2] || ''
        break
      case 'QUEST':
        data.quest = match[1] || ''
        break
      case 'BREAK':
        data.duration = match[1] || ''
        break
      case 'VALUABLE_DROP':
        data.item = match[1] || ''
        data.value = match[2] || ''
        break
      // DEATH and BREAK_OVER don't have additional data
    }

    return {
      type: eventType,
      botName,
      fileName,
      timestamp,
      data,
      rawLine
    }
  }

  processLogLines(
    lines: string[],
    botName: string,
    fileName: string,
    timestamp: string
  ): LogEvent[] {
    const events: LogEvent[] = []

    for (const line of lines) {
      const event = this.processLogLine(line, botName, fileName, timestamp)
      if (event) {
        events.push(event)
      }
    }

    return events
  }
}

// Export a single instance (singleton)
const eventProcessor = new EventProcessor()
export { eventProcessor }
