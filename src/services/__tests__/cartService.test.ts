import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: { from: vi.fn() },
}))

vi.mock("@/lib/supabase", () => ({ supabase: mockSupabase }))

import { cartService } from "../cartService"

type ChainResult = { data: unknown; error: unknown }

// Builds a chainable supabase query builder. `insert`, `select`, `update` and
// `delete` return the builder so the real call chains work; the terminal
// `eq`/`insert` resolves with the given `{ data, error }` payload.
function mockChain(result: ChainResult) {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }
  mockSupabase.from.mockReturnValue(query)
  return query
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("addToCart", () => {
    it("inserts a cart item and returns { data, error: null } on success", async () => {
      const row = {
        id: "cart-1",
        user_id: "user-1",
        product_id: "product-1",
        quantity: 2,
        size: "M",
        color: "red",
      }
      const query = mockChain({ data: row, error: null })

      const result = await cartService.addToCart("user-1", "product-1", 2, "M", "red")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(query.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        product_id: "product-1",
        quantity: 2,
        size: "M",
        color: "red",
      })
      expect(result).toEqual({ data: row, error: null })
    })

    it("returns { data: null, error } when the insert fails", async () => {
      const error = new Error("insert failed")
      mockChain({ data: null, error })

      const result = await cartService.addToCart("user-1", "product-1", 1, "S", "blue")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("getCartItems", () => {
    it("selects the user's cart rows joined with products and returns { data, error: null }", async () => {
      const rows = [
        {
          id: "cart-1",
          user_id: "user-1",
          product_id: "product-1",
          quantity: 2,
          size: "M",
          color: "red",
          product: { id: "product-1", name: "Runner" },
        },
      ]
      const query = mockChain({ data: rows, error: null })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(query.select).toHaveBeenCalledWith(expect.stringContaining("product:products"))
      expect(query.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ data: rows, error: null })
    })

    it("returns { data: null, error } when the fetch fails", async () => {
      const error = new Error("db down")
      mockChain({ data: null, error })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("updateCartItem", () => {
    it("updates the item quantity and returns { data, error: null } on success", async () => {
      const updated = { id: "cart-1", quantity: 5 }
      const query = mockChain({ data: updated, error: null })

      const result = await cartService.updateCartItem("cart-1", 5)

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(query.update).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 5, updated_at: expect.any(String) })
      )
      expect(query.eq).toHaveBeenCalledWith("id", "cart-1")
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
    it("deletes the item by id and returns { error: null } on success", async () => {
      const query = mockChain({ data: null, error: null })

      const result = await cartService.removeCartItem("cart-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(query.delete).toHaveBeenCalledWith()
      expect(query.eq).toHaveBeenCalledWith("id", "cart-1")
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
    it("deletes all items for the user and returns { error: null } on success", async () => {
      const query = mockChain({ data: null, error: null })

      const result = await cartService.clearCart("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(query.delete).toHaveBeenCalledWith()
      expect(query.eq).toHaveBeenCalledWith("user_id", "user-1")
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
