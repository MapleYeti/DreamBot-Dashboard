import React from 'react'
import styles from './StatusBadge.module.css'
import { ConfigStatus } from '../../types/ConfigStatus'

interface StatusBadgeProps {
  status: ConfigStatus
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusIcon = () => {
    switch (status) {
      case ConfigStatus.SAVED:
        return '✅'
      case ConfigStatus.UNSAVED:
        return '⚠️'
      case ConfigStatus.LOADING:
        return '🔄'
      case ConfigStatus.ERROR:
        return '❌'
      case ConfigStatus.MONITORING:
        return '🔒'
      default:
        return ''
    }
  }

  const getStatusText = () => {
    switch (status) {
      case ConfigStatus.SAVED:
        return 'Loaded'
      case ConfigStatus.UNSAVED:
        return 'Unsaved changes'
      case ConfigStatus.LOADING:
        return 'Loading...'
      case ConfigStatus.ERROR:
        return 'Error'
      case ConfigStatus.MONITORING:
        return 'Monitoring'
      default:
        return ''
    }
  }

  const badgeClassName = `${styles.statusBadge} ${styles[status]} ${className}`.trim()

  return (
    <div className={badgeClassName}>
      <span className={styles.statusIcon}>{getStatusIcon()}</span>
      {getStatusText()}
    </div>
  )
}

export default StatusBadge
