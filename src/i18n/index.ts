export const LANGUAGES = {
  en: { label: "English", flag: "🇬🇧", dir: "ltr", locale: "en-US" },
  fr: { label: "Français", flag: "🇫🇷", dir: "ltr", locale: "fr-FR" },
  ar: { label: "العربية", flag: "🇸🇦", dir: "rtl", locale: "ar-SA" },
  es: { label: "Español", flag: "🇪🇸", dir: "ltr", locale: "es-ES" },
  de: { label: "Deutsch", flag: "🇩🇪", dir: "ltr", locale: "de-DE" },
  it: { label: "Italiano", flag: "🇮🇹", dir: "ltr", locale: "it-IT" },
  pt: { label: "Português", flag: "🇵🇹", dir: "ltr", locale: "pt-PT" },
} as const;

export type Lang = keyof typeof LANGUAGES;

import en from "./languages/en.js";
import fr from "./languages/fr.js";
import ar from "./languages/ar.js";
import de from "./languages/de.js";
import it from "./languages/it.js";
import pt from "./languages/pt.js";
import es from "./languages/es.js";

const translations: Record<string, Record<string, string>> = { en, fr, ar, es, de, it, pt };

export function t(lang: string, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getLangFromUrl(url: URL): string {
  const segments = url.pathname.split("/").filter(Boolean);
  const lang = segments[0];
  if (lang && lang in LANGUAGES) return lang;
  return "en";
}

export function useTranslations(lang: string) {
  return (key: string, vars?: Record<string, string>) => {
    let text = t(lang, key);
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace("{" + k + "}", v); });
    return text;
  };
}
