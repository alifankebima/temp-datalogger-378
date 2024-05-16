export interface PrintPreviewWindowElectronAPI {
    managePrintPreviewWindow: (manage: "open" | "close" | "print") => void;
    ping: () => void,
    pong: () => void
}