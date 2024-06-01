import { StoreSchema } from "./electronStore";
import { ManagePrintPreviewWindow } from "./printPreviewWindow";

export interface Temps<T = number | undefined> {
    t1: T,
    t2: T,
    t3: T,
    t4: T,
}

export interface GraphData extends Temps {
    created_at: number
}

export interface MainWindowElectronAPI {
    getConfig: () => Promise<StoreSchema["config"]>;
    getDevicePath: () => Promise<StoreSchema["devicePath"]>;
    startRecord: (isDataExists: boolean) => void;
    stopRecord: (isStoppedManually: boolean) => void;
    manageSettingWindow: (manage: "open" | "close") => void;
    managePrintPreviewWindow: (args: ManagePrintPreviewWindow) => void;
    saveFile: (args: unknown) => void;
    updateGraph: (callback: (data: GraphData[]) => void) => void;
    removeUpdateGraph: () => void;
    updateTempDisplay: (callback: (data: Temps<number>) => void) => void;
    removeUpdateTempDisplay: () => void;
    updateConfig: (callback: (data:StoreSchema['config']) => void) => void;
    updateDevicePath: (callback: (data:string) => void) => void;
    removeUpdateConfig: () => void;
    startRecordCallback: (callback: (isContinueRecord: boolean) => void) => void;
    removeStartRecordCallback: () => void;
    stopRecordCallback: (callback: () => void) => void;
    removeStopRecordCallback: () => void;
}