import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { parseJsonBody, apiSuccess, apiError } from "@/lib/api-utils";

const schema = z.object({
  name: z.string().min(1).max(60).default("Anonymous"),
  quote: z.string().min(10).max(400),
});

export async function POST(req: Request) {
  const { data: body, error: jsonError } = await parseJsonBody(req);
  if (jsonError) return jsonError;

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("Feedback must be at least a sentence.", 422);
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.log("[feedback] Supabase not configured - logged:", parsed.data);
    return apiSuccess({ mock: true });
  }

  const { error } = await supabase.from("testimonials").insert({
    quote: parsed.data.quote,
    name: parsed.data.name,
    role: "Community feedback",
    rating: 5,
    status: "pending",
  });
  if (error) {
    console.error("[feedback] insert failed:", error.message);
    return apiError("Couldn't save feedback", 500);
  }

  return apiSuccess();
}
