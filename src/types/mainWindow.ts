import { StoreSchema } from "./electronStore";

export interface Temps<T = number | null | undefined> {
    t1: T,
    t2: T,
    t3: T,
    t4: T,
}

export interface GraphData extends Temps {
    created_at: number
}

export interface IpcMainWindow extends Temps<number> {
    command: string
    result: GraphData[]
}

export interface ElectronAPI {
    getConfig: () => Promise<StoreSchema["config"]>;
    startRecord: (isDataExists: boolean) => void;
    stopRecord: (isStoppedManually: boolean) => void;
    manageSettingWindow: (manage: "open" | "close") => void;
    managePrintWindow: (manage: "open" | "close") => void;
    updateGraph: (callback: (data: GraphData[]) => void) => void;
    removeUpdateGraph: () => void;
    updateTempDisplay: (callback: (data: Temps<number>) => void) => void;
    removeUpdateTempDisplay: () => void;
    updateConfig: (callback: (data:StoreSchema['config']) => void) => void;
    removeUpdateConfig: () => void;
    startRecordConfirmed: (callback: () => void) => void;
    removeStartRecordConfirmed: () => void;
    stopRecordConfirmed: (callback: () => void) => void;
    removeStopRecordConfirmed: () => void;
    ping: () => void,
    pong: () => void
}