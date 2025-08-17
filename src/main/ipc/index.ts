import { registerConfigHandlers } from './configHandlers'
import { registerMonitoringHandlers } from './monitoringHandlers'

export function registerAllIpcHandlers(): void {
  registerConfigHandlers()
  registerMonitoringHandlers()
}
