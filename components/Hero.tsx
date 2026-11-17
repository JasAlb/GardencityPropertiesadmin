"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { dictionary, language } = useLanguage();
  const copy = dictionary.hero;
  const isAr = language === "ar";
  const shouldReduceMotion = useReducedMotion();

  // Premium luxury easing curve
  const luxuryEase = [0.22, 1, 0.36, 1] as const;

  const whyInvestLeft = isAr
    ? [
        { num: "01", title: "الاستقرار السياسي والأمني" },
        { num: "02", title: "اقتصاد متنامٍ" },
        { num: "03", title: "رؤية عُمان 2040" },
        { num: "04", title: "التملك الحر" },
        { num: "05", title: "نمو رأس المال" },
      ]
    : [
        { num: "01", title: "Political Stability & Security" },
        { num: "02", title: "Growing Economy" },
        { num: "03", title: "Oman Vision 2040" },
        { num: "04", title: "Freehold Ownership" },
        { num: "05", title: "Capital Appreciation" },
      ];

  const whyInvestRight = isAr
    ? [
        { num: "06", title: "عوائد إيجارية مجزية" },
        { num: "07", title: "مدن المستقبل" },
        { num: "08", title: "موقع استراتيجي" },
        { num: "09", title: "جودة الحياة" },
        { num: "10", title: "فرص استثمارية متنوعة" },
      ]
    : [
        { num: "06", title: "Rental Returns" },
        { num: "07", title: "Future Cities" },
        { num: "08", title: "Strategic Location" },
        { num: "09", title: "Quality of Life" },
        { num: "10", title: "Diverse Investment Opportunities" },
      ];

  return (
    <section id="home" className="relative isolate min-h-[92vh] overflow-hidden m-0 -mt-[1px]">
      {/* Background Image Container with Cinematic Zoom */}
      <div className="absolute inset-0 z-0 bg-[#050816] overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: shouldReduceMotion ? 1 : 1.07 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/Oasis Fortress at Dusk.png"
            alt="Garden City Properties - Premium Real Estate Consultancy and Property Brokerage in Oman"
            fill
            priority={true}
            quality={90}
            sizes="100vw"
            className="object-cover object-[65%_center] md:object-center brightness-[0.92] contrast-[1.08]"
          />
        </motion.div>
      </div>

      {/* Refined Luxury Dark Overlays for Peak Legibility & Contrast */}
      <div className="absolute inset-0 z-0 bg-slate-950/35" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20 rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-[#050816] via-[#050816]/70 to-transparent" />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 sm:py-28 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-sky-300 uppercase backdrop-blur-md rtl:tracking-normal rtl:font-[family-name:var(--font-cairo)]"
        >
          {copy.badge}
        </motion.p>
        <h1 className="max-w-4xl font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.12] tracking-normal sm:tracking-tight text-white drop-shadow-md rtl:font-[family-name:var(--font-cairo)] rtl:leading-snug rtl:tracking-normal rtl:font-bold">
          <span className="inline-block animate-hero-title">
            {copy.title}
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: luxuryEase }}
          className="mt-6 max-w-2xl font-sans text-base sm:text-lg lg:text-xl leading-relaxed text-slate-200/90 font-normal rtl:font-[family-name:var(--font-cairo)]"
        >
          {copy.subtitle}
        </motion.p>

        {/* Why Invest in Oman Section (Two-Column Grid Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: luxuryEase }}
          className="my-8 sm:my-10 max-w-5xl rounded-3xl border border-white/10 bg-slate-950/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-sky-300 uppercase rtl:tracking-normal rtl:font-[family-name:var(--font-cairo)]">
              {isAr ? "الفرص العقارية الاستثمارية" : "Strategic Potential"}
            </span>
          </div>

          <h2 className="mt-3 font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white rtl:font-[family-name:var(--font-cairo)]">
            {isAr ? "لماذا الاستثمار في عُمان؟" : "Why Invest in Oman"}
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
            {/* Left Column (Points 1–5) */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {whyInvestLeft.map((point) => (
                <div
                  key={point.num}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3.5 py-3 transition-all duration-300 hover:border-sky-400/30 hover:bg-white/[0.06]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-400/30 text-xs font-bold text-sky-300">
                    {point.num}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide rtl:font-[family-name:var(--font-cairo)]">
                    {point.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Right Column (Points 6–10) */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {whyInvestRight.map((point) => (
                <div
                  key={point.num}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3.5 py-3 transition-all duration-300 hover:border-sky-400/30 hover:bg-white/[0.06]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-400/30 text-xs font-bold text-sky-300">
                    {point.num}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide rtl:font-[family-name:var(--font-cairo)]">
                    {point.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Summary Block */}
          <div className="mt-6 rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-transparent p-4 sm:p-5 text-center sm:text-start">
            <p className="font-[family-name:var(--font-outfit)] text-xs sm:text-sm font-extrabold tracking-wider text-sky-200 uppercase rtl:font-[family-name:var(--font-cairo)]">
              {isAr
                ? "استثمر في عُمان اليوم.. وامتلك جزءاً من المستقبل."
                : "INVEST IN OMAN TODAY. OWN A PART OF TOMORROW."}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-200/90 leading-relaxed rtl:font-[family-name:var(--font-cairo)]">
              {isAr
                ? "عُمان ليست مجرد مكان لشراء عقار؛ بل هي فرصة للاستثمار في اقتصاد واعد ومستقبل طموح."
                : "Oman is more than a place to buy property; it is an opportunity to invest in a growing economy and an ambitious future."}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: luxuryEase }}
          className="mt-4 sm:mt-6 flex flex-col gap-4 sm:flex-row"
        >
          <motion.a
            href="#projects"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.4)] transition hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]"
          >
            {copy.explore}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-sky-200 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-white/10"
          >
            {copy.contact}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
