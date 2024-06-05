import { contextBridge, ipcRenderer } from "electron";
import { GraphData } from "../../types/tempData";
import { MainWindowElectronAPI } from "../../types/renderer";

const mainWindowChannel = [
    "main-window:update-graph",
    "main-window:update-temp-display",
    "main-window:update-config",
    "main-window:update-device-path",
    "main-window:start-record-callback",
    "main-window:stop-record-callback"
] as const

const electronAPI: MainWindowElectronAPI = {
    // Manage other window
    manageSettingWindow: (manage) => ipcRenderer.send("setting-window:manage", manage),
    managePrintPreviewWindow: (manage) => ipcRenderer.send("print-preview-window:manage", manage),

    startRecord: (isDataExists) => ipcRenderer.send("main-window:start-record", isDataExists),
    stopRecord: (isStoppedManually) => ipcRenderer.send("main-window:stop-record", isStoppedManually),

    getConfig: () => ipcRenderer.invoke('electron-store:get', 'config'),
    getDevicePath: () => ipcRenderer.invoke('electron-store:get', 'devicePath'),
    saveFile: (args) => ipcRenderer.send("main-process:save-file", args),

    // Listen for updates from main process
    updateGraph: (callback) => ipcRenderer.on(mainWindowChannel[0], (_event, data: GraphData[]) => callback(data)),
    updateTempDisplay: (callback) => ipcRenderer.on(mainWindowChannel[1], (_event, data) => callback(data)),
    updateConfig: (newData) => ipcRenderer.on(mainWindowChannel[2], (_event, data) => newData(data)),
    updateDevicePath: (callback) => ipcRenderer.on(mainWindowChannel[3], (_event, data) => callback(data)),
    startRecordCallback: (callback) => ipcRenderer.on(mainWindowChannel[4], (_event, isContinueRecord) => callback(isContinueRecord)),
    stopRecordCallback: (callback) => ipcRenderer.on(mainWindowChannel[5], (_event, _data) => callback()),

    removeWindowListeners: () => mainWindowChannel.forEach(channel => ipcRenderer.removeAllListeners(channel))
}

contextBridge.exposeInMainWorld('electronAPImain', electronAPI);