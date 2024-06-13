import { DropdownItem } from "./sampleInterval";
import { Minutes } from "./unit";

interface StoreSchema {
    config: {
        title: string;
        subtitle: string;
        minGraphTemp: number;
        maxGraphTemp: number;
        t1monitor: boolean;
        t2monitor: boolean;
        t3monitor: boolean;
        t4monitor: boolean;
        stopRecordAutomatically: boolean;
        targetTemp: number;
        keepRecordDuration: Minutes;
    },
    state: {
        isRecording: boolean,
        isStopRecordingManually: boolean,
        recordingSessionID: number,
    },
    devicePath: string,
    printPreview: {
        sampleInterval: DropdownItem
    }
}

export {
    StoreSchema,
}