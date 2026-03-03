import { en } from "./en";
import { frCA } from "./fr-CA";
import { es } from "./es";
import { zh } from "./zh";
import { ja } from "./ja";
import { de } from "./de";
import { ar } from "./ar";
import type { Language } from "@/contexts/LocaleContext";

export const translations: Record<Language, Record<string, string>> = {
  en,
  "fr-CA": frCA,
  es,
  zh,
  ja,
  de,
  ar,
};
