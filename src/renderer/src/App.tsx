import React from 'react'
import './assets/dashboard-main.css'
import Header from './components/Header'
import MonitoringControl from './components/MonitoringCard'
import Configuration from './components/ConfigurationCard'
import LiveLogsCard from './components/LiveLogsCard'

function App(): React.JSX.Element {
  return (
    <div className="dashboard">
      <Header />
      {'test'}
      <main className="dashboard-content">
        <MonitoringControl />
        <Configuration />
        <LiveLogsCard />
      </main>
    </div>
  )
}

export default App
