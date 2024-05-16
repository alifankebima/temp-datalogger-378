import { contextBridge, ipcRenderer } from "electron";
import { PrintPreviewWindowElectronAPI } from "../../types/printPreviewWindow";

const electronAPIPrintPreview: PrintPreviewWindowElectronAPI = {
    managePrintPreviewWindow: (manage) => ipcRenderer.send("print-preview-window:manage", manage),
    // managePrintPreviewWindow: (manage) => console.log("e"),

    // for debugging
    ping: () => ipcRenderer.send('ping'),
    pong: () => ipcRenderer.on('pong', (_event, _data) => console.log('pong'))
}

contextBridge.exposeInMainWorld('electronAPIPrintPreview', electronAPIPrintPreview);