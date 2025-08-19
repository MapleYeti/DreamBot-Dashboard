import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import DashboardHeader from './components/DashboardHeader'
import MonitoringControl from './components/MonitoringCard'
import ConfigurationModal from './components/ConfigurationModal'

function Dashboard(): React.ReactElement {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const handleConfigClick = () => {
    setIsConfigModalOpen(true)
  }

  const handleConfigClose = () => {
    setIsConfigModalOpen(false)
  }

  return (
    <div className={styles.dashboard}>
      <DashboardHeader />
      <main className={styles.dashboardContent}>
        <MonitoringControl onConfigClick={handleConfigClick} />
      </main>
      <ConfigurationModal isOpen={isConfigModalOpen} onClose={handleConfigClose} />
    </div>
  )
}

export default Dashboard
