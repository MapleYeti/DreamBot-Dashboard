import { useEffect } from 'react'
import type { AppConfig } from '@shared/types/configTypes'

export function useConfigEvents(onConfigChanged: (data: { config: AppConfig }) => void) {
  useEffect(() => {
    console.log('useConfigEvents: Setting up event listener')
    if (!window.api?.config?.onChanged) {
      console.error('useConfigEvents: onChanged method not available')
      return
    }

    // Add the event listener
    console.log('useConfigEvents: Adding event listener')
    window.api.config.onChanged(onConfigChanged)

    // Cleanup function
    return () => {
      console.log('useConfigEvents: Cleaning up event listener')
      if (window.api?.config?.offChanged) {
        window.api.config.offChanged()
      }
    }
  }, [onConfigChanged])
}
