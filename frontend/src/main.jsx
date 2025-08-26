import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n";

import i18n from "./i18n";
import { rtlLanguages } from "./i18n";

// Keep document dir/lang in sync with current language
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = rtlLanguages.includes(lng) ? "rtl" : "ltr";
});

// Initialize at startup
document.documentElement.lang = i18n.language;
document.documentElement.dir = rtlLanguages.includes(i18n.language)
  ? "rtl"
  : "ltr";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
