import { registerConfigHandlers } from './configHandlers'
import { registerMonitoringHandlers } from './monitoringHandlers'
import { registerDialogHandlers } from './dialogHandlers'

export function registerAllIpcHandlers(): void {
  registerConfigHandlers()
  registerMonitoringHandlers()
  registerDialogHandlers()
}
