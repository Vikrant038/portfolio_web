import { parseJsonBody, apiSuccess } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { data: body } = await parseJsonBody(req);
  if (body) {
    console.log("[web-vitals]", JSON.stringify(body));
  }
  return apiSuccess();
}
