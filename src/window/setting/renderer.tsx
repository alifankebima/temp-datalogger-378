import React from "react";
import ReactDOM from "react-dom/client";
import Setting from "./SettingWindow";
import "../../assets/css/index.css";

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Setting />
);
