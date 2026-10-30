"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { dictionary } = useLanguage();
  const copy = dictionary.contact;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Inquiry from ${name || "Website Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    );

    setSubmitted(true);
    window.location.href = `mailto:gardencityin@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8 md:p-10"
        >
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">{copy.subtitle}</p>

          <form action="mailto:gardencityin@gmail.com" method="GET" onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.name}
              <input
                required
                name="name"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none ring-sky-400/0 transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder={copy.namePlaceholder}
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.email}
              <input
                required
                type="email"
                name="email"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder="you@company.com"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.phone}
              <input
                required
                type="tel"
                name="phone"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder="+968 0000 0000"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              {copy.message}
              <textarea
                required
                name="message"
                rows={5}
                className="resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15"
                placeholder={copy.messagePlaceholder}
              />
            </label>
            <button
              type="submit"
              className="mt-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5"
            >
              {copy.send}
            </button>
            {submitted ? (
              <p className="text-sm text-sky-300">{copy.thanks}</p>
            ) : null}
          </form>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between rounded-3xl border border-sky-400/25 bg-gradient-to-br from-slate-900 to-slate-950 p-8"
        >
          <div>
            <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-white">
              {copy.direct}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.directBody}</p>
            <a
              href="mailto:gardencityin@gmail.com"
              className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <Mail size={18} />
              gardencityin@gmail.com
            </a>
            <a
              href="tel:+9689495068217"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <Phone size={18} />
              +968 9495068217
            </a>
            <a
              href="https://maps.app.goo.gl/tZ5U4GjpML5jncRw5"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-sky-200 transition hover:border-sky-400/40"
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-sky-400" />
              <span className="leading-snug break-words">
                Office No 11, Po Box 275, Pc 117, Mawelah North, Sultanate Oman
              </span>
            </a>
          </div>
          <p className="mt-10 text-xs tracking-[0.2em] text-sky-200/80 uppercase">
            {copy.location}
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
