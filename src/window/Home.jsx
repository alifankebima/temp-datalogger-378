import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { PiRecordFill, PiPauseFill, PiStopFill } from "react-icons/pi";
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



const Home = () => {
  const [isRecording, setRecording] = useState(false);
  const [isPaused, setPaused] = useState(true);
  const [isStopRecording, setStopRecording] = useState(true);
  const [T1Temp, seT1Temp] = useState(0.0);
  const [T2Temp, seT2Temp] = useState(0.0);
  const [T3Temp, seT3Temp] = useState(0.0);
  const [T4Temp, seT4Temp] = useState(0.0);
  const [data, setData] = useState([{}]);
  const [intervalId2, setIntervalId2] = useState(null);
  const [port2, setPort2] = useState(null);
  const firstUpdate = useRef(true);

  const startRecording = () => {
    setRecording(true);
    setPaused(false);
    setStopRecording(false);
  };

  const pauseRecording = () => {
    setRecording(false);
    setPaused(true);
    setStopRecording(false);
  };

  const stopRecording = () => {
    setRecording(false);
    setPaused(true);
    setStopRecording(true);
    // saveFile();
    handleDivDownload();
  };

  const handleNewWindow = () => {
    // const win = new BrowserWindow({
    //   height: 600,
    //   width: 800,
    // });
    // win.loadURL(`https://www.electronjs.org/docs/api/remote`);
    ipcRenderer.send('newWindow', 'main.html')
  };

  // useEffect(() => {

  // }, [])

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-100 border-b border-gray-400 flex px-2 py-1">
        <NavbarButton onClick={startRecording} disabled={!port2 || isRecording}>
          <PiRecordFill
            className={`${
              !isRecording && port2 ? "text-red-500" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Rekam</div>
        </NavbarButton>

        {/* <NavbarButton onClick={pauseRecording} disabled={isPaused}>
          <PiPauseFill
            className={`${
              !isPaused ? 'text-cyan-700' : 'text-gray-300'
            } text-4xl`}
          />
          <div className="text-sm">Jeda</div>
        </NavbarButton> */}

        <NavbarButton onClick={stopRecording} disabled={isStopRecording}>
          <PiStopFill
            className={`${
              !isStopRecording ? "text-cyan-700" : "text-gray-300"
            } text-4xl`}
          />
          <div className="text-sm">Berhenti</div>
        </NavbarButton>

        <div className="border-l border-gray-400 h-16 w-0.5 mx-2" />

        <NavbarButton
          onClick={() => {
            handleNewWindow();
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
            currentTemp={T1Temp}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
          <TempDisplay
            name="T2"
            color="bg-yellow-600"
            currentTemp={T2Temp}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
          <TempDisplay
            name="T3"
            color="bg-green-600"
            currentTemp={T3Temp}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
          <TempDisplay
            name="T4"
            color="bg-blue-600"
            currentTemp={T4Temp}
            minTemp="--.-"
            avgTemp="--.-"
            maxTemp="--.-"
          />
        </div>
        <div className="w-full items-center flex flex-col">
          <div className="text-xl text-center">PT SUMBER REZEKI PALLETINDO</div>
          <div className="text-xl text-center">DRY KLIN</div>
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
                <XAxis dataKey="name" />
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

export default Home;
