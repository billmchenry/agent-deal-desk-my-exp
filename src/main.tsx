import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { MiraChatProvider } from "@/contexts/MiraChatContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MiraChatProvider>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </MiraChatProvider>
  </React.StrictMode>
);
