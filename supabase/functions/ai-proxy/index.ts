// Supabase Edge Function: ai-proxy
//
// Holds the Cerebras API key server-side so it never ships inside the app binary.
// The client sends only structured parameters; prompts are built here, which
// keeps this endpoint from being usable as a general-purpose LLM proxy.
//
// Deploy:
//   supabase secrets set CEREBRAS_API_KEY=<your key>
//   supabase functions deploy ai-proxy --no-verify-jwt

const CEREBRAS_API_KEY = Deno.env.get("CEREBRAS_API_KEY");
const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const MODEL = "gpt-oss-120b";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const BS_MONTHS = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];

const RITUAL_GUIDE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    items: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
  },
  required: ["title", "items", "steps"],
  additionalProperties: false,
};

const SMART_EVENT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    date: {
      type: "object",
      properties: {
        year: { type: "integer" },
        month: { type: "integer" },
        day: { type: "integer" },
      },
      required: ["year", "month", "day"],
      additionalProperties: false,
    },
    note: { type: "string" },
    reminderEnabled: { type: "boolean" },
    // Strict mode requires every property in `required`, so "absent" is modelled
    // as an explicit null and stripped before returning to the client.
    remindAtTime: { type: ["string", "null"], description: "HH:mm in 24h format, or null" },
  },
  required: ["title", "date", "note", "reminderEnabled", "remindAtTime"],
  additionalProperties: false,
};

interface Spec {
  temperature: number;
  system: string;
  user: string;
  schemaName: string;
  schema: Record<string, unknown>;
}

function ritualGuidePrompt(tithi: string, language: string): Spec {
  const isEn = language === "en";
  return {
    temperature: 0.7,
    schemaName: "ritual_guide",
    schema: RITUAL_GUIDE_SCHEMA,
    system:
      "You are a Nepali cultural and ritual expert. You provide accurate and structured information about Nepali traditions.",
    user: `
        As a Nepali cultural expert, provide a step-by-step ritual guide and a list of required items (Sait-Saaman) for the Tithi: "${tithi}".
        The response must be in ${isEn ? "English" : "Nepali"}.

        Provide a short title for the ritual, the list of required items, and the ordered steps.
    `,
  };
}

function smartEventPrompt(
  input: string,
  d: { year: number; month: number; day: number },
): Spec {
  return {
    temperature: 0.1, // low temperature for high precision
    schemaName: "smart_event",
    schema: SMART_EVENT_SCHEMA,
    system: "You are a precise date parsing assistant. You output only valid JSON.",
    user: `
        As a smart assistant for a Nepali Calendar app, parse the following user input into a structured event.

        Today's Bikram Sambat (BS) date is: ${d.year}-${d.month}-${d.day}.
        Current Year is ${d.year} BS.

        User Input: "${input}"

        Bikram Sambat Months (in order):
${BS_MONTHS.map((m, i) => `        ${i + 1}. ${m}`).join("\n")}

        Guidelines:
        1. Resolve relative dates like "tomorrow", "day after tomorrow", "next Monday" based on the provided current BS date.
        2. If a specific BS month is mentioned (e.g., "15th Baisakh", "Baisakh 15", "Chaitra 26"), map it to the correct month number using the month list above. If no year is mentioned, assume ${d.year} or the next occurrence.
        3. Extract the event title and any additional notes. If there is no separate note, use the original input.
        4. Detect if the user wants a reminder or mentioned a specific time (e.g., "at 10 AM", "remind me").
        5. Set remindAtTime to "HH:mm" in 24h format if a time was detected, otherwise null.
    `,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!CEREBRAS_API_KEY) {
    console.error("CEREBRAS_API_KEY secret is not set on this function");
    return json({ error: "AI service is not configured." }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  let spec: Spec;

  switch (body.action) {
    case "ritual_guide": {
      const { tithi, language } = body as { tithi?: string; language?: string };
      if (typeof tithi !== "string" || !tithi.trim()) {
        return json({ error: "`tithi` is required." }, 400);
      }
      spec = ritualGuidePrompt(tithi.slice(0, 200), language === "en" ? "en" : "np");
      break;
    }
    case "smart_event": {
      const { input, currentBsDate } = body as {
        input?: string;
        currentBsDate?: { year: number; month: number; day: number };
      };
      if (typeof input !== "string" || !input.trim()) {
        return json({ error: "`input` is required." }, 400);
      }
      const d = currentBsDate;
      if (
        !d || typeof d.year !== "number" || typeof d.month !== "number" ||
        typeof d.day !== "number"
      ) {
        return json({ error: "`currentBsDate` is required." }, 400);
      }
      spec = smartEventPrompt(input.slice(0, 500), d);
      break;
    }
    default:
      return json({ error: "Unknown action." }, 400);
  }

  try {
    const res = await fetch(CEREBRAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: spec.system },
          { role: "user", content: spec.user },
        ],
        temperature: spec.temperature,
        stream: false,
        response_format: {
          type: "json_schema",
          json_schema: { name: spec.schemaName, strict: true, schema: spec.schema },
        },
      }),
    });

    if (!res.ok) {
      // Log upstream detail server-side; don't leak provider internals to clients.
      console.error("Cerebras error", res.status, await res.text());
      if (res.status === 429) return json({ error: "AI service is busy. Please try again." }, 429);
      if (res.status === 402) {
        // Cerebras returns 402 when the key belongs to a Team org without a
        // subscription or credit balance. Personal-account keys get the free
        // tier instead. Quota exhaustion is a 429, not this.
        return json({ error: "AI service is not activated." }, 502);
      }
      return json({ error: "AI request failed." }, 502);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return json({ error: "AI returned an empty response." }, 502);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      return json({ error: "AI returned malformed data." }, 502);
    }

    // The schema forces remindAtTime to be present; clients expect it absent when unset.
    if (parsed.remindAtTime === null) delete parsed.remindAtTime;

    return json({ data: parsed });
  } catch (err) {
    console.error("ai-proxy failure", err);
    return json({ error: "AI request failed." }, 502);
  }
});
