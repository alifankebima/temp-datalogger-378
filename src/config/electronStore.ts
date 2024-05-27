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
                    type: 'string'
                },
                subtitle: {
                    type: 'string'
                },
                minGraphTemp: {
                    type: 'number'
                },
                maxGraphTemp: {
                    type: 'number'
                },
                // Sensor monitoring configuration
                t1monitor: {
                    type: 'boolean'
                },
                t2monitor: {
                    type: 'boolean'
                },
                t3monitor: {
                    type: 'boolean'
                },
                t4monitor: {
                    type: 'boolean'
                },
            },
            default: {
                title: '',
                subtitle: '',
                minGraphTemp: 20,
                maxGraphTemp: 80,
                t1monitor: true,
                t2monitor: false,
                t3monitor: true,
                t4monitor: true
            }
        },
        state: {
            type: 'object',
            properties: {
                isRecording: {
                    type: 'boolean'
                },
                isStopRecordingManually: {
                    type: 'boolean'
                },
                recordingSessionID: {
                    type: 'number'
                },
            },
            default: {
                isRecording: false,
                isStopRecordingManually: false,
                recordingSessionID: 0
            }
        },
        printPreview: {
            type: 'object',
            properties: {
                sampleInterval: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        value: {
                            type: 'number',
                        }
                    },
                }
            },
            default: {
                sampleInterval: {
                    name: "1 Jam",
                    value: 3600
                }
            }
        }
    }
})

export default store;