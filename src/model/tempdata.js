import sqlite from '../config/sqlite'

const fetchAllData = () => {
    return sqlite.fetchAll(`SELECT t1, t2, t3, t4, title, subtitle, created_at 
        FROM tempdata WHERE deleted_at IS NULL ORDER BY created_at ASC;`)
}

const fetchDownsampledData = () => {
    return sqlite.fetchAll(`WITH total_records AS (
        SELECT COUNT(*) AS total FROM tempdata WHERE deleted_at IS NULL
    ),
    earliest_and_latest AS (
        SELECT MIN(created_at) AS earliest_time, MAX(created_at) AS latest_time
        FROM tempdata WHERE deleted_at IS NULL
    ),
    sampled_data AS (
        SELECT *,
               (SELECT total FROM total_records) AS total_records,
               (SELECT COUNT(*) FROM tempdata t2 WHERE t2.created_at <= t1.created_at 
               AND deleted_at IS NULL) AS row_num
        FROM tempdata t1
    )
    SELECT t1, t2, t3, t4, created_at AS timestamp FROM (
        SELECT * FROM sampled_data WHERE row_num = 1
        UNION ALL
        SELECT * FROM sampled_data WHERE row_num = total_records
        UNION ALL
        SELECT * FROM sampled_data 
        WHERE (row_num % CASE WHEN total_records > 100 THEN total_records / 98 ELSE 1 END = 0)
              AND row_num NOT IN (1, total_records)
    )
    ORDER BY created_at ASC;`)
}

const fetchDownsampledTimestamp = () => {
    return sqlite.fetchAll(`WITH total_records AS (
        SELECT COUNT(*) AS total FROM tempdata WHERE deleted_at IS NULL
    ),
    earliest_and_latest AS (
        SELECT MIN(created_at) AS earliest_time, MAX(created_at) AS latest_time
        FROM tempdata WHERE deleted_at IS NULL
    ),
    sampled_data AS (
        SELECT *,
               (SELECT total FROM total_records) AS total_records,
               (SELECT COUNT(*) FROM tempdata t2 WHERE t2.created_at <= t1.created_at 
               AND deleted_at IS NULL) AS row_num
        FROM tempdata t1
    )
    SELECT created_at FROM (
        SELECT * FROM sampled_data WHERE row_num = 1
        UNION ALL
        SELECT * FROM sampled_data WHERE row_num = total_records
        UNION ALL
        SELECT * FROM sampled_data 
        WHERE (row_num % CASE WHEN total_records > 20 THEN total_records / 18 ELSE 1 END = 0)
              AND row_num NOT IN (1, total_records)
    )
    ORDER BY created_at ASC;`)
}

const insertData = (data) => {
    const { t1, t2, t3, t4, title, subtitle } = data;
    const created_at = new Date().getTime()
    return sqlite.executeQuery('INSERT INTO tempdata(t1, t2, t3, t4, title, subtitle, created_at) VALUES (?,?,?,?,?,?,?);',
        [t1, t2, t3, t4, title, subtitle, created_at])
}

const softDeleteAllData = () => {
    const deleted_at = new Date().getTime()
    return sqlite.executeQuery('UPDATE tempdata SET deleted_at=? WHERE deleted_at IS NULL;', [deleted_at])
}

const hardDeleteAllData = () => {
    return sqlite.executeQuery('DELETE FROM tempdata;')
}

export default {
    fetchAllData,
    fetchDownsampledData,
    fetchDownsampledTimestamp,
    insertData,
    softDeleteAllData,
    hardDeleteAllData
}