"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage, dictionary } = useLanguage();
  const nav = dictionary.nav;

  const links = [
    { href: "#home", label: nav.home },
    { href: "#about", label: nav.about },
    { href: "#projects", label: nav.projects },
    { href: "#services", label: nav.services },
    { href: "#values", label: language === "ar" ? "رؤيتنا" : "Why Us" },
    { href: "#contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 m-0 -mb-[1px] bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-20 md:min-h-28 max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4 m-0 mb-0">
        <Link
          href={language === "ar" ? "/ar" : "/en"}
          className="flex items-center shrink-0 focus:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo.jpeg"
            alt="Garden City Properties - Real Estate Consultancy & Brokerage in Oman"
            className="w-48 md:w-64 h-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 shrink-0">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs lg:text-sm font-medium text-slate-300 transition hover:text-sky-300 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-xs lg:px-5 lg:py-2.5 lg:text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            {nav.getStarted}
          </a>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex md:hidden items-center gap-2 sm:gap-3 shrink-0">
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-sky-300"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
              >
                {nav.getStarted}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function LanguageToggle({
  language,
  onToggle,
}: {
  language: "en" | "ar";
  onToggle: () => void;
}) {
  const pathname = usePathname() || "";
  const isArabic = pathname.startsWith("/ar") || language === "ar";

  const getPathForLocale = (target: "en" | "ar") => {
    if (pathname.startsWith("/ar")) {
      return pathname.replace(/^\/ar/, target === "en" ? "/en" : "/ar") || `/${target}`;
    }
    if (pathname.startsWith("/en")) {
      return pathname.replace(/^\/en/, target === "ar" ? "/ar" : "/en") || `/${target}`;
    }
    return `/${target}`;
  };

  const enHref = getPathForLocale("en");
  const arHref = getPathForLocale("ar");

  return (
    <div
      aria-label="Toggle language between English and Arabic"
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/80 p-1 text-xs font-semibold tracking-wide text-slate-300 transition hover:border-sky-400/40"
    >
      <Link
        href={enHref}
        onClick={() => {
          if (isArabic) onToggle();
        }}
        aria-label="Switch to English"
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          !isArabic
            ? "bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_14px_rgba(56,189,248,0.45)]"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </Link>
      <span className="text-slate-500 font-medium">/</span>
      <Link
        href={arHref}
        onClick={() => {
          if (!isArabic) onToggle();
        }}
        aria-label="التبديل إلى العربية"
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          isArabic
            ? "bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_14px_rgba(56,189,248,0.45)]"
            : "text-slate-400 hover:text-white"
        }`}
      >
        AR
      </Link>
    </div>
  );
}
