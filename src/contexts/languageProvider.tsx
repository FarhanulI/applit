"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "../../public/locale/en.json";
import de from "../../public/locale/de.json";
import fr from "../../public/locale/fr.json";
import es from "../../public/locale/es.json";
import pt from "../../public/locale/pt.json";
import ru from "../../public/locale/ru.json";
import ar from "../../public/locale/ar.json";
import tr from "../../public/locale/tr.json";
import uk from "../../public/locale/uk.json";
import pl from "../../public/locale/pl.json";
import ro from "../../public/locale/ro.json";

export type SupportedLang = "en" | "de" | "fr" | "es" | "pt" | "ru" | "ar" | "tr" | "uk" | "pl" | "ro";

type Dictionaries = Record<SupportedLang, Record<string, string>>;

const DICTS: Dictionaries = {
  en,
  de,
  fr,
  es,
  pt,
  ru,
  ar,
  tr,
  uk,
  pl,
  ro,
};

type LanguageContextValue = {
  language: SupportedLang;
  setLanguage: (lang: SupportedLang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("app_language");
      if (saved === "en" || saved === "de" || saved === "fr" || saved === "es" || saved === "pt" || saved === "ru" || saved === "ar" || saved === "tr" || saved === "uk" || saved === "pl" || saved === "ro") {
        setLanguageState(saved);
      }
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: SupportedLang) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem("app_language", lang);
    } catch {}
  }, []);

  const t = useCallback((key: string) => {
    const dict = DICTS[language] || DICTS.en;
    return dict[key] ?? key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}