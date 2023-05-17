import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.js";
import { StateProvider } from "./utils/StateProvider";
import reducer, { initialState } from "./utils/Reducer";
import { HashRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);root.render(
  <React.StrictMode>
    <HashRouter>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </HashRouter>

  </React.StrictMode>


);
