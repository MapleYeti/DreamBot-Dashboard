import { useContext } from 'react'
import { AppConfigContext } from '../contexts/AppConfigContextDef'

export function useAppConfig() {
  const context = useContext(AppConfigContext)
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider')
  }
  return context
}
