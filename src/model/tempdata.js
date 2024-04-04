import sqlite from '../config/sqlite'

const fetchAllData = (data) => {
    const { recording_sessions_id } = data;
    return sqlite.fetchAll(`SELECT t1, t2, t3, t4, created_at FROM temp_data 
        WHERE recording_sessions_id=? AND deleted_at IS NULL 
        ORDER BY created_at ASC;`, [recording_sessions_id]);
}

const fetchDownsampledData = (data) => {
    const { recording_sessions_id } = data;
    const query = new Array(4).fill(recording_sessions_id);
    return sqlite.fetchAll(`WITH total_records AS (
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
    ) ORDER BY created_at ASC;`, query)
}

const fetchDataPerHour = (data) => {
    const { recording_sessions_id } = data;
    return sqlite.fetchAll(`SELECT strftime('%Y-%m-%d %H:%M:%S', 
        datetime(created_at/1000, 'unixepoch', 'localtime')) AS interval_start, 
        COUNT(*) AS data_count, * FROM tempdata WHERE recording_sessions_id=? AND
        deleted_at IS NULL GROUP BY 
        strftime('%Y-%m-%d %H:00:00', datetime(created_at/1000, 'unixepoch', 
        'localtime'), '+6 hours');`, [recording_sessions_id])
}

const insertData = (data) => {
    const { recording_sessions_id, t1, t2, t3, t4 } = data;
    const created_at = new Date().getTime();
    return sqlite.executeQuery(`INSERT INTO temp_data(recording_sessions_id, 
        t1, t2, t3, t4, created_at) VALUES (?, ?, ?, ?, ?, ?);`,
        [recording_sessions_id, t1, t2, t3, t4, created_at])
}

const softDeleteAllData = () => {
    const deleted_at = new Date().getTime()
    return sqlite.executeQuery(`UPDATE temp_data SET deleted_at=? 
        WHERE deleted_at IS NULL;`, [deleted_at])
}

const hardDeleteAllData = () => {
    return sqlite.executeQuery('DELETE FROM temp_data;')
}

export default {
    fetchAllData,
    fetchDownsampledData,
    fetchDataPerHour,
    insertData,
    softDeleteAllData,
    hardDeleteAllData
}