"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { dictionary } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          <a href="#home" className="flex items-center gap-3 focus:outline-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-main.jpeg"
              alt="Garden City Properties"
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div className="flex flex-col justify-center">
              <span className="text-lg md:text-xl font-extrabold tracking-wide text-white">
                GARDEN<span className="text-amber-500">CITY</span>
              </span>
              <span className="text-[0.65rem] md:text-xs tracking-[0.3em] text-cyan-400 uppercase font-medium">
                Properties
              </span>
            </div>
          </a>
        </div>
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GardencityProperties. {dictionary.footer.rights}
        </p>
      </div>
    </footer>
  );
}
