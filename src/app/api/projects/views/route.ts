import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

const schema = z.object({ id: z.string().min(1).max(100) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: true, mock: true });

  const { error } = await supabase.rpc("increment_project_views", {
    project_id: parsed.data.id,
  });
  if (error) {
    // table/rpc may not exist yet - degrade silently
    return NextResponse.json({ ok: true, mock: true });
  }

  return NextResponse.json({ ok: true });
}
