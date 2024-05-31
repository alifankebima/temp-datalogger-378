import { BrowserWindow } from "electron"
import xlsx from "xlsx"
import fs from "fs"

import store from "../config/electronStore"
import tempData from "../model/tempData"

const saveAsPDF = async (printPreviewWindow: BrowserWindow | null, filePath: string) => {
    if (!printPreviewWindow) throw new Error("Gagal mengenerate file PDF")

    const pdfFile = await printPreviewWindow.webContents.printToPDF({
        pageSize: 'A4'
    })

    fs.writeFile(filePath, pdfFile, (error: unknown) => {
        if (error) {
            printPreviewWindow?.close()
            throw error
        }
    })

    if(!printPreviewWindow.isVisible()) printPreviewWindow.close()
}

const saveAsExcel = async (filePath: string) => {
    const recordingSessionID = store.get('state').recordingSessionID
    const data = await tempData.selectForExcel(recordingSessionID)
    const worksheet = xlsx.utils.json_to_sheet(data)

    // Convert "Tanggal_Waktu" column to custom date format
    if (!worksheet['!ref']) throw new Error("Data tidak ditemukan")
    const range = xlsx.utils.decode_range(worksheet['!ref'])
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const cellAddress = xlsx.utils.encode_cell({ r: row, c: 4 })
        if (!worksheet[cellAddress]) continue
        worksheet[cellAddress].t = 'n'
        worksheet[cellAddress].z = 'dd/mm/yyyy hh:mm:ss'
    }

    // Adjust column width
    worksheet['!cols'] = new Array(4).fill({ wch: 6 });
    worksheet['!cols'].push({ wch: 21 })

    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'KLIN DRY')

    xlsx.writeFile(workbook, filePath)
}

const saveAsImage = async (mainWindow: BrowserWindow | null, filePath: string, image?: string) => {
    if (!mainWindow || !image || typeof(image) !== "string") return

    image = image.replace(/^data:image\/png;base64,/, '')
    const imageBuffer = Buffer.from(image, 'base64')
    fs.writeFile(filePath, imageBuffer, (error: unknown) => {
        if (error) throw error
    })
}

export default {
    saveAsPDF,
    saveAsExcel,
    saveAsImage
}