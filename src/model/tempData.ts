import { GraphData } from '../types/mainWindow';
import db from '../config/sqlite';

interface InsertData {
    recording_sessions_id: number,
    t1?: number,
    t2?: number,
    t3?: number,
    t4?: number,
    moisture_content?: number
}

interface SelectData extends InsertData {
    created_at: number
}

const selectAllData = (recording_sessions_id: number) => {
    return new Promise<SelectData[]>((resolve, reject) => {
        db.all<SelectData>(
            `SELECT 
                t1, t2, t3, t4, moisture_content, created_at 
            FROM temp_data 
            WHERE recording_sessions_id=? AND deleted_at IS NULL 
            ORDER BY created_at ASC;`,
            [recording_sessions_id],
            (error, rows) => error ? reject(error) : resolve(rows)
        )
    })
}

const selectBySampleSize = (recording_sessions_id: number, sampleSize: number = 100) => {
    return new Promise<GraphData[]>((resolve, reject) => {
        db.all<GraphData>(
            `WITH td AS (
                SELECT t1, t2, t3, t4, created_at, ROW_NUMBER() OVER (ORDER BY id ASC) as rownum FROM temp_data 
                WHERE recording_sessions_id = ? AND deleted_at IS NULL
            ),
            total_records AS (
                SELECT count(*) FROM td
            )
            SELECT *, (SELECT * FROM total_records) AS total_records FROM td 
            WHERE rownum = 1 OR rownum = (
                SELECT rownum FROM td ORDER BY rownum DESC LIMIT 1
            ) OR (
                rownum % CASE WHEN total_records > ? THEN total_records / (? - 2) ELSE 1 END = 0
            ) ORDER BY created_at ASC;`,
            [recording_sessions_id, sampleSize, sampleSize],
            (error, rows) => error ? reject(error) : resolve(rows)
        )
    })
}

const selectByTimeInterval = (recording_sessions_id: number, intervalSeconds: number = 3600) => {
    const rowThresholdMilliseconds = 900000
    console.log(intervalSeconds)
    return new Promise<GraphData[]>((resolve, reject) => {
        db.all<GraphData>(
            `WITH td AS (
                SELECT t1, t2, t3, t4, created_at, ROW_NUMBER() OVER (ORDER BY id ASC) as rownum FROM temp_data 
                WHERE recording_sessions_id = ? AND deleted_at IS NULL
            ),
            total_records AS (
                SELECT COUNT(*) FROM td
            ),
            data_interval AS (
                SELECT ? / ROUND(CAST(MAX(created_at) - MIN(created_at) AS FLOAT) / count(*) / 1000) FROM td
            ),
            second_to_last_row AS (
                SELECT * FROM td WHERE rownum % (SELECT * FROM data_interval) = 0 ORDER BY rownum desc LIMIT 1
            )
            SELECT * FROM td WHERE rownum = 1 OR rownum = (
                SELECT * FROM total_records
            ) OR (
                rownum % (SELECT * FROM data_interval) = 0 AND rownum NOT IN (
                    SELECT rownum FROM second_to_last_row WHERE (SELECT max(created_at) FROM td) < created_at + ?
                )
            ) ORDER BY created_at ASC;`,
            [recording_sessions_id, intervalSeconds, rowThresholdMilliseconds],
            (error, rows) => error ? reject(error) : resolve(rows)
        )
    })
}

const insertData = (data: InsertData) => {
    const created_at = new Date().getTime();
    const values = [
        data.recording_sessions_id,
        data.t1 || null,
        data.t2 || null,
        data.t3 || null,
        data.t4 || null,
        data.moisture_content || null,
        created_at
    ];

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO temp_data(
                recording_sessions_id, t1, t2, t3, t4, moisture_content, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            values,
            function (error) {
                error ? reject(error) : resolve(this.changes)
            }
        )
    })
}

const softDeleteAllData = () => {
    const deleted_at = new Date().getTime();

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE temp_data SET 
                deleted_at=? 
            WHERE deleted_at IS NULL;`,
            [deleted_at],
            function (error) {
                error ? reject(error) : resolve(this.changes)
            }
        )
    })
}

const hardDeleteAllData = () => {
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM temp_data;`,
            function (error) {
                error ? reject(error) : resolve(this.changes)
            }
        )
    })
}

export default {
    selectAllData,
    selectBySampleSize,
    selectByTimeInterval,
    insertData,
    softDeleteAllData,
    hardDeleteAllData
}