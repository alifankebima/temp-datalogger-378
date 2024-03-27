import sqlite from '../config/sqlite'

const fetchAllData = () => {
    return sqlite.fetchAll('SELECT t1, t2, t3, t4, title, subtitle, created_at FROM tempdata WHERE deleted_at IS NOT NULL;')
}

const insertData = (data) => {
    const { t1, t2, t3, t4, title, subtitle, created_at } = data;
    return sqlite.executeQuery('INSERT INTO tempdata(t1, t2, t3, t4, title, subtitle, created_at) VALUES (?,?,?,?,?,?,?);',
        [t1, t2, t3, t4, title, subtitle, created_at])
}

const softDeleteAllData = (data) => {
    const { deleted_at } = data
    return sqlite.executeQuery('UPDATE tempdata SET deleted_at=? WHERE deleted_at IS NULL;', [deleted_at])
}

const hardDeleteAllData = () => {
    return sqlite.executeQuery('DELETE FROM tempdata;')
}

export default {
    fetchAllData,
    insertData,
    softDeleteAllData,
    hardDeleteAllData
}