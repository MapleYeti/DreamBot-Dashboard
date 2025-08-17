import React from 'react'
import Dashboard from './Dashboard/Dashboard'
import { AppConfigProvider } from './contexts/AppConfigContext'
import { UnsavedChangesProvider } from './contexts/UnsavedChangesContext'
import './base.css'

function App(): React.ReactElement {
  return (
    <AppConfigProvider>
      <UnsavedChangesProvider>
        <div className="App">
          <Dashboard />
        </div>
      </UnsavedChangesProvider>
    </AppConfigProvider>
  )
}

export default App
