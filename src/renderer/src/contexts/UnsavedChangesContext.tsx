import { useState, ReactNode } from 'react'
import { UnsavedChangesContext, type UnsavedChangesContextType } from './UnsavedChangesContextDef'

interface UnsavedChangesProviderProps {
  children: ReactNode
}

export function UnsavedChangesProvider({ children }: UnsavedChangesProviderProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const value: UnsavedChangesContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges
  }

  return <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>
}
