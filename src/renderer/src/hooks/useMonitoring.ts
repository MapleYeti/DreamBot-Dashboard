import { useState, useEffect, useCallback } from 'react'

interface MonitoringStatus {
  isMonitoring: boolean
  botFolders: string[]
  watchedFilesCount: number
}

interface LogUpdate {
  botName: string
  fileName: string
  filePath: string
  newContent: string
  timestamp: string
}

export function useMonitoring() {
  const [status, setStatus] = useState<MonitoringStatus>({
    isMonitoring: false,
    botFolders: [],
    watchedFilesCount: 0
  })
  const [logUpdates, setLogUpdates] = useState<LogUpdate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get initial status
  useEffect(() => {
    const getInitialStatus = async () => {
      try {
        if (window.api?.monitoring?.getStatus) {
          const initialStatus = await window.api.monitoring.getStatus()
          setStatus(initialStatus)
        }
      } catch (err) {
        console.error('Failed to get initial monitoring status:', err)
      }
    }

    getInitialStatus()
  }, [])

  // Listen for status changes
  useEffect(() => {
    if (!window.api?.monitoring?.onStatusChanged) return

    const handleStatusChange = (data: { isMonitoring: boolean }) => {
      setStatus((prev) => ({ ...prev, isMonitoring: data.isMonitoring }))
    }

    window.api.monitoring.onStatusChanged(handleStatusChange)

    return () => {
      if (window.api?.monitoring?.offStatusChanged) {
        window.api.monitoring.offStatusChanged()
      }
    }
  }, [])

  // Listen for log updates
  useEffect(() => {
    if (!window.api?.monitoring?.onLogUpdate) return

    const handleLogUpdate = (data: LogUpdate) => {
      setLogUpdates((prev) => [data, ...prev.slice(0, 99)]) // Keep last 100 updates
    }

    window.api.monitoring.onLogUpdate(handleLogUpdate)

    return () => {
      if (window.api?.monitoring?.offLogUpdate) {
        window.api.monitoring.offLogUpdate()
      }
    }
  }, [])

  const startMonitoring = useCallback(async () => {
    if (!window.api?.monitoring?.startMonitoring) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await window.api.monitoring.startMonitoring()
      if (!result.success) {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopMonitoring = useCallback(async () => {
    if (!window.api?.monitoring?.stopMonitoring) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await window.api.monitoring.stopMonitoring()
      if (!result.success) {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop monitoring')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearLogUpdates = useCallback(() => {
    setLogUpdates([])
  }, [])

  return {
    status,
    logUpdates,
    isLoading,
    error,
    startMonitoring,
    stopMonitoring,
    clearLogUpdates
  }
}
