import sqlite from '../config/sqlite'

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

const fetchAllData = (data: SelectData) => {
    const { recording_sessions_id } = data;

    return sqlite.fetchAll<SelectData>(`
        SELECT 
            t1, t2, t3, t4, moisture_content, created_at 
        FROM temp_data 
        WHERE recording_sessions_id=? AND deleted_at IS NULL 
        ORDER BY created_at ASC;`, [recording_sessions_id]
    );
}

const fetchDownsampledData = (data: SelectData) => {
    const { recording_sessions_id } = data;
    const values = new Array(4).fill(recording_sessions_id);

    return sqlite.fetchAll<SelectData>(`
        WITH total_records AS (
            SELECT COUNT(*) AS total FROM temp_data WHERE recording_sessions_id=? 
            AND deleted_at IS NULL
        ),
        earliest_and_latest AS (
            SELECT MIN(created_at) AS earliest_time, MAX(created_at) AS latest_time
            FROM temp_data WHERE recording_sessions_id=? AND deleted_at IS NULL
        ),
        sampled_data AS (
            SELECT *, (SELECT total FROM total_records) AS total_records,
            (SELECT COUNT(*) FROM temp_data t2 WHERE t2.recording_sessions_id=? AND 
            t2.created_at <= t1.created_at AND t2.deleted_at IS NULL) AS row_num FROM 
            temp_data t1 WHERE t1.recording_sessions_id=? AND t1.deleted_at IS NULL
        )
        SELECT t1, t2, t3, t4, created_at FROM (
            SELECT * FROM sampled_data WHERE row_num = 1
            UNION ALL
            SELECT * FROM sampled_data WHERE row_num = total_records
            UNION ALL
            SELECT * FROM sampled_data WHERE (row_num % CASE WHEN total_records > 100 
            THEN total_records / 98 ELSE 1 END = 0) AND row_num NOT IN 
            (1, total_records)
        ) ORDER BY created_at ASC;`, values
    );
}

const fetchDataPerHour = (data: SelectData) => {
    const { recording_sessions_id } = data;
    return sqlite.fetchAll<SelectData>(`
        SELECT 
            strftime('%Y-%m-%d %H:%M:%S', datetime(created_at/1000, 
            'unixepoch', 'localtime')) AS interval_start, COUNT(*) AS data_count, 
            * 
        FROM temp_data 
        WHERE recording_sessions_id=? AND deleted_at IS NULL 
        GROUP BY strftime('%Y-%m-%d %H:00:00', datetime(created_at/1000, 'unixepoch', 
        'localtime'), '+6 hours');`, [recording_sessions_id]
    );
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

    return sqlite.executeQuery(`
        INSERT INTO temp_data(
            recording_sessions_id, t1, t2, t3, t4, moisture_content, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?);`, values
    );
}

const softDeleteAllData = () => {
    const deleted_at = new Date().getTime();

    return sqlite.executeQuery(`
        UPDATE temp_data SET 
            deleted_at=? 
        WHERE deleted_at IS NULL;`, [deleted_at]
    );
}

const hardDeleteAllData = () => {
    return sqlite.executeQuery('DELETE FROM temp_data;');
}

export default {
    fetchAllData,
    fetchDownsampledData,
    fetchDataPerHour,
    insertData,
    softDeleteAllData,
    hardDeleteAllData
}