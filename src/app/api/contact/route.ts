import { z } from "zod";
import { sendContactEmail } from "@/lib/plunk";
import { getSupabase } from "@/lib/supabase";
import { parseJsonBody, apiSuccess, apiError } from "@/lib/api-utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000),
  projectType: z.string().max(80).optional(),
  budget: z.string().max(40).optional(),
  timeline: z.string().max(40).optional(),
  source: z.string().max(200).optional(),
});

/* simple in-memory rate limit: 3 messages / 10 min per client */
const hits = new Map<string, number[]>();
function rateLimited(key: string, limit = 3, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return true;
  arr.push(now);
  hits.set(key, arr);
  return false;
}

export async function POST(req: Request) {
  const { data: body, error: jsonError } = await parseJsonBody(req);
  if (jsonError) return jsonError;

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("Validation failed", 422, { issues: parsed.error.flatten() });
  }

  // honeypot - bots fill the hidden "company" field
  const raw = body as Record<string, unknown>;
  if (typeof raw?.company === "string" && raw.company.length > 0) {
    return apiSuccess({ mock: true }); // pretend success
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return apiError("Too many messages - please try again in a few minutes.", 429);
  }

  // 1. Store lead in Supabase FIRST so inquiries are never lost
  let dbSaved = false;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("contacts").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        project_type: parsed.data.projectType ?? null,
        budget: parsed.data.budget ?? null,
        timeline: parsed.data.timeline ?? null,
        source: parsed.data.source ?? null,
      });
      if (!error) {
        dbSaved = true;
      } else {
        console.error("[contact] Supabase save error:", error.message);
      }
    } catch (err) {
      console.error("[contact] Supabase save threw:", err);
    }
  }

  // 2. Dispatch email notification to site owner
  let emailSent = false;
  let emailMock = false;
  try {
    const result = await sendContactEmail(parsed.data);
    emailSent = result.ok && !result.mock;
    emailMock = Boolean(result.mock);
  } catch (err) {
    console.error("[contact] sendContactEmail threw:", err);
  }

  return apiSuccess({
    saved: dbSaved,
    emailSent,
    mock: emailMock,
  });
}

