import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSupabase } = vi.hoisted(() => ({ mockSupabase: { from: vi.fn() } }))

vi.mock("@/lib/supabase", () => ({ supabase: mockSupabase }))

import { cartService } from "../cartService"

function mockChain(result: unknown) {
  mockSupabase.from.mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  } as any)
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("getCartItems surfaces fetch errors instead of silently returning []", async () => {
    mockChain({ data: null, error: new Error("db down") })
    const result = await cartService.getCartItems("user-1")
    expect(result).toEqual({ data: null, error: new Error("db down") })
    expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
  })
})