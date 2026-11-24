import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 360,
    minHeight: 640,
    title: 'BILLNOTE',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  void win.loadURL(WEB_ORIGIN)
}

app.whenReady().then(() => {
  createWindow()

  // Auto-update stub. Real electron-updater wiring is Phase 7.
  ipcMain.handle('billnote:get-version', () => app.getVersion())
  ipcMain.handle('billnote:check-updates', async () => {
    return { status: 'stub', message: 'Desktop auto-update arrives in Phase 7.' }
  })
  ipcMain.handle('billnote:print-thermal', async () => {
    return { status: 'stub', message: 'Thermal print bridge arrives in Phase 7.' }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
