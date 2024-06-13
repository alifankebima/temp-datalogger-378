import { contextBridge, ipcRenderer } from "electron";
import { PrintPreviewWindowElectronAPI } from "../../types/renderer";

const electronAPIPrintPreview: PrintPreviewWindowElectronAPI = {
    managePrintPreviewWindow: (manage) => ipcRenderer.send("print-preview-window:manage", manage),
    getGraphData: (recordingSessionID, interval) => ipcRenderer.invoke('print-preview-window:get-temp-data', { recordingSessionID, interval }),
    getState: () => ipcRenderer.invoke('electron-store:get', 'state'),
    getConfig: () => ipcRenderer.invoke('electron-store:get', 'config'),
    getPrintPreviewConfig: () => ipcRenderer.invoke('electron-store:get', 'printPreview'),
    setPrintPreviewConfig: (configData) => ipcRenderer.send("print-preview-window:update-config", configData),
    saveFile: (args) => ipcRenderer.send("main-process:save-file", args)
}

contextBridge.exposeInMainWorld('electronAPIPrintPreview', electronAPIPrintPreview);