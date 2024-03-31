const Store = require('electron-store');

const store = new Store({
    schema: {
        config: {
            type: 'object',

            // Judul dan subjudul grafik
            title: {
                type: 'string',
                default: ''
            },
            subtitle: {
                type: 'string',
                default: ''
            },
            
            // Konfigurasi grafik
            minGraphTemp: {
                type: 'number',
                default: 20
            },
            maxGraphTemp: {
                type: 'number',
                default: 80
            },

            // Konfigurasi monitor sensor
            t1monitor: {
                type: 'boolean',
                default: true
            },
            t2monitor: {
                type: 'boolean',
                default: true
            },
            t3monitor: {
                type: 'boolean',
                default: true
            },
            t4monitor: {
                type: 'boolean',
                default: true
            },
        }
    }
})

export default store;