import React, { useEffect, useState } from "react";
import { PrintPreviewWindowElectronAPI } from "../../types/printPreviewWindow";
import SimpleButton from "../../components/SimpleButton";
import Dropdown from "../../components/Dropdown";
import { GraphData } from "../../types/mainWindow";
import commonHelper from "../../helper/commonHelper";
import logoGrayscale from "../../assets/img/logoGrayscale.png";
import { DropdownItems } from "../../types/dropdown";

declare global {
  interface Window {
    electronAPIPrintPreview: PrintPreviewWindowElectronAPI;
  }
}

const printPreviewWindow = () => {
  const [metadata, setMetadata] = useState({
    entryDate: "",
    exitDate: "",
    duration: "",
  });
  const [data, setData] = useState<GraphData[]>([]);
  const [sampleInterval, setSampleInterval] = useState<DropdownItems>({
    name: "1 Jam",
    value: 3600,
  });
  const [entryTimestamp, setEntryTimestamp] = useState(0);
  const [exitTimestamp, setExitTimestamp] = useState(0);

  useEffect(() => {
    (async () => {
      const printPreviewConfig =
        await window.electronAPIPrintPreview.getPrintPreviewConfig();

      setSampleInterval(printPreviewConfig.sampleInterval ?? sampleInterval);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await window.electronAPIPrintPreview.getTempData(
        sampleInterval.value
      );
      const entry = result[0]?.created_at ?? 0
      const exit = result[result.length - 1]?.created_at ?? 0

      setEntryTimestamp(entry);
      setExitTimestamp(exit);

      setData(result);
      setMetadata({
        entryDate: commonHelper.formatDate(entry),
        exitDate: commonHelper.formatDate(exit),
        duration: commonHelper.formatDuration(exit - entry),
      });
    })();
  }, [sampleInterval.value]);

  const handleDropdownChange = (option: DropdownItems) => {
    setSampleInterval(option)
    window.electronAPIPrintPreview.updatePrintPreviewConfig({sampleInterval: option})
  }

  const handlePrint = () =>
    window.electronAPIPrintPreview.managePrintPreviewWindow({
      args: "print",
    });

  const closePrintWindow = () =>
    window.electronAPIPrintPreview.managePrintPreviewWindow({ args: "close" });

  const handleSaveAsPDF = () =>
    window.electronAPIPrintPreview.managePrintPreviewWindow({
      args: "pdf",
      startTimestamp: entryTimestamp,
      endTimestamp: exitTimestamp,
    });

  return (
    <div className="h-screen flex flex-col">
      <div className="print:hidden flex flex-wrap justify-between items-center p-2 border-b bg-gray-100 border-gray-400">
        <div className="flex gap-2">
          <SimpleButton onClick={handlePrint}>Print</SimpleButton>
          <SimpleButton onClick={closePrintWindow}>Batal</SimpleButton>
        </div>
        <div className="flex items-center gap-2">
          <div className="">Jarak Waktu :</div>
          <Dropdown
            selectedOption={sampleInterval}
            onChange={handleDropdownChange}
          />
        </div>
        <SimpleButton onClick={handleSaveAsPDF}>
          Simpan Sebagai PDF
        </SimpleButton>
      </div>
      <div
        className="p-4 text-sm flex-grow overflow-auto print:overflow-visible"
        style={{ fontFamily: "Carlito, sans-serif" }}
      >
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="">
              <img
                src={logoGrayscale}
                style={{ width: 40, height: 50, minWidth: 40 }}
              />
            </div>
            <div
              className="font-bold"
              style={{
                fontFamily: "Liberation Serif, serif",
              }}
            >
              PT. SUMBER REZEKI PALLETINDO
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-20">DOK NEED :</div>
            <div className="w-10"></div>
            <div className="w-8">FM :</div>
            <div className="">06</div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-16">
          <div className="font-bold">"LAPORAN MONITORING SUHU INTI KAYU"</div>
        </div>
        <div className="grid grid-cols-2 mt-4 gap-3">
          <div className="flex gap-2">
            <div className="w-28">Jumlah</div>
            <div>:</div>
          </div>
          <div className="flex gap-2">
            <div className="w-28">Jenis Kayu</div>
            <div>:</div>
          </div>
          <div className="flex gap-2">
            <div className="w-28">Tanggal Masuk</div>
            <div>:</div>
            <div className="">{metadata.entryDate}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-28">Tanggal Keluar</div>
            <div>:</div>
            <div className="">{metadata.exitDate}</div>
          </div>
          <div className="flex gap-2 col-span-2">
            <div className="w-28">Lama Proses</div>
            <div>:</div>
            <div className="">{metadata.duration}</div>
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
                    {commonHelper.formatDate(value.created_at)}
                  </td>
                  <td className="border border-black">
                    {/* {new Date(value.created_at).toTimeString().split(" ")[0]} */}
                    {commonHelper.formatTime(value.created_at)}
                  </td>
                  <td className="border border-black">{value?.t1}</td>
                  <td className="border border-black">{value?.t2}</td>
                  <td className="border border-black">{value?.t3}</td>
                  <td className="border border-black">{value?.t4}</td>
                  <td className="border border-black"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default printPreviewWindow;

