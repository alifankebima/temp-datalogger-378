import React, { useCallback, useState, useEffect } from "react";
import { PiRecordFill, PiStopFill } from "react-icons/pi";
import { IoMdSettings, IoMdSave, IoMdPrint } from "react-icons/io";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import dateTimeAxisTick from "../../components/DateTimeAxisTick";
import NavbarButton from "../../components/NavbarButton";
import TempDisplay from "../../components/TempDisplay";
import legendGraph from "../../components/LegendGraph";
import commonHelper from "../../helper/commonHelper";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import "../../assets/css/index.css";
import {
  MainWindowElectronAPI,
  GraphData,
  Temps,
} from "../../types/mainWindow";
import { StoreSchema } from "../../types/electronStore";

declare global {
  interface Window {
    electronAPImain: MainWindowElectronAPI;
  }
}

const Main = () => {
  // User defined config
  const [config, setConfig] = useState<StoreSchema["config"]>();
  useEffect(() => {
    (async () => setConfig(await window.electronAPImain.getConfig()))();
  }, []);

  // Graph states
  const [graphData, setGraphData] = useState<GraphData[]>([]);

  // Temp display states
  const defaultTemps: Temps = {
    t1: null,
    t2: null,
    t3: null,
    t4: null,
  };
  const [currentTemp, setCurrentTemp] = useState<Temps>(defaultTemps);
  const [minTemp, setMinTemp] = useState<Temps>(defaultTemps);
  const [avgTemp, setAvgTemp] = useState<Temps<number[]>>({
    t1: [],
    t2: [],
    t3: [],
    t4: [],
  });
  const [maxTemp, setMaxTemp] = useState<Temps>(defaultTemps);

  // Navigation bar states
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // User event handlers
  const handleStartRecording = () =>
    window.electronAPImain.startRecord(!!graphData.length);
  const handleStopRecording = () => {
    setIsRecording(false);
    window.electronAPImain.stopRecord(true);
  };
  const [getDivJpeg, { ref }] = useGenerateImage<HTMLDivElement>({
    quality: 0.8,
    type: "image/png",
  });
  const saveGraphAsImage = useCallback(async () => {
    const jpeg = await getDivJpeg();
    if (jpeg) {
      FileSaver.saveAs(
        jpeg,
        `${config?.subtitle} ${commonHelper.formatDateTime(
          new Date().getTime()
        )}.png`
      );
    }
  }, []);
  const openSettingWindow = () =>
    window.electronAPImain.manageSettingWindow("open");
  const openPrintPreviewWindow = () => window.electronAPImain.managePrintPreviewWindow({args: "open"});

  // Run on component mount & unmount only
  useEffect(() => {
    window.electronAPImain.ping();
    window.electronAPImain.pong();
    window.electronAPImain.updateGraph((data) => setGraphData(data));
    window.electronAPImain.updateTempDisplay((data) => {
      setCurrentTemp({
        t1: data.t1,
        t2: data.t2,
        t3: data.t3,
        t4: data.t4,
      });
      setMinTemp((prev) => ({
        t1: commonHelper.calcMin(prev.t1, data.t1 ?? prev.t1),
        t2: commonHelper.calcMin(prev.t2, data.t2 ?? prev.t2),
        t3: commonHelper.calcMin(prev.t3, data.t3 ?? prev.t3),
        t4: commonHelper.calcMin(prev.t4, data.t4 ?? prev.t4),
      }));
      setAvgTemp((prev) => ({
        t1: commonHelper.shiftNumToArray(prev.t1, data.t1),
        t2: commonHelper.shiftNumToArray(prev.t2, data.t2),
        t3: commonHelper.shiftNumToArray(prev.t3, data.t3),
        t4: commonHelper.shiftNumToArray(prev.t4, data.t4),
      }));
      setMaxTemp((prev) => ({
        t1: commonHelper.calcMax(prev.t1, data.t1 ?? prev.t1),
        t2: commonHelper.calcMax(prev.t2, data.t2 ?? prev.t2),
        t3: commonHelper.calcMax(prev.t3, data.t3 ?? prev.t3),
        t4: commonHelper.calcMax(prev.t4, data.t4 ?? prev.t4),
      }));
    });
    window.electronAPImain.updateConfig((data) => setConfig(data));
    window.electronAPImain.startRecordCallback((isContinueRecord) => {
      if(!isContinueRecord) setGraphData([]);
      setIsRecording(true);
    });
    window.electronAPImain.stopRecordCallback(() => {
      setIsRecording(false);
    });

    // Load previous record data, in case of app crash
    // (async () => {
    //   const fetchDownsampledData = await ipcRenderer.invoke("database", {
    //     command: "fetch-downsampled",
    //   });

    //   if (fetchDownsampledData.length) setGraphData(fetchDownsampledData);
    // })();

    return () => {
      window.electronAPImain.removeUpdateGraph();
      window.electronAPImain.removeUpdateTempDisplay();
      window.electronAPImain.removeUpdateConfig();
      window.electronAPImain.removeStartRecordCallback();
      window.electronAPImain.removeStopRecordCallback();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-100 border-b border-gray-400 flex px-2 py-1">
        <NavbarButton onClick={handleStartRecording} disabled={isRecording}>
          <PiRecordFill
            className={`${
              !isRecording ? "text-red-500" : "text-gray-300"
            } text-4xl`}
          />
          <div className={`text-sm`}>Rekam</div>
        </NavbarButton>

        <NavbarButton onClick={handleStopRecording} disabled={!isRecording}>
          <PiStopFill
            className={`${
              isRecording ? "text-cyan-700" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Berhenti</div>
        </NavbarButton>

        <div className="border-l border-gray-400 h-16 w-0.5 mx-2" />

        <NavbarButton onClick={saveGraphAsImage} disabled={!graphData.length}>
          <IoMdSave
            className={`${
              graphData.length ? "text-sky-900" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Simpan</div>
        </NavbarButton>

        <NavbarButton onClick={openPrintPreviewWindow} disabled={!graphData.length}>
          <IoMdPrint
            className={`${
              graphData.length ? "text-indigo-900" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Print</div>
        </NavbarButton>

        <div className="border-l border-gray-400 h-16 w-0.5 mx-2" />

        <NavbarButton onClick={openSettingWindow}>
          <IoMdSettings className="text-gray-500 text-4xl" />
          <div className="text-sm">Pengaturan</div>
        </NavbarButton>
      </div>
      <div className="flex flex-grow">
        <div className="flex flex-col w-30">
          <TempDisplay
            name="T1"
            color="bg-red-600"
            currentTemp={currentTemp.t1}
            minTemp={minTemp.t1}
            avgTemp={commonHelper.calcAvgArray(avgTemp.t1)}
            maxTemp={maxTemp.t1}
            disabled={
              config?.t1monitor !== undefined ? !config.t1monitor : false
            }
          />
          <TempDisplay
            name="T2"
            color="bg-yellow-600"
            currentTemp={currentTemp.t2}
            minTemp={minTemp.t2}
            avgTemp={commonHelper.calcAvgArray(avgTemp.t2)}
            maxTemp={maxTemp.t2}
            disabled={
              config?.t2monitor !== undefined ? !config.t2monitor : false
            }
          />
          <TempDisplay
            name="T3"
            color="bg-green-600"
            currentTemp={currentTemp.t3}
            minTemp={minTemp.t3}
            avgTemp={commonHelper.calcAvgArray(avgTemp.t3)}
            maxTemp={maxTemp.t3}
            disabled={
              config?.t3monitor !== undefined ? !config.t3monitor : false
            }
          />
          <TempDisplay
            name="T4"
            color="bg-blue-600"
            currentTemp={currentTemp.t4}
            minTemp={minTemp.t4}
            avgTemp={commonHelper.calcAvgArray(avgTemp.t4)}
            maxTemp={maxTemp.t4}
            disabled={
              config?.t4monitor !== undefined ? !config.t4monitor : false
            }
          />
        </div>
        <div className="w-full items-center flex flex-col" ref={ref}>
          <div className="text-xl text-center">{config?.title}</div>
          <div className="text-lg text-center whitespace-pre-line line-clamp-4 min-h-10">
            {config?.subtitle}
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart
                data={graphData}
                margin={{
                  top: 5,
                  right: 35,
                  left: 25,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  xAxisId={0}
                  dataKey="created_at"
                  height={20}
                  interval={"preserveStartEnd"}
                  tick={dateTimeAxisTick}
                  minTickGap={50}
                />
                <XAxis
                  xAxisId={1}
                  dataKey="created_at"
                  height={80}
                  interval={"preserveStartEnd"}
                  tick={(props) =>
                    dateTimeAxisTick({ ...props, showDate: true })
                  }
                  minTickGap={50}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Waktu",
                    position: "InsideBottom",
                  }}
                />
                <YAxis
                  type="number"
                  label={{
                    value: "Suhu (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[
                    config?.minGraphTemp ?? 0,
                    config?.maxGraphTemp ?? 100,
                  ]}
                />
                {config?.t1monitor && (
                  <Line
                    connectNulls
                    type="monotone"
                    dataKey="t1"
                    stroke="#dc2626"
                    dot={false}
                    animationDuration={0}
                    strokeWidth={2}
                  />
                )}
                {config?.t2monitor && (
                  <Line
                    connectNulls
                    type="monotone"
                    dataKey="t2"
                    stroke="#ca8a04"
                    dot={false}
                  />
                )}
                {config?.t3monitor && (
                  <Line
                    connectNulls
                    type="monotone"
                    dataKey="t3"
                    stroke="#16a34a"
                    dot={false}
                    animationDuration={0}
                    strokeWidth={2}
                  />
                )}
                {config?.t4monitor && (
                  <Line
                    connectNulls
                    type="monotone"
                    dataKey="t4"
                    stroke="#2563eb"
                    dot={false}
                    animationDuration={0}
                    strokeWidth={2}
                  />
                )}
                <Tooltip
                  labelFormatter={(timestamp) =>
                    commonHelper.formatDateTime(timestamp)
                  }
                />
                <Legend formatter={legendGraph} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
