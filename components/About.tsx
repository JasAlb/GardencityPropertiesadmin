"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { dictionary } = useLanguage();
  const copy = dictionary.about;

  return (
    <section id="about" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-6 font-sans text-base leading-8 text-slate-300">{copy.body}</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {copy.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-md"
              >
                <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-sky-300">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="group relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.2)]"
        >
          {/* Background Looping Video */}
          <video
            src="/ani.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/20" />

          {/* Ambient Lighting Accents */}
          <div className="pointer-events-none absolute top-12 start-12 h-24 w-24 rounded-full bg-sky-400/20 blur-2xl" />
          <div className="pointer-events-none absolute end-10 bottom-16 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />

          {/* Text Content */}
          <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-end p-8 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.3em] text-sky-300 uppercase">
              {copy.principleLabel}
            </p>
            <p className="mt-3 max-w-sm font-[family-name:var(--font-outfit)] text-2xl font-semibold leading-snug text-white sm:text-3xl">
              {copy.principle}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
