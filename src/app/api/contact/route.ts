import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/plunk";
import { getSupabase } from "@/lib/supabase";

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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // honeypot - bots fill the hidden "company" field
  const raw = body as Record<string, unknown>;
  if (typeof raw.company === "string" && raw.company.length > 0) {
    return NextResponse.json({ ok: true, mock: true }); // pretend success
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages - please try again in a few minutes." },
      { status: 429 }
    );
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  // store the lead for the admin dashboard when Supabase is configured
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("contacts").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        project_type: parsed.data.projectType ?? null,
        budget: parsed.data.budget ?? null,
        timeline: parsed.data.timeline ?? null,
        source: parsed.data.source ?? null,
      });
    } catch {
      /* lead storage must never break the send */
    }
  }

  return NextResponse.json({ ok: true, mock: result.mock });
}
