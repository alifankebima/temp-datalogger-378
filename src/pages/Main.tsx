import React, { useCallback, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import { useState } from "react";
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
import dateTimeAxisTick from "../components/DateTimeAxisTick";
import NavbarButton from "../components/NavbarButton";
import TempDisplay from "../components/TempDisplay";
import legendGraph from "../components/LegendGraph";
// import store from "../config/electronStore";
import commonHelper from "../helper/commonHelper";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import '../assets/css/index.css';
import { ipcRenderer } from "electron";
import { GraphData, IpcMainWindow, Temps } from "../types/main";

const Main = () => {
  // User defined config
  // const [config, setConfig] = useState(store.get('config'));
  
  // Graph states
  const [graphData, setGraphData] = useState<GraphData[]>([]);

  // Temp display states
  const defaultTemps: Temps = {
    t1: null,
    t2: null,
    t3: null,
    t4: null,
  }
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
  const handleStartRecording = () => {
    ipcRenderer.send("main-window", {
      command: "start-record",
      isDataExists: !!graphData.length,
    });
  };
  // const handleStopRecording = () => {
  //   setIsRecording(false);
  //   ipcRenderer.send("main-window", {
  //     command: "stop-record",
  //     isStopRecordManually: true,
  //   });
  // };
  const [getDivJpeg, { ref }] = useGenerateImage<HTMLDivElement>({
    quality: 0.8,
    type: 'image/png',
  });
  // const saveGraphAsImage = useCallback(async () => {
  //   const jpeg = await getDivJpeg();
  //   if (jpeg) {
  //     FileSaver.saveAs(
  //       jpeg,
  //       `${config.subtitle} ${commonHelper.formatDate(
  //         new Date().getTime()
  //       )}.png`
  //     );
  //   }
  // }, []);
  // const openSettingWindow = () => {
  //   ipcRenderer.send("setting-window", { command: "open" });
  // };
  // const openPrintWindow = () => {
  //   ipcRenderer.send("print-window", { command: "open" });
  // };

  // Run on component mount & unmount only
  // useEffect(() => {
  //   ipcRenderer.on("main-window", (event, data:IpcMainWindow) => {
  //     if (data.command === "update-config") {
  //       setConfig(store.get('config'))
  //     }

  //     if (data.command == "record-confirm") {
  //       setGraphData([]);
  //       setIsRecording(true);
  //     }

  //     if (data.command === "update-temp-display") {
  //       setCurrentTemp({
  //         t1: data.t1,
  //         t2: data.t2,
  //         t3: data.t3,
  //         t4: data.t4,
  //       });
  //       setMinTemp((prev) => ({
  //         t1: commonHelper.calcMin(prev.t1, data.t1),
  //         t2: commonHelper.calcMin(prev.t2, data.t2),
  //         t3: commonHelper.calcMin(prev.t3, data.t3),
  //         t4: commonHelper.calcMin(prev.t4, data.t4),
  //       }));
  //       setAvgTemp((prev) => ({
  //         t1: commonHelper.shiftNumToArray(prev.t1, data.t1),
  //         t2: commonHelper.shiftNumToArray(prev.t2, data.t2),
  //         t3: commonHelper.shiftNumToArray(prev.t3, data.t3),
  //         t4: commonHelper.shiftNumToArray(prev.t4, data.t4),
  //       }));
  //       setMaxTemp((prev) => ({
  //         t1: commonHelper.calcMax(prev.t1, data.t1),
  //         t2: commonHelper.calcMax(prev.t2, data.t2),
  //         t3: commonHelper.calcMax(prev.t3, data.t3),
  //         t4: commonHelper.calcMax(prev.t4, data.t4),
  //       }));
  //     }

  //     if (data.command == "update-temp-graph") {
  //       setGraphData(data.result)
  //     }

  //     if (data.command == "stop-record") {
  //       setIsRecording(false)
  //     }
  //   });

  //   // Load previous record data, in case of app crash
  //   // (async () => {
  //   //   const fetchDownsampledData = await ipcRenderer.invoke("database", {
  //   //     command: "fetch-downsampled",
  //   //   });

  //   //   if (fetchDownsampledData.length) setGraphData(fetchDownsampledData);
  //   // })();
  
  //     return () => {
  //       ipcRenderer.removeAllListeners("main-window");
  //     };
  //   }, []);

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gray-100 border-b border-gray-400 flex px-2 py-1">
          {/* <NavbarButton onClick={handleStartRecording} disabled={isRecording}>
            <PiRecordFill
              className={`${
                !isRecording ? "text-red-500" : "text-gray-300"
              } text-4xl`}
            />
            <div className="text-sm">Rekam</div>
          </NavbarButton>
  
          <NavbarButton onClick={handleStopRecording} disabled={!isRecording}>
            <PiStopFill
              className={`${
                isRecording ? "text-cyan-700" : "text-gray-300"
              } text-4xl`}
            />
            <div className="text-sm">Berhenti</div>
          </NavbarButton> */}
  
          <div className="border-l border-gray-400 h-16 w-0.5 mx-2" />
  
          {/* <NavbarButton onClick={saveGraphAsImage} disabled={!graphData.length}>
            <IoMdSave
              className={`${
                graphData.length ? "text-sky-900" : "text-gray-300"
              } text-4xl`}
            />
            <div className="text-sm">Simpan</div>
          </NavbarButton>
  
          <NavbarButton onClick={openPrintWindow} >
            <IoMdPrint
              className={`${
                graphData.length ? "text-indigo-900" : "text-gray-300"
              } text-4xl`}
            />
            <div className="text-sm">Print</div>
          </NavbarButton> */}
  
          <div className="border-l border-gray-400 h-16 w-0.5 mx-2" />
  
          {/* <NavbarButton onClick={openSettingWindow}>
            <IoMdSettings className="text-gray-500 text-4xl" />
            <div className="text-sm">Pengaturan</div>
          </NavbarButton> */}
        </div>
        {/* <div className="flex flex-grow">
          <div className="flex flex-col w-30">
            <TempDisplay
              name="T1"
              color="bg-red-600"
              currentTemp={currentTemp.t1}
              minTemp={minTemp.t1}
              avgTemp={commonHelper.calcAvgArray(avgTemp.t1)}
              maxTemp={maxTemp.t1}
              disabled={config?.t1monitor}
            />
            <TempDisplay
              name="T2"
              color="bg-yellow-600"
              currentTemp={currentTemp.t2}
              minTemp={minTemp.t2}
              avgTemp={commonHelper.calcAvgArray(avgTemp.t2)}
              maxTemp={maxTemp.t2}
              disabled={config.t2monitor}
            />
            <TempDisplay
              name="T3"
              color="bg-green-600"
              currentTemp={currentTemp.t3}
              minTemp={minTemp.t3}
              avgTemp={commonHelper.calcAvgArray(avgTemp.t3)}
              maxTemp={maxTemp.t3}
              disabled={config.t3monitor}
            />
            <TempDisplay
              name="T4"
              color="bg-blue-600"
              currentTemp={currentTemp.t4}
              minTemp={minTemp.t4}
              avgTemp={commonHelper.calcAvgArray(avgTemp.t4)}
              maxTemp={maxTemp.t4}
              disabled={config.t4monitor}
            />
          </div>
          <div className="w-full items-center flex flex-col" ref={ref}>
            <div className="text-xl text-center">{config.title}</div>
            <div className="text-lg text-center whitespace-pre-line line-clamp-4 min-h-10">
              {config.subtitle}
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
                    dataKey="timestamp"
                    height={20}
                    interval={"preserveStartEnd"}
                    tick={dateTimeAxisTick}
                    minTickGap={50}
                  />
                  <XAxis
                    xAxisId={1}
                    dataKey="timestamp"
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
                      config.minGraphTemp,
                      config.maxGraphTemp
                    ]}
                  />
                  {config.t1monitor && <Line
                    connectNulls
                    type="monotone"
                    dataKey="t1"
                    stroke="#dc2626"
                    dot={false}
                    animationDuration={0}
                    strokeWidth={2}
                  />}
                  {config.t2monitor && <Line
                    connectNulls
                    type="monotone"
                    dataKey="t2"
                    stroke="#ca8a04"
                    dot={false}
                  />}
                  {config.t3monitor && <Line
                    connectNulls
                    type="monotone"
                    dataKey="t3"
                    stroke="#16a34a"
                    dot={false}
                    animationDuration={0}
                    strokeWidth={2}
                  />}
                  {config.t4monitor && <Line
                    connectNulls
                    type="monotone"
                    dataKey="t4"
                    stroke="#2563eb"
                    dot={false}
                    animationDuration={0}
                    strokeWidth={2}
                  />}
                  <Tooltip
                    labelFormatter={(timestamp) =>
                      commonHelper.formatDate(timestamp)
                    }
                  />
                  <Legend formatter={legendGraph} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}
      </div>
    );
};

export default Main;