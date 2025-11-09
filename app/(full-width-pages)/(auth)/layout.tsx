"use client";

import AuthSection from "@/components/auth/AuthSection";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import { useLocale, LocaleProvider } from "@/context/LocaleContext";

import React, { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <InnerAuthLayout>{children}</InnerAuthLayout>
    </LocaleProvider>
  );
}

function InnerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { locale, isHydrated } = useLocale();
  const isRtl = locale === "ar";

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
    }
  }, [locale, isHydrated]);

  if (!isHydrated) return null;

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <AuthSection />
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
