import React, { useEffect, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import CustomTabPanel from "../../components/CustomTabPanel";

import {
  SettingWindowElectronAPI,
  graphSettingForm,
} from "../../types/settingWindow";
import SimpleButton from "../../components/SimpleButton";

declare global {
  interface Window {
    electronAPISetting: SettingWindowElectronAPI;
  }
}

const SettingWindow = () => {
  const [value, setValue] = React.useState(0);
  const [config, setConfig] = useState<graphSettingForm>({
    title: "",
    subtitle: "",
  });

  useEffect(() => {
    (async () => {
      const result = await window.electronAPISetting.getConfig();
      setConfig({
        title: result.title ?? "",
        subtitle: result.subtitle ?? "",
      });
    })();
  }, []);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleApplySetting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electronAPISetting.updateConfig(config);
    window.electronAPISetting.manageSettingWindow("close");
  };

  const closeSettingWindow = () => {
    window.electronAPISetting.manageSettingWindow("close");
  };
  const handleTabs = (_event: unknown, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabs}>
          <Tab label="Grafik" />
          {/* <Tab label="Notifikasi" /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <form onSubmit={handleApplySetting}>
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
              onChange={handleChangeTitle}
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
          <div className="flex gap-2 justify-end items-end mt-4">
            <SimpleButton onClick={closeSettingWindow}>OK</SimpleButton>
            <SimpleButton type={"submit"} onClick={closeSettingWindow}>
              Batal
            </SimpleButton>
          </div>
        </form>
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        Notifikasi
      </CustomTabPanel> */}
    </Box>
  );
};

export default SettingWindow;

