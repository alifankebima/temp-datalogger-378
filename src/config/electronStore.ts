import Store from 'electron-store';
import { StoreSchema } from '../types/electronStore';

const store = new Store<StoreSchema>({
    schema: {
        // Stores user defined configuration in app settings
        config: {
            type: 'object',
            properties: {
                // Graph configuration
                title: {
                    type: 'string',
                    default: ''
                },
                subtitle: {
                    type: 'string',
                    default: ''
                },
                minGraphTemp: {
                    type: 'number',
                    default: 20
                },
                maxGraphTemp: {
                    type: 'number',
                    default: 80
                },
                // Sensor monitoring configuration
                t1monitor: {
                    type: 'boolean',
                    default: true
                },
                t2monitor: {
                    type: 'boolean',
                    default: false
                },
                t3monitor: {
                    type: 'boolean',
                    default: true
                },
                t4monitor: {
                    type: 'boolean',
                    default: true
                },
                stopRecordAutomatically: {
                    type: 'boolean',
                    default: false
                },
                targetTemp: {
                    type: 'number',
                    default: 65
                }
            },
            default: {}
        },
        state: {
            type: 'object',
            properties: {
                isRecording: {
                    type: 'boolean',
                    default: false
                },
                isStopRecordingManually: {
                    type: 'boolean',
                    default: false
                },
                recordingSessionID: {
                    type: 'number',
                    default: 0
                }
            },
            default: {}
        },
        devicePath: {
            type: 'string',
            default: ''
        },
        printPreview: {
            type: 'object',
            properties: {
                sampleInterval: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            default: "1 Jam"
                        },
                        value: {
                            type: 'number',
                            default: 3600
                        }
                    },
                    default: {}
                }
            },
            default: {}
        }
    }
})

export default store;