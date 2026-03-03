import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type Language = "en" | "fr-CA" | "es" | "zh" | "ja" | "de" | "ar";
export type DateFormatOption = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY/MM/DD" | "DD-MM-YYYY" | "MM-DD-YYYY" | "YYYY-MM-DD" | "DD Mon, YYYY";
export type TimeFormatOption = "12h" | "24h";
export type NumberFormatOption = "en-US" | "de-DE" | "en-IN";
export type FontSizeOption = "normal" | "large" | "x-large";

interface LocaleState {
  language: Language;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  numberFormat: NumberFormatOption;
  fontSize: FontSizeOption;
}

interface LocaleContextType extends LocaleState {
  setLanguage: (lang: Language) => void;
  setDateFormat: (fmt: DateFormatOption) => void;
  setTimeFormat: (fmt: TimeFormatOption) => void;
  setNumberFormat: (fmt: NumberFormatOption) => void;
  setFontSize: (size: FontSizeOption) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const fontSizeMap: Record<FontSizeOption, string> = {
  normal: "16px",
  large: "18px",
  "x-large": "20px",
};

const langCodeMap: Record<Language, string> = {
  en: "en",
  "fr-CA": "fr",
  es: "es",
  zh: "zh",
  ja: "ja",
  de: "de",
  ar: "ar",
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>("locale-language", "en");
  const [dateFormat, setDateFormat] = useLocalStorage<DateFormatOption>("locale-dateFormat", "MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useLocalStorage<TimeFormatOption>("locale-timeFormat", "12h");
  const [numberFormat, setNumberFormat] = useLocalStorage<NumberFormatOption>("locale-numberFormat", "en-US");
  const [fontSize, setFontSize] = useLocalStorage<FontSizeOption>("locale-fontSize", "normal");

  // Apply dir, lang, and fontSize to <html>
  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = langCodeMap[language];
  }, [language]);

  useEffect(() => {
    document.documentElement.style.fontSize = fontSizeMap[fontSize];
  }, [fontSize]);

  return (
    <LocaleContext.Provider
      value={{
        language, setLanguage,
        dateFormat, setDateFormat,
        timeFormat, setTimeFormat,
        numberFormat, setNumberFormat,
        fontSize, setFontSize,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
