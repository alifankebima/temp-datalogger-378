import React, { useEffect } from "react";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { PiRecordFill, PiStopFill } from "react-icons/pi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import NavbarButton from "../components/NavbarButton";
import TempDisplay from "../components/TempDisplay";
const { ipcRenderer } = require("electron");
const Store = require("electron-store");
const store = new Store();

const Main = () => {
  const [data, setData] = useState([]);
  const [judul, setJudul] = useState(store.get("config.judul") || "");
  const [subjudul, setSubjudul] = useState(store.get("config.subjudul") || "");
  const [currentTemp, setCurrentTemp] = useState({
    t1: null,
    t2: null,
    t3: null,
    t4: null,
  });
  const [isRecording, setRecording] = useState(false);

  const handleStartRecording = () =>
    !data && ipcRenderer.send("main-process", "open");
  const handleStopRecording = () => setRecording(false);
  const handleSettingWindow = () => ipcRenderer.send("setting-window", "open");

  // Set up IPC listener when component mounts
  useEffect(() => {
    ipcRenderer.on("main-window", (event, data) => {
      if (data.command === "update-config") {
        setJudul(store.get("config.judul") || "");
        setSubjudul(store.get("config.subjudul") || "");
      }

      if (data.command === "record-confirm") setRecording(true);

      if (data.command === "update-temp-graph") {
        setCurrentTemp({
          t1: data.t1,
          t2: data.t2,
          t3: data.t3,
          t4: data.t4,
        });
        setData((prev) => [
          ...prev,
          {
            t1: data.t1,
            t2: data.t2,
            t3: data.t3,
            t4: data.t4,
            timestamp: data.created_at,
          },
        ]);
      }
    });

    return () => ipcRenderer.removeListener("main-window", ipcListener);
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

        <div className="border-l border-gray-400 h-16 w-0.5 mx-2" />

        <NavbarButton
          onClick={() => {
            handleSettingWindow();
          }}
        >
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
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
          <TempDisplay
            name="T2"
            color="bg-yellow-600"
            currentTemp={currentTemp.t2}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
          <TempDisplay
            name="T3"
            color="bg-green-600"
            currentTemp={currentTemp.t3}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
          <TempDisplay
            name="T4"
            color="bg-blue-600"
            currentTemp={currentTemp.t4}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
        </div>
        <div className="w-full items-center flex flex-col">
          <div className="text-xl text-center">{judul}</div>
          <div className="text-lg text-center whitespace-pre-line line-clamp-4">
            {subjudul}
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis type="number" domain={[20, 80]} />
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="T1"
                  stroke="#dc2626"
                  dot={false}
                />
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="T2"
                  stroke="#ca8a04"
                  dot={false}
                />
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="T3"
                  stroke="#16a34a"
                  dot={false}
                />
                <Line
                  connectNulls
                  type="monotone"
                  dataKey="T4"
                  stroke="#2563eb"
                  dot={false}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
