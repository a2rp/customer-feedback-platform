import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";
import App from "./App.jsx";
import "./index.css";

OverlayScrollbars(document.body, { scrollbars: { theme: "os-theme-son", autoHide: "move", autoHideSuspend: false } });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}><App /></BrowserRouter>
  </StrictMode>,
);
