import React, { useState } from "react";
import { PrintPreviewWindowElectronAPI } from "../../types/printPreviewWindow";
import SimpleButton from "../../components/SimpleButton";
import commonHelper from "../../helper/commonHelper";

declare global {
  interface Window {
    electronAPIPrintPreview: PrintPreviewWindowElectronAPI;
  }
}

const printPreviewWindow = () => {
  const [metadata, setMetadata] = useState({
    entryDate: "Kamis, 16 Mei 2024",
    exitDate: "Jum'at, 17 Mei 2024",
    duration: "1 Hari, 13 Jam, 24 Menit, 15 Detik",
  });

  const [data, setData] = useState([
    {
      t1: 30,
      t2: null,
      t3: 30,
      t4: 30,
      mc: null,
      created_at: 1715849283578,
    },
  ]);
  const handlePrint = () =>
    window.electronAPIPrintPreview.managePrintPreviewWindow("print");

  return (
    <>
      <div className="flex print:hidden p-2 border-b border-gray-400 gap-2">
        <SimpleButton onClick={handlePrint}>Print</SimpleButton>
        <SimpleButton>Batal</SimpleButton>
        <hr />
      </div>
      <div className="m-4" style={{ fontFamily: "Carlito, sans-serif" }}>
        <div className="flex justify-between my-4">
          <div className="flex gap-2">
            <div>Logo</div>
            <div
            className="font-bold"
              style={{
                fontFamily: "Liberation Serif, serif",
              }}
            >
              PT. SUMBER REZEKI PALLETINDO
            </div>
          </div>
          <div className="flex">
            <div className="w-24">DOK NEED</div>
            <div className="w-16">:</div>
            <div className="w-8">FM</div>
            <div className="">: 06</div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-16">
          <div className="font-bold">"LAPORAN MONITORING SUHU INTI KAYU"</div>
        </div>
        <div className="grid grid-cols-2 mt-4 gap-3">
          <div className="flex">
            <div className="w-36">Tanggal Masuk</div>
            <div className="">: {metadata.entryDate}</div>
          </div>
          <div className="flex">
            <div className="w-36">Tanggal Keluar</div>
            <div className="">: {metadata.exitDate}</div>
          </div>
          <div className="flex">
            <div className="w-36">Jumlah</div>
            <div className="">:</div>
          </div>
          <div className="flex">
            <div className="w-36">Jenis Kayu</div>
            <div className="">: </div>
          </div>
          <div className="flex col-span-2">
            <div className="w-36">Lama Proses</div>
            <div className="">: {metadata.duration}</div>
          </div>
        </div>
        <div className="mt-4">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black">No</th>
                <th className="border border-black">Tanggal</th>
                <th className="border border-black">Waktu</th>
                <th className="border border-black">T1</th>
                <th className="border border-black">T2</th>
                <th className="border border-black">T3</th>
                <th className="border border-black">T4</th>
                <th className="border border-black">MC</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((value, index) => (
                <tr key={value.created_at} className="border-t border-black">
                  <td className="border border-black">{index + 1}</td>
                  <td className="border border-black">
                    {new Date(value.created_at).toLocaleDateString()}
                  </td>
                  <td className="border border-black">
                    {new Date(value.created_at).toTimeString().split(" ")[0]}
                  </td>
                  <td className="border border-black">{value?.t1}</td>
                  <td className="border border-black">{value?.t2}</td>
                  <td className="border border-black">{value?.t3}</td>
                  <td className="border border-black">{value?.t4}</td>
                  <td className="border border-black">{value?.mc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default printPreviewWindow;

