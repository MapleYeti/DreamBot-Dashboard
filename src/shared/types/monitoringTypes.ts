export interface MonitoringStatus {
  isMonitoring: boolean
  watchedFiles: string[]
  watchedFolders: string[]
}

export interface LogUpdate {
  botName: string
  fileName: string
  filePath: string
  newContent: string
  timestamp: string
}

export const LOG_PATTERNS = {
  CHAT: /\[INFO\] CHAT: (.+)/,
  RESPONSE: /\[INFO\] SLOWLY TYPING RESPONSE: (.+)/,
  LEVEL_UP: /you've just advanced your (.+?) level\. You are now level (\d+)/i,
  QUEST_COMPLETE: /completed a quest: <col=.+?>(.+?)<\/col>/i,
  QUEST_START: /\[INFO\] \[GAME\] You've started a new quest: <col=.+?>(.+?)<\/col>/i,
  BREAK: /\[(?:SCRIPT|INFO)\] Break length (\d+)/,
  BREAK_OVER: /\[(?:SCRIPT|INFO)\] Break over/,
  DEATH: /Oh dear, you are dead!/,
  VALUABLE_DROP: /\[INFO\] \[GAME\] <col=.+?>Valuable drop: (.+?) \((\d+(?:,\d+)*) coins\)<\/col>/
}

export interface LogEvent {
  type: keyof typeof LOG_PATTERNS
  botName: string
  fileName: string
  timestamp: string
  data: Record<string, string>
  rawLine: string
}
