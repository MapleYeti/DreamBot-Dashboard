import React from 'react'
import styles from './FooterNotes.module.css'

const FooterNotes: React.FC = () => {
  return (
    <div className={styles.footerNotes}>
      <div className={styles.noteItem}>
        <span className={styles.noteIcon}>ℹ</span>
        <span className={styles.noteText}>
          Configuration changes are saved automatically when you click Save
        </span>
      </div>
      <div className={styles.noteItem}>
        <span className={styles.noteIcon}>ℹ</span>
        <span className={styles.noteText}>
          Bot configurations can be imported/exported for backup purposes
        </span>
      </div>
      <div className={styles.noteItem}>
        <span className={styles.noteIcon}>ℹ</span>
        <span className={styles.noteText}>
          DreamBot VIP features require an active subscription
        </span>
      </div>
    </div>
  )
}

export default FooterNotes
