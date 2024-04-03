import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { PiRecordFill, PiStopFill } from "react-icons/pi";
import { IoMdSettings, IoMdSave } from "react-icons/io";
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
import dateTimeAxisTick from "../components/dateTimeAxisTick";
import NavbarButton from "../components/NavbarButton";
import TempDisplay from "../components/TempDisplay";
import legendGraph from "../components/legendGraph";
import store from "../config/electronStore.js";
import commonHelper from "../helper/common.js";
import FileSaver from "file-saver";
import { useCurrentPng, useGenerateImage } from "recharts-to-png";
const { ipcRenderer } = require("electron");

const Main = () => {
  // Graph states
  const [title, setTitle] = useState(store.get("config.title"));
  const [subtitle, setSubtitle] = useState(store.get("config.subtitle"));
  const [data, setData] = useState([]);

  // Temp display states
  const [currentTemp, setCurrentTemp] = useState({
    t1: null,
    t2: null,
    t3: null,
    t4: null,
  });
  const [minTemp, setMinTemp] = useState({
    t1: null,
    t2: null,
    t3: null,
    t4: null,
  });
  const [avgTemp, setAvgTemp] = useState({
    t1: [],
    t2: [],
    t3: [],
    t4: [],
  });
  const [maxTemp, setMaxTemp] = useState({
    t1: null,
    t2: null,
    t3: null,
    t4: null,
  });

  // Navigation bar states
  const [isRecording, setIsRecording] = useState(false);

  // User event handlers
  const handleStartRecording = () => {
    ipcRenderer.send("main-window", {
      command: "start-record",
      isDataExists: !!data.length,
    });
  };
  const handleStopRecording = () => {
    setIsRecording(false);
    ipcRenderer.send("main-window", {
      command: "stop-record",
      isStopRecordManually: true,
    });
  };
  const [getDivJpeg, { ref }] = useGenerateImage({
    quality: 0.8,
    type: 'image/png',
  });
  const saveGraphAsImage = useCallback(async () => {
    const jpeg = await getDivJpeg();
    if (jpeg) {
      FileSaver.saveAs(
        jpeg,
        `${store.get("config.subtitle")} ${commonHelper.formattedDate(
          new Date().getTime()
        )}.png`
      );
    }
  }, []);
  const openSettingWindow = () => {
    ipcRenderer.send("setting-window", { command: "open" });
  };

  // Run on component mount & unmount only
  useEffect(() => {
    ipcRenderer.on("main-window", (event, data) => {
      if (data.command === "update-config") {
        setTitle(store.get("config.title"));
        setSubtitle(store.get("config.subtitle"));
      }

      if (data.command == "record-confirm") {
        setData([]);
        setIsRecording(true);
        console.log("true");
      }

      if (data.command === "update-temp-display") {
        setCurrentTemp({
          t1: data.t1,
          t2: data.t2,
          t3: data.t3,
          t4: data.t4,
        });
        setMinTemp((prev) => ({
          t1: commonHelper.calculateMinTemp(prev.t1, data.t1),
          t2: commonHelper.calculateMinTemp(prev.t2, data.t2),
          t3: commonHelper.calculateMinTemp(prev.t3, data.t3),
          t4: commonHelper.calculateMinTemp(prev.t4, data.t4),
        }));
        setAvgTemp((prev) => ({
          t1: commonHelper.handleAvgTempArray(prev.t1, data.t1),
          t2: commonHelper.handleAvgTempArray(prev.t2, data.t2),
          t3: commonHelper.handleAvgTempArray(prev.t3, data.t3),
          t4: commonHelper.handleAvgTempArray(prev.t4, data.t4),
        }));
        setMaxTemp((prev) => ({
          t1: commonHelper.calculateMaxTemp(prev.t1, data.t1),
          t2: commonHelper.calculateMaxTemp(prev.t2, data.t2),
          t3: commonHelper.calculateMaxTemp(prev.t3, data.t3),
          t4: commonHelper.calculateMaxTemp(prev.t4, data.t4),
        }));
      }

      if (data.command == "update-temp-graph") {
        setData(data.result);
      }

      if (data.command == "stop-record") {
        setIsRecording(false)
      }
    });

    // Load previous record data, in case of app crash
    (async () => {
      const fetchDownsampledData = await ipcRenderer.invoke("database", {
        command: "fetch-downsampled",
      });

      if (fetchDownsampledData.length) setData(fetchDownsampledData);
    })();

    return () => {
      ipcRenderer.removeAllListeners("main-window");
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
          <div className="text-sm">Rekam</div>
        </NavbarButton>

        <NavbarButton onClick={handleStopRecording} disabled={!isRecording}>
          <PiStopFill
            className={`${
              isRecording ? "text-cyan-700" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Berhenti</div>
        </NavbarButton>

        <NavbarButton onClick={saveGraphAsImage} disabled={!data.length}>
          <IoMdSave
            className={`${
              data.length ? "text-indigo-900" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Simpan</div>
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
            avgTemp={commonHelper.calculateAvgTemp(avgTemp.t1)}
            maxTemp={maxTemp.t1}
            isDisabled={store.get("config.t1monitor")}
          />
          <TempDisplay
            name="T2"
            color="bg-yellow-600"
            currentTemp={currentTemp.t2}
            minTemp={minTemp.t2}
            avgTemp={commonHelper.calculateAvgTemp(avgTemp.t2)}
            maxTemp={maxTemp.t2}
            isDisabled={store.get("config.t2monitor")}
          />
          <TempDisplay
            name="T3"
            color="bg-green-600"
            currentTemp={currentTemp.t3}
            minTemp={minTemp.t3}
            avgTemp={commonHelper.calculateAvgTemp(avgTemp.t3)}
            maxTemp={maxTemp.t3}
            isDisabled={store.get("config.t3monitor")}
          />
          <TempDisplay
            name="T4"
            color="bg-blue-600"
            currentTemp={currentTemp.t4}
            minTemp={minTemp.t4}
            avgTemp={commonHelper.calculateAvgTemp(avgTemp.t4)}
            maxTemp={maxTemp.t4}
            isDisabled={store.get("config.t4monitor")}
          />
        </div>
        <div className="w-full items-center flex flex-col" ref={ref}>
          <div className="text-xl text-center">{title}</div>
          <div className="text-lg text-center whitespace-pre-line line-clamp-4 min-h-10">
            {subtitle}
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart
                data={data}
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
                  tick={(props) => dateTimeAxisTick({ ...props })}
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
                    store.get("config.minGraphTemp"),
                    store.get("config.maxGraphTemp"),
                  ]}
                />
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="t1"
                  stroke="#dc2626"
                  dot={false}
                  animationDuration={0}
                  strokeWidth={2}
                />
                {/* <Line
                  connectNulls
                  type="monotone"
                  dataKey="t2"
                  stroke="#ca8a04"
                  dot={false}
                /> */}
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="t3"
                  stroke="#16a34a"
                  dot={false}
                  animationDuration={0}
                  strokeWidth={2}
                />
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="t4"
                  stroke="#2563eb"
                  dot={false}
                  animationDuration={0}
                  strokeWidth={2}
                />
                <Tooltip
                  labelFormatter={(timestamp) =>
                    commonHelper.formattedDate(timestamp)
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
