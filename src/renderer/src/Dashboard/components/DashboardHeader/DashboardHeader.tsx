import React from 'react'
import { useMonitoring } from '../../../hooks/useMonitoring'
import { useAppConfig } from '../../../hooks/useAppConfig'
import { useBotLaunch } from '../../../hooks/useBotLaunch'
import VersionBadge from './components/VersionBadge'
import ThemeSelector from '../../../components/ThemeSelector'
import styles from './DashboardHeader.module.css'

const DashboardHeader: React.FC = () => {
  const monitoring = useMonitoring()
  const appConfigContext = useAppConfig()
  const { botStatuses } = useBotLaunch()

  const runningBots = Object.values(botStatuses).filter((status) => status.isRunning).length
  const isVipEnabled = appConfigContext.config?.DREAMBOT_VIP_FEATURES ?? false

  const getMonitoringStatusText = () => {
    if (monitoring.status.isMonitoring) {
      return `Monitoring (${monitoring.status.watchedFolders.length} log${monitoring.status.watchedFolders.length > 1 ? 's' : ''})`
    }
    return 'Not monitoring'
  }

  const getBotStatusText = () => {
    if (runningBots === 0) {
      return 'No bots running'
    }
    return `${runningBots} bot${runningBots > 1 ? 's' : ''} running`
  }

  const getBotStatusDotClass = () => {
    return runningBots > 0 ? styles.statusDotOnline : styles.statusDotOffline
  }

  const getStatusDotClass = () => {
    return monitoring.status.isMonitoring ? styles.statusDotOnline : styles.statusDotOffline
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🤖</div>
          <h1 className={styles.logoText}>DreamBot Dashboard</h1>
          <VersionBadge />
        </div>
        <div className={styles.userInfo}>
          {isVipEnabled && (
            <div className={styles.statusIndicator}>
              <div className={`${styles.statusDot} ${getBotStatusDotClass()}`}></div>
              <span>{getBotStatusText()}</span>
            </div>
          )}
          <div className={styles.statusIndicator}>
            <div className={`${styles.statusDot} ${getStatusDotClass()}`}></div>
            <span>{getMonitoringStatusText()}</span>
          </div>
          <ThemeSelector />
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
