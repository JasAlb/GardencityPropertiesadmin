"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Leadership() {
  const { dictionary } = useLanguage();
  const copy = dictionary.about;

  return (
    <section id="leadership" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.leadershipEyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white sm:text-4xl">
            {copy.leadershipTitle}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {copy.leaders.map((leader, index) => (
            <motion.article
              key={leader.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.18)]"
            >
              {/* Leader Portrait */}
              <div className="relative h-80 w-full overflow-hidden bg-slate-900 sm:h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leader.src}
                  alt={`${leader.name} - ${leader.title}`}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-75" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block rounded-full border border-sky-400/35 bg-slate-950/85 px-3.5 py-1 text-xs font-semibold tracking-[0.18em] text-sky-300 uppercase shadow-[0_0_16px_rgba(56,189,248,0.3)] backdrop-blur-md">
                    {leader.title}
                  </span>
                </div>
              </div>

              {/* Profile Details with enhanced typography */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                {/* Name */}
                <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-extrabold tracking-tight text-white transition-colors group-hover:text-sky-300 sm:text-3xl">
                  {leader.name}
                </h3>

                {/* Title */}
                <p className="mt-1 text-sm font-semibold tracking-wide text-sky-400/95 sm:text-base">
                  {leader.title}
                </p>

                {/* Extended Biography */}
                <p className="mt-5 flex-1 font-sans text-sm font-normal leading-relaxed text-slate-200/90 antialiased tracking-normal sm:text-[15px] sm:leading-7">
                  {leader.bio}
                </p>

                {/* Contact Links */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                  <a
                    href={`mailto:${leader.email}`}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300 sm:text-sm shadow-sm"
                  >
                    <Mail size={16} className="shrink-0 text-sky-400" />
                    <span>{leader.email}</span>
                  </a>

                  <a
                    href={leader.phoneHref}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300 sm:text-sm shadow-sm"
                  >
                    <Phone size={16} className="shrink-0 text-sky-400" />
                    <span dir="ltr">{leader.phone}</span>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
