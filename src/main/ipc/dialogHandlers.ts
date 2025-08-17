import { ipcMain, dialog } from 'electron'

export function registerDialogHandlers(): void {
  ipcMain.handle('dialog:select-directory', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select DreamBot Logs Directory'
      })

      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0]
      }
      return null
    } catch (error) {
      console.error('Dialog handler: selectDirectory error:', error)
      return null
    }
  })
}
