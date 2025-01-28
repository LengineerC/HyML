import { createRoot } from "react-dom/client"
import App from "./App";
import React from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);