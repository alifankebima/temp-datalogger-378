const sqlite = require('sqlite-electron');

(async () => {
    try {
        const dbCreated = await sqlite.setdbPath("file:datalogger.db?mode:rwc", true);
        if (!dbCreated) throw new Error("Error creating database file");

        const dbConfigured = await sqlite.executeQuery(`PRAGMA foreign_keys = ON;`);
        if (!dbConfigured) throw new Error("Error configuring database");

        const recordingSessionsCreated = await sqlite.executeQuery(`
            CREATE TABLE IF NOT EXISTS recording_sessions(
                id integer primary key AUTOINCREMENT NOT NULL,
                graph_title text,
                graph_subtitle text,
                start_date integer NOT NULL,
                end_date integer,
                product_type_wood text,
                product_type_pallet text,
                qty_pcs integer,
                qty_m3 integer,
                moisture_content integer,
                created_at integer NOT NULL,
                updated_at integer,
                deleted_at integer
        );`);
        if (!recordingSessionsCreated) throw new Error("Error creating recording_sessions table");

        const tempDataCreated = await sqlite.executeQuery(`
            CREATE TABLE IF NOT EXISTS temp_data(
                id integer primary key AUTOINCREMENT NOT NULL,
                recording_sessions_id integer NOT NULL,
                t1 real,
                t2 real,
                t3 real,
                t4 real,
                created_at integer NOT NULL,
                deleted_at integer,
                foreign key (recording_sessions_id) references recording_sessions(id)
        );`);
        if (!tempDataCreated) throw new Error("Error creating temp_data table");

        console.log("Successfully initialize SQLite database")
    } catch (err) {
        console.log(err);
    }
})()

export default sqlite;