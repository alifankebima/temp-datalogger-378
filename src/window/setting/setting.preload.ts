import { contextBridge, ipcRenderer } from "electron";
import { SettingWindowElectronAPI } from "../../types/settingWindow";

const electronAPISetting: SettingWindowElectronAPI = {
    getConfig: () => ipcRenderer.invoke('electron-store:get', 'config'),
    // startRecord: (isDataExists) => ipcRenderer.send("main-window:start-record", isDataExists),
    // stopRecord: (isStoppedManually) => ipcRenderer.send("main-window:stop-record", isStoppedManually),
    manageSettingWindow: (manage) => ipcRenderer.send("setting-window:manage", manage),
    updateConfig: (configData) => ipcRenderer.send("setting-window:update-config", configData),
    // managePrintWindow: (manage) => ipcRenderer.send("print-window:manage", manage),
    // updateGraph: (callback) => ipcRenderer.on("main-window:update-graph", (_event, data: GraphData[]) => callback(data)),
    // removeUpdateGraph: () => ipcRenderer.removeAllListeners("main-window:update-graph"),
    // updateTempDisplay: (callback) => ipcRenderer.on("main-window:update-temp-display", (_event, data) => callback(data)),
    // removeUpdateTempDisplay: () => ipcRenderer.removeAllListeners("main-window:update-temp-display"),
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // updateConfig: () => ipcRenderer.on("main-window:update-config", (_event, _data) => ipcRenderer.invoke('electron-store:get', 'config')),
    // removeUpdateConfig: () => ipcRenderer.removeAllListeners("main-window:update-config"),
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // startRecordCallback: (callback) => ipcRenderer.on("main-window:start-record-callback", (_event, _data) => callback()),
    // removeStartRecordCallback: () => ipcRenderer.removeAllListeners("main-window:start-record-callback"),
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // stopRecordCallback: (callback) => ipcRenderer.on("main-window:stop-record-callback", (_event, _data) => callback()),
    // removeStopRecordCallback: () => ipcRenderer.removeAllListeners("main-window:stop-record-callback"),
    // for debugging
    ping: () => ipcRenderer.send('ping'),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pong: () => ipcRenderer.on('pong', (_event, _data) => console.log('pong'))
}

contextBridge.exposeInMainWorld('electronAPISetting', electronAPISetting);