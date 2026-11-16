"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Phone,
  ChevronDown,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isError?: boolean;
}

function WhatsAppIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const QUICK_PROMPTS = {
  en: [
    "Explore Properties in Muscat",
    "Certified Valuation Services",
    "Turnkey Property Management",
    "Contact an Advisor",
  ],
  ar: [
    "استكشاف عقارات مسقط",
    "خدمات التقييم العقاري المعتمد",
    "إدارة الأملاك والعقارات في عُمان",
    "تواصل مع مستشار عقاري",
  ],
};

function formatMessageText(text: string) {
  // Simple & secure parser for markdown bold and links
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    // Bullet points
    const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
    const cleanLine = isBullet ? line.trim().substring(2) : line;

    // Parse **bold** parts
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={idx} className="ms-4 list-disc text-slate-200/90 leading-relaxed my-1">
          {renderedParts}
        </li>
      );
    }

    if (!cleanLine.trim()) {
      return <div key={idx} className="h-2" />;
    }

    return (
      <p key={idx} className="leading-relaxed my-1 text-slate-200/90">
        {renderedParts}
      </p>
    );
  });
}

export default function AiAssistant() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or synchronize default greeting
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = isAr
        ? "أهلاً بك في جاردن سيتي بروبرتيز. أنا مستشارك العقاري الذكي المدعوم بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم في استكشاف العقارات، التقييم المعتمد، أو الاستثمار في سلطنة عُمان؟"
        : "Welcome to Garden City Properties. I am your AI Real Estate Advisor. How may I assist you with luxury properties, certified valuation, or property investment in Oman today?";

      setMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          content: welcomeText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [isAr, messages.length]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const messageContent = (textToSend || input).trim();
      if (!messageContent || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updatedHistory = [...messages, userMessage];
      setMessages(updatedHistory);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/ai-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedHistory
              .filter(
                (m) =>
                  m.id !== "welcome-msg" &&
                  !m.isError &&
                  m.content &&
                  m.content.trim().length > 0
              )
              .map((m) => ({
                role: m.role,
                content: m.content.trim(),
              })),
            locale: language,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to get AI response.");
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (!isOpen) {
          setHasUnread(true);
        }
      } catch (err: any) {
        console.error("[AiAssistant Technical Error]:", err);

        const errorMessage: Message = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: isAr
            ? "يشهد المساعد العقاري الذكي طلباً مرتفعاً حالياً. يرجى استكشاف مشاريعنا وعقاراتنا الحالية في مسقط أو التواصل مباشرة مع فريقنا الاستشاري عبر واتساب على الرقم 97300200 968+."
            : "Our AI advisory assistant is currently experiencing high demand. Please explore our live properties in Muscat or reach out directly to our advisory team via WhatsApp at +968 97300200.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, language, isOpen, isAr]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    const welcomeText = isAr
      ? "أهلاً بك في جاردن سيتي بروبرتيز. أنا مستشارك العقاري الذكي. كيف يمكنني مساعدتك في عقارات واستشارات سلطنة عُمان؟"
      : "Welcome to Garden City Properties. I am your AI Real Estate Advisor. How may I assist you with properties, valuation, or investment in Oman today?";

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const currentPrompts = isAr ? QUICK_PROMPTS.ar : QUICK_PROMPTS.en;

  return (
    <aside
      aria-label="AI Real Estate Assistant"
      className="fixed bottom-6 end-6 z-50 flex flex-col items-end"
      dir={isAr ? "rtl" : "ltr"}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-3 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#070b1e]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(56,189,248,0.2)] w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] sm:max-h-[620px] ${
              isAr ? "font-[family-name:var(--font-cairo)]" : "font-sans"
            }`}
          >
            {/* Header */}
            <header className="relative flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.4)]">
                  <Sparkles className="h-5 w-5" />
                  {/* Live Online Badge */}
                  <span className="absolute -top-0.5 -end-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    {isAr ? "المستشار العقاري الذكي" : "AI Real Estate Advisor"}
                  </h2>
                  <p className="text-[11px] text-sky-300/90 font-medium">
                    {isAr ? "جاردن سيتي بروبرتيز · عُمان" : "Garden City Properties · Oman"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset Conversation */}
                <button
                  type="button"
                  onClick={resetChat}
                  title={isAr ? "بدء محادثة جديدة" : "New Chat"}
                  aria-label={isAr ? "بدء محادثة جديدة" : "New Chat"}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                {/* Close/Minimize */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title={isAr ? "إغلاق النافذة" : "Close chat"}
                  aria-label={isAr ? "إغلاق النافذة" : "Close chat"}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      isAssistant ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-md ${
                        isAssistant
                          ? "bg-white/5 border border-white/10 text-slate-100 rounded-tl-sm"
                          : "bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-medium rounded-tr-sm"
                      }`}
                    >
                      <div className="prose prose-invert prose-sm max-w-none">
                        {formatMessageText(msg.content)}
                      </div>

                      {/* Interactive Quick Action Buttons on Error / High Demand */}
                      {msg.isError && (
                        <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                          <a
                            href="https://wa.me/message/ZL2BXWHCXFCXN1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 transition-all hover:bg-emerald-500/25 hover:border-emerald-300 hover:scale-105 active:scale-95"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{isAr ? "واتساب مباشر" : "Direct WhatsApp"}</span>
                          </a>

                          <a
                            href="tel:+96897300200"
                            className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 px-3 py-1.5 text-[11px] font-semibold text-sky-200 transition-all hover:bg-sky-500/20 hover:border-sky-300 hover:scale-105 active:scale-95"
                          >
                            <Phone className="h-3 w-3 text-sky-400" />
                            <span>+968 97300200</span>
                          </a>

                          <a
                            href={`/${language}/projects/`}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95"
                          >
                            <span>{isAr ? "استعراض العقارات" : "Explore Properties"}</span>
                          </a>
                        </div>
                      )}

                      <span
                        className={`mt-1.5 block text-[10px] ${
                          isAssistant
                            ? "text-slate-400 text-end"
                            : "text-slate-950/70 text-end"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isAssistant && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-white/5 border border-white/10 rounded-2xl w-fit">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                  <span>
                    {isAr
                      ? "جاري إعداد الرد العقاري..."
                      : "Consulting advisor intelligence..."}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  {isAr ? "أسئلة شائعة وسريعة:" : "Suggested topics:"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentPrompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200 transition-all hover:bg-sky-400/20 hover:border-sky-400 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Human Contact Callout */}
            <div className="border-t border-white/5 bg-slate-950/60 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-sky-400" />
                <span>+968 97300200</span>
              </span>
              <a
                href="https://wa.me/message/ZL2BXWHCXFCXN1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-300 font-semibold hover:underline"
              >
                <span>{isAr ? "واتساب مباشر" : "Direct WhatsApp"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="border-t border-white/10 bg-slate-950/90 p-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAr
                    ? "اسأل عن العقارات، التقييم، أو الاستثمار..."
                    : "Ask about properties, valuation, Muscat..."
                }
                disabled={isLoading}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-sky-400/60 focus:bg-white/10 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label={isAr ? "إرسال الرسالة" : "Send message"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-bold shadow-[0_0_16px_rgba(56,189,248,0.4)] transition hover:shadow-[0_0_24px_rgba(56,189,248,0.6)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={
          isOpen
            ? isAr
              ? "تصغير نافذة المساعد الذكي"
              : "Close AI Assistant"
            : isAr
            ? "فتح المستشار العقاري الذكي"
            : "Open AI Real Estate Assistant"
        }
        className="group relative flex h-14 items-center gap-2.5 rounded-full border border-sky-400/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-2 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-sky-400 hover:shadow-[0_0_36px_rgba(56,189,248,0.55)]"
      >
        {/* Glowing pulse ring */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-sky-400/20 duration-1000" />

        {/* Gradient Icon Badge */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300 text-slate-950 font-bold shadow-md">
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </div>

        {/* Text Label on Desktop */}
        <span
          className={`hidden sm:inline-block font-semibold text-xs tracking-wide text-white group-hover:text-sky-300 transition-colors ${
            isAr ? "font-[family-name:var(--font-cairo)]" : "font-[family-name:var(--font-outfit)]"
          }`}
        >
          {isOpen
            ? isAr
              ? "تصغير المساعد"
              : "Close Assistant"
            : isAr
            ? "المستشار العقاري الذكي"
            : "AI Real Estate Advisor"}
        </span>

        {/* Online Indicator Badge */}
        {!isOpen && (
          <span className="relative flex h-2.5 w-2.5 me-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        )}

        {/* Unread indicator dot */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -start-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg animate-pulse">
            1
          </span>
        )}
      </motion.button>
    </aside>
  );
}
