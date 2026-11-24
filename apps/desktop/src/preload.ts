import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('billnoteDesktop', {
  getVersion: () => ipcRenderer.invoke('billnote:get-version') as Promise<string>,
  checkUpdates: () =>
    ipcRenderer.invoke('billnote:check-updates') as Promise<{ status: string; message: string }>,
  printThermal: (payload: unknown) =>
    ipcRenderer.invoke('billnote:print-thermal', payload) as Promise<{
      status: string
      message: string
    }>,
})
