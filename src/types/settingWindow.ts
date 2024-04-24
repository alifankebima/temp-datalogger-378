import { StoreSchema } from "./electronStore";

export interface SettingWindowElectronAPI {
    getConfig: () => Promise<StoreSchema["config"]>;
    manageSettingWindow: (manage: "open" | "close") => void;
    ping: () => void,
    pong: () => void
}