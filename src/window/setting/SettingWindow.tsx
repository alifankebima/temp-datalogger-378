import React, { useEffect, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import CustomTabPanel from "../../components/CustomTabPanel";

import { SettingWindowElectronAPI } from "../../types/renderer";
import SimpleButton from "../../components/SimpleButton";
import { FormControl, FormControlLabel, Switch } from "@mui/material";
import { StoreSchema } from "../../types/electronStore";

declare global {
  interface Window {
    electronAPISetting: SettingWindowElectronAPI;
  }
}

const SettingWindow = () => {
  const [value, setValue] = React.useState(2);
  const [config, setConfig] = useState<StoreSchema["config"]>({
    title: "",
    subtitle: "",
    minGraphTemp: 20,
    maxGraphTemp: 80,
    t1monitor: true,
    t2monitor: false,
    t3monitor: true,
    t4monitor: true,
    keepRecordDuration: 30,
    stopRecordAutomatically: false,
    targetTemp: 65,
  });

  useEffect(() => {
    (async () => {
      const result = await window.electronAPISetting.getConfig();
      setConfig(result);
    })();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeSubtitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleApplySetting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electronAPISetting.setConfig(config);
    window.electronAPISetting.manageSettingWindow("close");
  };

  const closeSettingWindow = () => {
    window.electronAPISetting.manageSettingWindow("close");
  };
  const handleTabs = (_event: unknown, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-col h-screen">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabs}>
          <Tab label="Grafik" />
          <Tab label="Monitoring" />
          <Tab label="Perekaman" />
        </Tabs>
      </Box>
      <form onSubmit={handleApplySetting} className="flex flex-col grow">
        <CustomTabPanel value={value} index={0} className="grow">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium me-4"
            >
              Judul
            </label>
            <input
              type="text"
              name="title"
              onChange={handleInput}
              value={config.title}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="subtitle"
              className="block mb-2 text-sm font-medium"
            >
              Subjudul
            </label>
            <textarea
              id="subtitle"
              name="subtitle"
              onChange={handleChangeSubtitle}
              value={config.subtitle}
              rows={3}
              className="block p-2.5 w-full text-sm  bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} className="grow">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium">
              Konfigurasi monitor sensor
            </div>
            <div className="flex">
              <Switch
                name="t1monitor"
                checked={config.t1monitor}
                onChange={handleSwitch}
              />
              <div className="">T1</div>
            </div>

            <div className="">
              <div className="inline-flex items-center">
                <FormControl
                  control={
                    <Switch
                      name="t2monitor"
                      checked={config.t2monitor}
                      onChange={handleSwitch}
                    />
                  }
                />
              </div>
            </div>
            <div className="">
              <div className="inline-flex items-center">
                <FormControlLabel
                  control={
                    <Switch
                      name="t3monitor"
                      checked={config.t3monitor}
                      onChange={handleSwitch}
                    />
                  }
                  label="T3"
                />
              </div>
            </div>
            <div className="">
              <div className="inline-flex items-center">
                <FormControlLabel
                  control={
                    <Switch
                      name="t4monitor"
                      checked={config.t4monitor}
                      onChange={handleSwitch}
                    />
                  }
                  label="T4"
                />
              </div>
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} className="grow">
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="inline-flex items-center">
                <FormControlLabel
                  control={
                    <Switch
                      name="stopRecordAutomatically"
                      checked={config.stopRecordAutomatically}
                      onChange={handleSwitch}
                    />
                  }
                  label="Hentikan Rekaman Secara Otomatis"
                />
              </div>
              {!config.stopRecordAutomatically && (
                <>
                  <div className="flex items-center ms-8 my-2">
                    <div className="text-nowrap text-sm mx-4">Target Suhu</div>
                    <input
                      type="number"
                      name="targetTemp"
                      onChange={handleInput}
                      value={config.targetTemp}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-16 text-right p-2"
                    />
                    <div className="mx-2 text-sm">&#176;C</div>
                  </div>
                  <div className="flex items-center ms-8 my-2">
                    <div className="text-nowrap text-sm mx-4">
                      Tetap merekam setelah mencapai target suhu selama
                    </div>
                    <input
                      type="number"
                      name="targetTemp"
                      onChange={handleInput}
                      value={config.keepRecordDuration}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-16 text-right p-2"
                    />
                    <div className="mx-2 text-sm">Menit</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CustomTabPanel>
        <div className="flex gap-2 justify-end items-end me-6 mb-6">
          <SimpleButton type={"submit"} onClick={closeSettingWindow}>
            OK
          </SimpleButton>
          <SimpleButton onClick={closeSettingWindow}>Batal</SimpleButton>
        </div>
      </form>
    </div>
  );
};

export default SettingWindow;

