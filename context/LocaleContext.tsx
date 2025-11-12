"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as languageService from "@/services/languageService";
import { getTranslationsByLanguage } from "@/services/translationService";
import { Language } from "@/types/Language";

type LocaleContextType = {
  locale: string;
  messages: Record<string, string>;
  setLocale: React.Dispatch<React.SetStateAction<string>>;
  isHydrated: boolean;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const clearOldTranslations = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("translations_")) {
      localStorage.removeItem(key);
    }
  }
};

export const LocaleProvider = ({
  children,
  userLang,
}: {
  children: React.ReactNode;
  userLang?: string;
}) => {
  const [locale, setLocale] = useState<string>("en");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  const loadMessages = useCallback(async (langId: number, langCode: string) => {
    try {
      clearOldTranslations();
      
      const cached = localStorage.getItem(`translations_${langId}`);
      if (cached) {
        setMessages(JSON.parse(cached));
      } else {
        const { translations } = await getTranslationsByLanguage(langId);
        setMessages(translations);
        localStorage.setItem(`translations_${langId}`, JSON.stringify(translations));
      }
      setLocale(langCode);
      localStorage.setItem("locale", langCode);
    } catch (error) {
      console.error("Failed to load translations:", error);
      if (langCode !== "en") {
        const languages: Language[] = await languageService.getLanguages();
        const enLang = languages.find(l => l.code === "en");
        if (enLang) await loadMessages(enLang.id, "en");
      }
    }
  }, []);

  useEffect(() => {
    const initLocale = async () => {
      try {
        const languages: Language[] = await languageService.getLanguages();
        let defaultLang: Language | undefined;

        if (userLang) {
          defaultLang = languages.find(l => l.code === userLang);
        }

        if (!defaultLang) {
          const storedCode = localStorage.getItem("locale");
          defaultLang = languages.find(l => l.code === storedCode) || languages.find(l => l.isDefault);
        }

        if (!defaultLang && languages.length > 0) defaultLang = languages[0];

        if (defaultLang) {
          await loadMessages(defaultLang.id, defaultLang.code);
        }
      } catch (error) {
        console.error("Failed to init locale:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    initLocale();
  }, [userLang, loadMessages]);

useEffect(() => {
  if (!isHydrated) return;

  const updateTranslations = async () => {
    clearOldTranslations();

    const languages: Language[] = await languageService.getLanguages();
    const lang = languages.find(l => l.code === locale);
    if (lang) {
      const langId = lang.id;
      const cached = localStorage.getItem(`translations_${langId}`);
      if (cached) {
        setMessages(JSON.parse(cached));
      } else {
        const { translations } = await getTranslationsByLanguage(langId);
        setMessages(translations);
        localStorage.setItem(`translations_${langId}`, JSON.stringify(translations));
      }
    }
    localStorage.setItem("locale", locale);
  };

  updateTranslations();
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