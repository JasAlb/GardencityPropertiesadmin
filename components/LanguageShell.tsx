"use client";

import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import type { ReactNode } from "react";

function DirectedShell({ children }: { children: ReactNode }) {
  const { dir, language } = useLanguage();

  return (
    <div
      dir={dir}
      lang={language}
      className={`flex min-h-full flex-col bg-[#050816] ${
        language === "ar" ? "font-[family-name:var(--font-cairo)]" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function LanguageShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <DirectedShell>{children}</DirectedShell>
    </LanguageProvider>
  );
}
