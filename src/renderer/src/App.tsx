import React from 'react'
import Dashboard from './Dashboard/Dashboard'
import { AppConfigProvider } from './contexts/AppConfigContext'
import './base.css'

function App(): React.ReactElement {
  return (
    <AppConfigProvider>
      <div className="App">
        <Dashboard />
      </div>
    </AppConfigProvider>
  )
}

export default App
