import { contextBridge, ipcRenderer } from "electron";
import { ElectronAPI, GraphData, Temps } from "../types/mainWindow";

const electronAPI: ElectronAPI = {
    getConfig: () => ipcRenderer.invoke('electron-store:get', 'config'),
    startRecord: (isDataExists) => ipcRenderer.send("main-window:start-record", isDataExists),
    stopRecord: (isStoppedManually) => ipcRenderer.send("main-window:stop-record", isStoppedManually),
    manageSettingWindow: (manage) => ipcRenderer.send("setting-window:manage", manage),
    managePrintWindow: (manage) => ipcRenderer.send("print-window:manage", manage),
    updateGraph: (callback) => ipcRenderer.on("main-window:update-graph", (_event, data: GraphData[]) => callback(data)),
    removeUpdateGraph: () => ipcRenderer.removeAllListeners("main-window:update-graph"),
    updateTempDisplay: (callback) => ipcRenderer.on("main-window:update-temp-display", (_event, data: Temps<number>) => callback(data)),
    removeUpdateTempDisplay: () => ipcRenderer.removeAllListeners("main-window:update-temp-display"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateConfig: () => ipcRenderer.on("main-window:update-config", (_event, _data) => ipcRenderer.invoke('electron-store:get', 'config')),
    removeUpdateConfig: () => ipcRenderer.removeAllListeners("main-window:update-config"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startRecordConfirmed: (callback) => ipcRenderer.on("main-window:start-record-confirmed", (_event, _data) => callback()),
    removeStartRecordConfirmed: () => ipcRenderer.removeAllListeners("main-window:start-record-confirmed"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stopRecordConfirmed: (callback) => ipcRenderer.on("main-window:start-record-confirmed", (_event, _data) => callback()),
    removeStopRecordConfirmed: () => ipcRenderer.removeAllListeners("main-window:start-record-confirmed"),
    // for debugging
    ping: () => ipcRenderer.send('ping'),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pong: () => ipcRenderer.on('pong', (_event, _data) => console.log('pong'))
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI);