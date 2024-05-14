import db from '../config/sqlite'

interface InsertData {
    graph_title?: string,
    graph_subtitle?: string,
    product_type_wood?: string,
    product_type_pallet?: string,
    qty_pcs?: number,
    qty_m3?: number
}

interface UpdateData extends InsertData {
    id: number,
    end_date?: number
}

interface SelectData extends UpdateData {
    start_date: number,
    created_at: number,
    updated_at?: number
}

const fetchLastData = () => {
    return new Promise<SelectData | undefined>((resolve, reject) => {
        db.get<SelectData>(
            `SELECT 
            id, graph_title, graph_subtitle, start_date, end_date, 
            product_type_wood, product_type_pallet, qty_pcs, qty_m3, 
            created_at, updated_at 
        FROM recording_sessions 
        WHERE deleted_at IS NULL 
        ORDER BY created_at DESC 
        LIMIT 1;`,
            (error, row) => error ? reject(error) : resolve(row)
        )
    })
}

const insertData = (data: InsertData) => {
    const created_at = new Date().getTime()
    const values = [
        data.graph_title || null,
        data.graph_subtitle || null,
        created_at,
        data.product_type_wood || null,
        data.product_type_pallet || null,
        data.qty_pcs || null,
        data.qty_m3 || null,
        created_at
    ]

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO recording_sessions(
                graph_title, graph_subtitle, start_date, product_type_wood, 
                product_type_pallet, qty_pcs, qty_m3, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            values,
            function (error) {
                error ? reject(error) : resolve(this.changes)
            }
        )
    })
}

const updateData = (data: UpdateData) => {
    const updated_at = new Date().getTime();
    const values = [
        data.graph_title,
        data.graph_subtitle,
        data.end_date,
        data.product_type_wood,
        data.product_type_pallet,
        data.qty_pcs,
        data.qty_m3,
        updated_at,
        data.id
    ].filter(Boolean) as (string | number)[]

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE recording_sessions SET 
                ${data.graph_title && "graph_title='?', "}
                ${data.graph_subtitle && "graph_subtitle='?', "}
                ${data.end_date && "end_date=?, "}
                ${data.product_type_wood && "product_type_wood='?', "}
                ${data.product_type_pallet && "product_type_pallet='?', "}
                ${data.qty_pcs && "qty_pcs=?, "}
                ${data.qty_m3 && "qty_m3=?, "}
                updated_at=? 
            WHERE id=? AND deleted_at IS NULL;`,
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
            `UPDATE recording_sessions SET 
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
            `DELETE FROM recording_sessions;`,
            function (error) {
                error ? reject(error) : resolve(this.changes)
            }
        )
    })
}

export default {
    fetchLastData,
    insertData,
    updateData,
    softDeleteAllData,
    hardDeleteAllData
}