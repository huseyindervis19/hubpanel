"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useSidebar } from "@/context/SidebarContext";
import { useLocale, LocaleProvider } from "@/context/LocaleContext";
import UnauthorizedPage from "../unauthorized";
import { useCurrentUser } from "@/hooks/useAuth";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!currentUser || !currentUser.language) {
    return <UnauthorizedPage />;
  }

  return (
    <LocaleProvider userLang={currentUser.language.key}>
      <InnerAdminLayout>{children}</InnerAdminLayout>
    </LocaleProvider>
  );
}

function InnerAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { locale, isHydrated } = useLocale();

  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // client-only token check
  useEffect(() => {
    if (!isHydrated) return;

    const checkToken = () => {
      const token = localStorage.getItem("accessToken");
      const exp = localStorage.getItem("token_exp");

      if (!token || !exp || Date.now() >= parseInt(exp, 10)) {
        localStorage.clear();
        setHasToken(false);
        router.replace("/signin");
      } else {
        setHasToken(true);
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 10000);

    return () => clearInterval(interval);
  }, [router, isHydrated]);

  // set html lang & dir only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const isRtl = locale === "ar";
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [locale, isHydrated]);

  if (!isHydrated || hasToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Initializing...
      </div>
    );
  }

  if (!hasToken) {
    return <UnauthorizedPage />;
  }

  const isRtl = locale === "ar";

  const sidebarMarginClass = isMobileOpen
    ? ""
    : isExpanded || isHovered
      ? isRtl
        ? "lg:mr-[280px]"
        : "lg:ml-[280px]"
      : isRtl
        ? "lg:mr-[90px]"
        : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />

      <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarMarginClass}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
