const sqlite = require('sqlite-electron');

(async () => {
    try {
        const dbCreated = await sqlite.setdbPath("file:datalogger.db?mode:rwc", true);
        console.log('DB file created!');

        if (dbCreated){
            await sqlite.executeQuery(`CREATE TABLE IF NOT EXISTS tempdata(
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                title TEXT,
                subtitle TEXT,
                t1 REAL,
                t2 REAL,
                t3 REAL,
                t4 REAL,
                created_at INTEGER,
                deleted_at INTEGER
            );`)
            console.log('Table created!');
        } 
    }
    catch (err) {
        console.log(err);
    }
})()

export default sqlite;