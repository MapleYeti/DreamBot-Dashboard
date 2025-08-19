import React from 'react'
import styles from './MonitoringControl.module.css'

interface MonitoringControlProps {
  isMonitoring: boolean
  isLoading: boolean
  isConfigReady: boolean
  watchedFiles: string[]
  watchedFolders: string[]
  error?: string
  onStartMonitoring: () => void
  onStopMonitoring: () => void
}

const MonitoringControl: React.FC<MonitoringControlProps> = ({
  isMonitoring,
  isLoading,
  isConfigReady,
  watchedFiles,
  watchedFolders,
  error,
  onStartMonitoring,
  onStopMonitoring
}) => {
  return (
    <div className={styles.monitoringControl}>
      {error && <div className={styles.errorMessage}>Error: {error}</div>}

      <div className={styles.monitoringRow}>
        <button
          className={isMonitoring ? styles.stopButton : styles.startButton}
          onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
          disabled={isLoading || (!isMonitoring && !isConfigReady)}
          title={
            !isConfigReady && !isMonitoring
              ? 'Fix configuration errors before starting monitoring'
              : undefined
          }
        >
          {isLoading ? 'Processing...' : isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>

        <div
          className={`${styles.monitoringStatus} ${
            isMonitoring ? styles.active : !isConfigReady ? styles.pending : ''
          }`}
        >
          {isMonitoring ? (
            <>
              <span className={`${styles.statusIndicator} ${styles.online}`}>
                <div className={`${styles.statusDot} ${styles.online}`}></div>
                <span>Monitoring Active</span>
              </span>
              <span className={styles.statusDetails}>
                Watching {watchedFiles.length} files in {watchedFolders.length} bot folders
              </span>
            </>
          ) : (
            <>
              <span
                className={`${styles.statusIndicator} ${!isConfigReady ? styles.pending : styles.offline}`}
              >
                <div
                  className={`${styles.statusDot} ${!isConfigReady ? styles.pending : styles.offline}`}
                ></div>
                <span>{!isConfigReady ? 'Config Errors' : 'Not Monitoring'}</span>
              </span>
              <span className={styles.statusDetails}>
                {!isConfigReady
                  ? '⚠️ Fix configuration errors to start monitoring'
                  : 'No monitoring active'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MonitoringControl
