"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Building2, CalendarDays, RefreshCw, Square } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  name: string;
  price: string;
  paymentPlan: string;
  area: string;
  developer: string;
  image: string;
}

const WHATSAPP_PREFIX =
  "https://wa.me/9689495068217?text=Hello,%20I%20would%20like%20more%20details%20about%20";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ProjectsShowcase() {
  const { language, dictionary } = useLanguage();
  const copy = dictionary.projects;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const { data, error: fetchErr } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (ignore) return;

        if (fetchErr) {
          throw fetchErr;
        }

        if (data) {
          const mapped: Project[] = data.map((row: Record<string, unknown>) => ({
            id: String(row.id || ""),
            name: String(row.name || ""),
            price: String(row.price || ""),
            paymentPlan: String(row.payment_plan || row.paymentPlan || ""),
            area: String(row.area || ""),
            developer: String(row.developer || ""),
            image: String(row.image || ""),
          }));
          setProjects(mapped);
        }
      } catch (err: unknown) {
        if (ignore) return;
        const msg =
          err instanceof Error ? err.message : copy.error || "Failed to load projects.";
        setError(msg);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [copy.error]);

  async function handleRetry() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      if (data) {
        const mapped: Project[] = data.map((row: Record<string, unknown>) => ({
          id: String(row.id || ""),
          name: String(row.name || ""),
          price: String(row.price || ""),
          paymentPlan: String(row.payment_plan || row.paymentPlan || ""),
          area: String(row.area || ""),
          developer: String(row.developer || ""),
          image: String(row.image || ""),
        }));
        setProjects(mapped);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : copy.error || "Failed to load projects.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="projects" className="scroll-mt-24 border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white sm:text-4xl">
            {language === "ar" ? (
              <>
                عرض <span className="text-amber-500">المشاريع</span>
              </>
            ) : (
              <>
                Showcase of Our <span className="text-amber-500">Projects</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-slate-400">{copy.subtitle}</p>
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60 shadow-lg animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="h-[230px] w-full bg-slate-700/40" />

                {/* Card Body Skeleton */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-700/60" />
                  <div className="mt-2 h-7 w-1/2 rounded bg-slate-700/80" />

                  <div className="mt-5 space-y-2.5">
                    <div className="h-3.5 w-4/5 rounded bg-slate-700/40" />
                    <div className="h-3.5 w-3/5 rounded bg-slate-700/40" />
                    <div className="h-3.5 w-2/3 rounded bg-slate-700/40" />
                  </div>

                  <div className="mt-6 flex items-center gap-2.5 pt-2">
                    <div className="h-10 flex-1 rounded-lg bg-slate-700/60" />
                    <div className="h-10 w-10 rounded-lg bg-slate-700/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-950/30 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
              {copy.error}
            </h3>
            <p className="mt-1 text-xs text-red-200/80">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-900/40 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-800/60"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-slate-500">
              <Building2 className="h-7 w-7 text-sky-400" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
              {copy.empty}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              New property listings will appear here dynamically as they are published.
            </p>
          </div>
        )}

        {/* Dynamic Projects Grid */}
        {!isLoading && !error && projects.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const whatsappUrl = `${WHATSAPP_PREFIX}${encodeURIComponent(project.name)}`;

              return (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-2xl"
                >
                  {/* Project Image */}
                  <div className="relative h-[230px] w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Project Title (Gold/Amber) */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-lg font-medium text-amber-500 line-clamp-1">
                      {project.name}
                    </h3>

                    {/* Price (White, bold) */}
                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {project.price}
                    </p>

                    {/* Details List */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-400">
                      <li className="flex items-center gap-2">
                        <CalendarDays size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">
                          <span>{copy.paymentPlan}: </span>
                          <span className="font-medium text-slate-300">
                            {project.paymentPlan}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Square size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">
                          <span>{copy.startingArea}: </span>
                          <span className="font-medium text-slate-300">
                            {project.area}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Building2 size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">
                          <span>{copy.developer}: </span>
                          <span className="font-medium text-slate-300">
                            {project.developer}
                          </span>
                        </span>
                      </li>
                    </ul>

                    {/* Action Buttons: Primary + WhatsApp */}
                    <div className="mt-5 flex items-center gap-2.5 pt-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200 active:scale-[0.99]"
                      >
                        {copy.getDetails}
                      </a>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${copy.whatsapp}: ${project.name}`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950 shadow-sm transition hover:bg-slate-200 active:scale-[0.99]"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
