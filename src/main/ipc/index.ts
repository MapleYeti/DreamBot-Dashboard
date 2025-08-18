import { registerConfigHandlers } from './configHandlers'
import { registerMonitoringHandlers } from './monitoringHandlers'
import { registerDialogHandlers } from './dialogHandlers'
import { registerBotLaunchHandlers } from './botLaunchHandlers'

export function registerAllIpcHandlers(): void {
  registerConfigHandlers()
  registerMonitoringHandlers()
  registerDialogHandlers()
  registerBotLaunchHandlers()
}
