import { useLocale } from "@/contexts/LocaleContext";
import { translations } from "@/i18n";

export function useTranslation() {
  const { language } = useLocale();

  const t = (key: string): string => {
    const langStrings = translations[language];
    if (langStrings && key in langStrings) {
      return (langStrings as Record<string, string>)[key];
    }
    // Fallback to English
    const en = translations.en;
    if (key in en) {
      return (en as Record<string, string>)[key];
    }
    return key;
  };

  return { t };
}
