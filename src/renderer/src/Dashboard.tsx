import React from 'react'
import './Dashboard.css'
import Header from './components/Header/Header'
import MonitoringControl from './components/MonitoringCard/MonitoringCard'
import Configuration from './components/ConfigurationCard/ConfigurationCard'
import LiveLogsCard from './components/LiveLogsCard/LiveLogsCard'

function App(): React.JSX.Element {
  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-content">
        <MonitoringControl />
        <Configuration />
        <LiveLogsCard />
      </main>
    </div>
  )
}

export default App
