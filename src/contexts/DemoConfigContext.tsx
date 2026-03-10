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

export type CountryMode = "us" | "canada" | "global";

export type CappingMode = "uncapped" | "capped";

export type BrokerHubMode = "us" | "canada";

interface DemoConfig {
  mentorMode: MentorMode;
  flqaMode: FlqaMode;
  distributionMode: DistributionMode;
  countryMode: CountryMode;
  cappingMode: CappingMode;
}

interface DemoConfigContextValue {
  config: DemoConfig;
  setMentorMode: (mode: MentorMode) => void;
  setFlqaMode: (mode: FlqaMode) => void;
  setDistributionMode: (mode: DistributionMode) => void;
  setCountryMode: (mode: CountryMode) => void;
  setCappingMode: (mode: CappingMode) => void;
}

const DemoConfigContext = createContext<DemoConfigContextValue | null>(null);

const STORAGE_KEY = "demoConfig";

const DEFAULT_CONFIG: DemoConfig = {
  mentorMode: "none",
  flqaMode: "low",
  distributionMode: "full",
  countryMode: "us",
  cappingMode: "uncapped",
};

function loadConfig(): DemoConfig {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...DEFAULT_CONFIG };
}

function saveConfig(config: DemoConfig) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function DemoConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DemoConfig>(loadConfig);

  const update = useCallback(<K extends keyof DemoConfig>(key: K, value: DemoConfig[K]) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      saveConfig(next);
      return next;
    });
  }, []);

  const setMentorMode = useCallback((mode: MentorMode) => update("mentorMode", mode), [update]);
  const setFlqaMode = useCallback((mode: FlqaMode) => update("flqaMode", mode), [update]);
  const setDistributionMode = useCallback((mode: DistributionMode) => update("distributionMode", mode), [update]);
  const setCountryMode = useCallback((mode: CountryMode) => update("countryMode", mode), [update]);
  const setCappingMode = useCallback((mode: CappingMode) => update("cappingMode", mode), [update]);

  return (
    <DemoConfigContext.Provider value={{ config, setMentorMode, setFlqaMode, setDistributionMode, setCountryMode, setCappingMode }}>
      {children}
    </DemoConfigContext.Provider>
  );
}

export function useDemoConfig() {
  const ctx = useContext(DemoConfigContext);
  if (!ctx) throw new Error("useDemoConfig must be used within DemoConfigProvider");
  return ctx;
}
