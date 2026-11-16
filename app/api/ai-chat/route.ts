import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are the official AI Real Estate Advisor and Senior Advisory Concierge for Garden City Properties (شركة جاردن سيتي بروبرتيز), a premier real estate firm in the Sultanate of Oman (official website: www.gardencityproperties.net).

### 1. STRICT DOMAIN RESTRICTION (OMAN REAL ESTATE & GARDEN CITY PROPERTIES ONLY):
- Your expertise is STRICTLY and EXCLUSIVELY limited to real estate brokerage, certified bank-compliant property valuation, turnkey property management, and real estate investments in the Sultanate of Oman with Garden City Properties.
- Under NO circumstances should you answer off-topic queries (such as sports, politics, weather outside Oman, coding, software, general trivia, movies, recipes, pop culture, non-Oman property, math, or personal topics).
- If the user asks about ANY off-topic or unrelated subject, you MUST politely and firmly decline to answer and redirect them back to Omani real estate or invite them to speak with our advisory team.
- You MUST use the following boundary response for any off-topic queries:
  - English: "My expertise is focused exclusively on real estate brokerage, valuation, and property investment in Oman with Garden City Properties. How can I assist you with your property goals today?"
  - Arabic: "يقتصر اختصاصي حصرياً على خدمات الوساطة العقارية، التقييم المعتمد، وإدارة واستثمار العقارات في سلطنة عُمان مع شركة جاردن سيتي بروبرتيز. كيف يمكنني مساعدتك في أهدافك العقارية اليوم؟"

### 2. CONCISE & DIRECT OUTPUT RULES:
- STRICT BREVITY: Deliver sharp, highly focused, and direct answers without filler.
- NO FLUFF: Eliminate long narrative analogies, lengthy historical essays, repetitive preamble, and multi-paragraph tangents.
- COMPACT FORMAT: Keep replies compact — typically 1 to 2 short paragraphs or 3 to 4 crisp bullet points maximum.
- CALL TO ACTION: Conclude with a crisp, relevant next step or official contact detail (Phone / WhatsApp: +968 97300200 / +968 77304446, or Office No 11, Mawelah North, Muscat).
- ACCURACY: Never fabricate pricing or guaranteed financial returns. Invite direct consultations for certified valuations and bespoke listings.

### 3. CORPORATE PROFILE & CORE PRACTICES:
- Established: 2007 in Muscat, Sultanate of Oman.
- Leadership: Founder & Chairman Mohamed Al Harthy (18+ years industry experience in brokerage, certified valuation, property management, and quantity surveying) and General Manager Adam Al Harthy.
- Key Practice Areas:
  1. Real Estate Brokerage: Luxury villas, townhouses, penthouses, apartments, commercial assets, and land plots (Muscat, Al Mouj, Shatti Al Qurum, Madinat Al Sultan Qaboos, Mawelah, Bousher, Jebel Sifah).
  2. Certified Property Valuation: Bank-approved valuations compliant with Ministry of Housing & Urban Planning regulations and RICS standards.
  3. Turnkey Property Management: Full tenant vetting, lease administration, rent collection, and facility maintenance to maximize net yield.
  4. Real Estate Investment Advisory: Feasibility studies, market entry, and guidance on foreign ownership in Integrated Tourism Complexes (ITCs).
  5. Quantity Surveying: Cost control, BOQ evaluation, and construction audits.

### 4. CONTACT & LOCATION DETAILS:
- Address: Office No 11, Po Box 275, Pc 117, Mawelah North, Muscat, Sultanate of Oman.
- Phone / Direct Contact: +968 97300200 / +968 77304446
- Email: info@gardencityproperties.net
- Website: www.gardencityproperties.net
- Google Maps: https://maps.app.goo.gl/2hPDjkPfGt424wNA7?g_st=aw

