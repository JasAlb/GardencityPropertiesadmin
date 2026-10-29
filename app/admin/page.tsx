"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  LogOut,
  Plus,
  RefreshCw,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProjectRecord {
  id: string;
  name: string;
  price: string;
  paymentPlan: string;
  area: string;
  developer: string;
  image: string;
  created_at?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Property list state
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [deleteIdInProgress, setDeleteIdInProgress] = useState<string | null>(null);

  // Form input state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [area, setArea] = useState("");
  const [developer, setDeveloper] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Feedback banners
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [listMessage, setListMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    setListMessage(null);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map database columns to ProjectRecord (supporting both snake_case payment_plan and camelCase)
        const mapped: ProjectRecord[] = data.map((item: Record<string, unknown>) => ({
          id: String(item.id || ""),
          name: String(item.name || ""),
          price: String(item.price || ""),
          paymentPlan: String(item.payment_plan || item.paymentPlan || ""),
          area: String(item.area || ""),
          developer: String(item.developer || ""),
          image: String(item.image || ""),
          created_at: typeof item.created_at === "string" ? item.created_at : undefined,
        }));
        setProjects(mapped);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load projects.";
      setListMessage({ type: "error", text: msg });
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Check user session
  useEffect(() => {
    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/admin/login");
          return;
        }

        setUser(session.user);
        setAuthChecking(false);
        fetchProjects();
      } catch (err) {
        console.error("Auth init error:", err);
        router.replace("/admin/login");
      }
    }

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, fetchProjects]);

  // Handle image selection & preview
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  // Generate unique URL slug
  function generateSlug(title: string): string {
    const clean = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${clean || "project"}-${randomSuffix}`;
  }

  // Submit new property
  async function handleAddProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!imageFile) {
      setFormError("Please select an image file for the property.");
      return;
    }

    setSubmitting(true);

    try {
      const slug = generateSlug(name);

      // 1. Upload image to 'property-images' Supabase storage bucket
      const fileExt = imageFile.name.split(".").pop() || "jpg";
      const sanitizedExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
      const storagePath = `properties/${slug}-${Date.now()}.${sanitizedExt}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(storagePath, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // 2. Retrieve public URL
      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(storagePath);

      const publicImageUrl = publicUrlData.publicUrl;

      // 3. Insert record into 'projects' table
      const { error: insertError } = await supabase.from("projects").insert([
        {
          id: slug,
          name: name.trim(),
          price: price.trim(),
          payment_plan: paymentPlan.trim(),
          area: area.trim(),
          developer: developer.trim(),
          image: publicImageUrl,
        },
      ]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      // 4. Success feedback and form reset
      setFormSuccess(`Successfully published "${name}" to the projects database!`);
      setName("");
      setPrice("");
      setPaymentPlan("");
      setArea("");
      setDeveloper("");
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);

      // Reset file input element
      const fileInput = document.getElementById("project-image-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";

      // 5. Refresh properties list
      await fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish project.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // Delete project
  async function handleDeleteProject(id: string, projectName: string) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${projectName}" from the database?`,
    );
    if (!confirmed) return;

    setDeleteIdInProgress(id);
    setListMessage(null);

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      setListMessage({
        type: "success",
        text: `"${projectName}" was successfully removed.`,
      });
      // Refresh list
      await fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project.";
      setListMessage({ type: "error", text: msg });
    } finally {
      setDeleteIdInProgress(null);
    }
  }

  // Logout handler
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/login");
    }
  }

  // Render loading state while checking session
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide text-slate-400">
            Authenticating administrator session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-main.jpeg"
              alt="Garden City Properties"
              className="h-10 w-10 rounded-xl object-contain shadow-md"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wide text-white sm:text-lg">
                  GARDEN<span className="text-amber-500">CITY</span>
                </span>
                <span className="rounded-md border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[0.65rem] font-bold tracking-widest text-sky-400 uppercase">
                  Admin
                </span>
              </div>
              <span className="text-[0.65rem] tracking-[0.25em] text-cyan-400 uppercase">
                Properties Management
              </span>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user?.email && (
              <span className="hidden text-xs text-slate-400 md:inline-block">
                Signed in as: <strong className="text-slate-200">{user.email}</strong>
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-900/40 hover:text-white"
              title="Sign out of Admin Portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            Portfolio Control Desk
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-extrabold text-white sm:text-4xl">
            Project Inventory & Publishing
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Publish new developments directly to the live database, manage existing property
            listings, and upload media assets into your Supabase storage bucket.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SECTION A: Add Property Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                    Add New Property
                  </h2>
                  <p className="text-xs text-slate-400">Create a real estate listing in Supabase</p>
                </div>
              </div>

              {/* Form Feedback Alerts */}
              {formError && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p>{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p>{formSuccess}</p>
                </div>
              )}

              <form onSubmit={handleAddProject} className="mt-6 space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="prop-name"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Project Name *
                  </label>
                  <input
                    id="prop-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sultan Haitham City"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Developer */}
                <div>
                  <label
                    htmlFor="prop-dev"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Developer *
                  </label>
                  <input
                    id="prop-dev"
                    type="text"
                    required
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="e.g., Al Abrar Real Estate"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Price & Area grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="prop-price"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Starting Price *
                    </label>
                    <input
                      id="prop-price"
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., OMR 45,000+"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="prop-area"
                      className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                    >
                      Starting Area *
                    </label>
                    <input
                      id="prop-area"
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g., 67.5 sqm"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>
                </div>

                {/* Payment Plan */}
                <div>
                  <label
                    htmlFor="prop-plan"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Payment Plan *
                  </label>
                  <input
                    id="prop-plan"
                    type="text"
                    required
                    value={paymentPlan}
                    onChange={(e) => setPaymentPlan(e.target.value)}
                    placeholder="e.g., 20/80 or Flexible"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Image Upload Input */}
                <div>
                  <label
                    htmlFor="project-image-input"
                    className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Property Image (Upload to Bucket) *
                  </label>

                  <div className="mt-1.5">
                    <label
                      htmlFor="project-image-input"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-slate-950/60 p-4 transition hover:border-sky-400/50 hover:bg-slate-950"
                    >
                      {imagePreview ? (
                        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Selected upload preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <span className="text-xs font-semibold text-white bg-slate-950/80 px-2.5 py-1 rounded-md">
                              Click to change image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Upload className="h-8 w-8 text-sky-400" />
                          <p className="mt-2 text-xs font-medium text-slate-300">
                            Click to browse property photo
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        id="project-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      <span>Uploading & Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Publish Property</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* SECTION B: Properties List */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                    Live Properties ({projects.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time listings synchronized with Supabase
                  </p>
                </div>

                <button
                  onClick={() => fetchProjects()}
                  disabled={loadingProjects}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:text-white disabled:opacity-50"
                  title="Refresh properties list"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${loadingProjects ? "animate-spin text-sky-400" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Status Message */}
              {listMessage && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${
                    listMessage.type === "success"
                      ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-200"
                      : "border-red-500/30 bg-red-950/40 text-red-200"
                  }`}
                >
                  {listMessage.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <p>{listMessage.text}</p>
                </div>
              )}

              {/* Loading State */}
              {loadingProjects && projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                  <p className="mt-3 text-xs text-slate-400">Loading properties from Supabase...</p>
                </div>
              ) : projects.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-slate-500">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-base font-semibold text-white">
                    No properties in the database yet
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">
                    Use the form on the left to add your first property. It will be saved into
                    Supabase and displayed here immediately.
                  </p>
                </div>
              ) : (
                /* Projects List / Grid */
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-all duration-200 hover:border-sky-400/30 hover:bg-slate-950 sm:flex-row sm:items-center sm:gap-5"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 sm:h-24 sm:w-28">
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image}
                            alt={project.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-600">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                        <span className="absolute top-2 start-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-amber-400 backdrop-blur-md">
                          {project.price}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-[family-name:var(--font-outfit)] text-base font-bold text-white transition group-hover:text-sky-300">
                            {project.name}
                          </h3>
                        </div>

                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                          <Building2 className="h-3.5 w-3.5 text-sky-400/80" />
                          <span className="truncate">{project.developer}</span>
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-slate-300">
                            <CalendarDays className="h-3 w-3 text-sky-400" />
                            <span>Plan: {project.paymentPlan || "N/A"}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-slate-300">
                            <Square className="h-3 w-3 text-sky-400" />
                            <span>{project.area || "N/A"}</span>
                          </span>

                          <span className="text-[0.65rem] text-slate-500 truncate">
                            id: {project.id}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          disabled={deleteIdInProgress === project.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-900/40 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                          title={`Delete ${project.name}`}
                        >
                          {deleteIdInProgress === project.id ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
