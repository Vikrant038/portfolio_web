import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(1).max(60).default("Anonymous"),
  quote: z.string().min(10).max(400),
});

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
      { error: "Feedback must be at least a sentence." },
      { status: 422 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.log("[feedback] Supabase not configured - logged:", parsed.data);
    return NextResponse.json({ ok: true, mock: true });
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
    return NextResponse.json({ error: "Couldn't save feedback" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
