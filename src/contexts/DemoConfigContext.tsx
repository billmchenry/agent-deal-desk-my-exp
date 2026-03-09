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

export type FlqaMode =
  | "low"
  | "mid"
  | "high"
  | "max"
  | "over";

export type DistributionMode = "full" | "few_levels" | "few_countries" | "many_countries";

interface DemoConfig {
  mentorMode: MentorMode;
  flqaMode: FlqaMode;
  distributionMode: DistributionMode;
}

interface DemoConfigContextValue {
  config: DemoConfig;
  setMentorMode: (mode: MentorMode) => void;
  setFlqaMode: (mode: FlqaMode) => void;
  setDistributionMode: (mode: DistributionMode) => void;
}

const DemoConfigContext = createContext<DemoConfigContextValue | null>(null);

const STORAGE_KEY = "demoConfig";

function loadConfig(): DemoConfig {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { mentorMode: "none", flqaMode: "low", distributionMode: "full" as const, ...parsed };
    }
  } catch {}
  return { mentorMode: "none", flqaMode: "low", distributionMode: "full" as const };
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

  const setFlqaMode = useCallback((mode: FlqaMode) => {
    setConfig((prev) => {
      const next = { ...prev, flqaMode: mode };
      saveConfig(next);
      return next;
    });
  }, []);

  const setDistributionMode = useCallback((mode: DistributionMode) => {
    setConfig((prev) => {
      const next = { ...prev, distributionMode: mode };
      saveConfig(next);
      return next;
    });
  }, []);

  return (
    <DemoConfigContext.Provider value={{ config, setMentorMode, setFlqaMode, setDistributionMode }}>
      {children}
    </DemoConfigContext.Provider>
  );
}

export function useDemoConfig() {
  const ctx = useContext(DemoConfigContext);
  if (!ctx) throw new Error("useDemoConfig must be used within DemoConfigProvider");
  return ctx;
}
