import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSupabase } = vi.hoisted(() => ({ mockSupabase: { from: vi.fn() } }))

vi.mock("@/lib/supabase", () => ({ supabase: mockSupabase }))

import { cartService } from "../cartService"

/**
 * Builds a chainable supabase query mock whose terminal call
 * (eq / insert) resolves with `result`. Returns the chain so tests
 * can assert on the individual builder calls (select/eq/insert/update/delete).
 */
function mockChain(result: unknown) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }
  mockSupabase.from.mockReturnValue(chain)
  return chain
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("addToCart", () => {
    it("inserts a cart_items row and returns { data, error: null } on success", async () => {
      const inserted = {
        id: "cart-1",
        user_id: "user-1",
        product_id: "prod-1",
        quantity: 2,
        size: "M",
        color: "Black",
      }
      const chain = mockChain({ data: inserted, error: null })

      const result = await cartService.addToCart("user-1", "prod-1", 2, "M", "Black")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        product_id: "prod-1",
        quantity: 2,
        size: "M",
        color: "Black",
      })
      expect(result).toEqual({ data: inserted, error: null })
    })

    it("returns { data: null, error } when the insert fails", async () => {
      const error = new Error("insert failed")
      mockChain({ data: null, error })

      const result = await cartService.addToCart("user-1", "prod-1", 1, "S", "Red")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("getCartItems", () => {
    it("selects the user's cart_items rows and returns { data, error: null } on success", async () => {
      const items = [
        {
          id: "cart-1",
          user_id: "user-1",
          product_id: "prod-1",
          quantity: 2,
          size: "M",
          color: "Black",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ]
      const chain = mockChain({ data: items, error: null })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.select).toHaveBeenCalled()
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ data: items, error: null })
    })

    it("returns { data: null, error } instead of a silent [] when the fetch fails", async () => {
      const error = new Error("db down")
      const chain = mockChain({ data: null, error })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.select).toHaveBeenCalled()
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("updateCartItem", () => {
    it("updates the row by id and returns { data, error: null } on success", async () => {
      const updated = { id: "cart-1", quantity: 3 }
      const chain = mockChain({ data: updated, error: null })

      const result = await cartService.updateCartItem("cart-1", 3)

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.update).toHaveBeenCalledWith({
        quantity: 3,
        updated_at: expect.any(String),
      })
      expect(chain.eq).toHaveBeenCalledWith("id", "cart-1")
      expect(result).toEqual({ data: updated, error: null })
    })

    it("returns { data: null, error } when the update fails", async () => {
      const error = new Error("update failed")
      mockChain({ data: null, error })

      const result = await cartService.updateCartItem("cart-1", 3)

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("removeCartItem", () => {
    it("deletes the row by id and returns { error: null } on success", async () => {
      const chain = mockChain({ data: null, error: null })

      const result = await cartService.removeCartItem("cart-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.delete).toHaveBeenCalled()
      expect(chain.eq).toHaveBeenCalledWith("id", "cart-1")
      expect(result).toEqual({ error: null })
    })

    it("returns { error } when the delete fails", async () => {
      const error = new Error("delete failed")
      mockChain({ data: null, error })

      const result = await cartService.removeCartItem("cart-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ error })
    })
  })

  describe("clearCart", () => {
    it("deletes all of the user's rows and returns { error: null } on success", async () => {
      const chain = mockChain({ data: null, error: null })

      const result = await cartService.clearCart("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.delete).toHaveBeenCalled()
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ error: null })
    })

    it("returns { error } when the delete fails", async () => {
      const error = new Error("clear failed")
      mockChain({ data: null, error })

      const result = await cartService.clearCart("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ error })
    })
  })
})
