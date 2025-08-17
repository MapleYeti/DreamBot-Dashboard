import React from 'react'
import styles from './LiveLogsCard.module.css'

const LiveLogsCard: React.FC = () => {
  return (
    <section className={styles.dashboardSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📄</span>
          <h2>Live Logs</h2>
        </div>
        <div className={styles.sectionActions}>
          <a href="#" className={styles.logLink}>
            Recent Activity
          </a>
          <a href="#" className={styles.logLink}>
            Clear
          </a>
        </div>
      </div>

      <div className={styles.logConsole}>
        <div className={styles.logPlaceholder}>
          Program output will appear here when monitoring is active.
        </div>
        <div className={styles.logEntries}>
          <div className={`${styles.logEntry} ${styles.config}`}>
            <div className={`${styles.logIcon} ${styles.config}`}>■</div>
            <span className={styles.logLabel}>CONFIG</span>
            <span className={styles.logMessage}>Loading configuration...</span>
            <span className={styles.logTime}>11:53:40 PM</span>
          </div>
          <div className={`${styles.logEntry} ${styles.config} ${styles.success}`}>
            <div className={`${styles.logIcon} ${styles.success}`}>✓</div>
            <span className={styles.logLabel}>CONFIG</span>
            <span className={styles.logMessage}>Configuration loaded successfully.</span>
            <span className={styles.logTime}>11:53:40 PM</span>
          </div>
          <div className={`${styles.logEntry} ${styles.system} ${styles.success}`}>
            <div className={`${styles.logIcon} ${styles.success}`}>✓</div>
            <span className={styles.logLabel}>SYSTEM</span>
            <span className={styles.logMessage}>
              RuneScape Bot Monitor initialized successfully.
            </span>
            <span className={styles.logTime}>11:53:40 PM</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveLogsCard
