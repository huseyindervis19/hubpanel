"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import messagesData from "@/locales/message-keys.json";

type Locale = "en" | "ar";
type Messages = Record<string, string>;

type LocaleContextType = {
  locale: Locale;
  messages: Messages;
  setLocale: React.Dispatch<React.SetStateAction<Locale>>;
  isHydrated: boolean;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LANGUAGES: Locale[] = ["en", "ar"];

export const LocaleProvider = ({
  children,
  userLang,
}: {
  children: React.ReactNode;
  userLang?: string;
}) => {
  const [locale, setLocale] = useState<Locale>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let initialLang: Locale = "en";

    if (userLang && LANGUAGES.includes(userLang as Locale)) {
      initialLang = userLang as Locale;
    } else {
      const storedCode = localStorage.getItem("locale");
      if (storedCode && LANGUAGES.includes(storedCode as Locale)) {
        initialLang = storedCode as Locale;
      }
    }

    setLocale(initialLang);
    setIsHydrated(true);
  }, [userLang]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("locale", locale);
    }
  }, [locale, isHydrated]);

  const messages = useMemo(() => {
    return messagesData.data[locale];
  }, [locale]);

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