import React, { useMemo } from 'react'
import { Card } from '../../../components/Card'
import HelpText from '../../../components/HelpText'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useMonitoring } from '../../../hooks/useMonitoring'
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges'
import { useBotLaunch } from '../../../hooks/useBotLaunch'
import MonitoringControl from './components/MonitoringControl'
import BotStatusTable from './components/BotStatusTable'
import styles from './MonitoringCard.module.css'

interface BotStatus {
  id: string
  name: string
  status: 'Online' | 'Offline' | 'Starting' | 'Error'
  enabled: boolean
  webhookUrl: string
  launchScript: string
  isRunning?: boolean
  pid?: number
}

const MonitoringCard: React.FC = () => {
  const appConfigContext = useAppConfig()
  const monitoring = useMonitoring()
  const { hasUnsavedChanges } = useUnsavedChanges()
  const { botStatuses, launchBot, stopBot, isLoading: botLaunchLoading } = useBotLaunch()

  // Derive bots list from config and bot statuses
  const bots: BotStatus[] = useMemo(() => {
    if (!appConfigContext.config?.BOT_CONFIG) return []

    return Object.entries(appConfigContext.config.BOT_CONFIG).map(([botName, botConfig]) => {
      const status = botStatuses[botName]
      return {
        id: botName,
        name: botName,
        status: status?.isRunning ? ('Online' as const) : ('Offline' as const),
        enabled: true,
        webhookUrl: botConfig.webhookUrl,
        launchScript: botConfig.launchScript,
        isRunning: status?.isRunning ?? false,
        pid: status?.pid
      }
    })
  }, [appConfigContext.config?.BOT_CONFIG, botStatuses])

  const handleStartMonitoring = () => monitoring.startMonitoring()
  const handleStopMonitoring = () => monitoring.stopMonitoring()

  const handleLaunchBot = async (botId: string): Promise<void> => {
    try {
      const result = await launchBot(botId)
      if (!result.success) {
        console.error(`Failed to launch bot ${botId}:`, result.message)
      }
      // Success case is handled by real-time status updates
    } catch (error) {
      console.error(`Error launching bot ${botId}:`, error)
    }
  }

  const handleStopBot = async (botId: string): Promise<void> => {
    try {
      const result = await stopBot(botId)
      if (!result.success) {
        console.error(`Failed to stop bot ${botId}:`, result.message)
      }
      // Success case is handled by real-time status updates
    } catch (error) {
      console.error(`Error stopping bot ${botId}:`, error)
    }
  }

  if (appConfigContext.isLoading) {
    return (
      <Card title="Monitoring" icon="🎮">
        <div className={styles.loadingMessage}>Loading bot configurations...</div>
      </Card>
    )
  }

  return (
    <Card
      title="Monitoring"
      icon="🎮"
      footer={
        appConfigContext.config?.DREAMBOT_VIP_FEATURES ? (
          <HelpText icon="💡" variant="info">
            Must launch bot through dashboard to track status
          </HelpText>
        ) : undefined
      }
    >
      <MonitoringControl
        isMonitoring={monitoring.status.isMonitoring}
        isLoading={monitoring.isLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        watchedFiles={monitoring.status.watchedFiles}
        watchedFolders={monitoring.status.watchedFolders}
        error={monitoring.error || undefined}
        onStartMonitoring={handleStartMonitoring}
        onStopMonitoring={handleStopMonitoring}
      />

      {appConfigContext.config?.DREAMBOT_VIP_FEATURES && (
        <div className={styles.botStatus}>
          <h3>Bot Status</h3>
          <BotStatusTable
            bots={bots}
            isLoading={botLaunchLoading}
            onLaunchBot={handleLaunchBot}
            onStopBot={handleStopBot}
          />
        </div>
      )}
    </Card>
  )
}

export default MonitoringCard
