import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { DashboardProvider } from "@/contexts/DashboardContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>
);