### 5. LANGUAGE & TONE:
- Immediately match the user's language: Refined, professional modern Arabic (اللغة العربية الفصحى الراقية) if the user asks in Arabic; polished, prestigious corporate English if in English.
- Tone: Welcoming, courteous, expert, transparent, and direct.`;

/**
 * Standard Google Gen AI Client
 * Automatically manages API Key auth (query param + x-goog-api-key) and OAuth Bearer tokens (ya29... / Bearer)
 */
class GoogleGenAiClient {
  private key: string;
  private isOAuth: boolean;

  constructor(apiKey?: string) {
    const raw =
      apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!raw || typeof raw !== "string" || !raw.trim()) {
      throw new Error(
        "Google Gen AI Client error: GEMINI_API_KEY (or NEXT_PUBLIC_GEMINI_API_KEY) is not defined in environment variables."
      );
    }

    this.key = raw.trim().replace(/^["']|["']$/g, "");
    this.isOAuth = this.key.startsWith("ya29.") || this.key.startsWith("Bearer ");
  }

  public getMaskedKey(): string {
    if (this.key.length <= 8) return "********";
    return `${this.key.slice(0, 4)}...${this.key.slice(-4)}`;
  }

  public async generateContent({
    model,
    contents,
    systemInstruction,
    generationConfig,
    signal,
  }: {
    model: string;
    contents: Array<{ role: "user" | "model"; parts: [{ text: string }] }>;
    systemInstruction?: string;
    generationConfig?: {
      temperature?: number;
      maxOutputTokens?: number;
      topP?: number;
    };
    signal?: AbortSignal;
  }) {
    const endpoint = this.isOAuth
      ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
      : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          this.key
        )}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.isOAuth) {
      headers["Authorization"] = this.key.startsWith("Bearer ")
        ? this.key
        : `Bearer ${this.key}`;
    } else {
      headers["x-goog-api-key"] = this.key;
    }

    const payload: Record<string, any> = {
      contents,
      generationConfig: {
        temperature: generationConfig?.temperature ?? 0.7,
        maxOutputTokens: generationConfig?.maxOutputTokens ?? 1024,
        topP: generationConfig?.topP ?? 0.95,
      },
    };

    if (systemInstruction) {
      payload.system_instruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    return fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Initialize Google Gen AI Client cleanly from environment variables
    let client: GoogleGenAiClient;
    try {
      client = new GoogleGenAiClient();
    } catch (clientErr: any) {
      console.error("[AI Chat Auth Error] Client initialization failed:", clientErr);
      return NextResponse.json(
        { error: clientErr.message || "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // 2. Parse and validate incoming messages
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid payload: 'messages' array is required." },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = body.messages;
    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Empty messages array." },
        { status: 400 }
      );
    }

    // 3. Build strictly valid alternating conversation sequence for Google Gemini
    // Gemini API requires:
    // a) Conversation history MUST begin with a "user" message.
    // b) Roles must alternate: user -> model -> user -> model.
    // c) System instructions belong in system_instruction, not as a chat role.
    const contents: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];
    let hasEncounteredFirstUser = false;

    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string") continue;
      const text = msg.content.trim();
      if (!text) continue;

      // Ignore client system messages; system instructions are configured in system_instruction
      if (msg.role === "system") continue;

      // Drop any greeting or leading assistant messages until the first user message appears
      if (!hasEncounteredFirstUser) {
        if (msg.role !== "user") continue;
        hasEncounteredFirstUser = true;
      }

      const role: "user" | "model" =
        msg.role === "assistant" ? "model" : "user";

      // Gemini requires alternating roles. If consecutive messages share the same role, merge them.
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }

    // Ensure conversation contains at least one valid user message
    if (contents.length === 0 || contents[0].role !== "user") {
      return NextResponse.json(
        { error: "Conversation must contain at least one user message." },
        { status: 400 }
      );
    }

    // 4. Model Selection & Fast Cascade:
    // If GEMINI_MODEL is set, try that first.
    // If that model is unavailable on this key/tier (e.g. 404), seamlessly cascade to verified models.
    const envModel = process.env.GEMINI_MODEL?.trim();
    const candidateModels = Array.from(
      new Set([
        envModel,
        "gemini-3.5-flash-lite", // Verified 200 OK with provided key
        "gemini-1.5-flash",      // Standard production model for standard developer keys
        "gemini-3.5-flash",
      ].filter(Boolean) as string[])
    );

    let lastError: Error | null = null;
    let lastStatusCode: number = 500;
    let replyText: string | null = null;

    // 5. Query Gemini with candidate model cascade
    for (const model of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await client.generateContent({
          model,
          contents,
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
            topP: 0.9,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          lastStatusCode = response.status;
          const errData = await response.json().catch(() => ({}));
          const errMsg =
            errData?.error?.message ||
            `Gemini API HTTP ${response.status}: ${response.statusText}`;

          console.error(
            `[AI Chat API Error] Model "${model}" failed (HTTP ${response.status}):`,
            JSON.stringify(errData, null, 2)
          );

          lastError = new Error(errMsg);

          // If model is unsupported on this tier (404), immediately try next model
          if (response.status === 404) {
            continue;
          }

          // If 503 or transient service spike, try next candidate
          if (response.status === 503) {
            continue;
          }

          break;
        }

        const data = await response.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          replyText = text;
          break;
        }
      } catch (err: any) {
        console.error(`[AI Chat API Exception] Model "${model}":`, err);
        lastError = err;
      }
    }

    if (!replyText) {
      console.error("[AI Chat API Failure] All candidate models failed. Last error:", lastError);
      return NextResponse.json(
        {
          error:
            lastError?.message ||
            "Unable to generate response from Gemini AI. Please check server logs.",
          details: {
            status: lastStatusCode,
            keyConfigured: true,
            maskedKey: client.getMaskedKey(),
          },
        },
        { status: lastStatusCode || 502 }
      );
    }

    return NextResponse.json({
      role: "assistant",
      content: replyText,
    });
  } catch (error: any) {
    console.error("[AI Chat API Unhandled Exception]:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
