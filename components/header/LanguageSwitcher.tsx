"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useLanguages } from "@/hooks/useLanguages";

export default function LanguageDropdown() {
  const { locale, setLocale } = useLocale();
  const { languages: languagesData, isLoading } = useLanguages();
  const [isOpen, setIsOpen] = useState(false);

  const languages = Array.isArray(languagesData) ? languagesData : [];
  
  useEffect(() => {
    function handleClickOutside() {
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function selectLanguage(code: string) {
    setLocale(code);
    setIsOpen(false);
  }

  const currentLangLabel =
    languages.find((lang) => lang.code === locale)?.name || locale;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-32 px-3 py-1 border rounded-md text-sm dark:text-white dark:border-white/20"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{isLoading ? "Loading..." : currentLangLabel}</span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
          <ul className="py-1">
            {isLoading ? (
              <li className="px-4 py-2 text-sm dark:text-white">Loading...</li>
            ) : (
              languages.map(({ code, name }) => (
                <li key={code}>
                  <button
                    onClick={() => selectLanguage(code!)}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      locale === code
                        ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } dark:text-white`}
                    type="button"
                  >
                    {name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
