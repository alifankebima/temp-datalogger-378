export interface StoreSchema {
    config:{
        title: string;
        subtitle: string;
        minGraphTemp: number;
        maxGraphTemp: number;
        t1monitor: boolean;
        t2monitor: boolean;
        t3monitor: boolean;
        t4monitor: boolean;
    },
    state: {
        isRecording: boolean,
        isStopRecordingManually: boolean,
        recordingSessionID: number
    },
    serialportMock: boolean
}