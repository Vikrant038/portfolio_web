import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/constants";
import { sendEmail } from "@/lib/plunk";

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
  if (!supabase) {
    return NextResponse.json(
      { error: "Digest needs Supabase configured" },
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

  const result = await sendEmail({
    to: process.env.CONTACT_EMAIL ?? SITE_CONFIG.email,
    subject: `Weekly digest - ${rows.length} new lead${rows.length === 1 ? "" : "s"}`,
    body,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Digest send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, leads: rows.length });
}
