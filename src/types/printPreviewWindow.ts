import { GraphData } from "./mainWindow";

export interface PrintPreviewWindowElectronAPI {
    managePrintPreviewWindow: (manage: "open" | "close" | "print") => void;
    getTempData: () => Promise<GraphData[]>,
    ping: () => void,
    pong: () => void
}