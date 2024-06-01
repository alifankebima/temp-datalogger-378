import { contextBridge, ipcRenderer } from "electron";
import { SettingWindowElectronAPI } from "../../types/settingWindow";

const electronAPISetting: SettingWindowElectronAPI = {
    getConfig: () => ipcRenderer.invoke('electron-store:get', 'config'),
    manageSettingWindow: (manage) => ipcRenderer.send("setting-window:manage", manage),
    updateConfig: (configData) => ipcRenderer.send("setting-window:update-config", configData)
}

contextBridge.exposeInMainWorld('electronAPISetting', electronAPISetting);