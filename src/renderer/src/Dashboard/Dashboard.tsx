import React from 'react'
import styles from './Dashboard.module.css'
import DashboardHeader from './components/DashboardHeader'
import MonitoringControl from './components/MonitoringCard'
import Configuration from './components/ConfigurationCard'

function Dashboard(): React.ReactElement {
  return (
    <div className={styles.dashboard}>
      <DashboardHeader />
      <main className={styles.dashboardContent}>
        <MonitoringControl />
        <Configuration />
      </main>
    </div>
  )
}

export default Dashboard
