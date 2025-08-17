import React, { useState } from 'react'
import './dashboard-main.css'
import Header from './components/Header/Header'
import MonitoringControl from './components/MonitoringCard/MonitoringCard'
import Configuration from './components/ConfigurationCard/ConfigurationCard'
import LiveLogsCard from './components/LiveLogsCard/LiveLogsCard'

interface Bot {
  id: string
  name: string
  status: 'Unknown' | 'Running' | 'Stopped'
}

function App(): React.JSX.Element {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [bots] = useState<Bot[]>([
    { id: '1', name: 'RuneYeti0', status: 'Unknown' },
    { id: '2', name: 'MapleYeti', status: 'Unknown' },
    { id: '3', name: 'TEST', status: 'Unknown' }
  ])

  const handleStartMonitoring = (): void => {
    setIsMonitoring(true)
  }

  const handleLaunchBot = (botId: string): void => {
    console.log(`Launching bot: ${botId}`)
  }

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-content">
        <MonitoringControl
          isMonitoring={isMonitoring}
          bots={bots}
          onStartMonitoring={handleStartMonitoring}
          onLaunchBot={handleLaunchBot}
        />
        <Configuration />
        <LiveLogsCard />
      </main>
    </div>
  )
}

export default App
