import Store from 'electron-store';

interface StoreSchema {
    config:{
        title: string;
        subtitle: string;
        minGraphTemp: number;
        maxGraphTemp: number;
        t1monitor: boolean;
        t2monitor: boolean;
        t3monitor: boolean;
        t4monitor: boolean;
    }
}
Store.initRenderer()
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
                    default: false
                },
                t2monitor: {
                    type: 'boolean',
                    default: true
                },
                t3monitor: {
                    type: 'boolean',
                    default: false
                },
                t4monitor: {
                    type: 'boolean',
                    default: false
                },
            }
        }
    }
})

export default store;