import { createContext } from 'react'

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

export const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined)
export type { UnsavedChangesContextType }
