import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Emails a summary of the last 7 days of leads via Plunk.
 * Trigger with a cron: `POST /api/digest` + header `x-digest-token: <DIGEST_TOKEN>`.
 */
export async function POST(req: Request) {
  const expected = process.env.DIGEST_TOKEN;
  const provided = req.headers.get("x-digest-token");

  // Fail closed: require explicit token match
  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const apiKey = process.env.PLUNK_API_KEY;
  if (!supabase || !apiKey) {
    return NextResponse.json(
      { error: "Digest needs Supabase + PLUNK_API_KEY configured" },
      { status: 501 }
    );
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("contacts")
    .select("name, email, project_type, budget, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  const rows = data ?? [];
  const body = rows.length
    ? rows
        .map(
          (r, i) =>
            `${i + 1}. ${r.name} (${r.email})${
              r.project_type ? ` - ${r.project_type}` : ""
            }${r.budget ? `, ${r.budget}` : ""}`
        )
        .join("\n")
    : "No new leads this week.";

  const res = await fetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: process.env.CONTACT_EMAIL ?? SITE_CONFIG.email,
      from: `${SITE_CONFIG.name} Portfolio <${process.env.PLUNK_FROM ?? "no-reply@vikrantyadav.dev"}>`,
      subject: `Weekly digest - ${rows.length} new lead${rows.length === 1 ? "" : "s"}`,
      body,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Digest send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, leads: rows.length });
}
