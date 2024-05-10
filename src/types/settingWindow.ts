import { StoreSchema } from "./electronStore";

export interface graphSettingForm {
    title: string,
    subtitle: string
}

export interface SettingWindowElectronAPI {
    getConfig: () => Promise<StoreSchema["config"]>;
    manageSettingWindow: (manage: "open" | "close") => void;
    updateConfig: (configData: graphSettingForm) => void;
    ping: () => void,
    pong: () => void
}