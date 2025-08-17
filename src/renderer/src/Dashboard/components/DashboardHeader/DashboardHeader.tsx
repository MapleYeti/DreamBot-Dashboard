import React from 'react'
import { useMonitoring } from '../../../hooks/useMonitoring'
import styles from './DashboardHeader.module.css'

const DashboardHeader: React.FC = () => {
  const monitoring = useMonitoring()

  const getStatusText = () => {
    if (monitoring.status.isMonitoring) {
      return `Active (${monitoring.status.watchedFolders.length} bot${monitoring.status.watchedFolders.length > 1 ? 's' : ''})`
    }
    return 'Stopped'
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
        </div>
        <div className={styles.userInfo}>
          <div className={styles.statusIndicator}>
            <div className={`${styles.statusDot} ${getStatusDotClass()}`}></div>
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
