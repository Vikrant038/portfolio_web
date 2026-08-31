import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/plunk";
import { SITE_CONFIG } from "@/lib/constants";
import { parseJsonBody, apiSuccess, apiError } from "@/lib/api-utils";

const schema = z.object({
  name: z
    .string()
    .max(60, "Name must be under 60 characters")
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : "Anonymous")),
  quote: z
    .string()
    .min(5, "Feedback should be at least 5 characters.")
    .max(500, "Feedback must be under 500 characters."),
});

export async function POST(req: Request) {
  const { data: body, error: jsonError } = await parseJsonBody(req);
  if (jsonError) return jsonError;

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Please provide valid feedback.";
    return apiError(firstError, 422);
  }

  const { name, quote } = parsed.data;
  let savedId = "fb-" + Date.now();
  const avatar = "/avatars/priya.svg";

  // ── 1. Save to Supabase (when configured) ───────────────────────────────
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          quote,
          name,
          role: "Community feedback",
          rating: 5,
          status: "approved",
          avatar,
        })
        .select()
        .single();

      if (error) {
        console.error("[feedback] Supabase insert failed:", error.message);
      } else if (data?.id) {
        savedId = data.id;
      }
    } catch (err) {
      console.error("[feedback] Supabase insert threw:", err);
    }
  } else {
    console.log("[feedback] Supabase not configured – feedback logged:", { name, quote });
  }

  // ── 2. Email notification to site owner ─────────────────────────────────
  try {
    await sendEmail({
      to: SITE_CONFIG.email,
      subject: `New portfolio feedback from ${name}`,
      body: `Name: ${name}\n\nFeedback:\n${quote}\n\n---\nReview it in the admin panel at /admin`,
      html: `
        <div style="font-family:system-ui,sans-serif;padding:24px;background:#0b0b12;color:#f2f2f5;border-radius:16px">
          <h2 style="margin:0 0 4px;color:#2dd4cd">New feedback on your portfolio</h2>
          <p style="margin:0 0 16px;color:#9b9ba8">From: <strong style="color:#f2f2f5">${escapeHtml(name)}</strong></p>
          <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #2dd4cd;font-style:italic;color:#f2f2f5">
            ${escapeHtml(quote)}
          </blockquote>
          <hr style="border-color:rgba(255,255,255,0.1);margin:20px 0"/>
          <p style="color:#9b9ba8;font-size:12px">Review it at <a href="${SITE_CONFIG.url}/admin" style="color:#2dd4cd">${SITE_CONFIG.url}/admin</a></p>
        </div>`,
    });
  } catch (err) {
    console.error("[feedback] email notification failed:", err);
  }

  return apiSuccess({
    testimonial: {
      id: savedId,
      name,
      quote,
      role: "Community feedback",
      rating: 5,
      avatar,
    },
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
