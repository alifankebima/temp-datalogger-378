import sqlite from '../config/sqlite'

const fetchLastData = () => {
    return sqlite.fetchOne(`SELECT id, graph_title, graph_subtitle, start_date,
        end_date, product_type_wood, product_type_pallet, qty_pcs, qty_m3,
        moisture_content, created_at, updated_at FROM recording_sessions 
        WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 1;`);
}

const insertData = (data) => {
    const { graph_title, graph_subtitle, product_type_wood, product_type_pallet,
        qty_pcs, qty_m3 } = data;
    const created_at = new Date().getTime()

    return sqlite.executeQuery(`INSERT INTO recording_sessions(graph_title,
        graph_subtitle, start_date, product_type_wood, product_type_pallet, 
        qty_pcs, qty_m3, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, 
        [graph_title, graph_subtitle, created_at, product_type_wood, 
        product_type_pallet, qty_pcs, qty_m3, created_at]);
}

const updateData = (data) => {
    const { id, graph_title, graph_subtitle, end_date, product_type_wood,
        product_type_pallet, qty_pcs, qty_m3, moisture_content } = data;

    const order = ["graph_title", "graph_subtitle", "end_date", "product_type_wood",
        "product_type_pallet", "qty_pcs", "qty_m3", "moisture_content"];
    const filteredData = order.map(key => data[key]).filter(value => !value);
    const updated_at = new Date().getTime();
    filteredData.push(updated_at);
    filteredData.push(id);

    return sqlite.executeQuery(`UPDATE recording_sessions SET 
        ${graph_title && "graph_title='?', "}
        ${graph_subtitle && "graph_subtitle='?', "}
        ${end_date && "end_date=?, "}
        ${product_type_wood && "product_type_wood='?', "}
        ${product_type_pallet && "product_type_pallet='?', "}
        ${qty_pcs && "qty_pcs=?, "}
        ${qty_m3 && "qty_m3=?, "}
        ${moisture_content && "moisture_content=?, "}
        updated_at=? WHERE id=? and deleted_at IS NULL;`, filteredData);
}

const softDeleteAllData = () => {
    const deleted_at = new Date().getTime()
    return sqlite.executeQuery(`UPDATE recording_sessions SET deleted_at=? 
        WHERE deleted_at IS NULL;`, [deleted_at])
}

const hardDeleteAllData = () => {
    return sqlite.executeQuery('DELETE FROM recording_sessions;')
}

export default {
    fetchLastData,
    insertData,
    updateData,
    softDeleteAllData,
    hardDeleteAllData
}