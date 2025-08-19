import React from 'react'
import Dashboard from './Dashboard/Dashboard'
import { AppConfigProvider } from './contexts/AppConfigContext'
import { UnsavedChangesProvider } from './contexts/UnsavedChangesContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './base.css'

function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <AppConfigProvider>
        <UnsavedChangesProvider>
          <div className="App">
            <Dashboard />
          </div>
        </UnsavedChangesProvider>
      </AppConfigProvider>
    </ThemeProvider>
  )
}

export default App
