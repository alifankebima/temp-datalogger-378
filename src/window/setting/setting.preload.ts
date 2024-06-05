import { contextBridge, ipcRenderer } from "electron";
import { SettingWindowElectronAPI } from "../../types/renderer";

const electronAPISetting: SettingWindowElectronAPI = {
    getConfig: () => ipcRenderer.invoke('electron-store:get', 'config'),
    setConfig: (newData) => ipcRenderer.send("electron-store:set", {key: 'config', value: newData}),
    manageSettingWindow: (manage) => ipcRenderer.send("setting-window:manage", manage),
}

contextBridge.exposeInMainWorld('electronAPISetting', electronAPISetting);