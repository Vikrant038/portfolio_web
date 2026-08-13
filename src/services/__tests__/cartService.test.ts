import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSupabase } = vi.hoisted(() => ({ mockSupabase: { from: vi.fn() } }))

vi.mock("@/lib/supabase", () => ({ supabase: mockSupabase }))

import { cartService } from "../cartService"

type ChainKey = "select" | "eq" | "insert" | "update" | "delete"

// Builds a supabase query-builder chain where every builder method returns the
// chain itself, except `terminal`, which resolves with `result`. This mirrors
// the real supabase-js v2 API for the call shapes cartService uses.
function mockChain(terminal: ChainKey, result: unknown) {
  const chain = {
    select: vi.fn(),
    eq: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as Record<ChainKey, ReturnType<typeof vi.fn>>

  for (const key of Object.keys(chain) as ChainKey[]) {
    if (key === terminal) {
      chain[key].mockResolvedValue(result)
    } else {
      chain[key].mockReturnValue(chain)
    }
  }

  mockSupabase.from.mockReturnValue(chain)
  return chain
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("addToCart", () => {
    const payload = {
      user_id: "user-1",
      product_id: "prod-1",
      quantity: 2,
      size: "M",
      color: "red",
    }
    const row = {
      id: "cart-1",
      ...payload,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }

    it("inserts a row with .select() and returns { data, error: null } on success", async () => {
      const chain = mockChain("select", { data: [row], error: null })

      const result = await cartService.addToCart("user-1", "prod-1", 2, "M", "red")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.insert).toHaveBeenCalledWith(payload)
      expect(chain.select).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ data: [row], error: null })
    })

    it("returns { data: null, error } when the insert fails", async () => {
      const error = new Error("insert failed")
      mockChain("select", { data: null, error })

      const result = await cartService.addToCart("user-1", "prod-1", 2, "M", "red")

      expect(result).toEqual({ data: null, error })
    })
  })

  describe("getCartItems", () => {
    const row = {
      id: "cart-1",
      user_id: "user-1",
      product_id: "prod-1",
      quantity: 2,
      size: "M",
      color: "red",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }

    it("fetches the user's cart and returns { data, error: null } on success", async () => {
      const chain = mockChain("eq", { data: [row], error: null })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.select).toHaveBeenCalledWith(
        expect.stringContaining("product:products(*)")
      )
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ data: [row], error: null })
    })

    it("returns an empty data array for an empty cart", async () => {
      mockChain("eq", { data: [], error: null })

      const result = await cartService.getCartItems("user-1")

      expect(result).toEqual({ data: [], error: null })
    })

    it("returns { data: null, error } instead of [] when the fetch fails", async () => {
      const error = new Error("db down")
      mockChain("eq", { data: null, error })

      const result = await cartService.getCartItems("user-1")

      expect(result).toEqual({ data: null, error })
    })
  })

  describe("updateCartItem", () => {
    const row = {
      id: "cart-1",
      user_id: "user-1",
      product_id: "prod-1",
      quantity: 3,
      size: "M",
      color: "red",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
    }

    it("updates the row with .select() and returns { data, error: null } on success", async () => {
      const chain = mockChain("select", { data: [row], error: null })

      const result = await cartService.updateCartItem("cart-1", 3)

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.update).toHaveBeenCalledTimes(1)
      const updateArg = chain.update.mock.calls[0][0] as Record<string, unknown>
      expect(updateArg.quantity).toBe(3)
      expect(typeof updateArg.updated_at).toBe("string")
      expect(chain.eq).toHaveBeenCalledWith("id", "cart-1")
      expect(chain.select).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ data: [row], error: null })
    })

    it("returns { data: null, error } when the update fails", async () => {
      const error = new Error("update failed")
      mockChain("select", { data: null, error })

      const result = await cartService.updateCartItem("cart-1", 3)

      expect(result).toEqual({ data: null, error })
    })
  })

  describe("removeCartItem", () => {
    it("deletes the row and returns { error: null } on success", async () => {
      const chain = mockChain("eq", { data: null, error: null })

      const result = await cartService.removeCartItem("cart-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.delete).toHaveBeenCalledTimes(1)
      expect(chain.eq).toHaveBeenCalledWith("id", "cart-1")
      expect(result).toEqual({ error: null })
    })

    it("returns { error } when the delete fails", async () => {
      const error = new Error("delete failed")
      mockChain("eq", { data: null, error })

      const result = await cartService.removeCartItem("cart-1")

      expect(result).toEqual({ error })
    })
  })

  describe("clearCart", () => {
    it("deletes all the user's rows and returns { error: null } on success", async () => {
      const chain = mockChain("eq", { data: null, error: null })

      const result = await cartService.clearCart("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.delete).toHaveBeenCalledTimes(1)
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ error: null })
    })

    it("returns { error } when the delete fails", async () => {
      const error = new Error("clear failed")
      mockChain("eq", { data: null, error })

      const result = await cartService.clearCart("user-1")

      expect(result).toEqual({ error })
    })
  })
})
