import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSupabase } = vi.hoisted(() => ({ mockSupabase: { from: vi.fn() } }))

vi.mock("@/lib/supabase", () => ({ supabase: mockSupabase }))

import { cartService } from "../cartService"

// Builds a mock supabase query-builder chain. The terminal method of each
// chain (insert for addToCart, eq for the select/update/delete chains)
// resolves with `result`, matching how the service awaits it.
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
    it("inserts the cart item and returns { data, error: null } on success", async () => {
      const chain = mockChain({ data: { id: "item-1" }, error: null })

      const result = await cartService.addToCart("user-1", "prod-1", 2, "10", "red")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        product_id: "prod-1",
        quantity: 2,
        size: "10",
        color: "red",
      })
      expect(result).toEqual({ data: { id: "item-1" }, error: null })
    })

    it("returns { data: null, error } when the insert fails", async () => {
      const error = new Error("insert failed")
      mockChain({ data: null, error })

      const result = await cartService.addToCart("user-1", "prod-1", 1, "9", "blue")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("getCartItems", () => {
    it("selects the user's cart items and returns { data, error: null } on success", async () => {
      const chain = mockChain({
        data: [{ id: "item-1", user_id: "user-1", product_id: "prod-1" }],
        error: null,
      })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.select).toHaveBeenCalledWith(
        expect.stringContaining("product:products(*)")
      )
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({
        data: [{ id: "item-1", user_id: "user-1", product_id: "prod-1" }],
        error: null,
      })
    })

    it("returns { data: null, error } instead of a silent [] when the fetch fails", async () => {
      const error = new Error("db down")
      mockChain({ data: null, error })

      const result = await cartService.getCartItems("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("updateCartItem", () => {
    it("updates the item's quantity and returns { data, error: null } on success", async () => {
      const chain = mockChain({ data: { id: "item-1", quantity: 3 }, error: null })

      const result = await cartService.updateCartItem("item-1", 3)

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.update).toHaveBeenCalledWith({
        quantity: 3,
        updated_at: expect.any(String),
      })
      expect(chain.eq).toHaveBeenCalledWith("id", "item-1")
      expect(result).toEqual({ data: { id: "item-1", quantity: 3 }, error: null })
    })

    it("returns { data: null, error } when the update fails", async () => {
      const error = new Error("update failed")
      mockChain({ data: null, error })

      const result = await cartService.updateCartItem("item-1", 3)

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ data: null, error })
    })
  })

  describe("removeCartItem", () => {
    it("deletes the item by id and returns { error: null } on success", async () => {
      const chain = mockChain({ data: null, error: null })

      const result = await cartService.removeCartItem("item-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.delete).toHaveBeenCalled()
      expect(chain.eq).toHaveBeenCalledWith("id", "item-1")
      expect(result).toEqual({ error: null })
    })

    it("returns { error } when the delete fails", async () => {
      const error = new Error("delete failed")
      mockChain({ data: null, error })

      const result = await cartService.removeCartItem("item-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ error })
    })
  })

  describe("clearCart", () => {
    it("deletes all items for the user and returns { error: null } on success", async () => {
      const chain = mockChain({ data: null, error: null })

      const result = await cartService.clearCart("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(chain.delete).toHaveBeenCalled()
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1")
      expect(result).toEqual({ error: null })
    })

    it("returns { error } when clearing the cart fails", async () => {
      const error = new Error("clear failed")
      mockChain({ data: null, error })

      const result = await cartService.clearCart("user-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      expect(result).toEqual({ error })
    })
  })
})
