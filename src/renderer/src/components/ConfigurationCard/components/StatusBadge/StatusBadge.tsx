import React from 'react'
import styles from './StatusBadge.module.css'

export type ConfigStatus = 'saved' | 'unsaved' | 'loading' | 'error'

interface StatusBadgeProps {
  status: ConfigStatus
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'saved':
        return '✅'
      case 'unsaved':
        return '⚠️'
      case 'loading':
        return '🔄'
      case 'error':
        return '❌'
      default:
        return ''
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'saved':
        return 'Loaded'
      case 'unsaved':
        return 'Unsaved changes'
      case 'loading':
        return 'Loading...'
      case 'error':
        return 'Error'
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
