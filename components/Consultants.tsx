"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Consultant {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
}

const CONSULTANTS: Consultant[] = [
  {
    name: "Rahul",
    role: "Property consultant",
    phone: "+968 99190404",
    email: "rahul@gmail.com",
    image: "/Consult1.jpeg",
  },
  {
    name: "[Consultant Name]",
    role: "Property consultant",
    phone: "[Consultant Mob]",
    email: "[Consultant Email]",
    image: "/Consult2.png",
  },
];

export default function Consultants() {
  const { language } = useLanguage();

  return (
    <section id="consultants" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {language === "ar" ? "المستشارون العقاريون" : "Advisory Team"}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white sm:text-4xl">
            {language === "ar" ? (
              <>
                مستشارو <span className="text-amber-500">العقارات</span>
              </>
            ) : (
              <>
                Property <span className="text-amber-500">Consultants</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-slate-400">
            {language === "ar"
              ? "فريقنا المتخصص لتقديم استشارات عقارية شخصية ومساعدتك في اختيار العقار الأنسب."
              : "Dedicated professionals providing tailored advisory and high-touch guidance across Oman’s prime developments."}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CONSULTANTS.map((consultant, index) => {
            const cleanPhone = consultant.phone.replace(/[^0-9]/g, "");

            return (
              <motion.article
                key={consultant.name + index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.18)] sm:flex-row sm:items-center sm:p-8"
              >
                {/* Circular Profile Image */}
                <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-full border-2 border-sky-400/40 bg-slate-950 p-1 shadow-[0_0_24px_rgba(56,189,248,0.2)] transition-colors group-hover:border-sky-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={consultant.image}
                    alt={`${consultant.name} - ${consultant.role} at Garden City Properties Oman`}
                    className="h-full w-full rounded-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Consultant Details */}
                <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-start">
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-sky-300 uppercase">
                    {consultant.role}
                  </span>

                  <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-2xl font-bold text-white transition-colors group-hover:text-sky-300">
                    {consultant.name}
                  </h3>

                  <p className="mt-1 text-xs tracking-wider text-slate-400 uppercase">
                    Garden City Properties
                  </p>

                  {/* Interactive Action Icon Buttons (No raw email text displayed) */}
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={`tel:${consultant.phone}`}
                      aria-label={`Call ${consultant.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-sky-400 shadow-md backdrop-blur-md transition-all duration-200 hover:border-sky-400/60 hover:bg-sky-400/15 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      title={consultant.phone}
                    >
                      <Phone className="h-5 w-5" />
                    </a>

                    <a
                      href={`mailto:${consultant.email}`}
                      aria-label={`Email ${consultant.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-sky-400 shadow-md backdrop-blur-md transition-all duration-200 hover:border-sky-400/60 hover:bg-sky-400/15 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      title={consultant.email}
                    >
                      <Mail className="h-5 w-5" />
                    </a>

                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${consultant.name}`}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-emerald-400 shadow-md backdrop-blur-md transition-all duration-200 hover:border-emerald-400/60 hover:bg-emerald-400/15 hover:text-white hover:shadow-[0_0_20px_rgba(52,211,153,0.35)]"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
