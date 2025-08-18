import { useCallback, useState, useEffect } from 'react'

interface BotStatus {
  isRunning: boolean
  pid?: number
  startTime?: Date
  command?: string
}

interface BotLaunchResult {
  success: boolean
  message: string
}

export function useBotLaunch() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatus>>({})

  const launchBot = useCallback(async (botName: string): Promise<BotLaunchResult> => {
    if (!window.api?.botLaunch?.launchBot) {
      return { success: false, message: 'Bot launch API not available' }
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await window.api.botLaunch.launchBot(botName)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to launch bot'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopBot = useCallback(async (botName: string): Promise<BotLaunchResult> => {
    if (!window.api?.botLaunch?.stopBot) {
      return { success: false, message: 'Bot stop API not available' }
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await window.api.botLaunch.stopBot(botName)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop bot'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAllBotStatuses = useCallback(async (): Promise<Record<string, BotStatus>> => {
    if (!window.api?.botLaunch?.getAllBotStatuses) {
      return {}
    }

    try {
      return await window.api.botLaunch.getAllBotStatuses()
    } catch (err) {
      console.error('Failed to get all bot statuses:', err)
      return {}
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Listen for bot status updates and fetch initial statuses
  useEffect(() => {
    const handleStatusUpdate = (statuses: Record<string, BotStatus>) => {
      setBotStatuses(statuses)
    }

    // Fetch initial bot statuses
    const fetchInitialStatuses = async () => {
      try {
        const initialStatuses = await getAllBotStatuses()
        setBotStatuses(initialStatuses)
      } catch (error) {
        console.error('Failed to fetch initial bot statuses:', error)
      }
    }

    // Set up event listener
    if (window.api?.botLaunch?.onStatusUpdate) {
      window.api.botLaunch.onStatusUpdate(handleStatusUpdate)
    }

    // Fetch initial statuses
    fetchInitialStatuses()

    return () => {
      if (window.api?.botLaunch?.offStatusUpdate) {
        window.api.botLaunch.offStatusUpdate()
      }
    }
  }, [])

  return {
    launchBot,
    stopBot,
    getAllBotStatuses,
    botStatuses,
    isLoading,
    error,
    clearError
  }
}
