import React from 'react'
import styles from './FooterNotes.module.css'

const FooterNotes: React.FC = () => {
  return (
    <div className={styles.footerNotes}>
      <div className={styles.noteItem}>
        <span className={styles.noteIcon}>💡</span>
        <span className={styles.noteText}>
          Import Configuration: Select a JSON file to import and overwrite current settings
        </span>
      </div>
      <div className={styles.noteItem}>
        <span className={styles.noteIcon}>💡</span>
        <span className={styles.noteText}>
          Export Configuration: Save current settings to a JSON file
        </span>
      </div>
    </div>
  )
}

export default FooterNotes
