"use client";

import { useState } from "react";
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
    { href: "#contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#home"
          className="flex items-center focus:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo.jpeg"
            alt="Garden City Properties"
            className="h-11 sm:h-14 w-auto object-contain"
          />
        </a>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-sky-300"
            >
              {link.label}
            </a>
          ))}
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {nav.getStarted}
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white"
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
            className="overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
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
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle language between English and Arabic"
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/80 p-1 text-xs font-semibold tracking-wide text-slate-300 transition hover:border-sky-400/40"
    >
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          language === "en"
            ? "bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_14px_rgba(56,189,248,0.45)]"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </span>
      <span className="text-slate-500 font-medium">/</span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          language === "ar"
            ? "bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_14px_rgba(56,189,248,0.45)]"
            : "text-slate-400 hover:text-white"
        }`}
      >
        AR
      </span>
    </button>
  );
}
