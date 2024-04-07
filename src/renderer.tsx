import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./pages/Main";
import "./assets/css/index.css";

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
