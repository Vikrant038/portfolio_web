import { NextResponse } from "next/server";

export async function parseJsonBody<T = unknown>(req: Request): Promise<{ data: T | null; error: NextResponse | null }> {
  try {
    const data = (await req.json()) as T;
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}

export function apiSuccess<T extends Record<string, unknown>>(data?: T, status = 200) {
  return NextResponse.json({ ok: true, ...(data ?? {}) }, { status });
}

export function apiError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...(extra ?? {}) }, { status });
}
