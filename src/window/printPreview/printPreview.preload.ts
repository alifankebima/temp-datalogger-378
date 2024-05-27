import { contextBridge, ipcRenderer } from "electron";
import { PrintPreviewWindowElectronAPI } from "../../types/printPreviewWindow";

const electronAPIPrintPreview: PrintPreviewWindowElectronAPI = {
    managePrintPreviewWindow: (manage) => ipcRenderer.send("print-preview-window:manage", manage),
    getTempData: (intervalSeconds) => ipcRenderer.invoke('print-preview-window:get-temp-data', intervalSeconds),
    getPrintPreviewConfig: () => ipcRenderer.invoke('electron-store:get', 'printPreview'),
    updatePrintPreviewConfig: (configData) => ipcRenderer.send("print-preview-window:update-config", configData),
    // for debugging
    ping: () => ipcRenderer.send('ping'),
    pong: () => ipcRenderer.on('pong', (_event, _data) => console.log('pong'))
}

contextBridge.exposeInMainWorld('electronAPIPrintPreview', electronAPIPrintPreview);