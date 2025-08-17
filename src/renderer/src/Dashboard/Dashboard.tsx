import React from 'react'
import styles from './Dashboard.module.css'
import Header from './components/Header'
import MonitoringControl from './components/MonitoringCard'
import Configuration from './components/ConfigurationCard'
import LiveLogsCard from './components/LiveLogsCard'

function Dashboard(): React.ReactElement {
  return (
    <div className={styles.dashboard}>
      <Header />
      <main className={styles.dashboardContent}>
        <MonitoringControl />
        <Configuration />
        <LiveLogsCard />
      </main>
    </div>
  )
}

export default Dashboard
