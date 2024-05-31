import { DropdownItems } from "./dropdown";
import { StoreSchema } from "./electronStore";
import { GraphData } from "./mainWindow";

export interface ManagePrintPreviewWindow {
    args: "open" | "close" | "print" | "pdf"
    startTimestamp?: number,
    endTimestamp?: number
}
export interface PrintPreviewConfing {
    sampleInterval: DropdownItems
}

export interface PrintPreviewWindowElectronAPI {
    managePrintPreviewWindow: (args: ManagePrintPreviewWindow) => void;
    getTempData: (recordingSessionID: number, intervalSeconds: number) => Promise<GraphData[]>,
    getPrintPreviewConfig: () => Promise<StoreSchema["printPreview"]>;
    getState: () => Promise<StoreSchema["state"]>;
    updatePrintPreviewConfig: (configData: PrintPreviewConfing) => void;
    ping: () => void,
    pong: () => void
}