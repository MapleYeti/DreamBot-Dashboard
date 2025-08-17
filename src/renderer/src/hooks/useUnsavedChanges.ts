import { useContext } from 'react'
import { UnsavedChangesContext } from '../contexts/UnsavedChangesContextDef'

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext)
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider')
  }
  return context
}
