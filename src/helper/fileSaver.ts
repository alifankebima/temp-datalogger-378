import tempData from "../model/tempData"
import xlsx from "xlsx"
import path from "path"
import { app } from "electron"

// const saveAsPDF = async () => {

// }

const saveAsExcel = async (recordingSessionID: number) => {
    try {
        const data = await tempData.selectForExcel(recordingSessionID)
        const worksheet = xlsx.utils.json_to_sheet(data)

        // Convert "Tanggal_Waktu" column to custom date format
        if(!worksheet['!ref']) throw new Error("Data tidak ditemukan")
        const range = xlsx.utils.decode_range(worksheet['!ref'])
        for(let row = range.s.r + 1; row <= range.e.r; row++){
            const cellAddress = xlsx.utils.encode_cell({r: row, c: 4})
            if(!worksheet[cellAddress]) continue
            worksheet[cellAddress].t = 'n'
            worksheet[cellAddress].z = 'dd/mm/yyyy hh:mm:ss'
        }

        // Adjust column width
        worksheet['!cols'] = new Array(4).fill({ wch: 6 });
        worksheet['!cols'].push({ wch: 21 })
        
        const workbook = xlsx.utils.book_new()
        xlsx.utils.book_append_sheet(workbook, worksheet, 'KLIN DRY')

        const filePath = path.join( app.getPath('documents'), 'test.xlsx')
        xlsx.writeFile(workbook, filePath)
    } catch (error) {
        console.error("Terjadi kesalahan menyimpan data sebagai Excel")
        console.error(error)
    }
}

export default {
    saveAsExcel
}