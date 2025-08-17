import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import Header from './components/Header'
import MonitoringControl from './components/MonitoringCard'
import Configuration from './components/ConfigurationCard'
import LiveLogsCard from './components/LiveLogsCard'
import { useConfigApi } from '../hooks/useConfigApi'

function Dashboard(): React.ReactElement {
  const { readConfig } = useConfigApi()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      await readConfig()
      setLoading(false)
    }
    loadConfig()
  }, [readConfig])

  if (loading) {
    return <div>Loading...</div>
  }

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
