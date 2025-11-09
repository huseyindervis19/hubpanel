"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as languageService from "@/services/languageService";
import { Language } from "@/types/Language";

type LocaleContextType = {
  locale: string;
  messages: Record<string, string>;
  setLocale: React.Dispatch<React.SetStateAction<string>>;
  isHydrated: boolean;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({
  children,
  userLang,
}: {
  children: React.ReactNode;
  userLang?: string;
}) => {
  const [locale, setLocale] = useState<string>("ar");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  const loadMessages = useCallback(async (lang: string) => {
    try {
      const mod = await import(`@/locales/${lang}.json`);
      setMessages(mod.default);
    } catch (error) {
      const fallback = await import("@/locales/en.json");
      setMessages(fallback.default);
    }
  }, []);

  useEffect(() => {
    const initLocale = async () => {
      try {
        const languages: Language[] = await languageService.getLanguages();
        let defaultLocale: string;

        if (userLang) defaultLocale = userLang;
        else {
          const stored = localStorage.getItem("locale");
          if (stored) defaultLocale = stored;
          else if (languages.length > 0) defaultLocale = languages[0].key || "";
          else defaultLocale = "en";
        }

        setLocale(defaultLocale);
        await loadMessages(defaultLocale);
      } catch (error) {
        setLocale("en");
        await loadMessages("en");
      } finally {
        setIsHydrated(true);
      }
    };

    initLocale();
  }, [userLang, loadMessages]);

  useEffect(() => {
    if (isHydrated) localStorage.setItem("locale", locale);
  }, [locale, isHydrated]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages, isHydrated }}>
      {isHydrated ? children : null}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
};
