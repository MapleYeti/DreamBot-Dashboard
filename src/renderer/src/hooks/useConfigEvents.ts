import { useEffect } from 'react'
import type { AppConfig } from '@shared/types/configTypes'

export function useConfigEvents(onConfigChanged: (data: { config: AppConfig }) => void) {
  useEffect(() => {
    if (!window.api?.config?.onConfigChanged) return

    // Add the event listener
    window.api.config.onConfigChanged(onConfigChanged)

    // Cleanup function
    return () => {
      if (window.api?.config?.offConfigChanged) {
        window.api.config.offConfigChanged()
      }
    }
  }, [onConfigChanged])
}
