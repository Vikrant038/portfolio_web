import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { SITE_CONFIG } from "@/lib/constants";

export async function GET() {
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasPlunk = Boolean(process.env.PLUNK_API_KEY);
  const hasWebhook = Boolean(process.env.NOTIFY_WEBHOOK_URL);
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return NextResponse.json(
    {
      ok: true,
      service: "luxe-portfolio",
      time: new Date().toISOString(),
      emailStatus: {
        activeProvider: hasResend ? "Resend" : hasPlunk ? "Plunk" : "None (Mock/Console)",
        RESEND_API_KEY: hasResend,
        PLUNK_API_KEY: hasPlunk,
        NOTIFY_WEBHOOK_URL: hasWebhook,
        destination: process.env.CONTACT_EMAIL ?? process.env.RESEND_RECIPIENT ?? SITE_CONFIG.email,
      },
      supabaseConfigured: hasSupabase,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
