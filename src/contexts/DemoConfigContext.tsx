import React, { createContext, useContext, useState, useCallback } from "react";

export type MentorMode =
  | "none"
  | "needs_mentor"
  | "pairing_underway"
  | "mentee"
  | "not_applied"
  | "pending"
  | "approved_certification"
  | "active_mentor";

interface DemoConfig {
  mentorMode: MentorMode;
}

interface DemoConfigContextValue {
  config: DemoConfig;
  setMentorMode: (mode: MentorMode) => void;
}

const DemoConfigContext = createContext<DemoConfigContextValue | null>(null);

const STORAGE_KEY = "demoConfig";

function loadConfig(): DemoConfig {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { mentorMode: "none" };
}

function saveConfig(config: DemoConfig) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function DemoConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DemoConfig>(loadConfig);

  const setMentorMode = useCallback((mode: MentorMode) => {
    setConfig((prev) => {
      const next = { ...prev, mentorMode: mode };
      saveConfig(next);
      return next;
    });
  }, []);

  return (
    <DemoConfigContext.Provider value={{ config, setMentorMode }}>
      {children}
    </DemoConfigContext.Provider>
  );
}

export function useDemoConfig() {
  const ctx = useContext(DemoConfigContext);
  if (!ctx) throw new Error("useDemoConfig must be used within DemoConfigProvider");
  return ctx;
}
