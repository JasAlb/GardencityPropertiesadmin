"use client";

import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Building2,
  Handshake,
  KeyRound,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons: LucideIcon[] = [
  Building2,
  Handshake,
  KeyRound,
  BadgeDollarSign,
  Ruler,
];

export default function Services() {
  const { dictionary } = useLanguage();
  const copy = dictionary.services;

  return (
    <section id="services" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-slate-400">{copy.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((service, index) => {
            const Icon = icons[index];
            const featured = index === 0;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -8 }}
                className={`group rounded-2xl border bg-white/5 p-7 backdrop-blur-xl transition ${
                  featured
                    ? "border-sky-400/70 shadow-[0_0_36px_rgba(56,189,248,0.18)]"
                    : "border-white/10 hover:border-sky-400/40 hover:shadow-[0_0_28px_rgba(56,189,248,0.14)]"
                }`}
              >
                {featured ? (
                  <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-sky-300 uppercase">
                    {copy.core}
                  </p>
                ) : null}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-sky-300 transition group-hover:text-cyan-200">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-outfit)] text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
