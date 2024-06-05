import { StoreSchema } from "./electronStore";
import { Milliseconds, Seconds } from "./unit";
import { GraphData, Temps } from "./tempData";
import { SaveFileArgs } from "./main";

type ManageWindow = "open" | "close"

interface ManagePrintPreviewWindow {
    args: ManageWindow | "print" | "pdf"
    startTimestamp?: Milliseconds,
    endTimestamp?: Milliseconds
}

interface MainWindowElectronAPI {
    manageSettingWindow: (manageWindow: ManageWindow) => void;
    managePrintPreviewWindow: (args: ManagePrintPreviewWindow) => void;

    startRecord: (isDataExists: boolean) => void;
    stopRecord: (isStoppedManually: boolean) => void;

    getConfig: () => Promise<StoreSchema["config"]>;
    getDevicePath: () => Promise<StoreSchema["devicePath"]>;
    saveFile: (args: SaveFileArgs) => void;
    
    updateGraph: (callback: (data: GraphData[]) => void) => void;
    updateTempDisplay: (callback: (data: Temps) => void) => void;
    updateConfig: (callback: (newData: StoreSchema['config']) => void) => void;
    updateDevicePath: (callback: (devicePath: string) => void) => void;
    startRecordCallback: (callback: (isContinueRecord: boolean) => void) => void;
    stopRecordCallback: (callback: () => void) => void;
    
    removeWindowListeners: () => void;
}

interface SettingWindowElectronAPI {
    getConfig: () => Promise<StoreSchema["config"]>;
    setConfig: (newData: StoreSchema["config"]) => void;
    manageSettingWindow: (manageWindow: ManageWindow) => void;
}

interface PrintPreviewWindowElectronAPI {
    managePrintPreviewWindow: (args: ManagePrintPreviewWindow) => void;

    getGraphData: (recordingSessionID: number, interval: Seconds) => Promise<GraphData[]>,

    getState: () => Promise<StoreSchema["state"]>;    
    getPrintPreviewConfig: () => Promise<StoreSchema["printPreview"]>;
    setPrintPreviewConfig: (newData: StoreSchema["printPreview"]) => void;

    saveFile: (args: SaveFileArgs) => void;
}

export {
    ManageWindow,
    MainWindowElectronAPI,
    SettingWindowElectronAPI,
    PrintPreviewWindowElectronAPI
}