import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Textarea from "../components/Textarea";
import Textinput from "../components/Textinput";
const { ipcRenderer } = require("electron");
const Store = require('electron-store');
const store = new Store();

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Setting() {
  const [value, setValue] = React.useState(0);
  const [formData, setFormData] = React.useState({
    title: store.get('config.title') || '',
    subtitle: store.get('config.subtitle') || '',
    maxGraphTemp: store.get('config.maxGraphTemp') || '',
    minGraphTemp: store.get('config.minGraphTemp') || '',
    t1monitor: store.get('config.t1monitor') || '',
    t2monitor: store.get('config.t2monitor') || '',
    t3monitor: store.get('config.t3monitor') || '',
    t4monitor: store.get('config.t4monitor') || '',
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    store.set({
      config:{
        title:formData.title,
        subtitle:formData.subtitle
      }
    })
    ipcRenderer.send("mainWindow", "updateConfig");
    ipcRenderer.send("settingWindow", "close");
  }

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleTabs}
        >
          <Tab label="Grafik" {...a11yProps(0)} />
          <Tab label="Notifikasi" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <form onSubmit={handleSubmit}>
          <div>
            <label for="judul" class="block mb-2 text-sm font-medium me-4">
              Judul
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={formData.judul}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
            />
          </div>
          <div className="mt-4">
            <label for="message" class="block mb-2 text-sm font-medium">
              Subjudul
            </label>
            <textarea
              id="message"
              name='subtitle'
              onChange={handleChange}
              value={formData.subjudul}
              rows="3"
              class="block p-2.5 w-full text-sm  bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end items-end mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                ipcRenderer.send("settingWindow", "close");
              }}
              class=" text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Batal
            </button>
            <button
              type="submit"
              class=" text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Terapkan
            </button>
          </div>
        </form>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Notifikasi
      </CustomTabPanel>
    </Box>
  );
}
