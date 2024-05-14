import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';
import commonHelper from '../helper/commonHelper';

const dbPath = path.join(app.getPath('userData'), 'datalogger.db')

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) return console.error(error)
    console.log("Successfully initialized database")
})

db.run('PRAGMA foreign_keys = ON;', commonHelper.handleError)
db.run(
    `CREATE TABLE IF NOT EXISTS recording_sessions(
        id integer primary key AUTOINCREMENT NOT NULL,
        graph_title text,
        graph_subtitle text,
        start_date integer NOT NULL,
        end_date integer,
        product_type_wood text,
        product_type_pallet text,
        qty_pcs integer,
        qty_m3 integer,
        created_at integer NOT NULL,
        updated_at integer,
        deleted_at integer
    );`
, commonHelper.handleError)
db.run(
    `CREATE TABLE IF NOT EXISTS temp_data(
        id integer primary key AUTOINCREMENT NOT NULL,
        recording_sessions_id integer NOT NULL,
        t1 real,
        t2 real,
        t3 real,
        t4 real,
        moisture_content integer,
        created_at integer NOT NULL,
        deleted_at integer,
        foreign key (recording_sessions_id) references recording_sessions(id)
    );`
, commonHelper.handleError)

export default db