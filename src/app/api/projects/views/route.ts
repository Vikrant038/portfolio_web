import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { parseJsonBody, apiSuccess } from "@/lib/api-utils";

const schema = z.object({ id: z.string().min(1).max(100) });

export async function POST(req: Request) {
  const { data: body } = await parseJsonBody(req);
  if (!body) return apiSuccess();

  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiSuccess();

  const supabase = getSupabase();
  if (!supabase) return apiSuccess({ mock: true });

  const { error } = await supabase.rpc("increment_project_views", {
    project_id: parsed.data.id,
  });
  if (error) {
    // table/rpc may not exist yet - degrade silently
    return apiSuccess({ mock: true });
  }

  return apiSuccess();
}
