import React from 'react'
import styles from './Header.module.css'

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🤖</div>
          <h1 className={styles.logoText}>DreamBot Dashboard</h1>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot}></div>
            <span>Stopped</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
