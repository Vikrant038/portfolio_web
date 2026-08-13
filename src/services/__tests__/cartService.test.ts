import { describe, it, expect, vi, beforeEach } from "vitest"
import type { CartItem } from "@/types"

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: {
    from: vi.fn()
  }
}))

vi.mock("@/lib/supabase", () => ({
  supabase: mockSupabase
}))

import { cartService } from "../cartService"

function mockChain(result: unknown) {
  const mock = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }
  mockSupabase.from.mockReturnValue(mock)
  return mock
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("addToCart", () => {
    it("should successfully add an item to cart", async () => {
      const mockData = { id: "1" }
      mockChain({ data: mockData, error: null })
      
      const result = await cartService.addToCart("user-1", "product-1", 1, "M", "red")
      
      expect(result).toEqual({ data: mockData, error: null })
      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      const insertCall = mockSupabase.from("cart_items").insert
      expect(insertCall).toHaveBeenCalledWith({
        user_id: "user-1",
        product_id: "product-1",
        quantity: 1,
        size: "M",
        color: "red",
      })
    })
    
    it("should handle errors when adding to cart", async () => {
      const mockError = new Error("DB error")
      mockChain({ data: null, error: mockError })
      
      const result = await cartService.addToCart("user-1", "product-1", 1, "M", "red")
      
      expect(result).toEqual({ data: null, error: mockError })
    })
  })
  
  describe("getCartItems", () => {
    it("should successfully fetch cart items", async () => {
      const mockItems: CartItem[] = [
        {
          id: "1",
          user_id: "user-1",
          product_id: "product-1",
          quantity: 1,
          size: "M",
          color: "red",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          product: {
            id: "product-1",
            name: "Test Product",
            price: 99.99,
            description: "Test description",
            image_url: "https://example.com/image.jpg",
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
            category: "shoes",
            stock: 10,
          }
        }
      ]
      
      const mock = mockChain({ data: mockItems, error: null })
      
      const result = await cartService.getCartItems("user-1")
      
      expect(result).toEqual({ data: mockItems, error: null })
      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      const selectCall = mockSupabase.from("cart_items").select
      expect(selectCall).toHaveBeenCalledWith(
        `\n          *,\n          product:products(*)\n        `
      )
      const eqCall = mockSupabase.from("cart_items").select().eq
      expect(eqCall).toHaveBeenCalledWith("user_id", "user-1")
    })
    
    it("should handle errors when fetching cart items", async () => {
      const mockError = new Error("DB error")
      mockChain({ data: null, error: mockError })
      
      const result = await cartService.getCartItems("user-1")
      
      expect(result).toEqual({ data: null, error: mockError })
    })
  })
  
  describe("updateCartItem", () => {
    it("should successfully update a cart item", async () => {
      const mockData = { id: "1", quantity: 2 }
      mockChain({ data: mockData, error: null })
      
      const result = await cartService.updateCartItem("1", 2)
      
      expect(result).toEqual({ data: mockData, error: null })
      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      const updateCall = mockSupabase.from("cart_items").update
      expect(updateCall).toHaveBeenCalledWith({
        quantity: 2,
        updated_at: expect.any(String)
      })
      const eqCall = mockSupabase.from("cart_items").update().eq
      expect(eqCall).toHaveBeenCalledWith("id", "1")
    })
    
    it("should handle errors when updating a cart item", async () => {
      const mockError = new Error("DB error")
      mockChain({ data: null, error: mockError })
      
      const result = await cartService.updateCartItem("1", 2)
      
      expect(result).toEqual({ data: null, error: mockError })
    })
  })
  
  describe("removeCartItem", () => {
    it("should successfully remove a cart item", async () => {
      const mockResult = { data: null, error: null }
      mockChain(mockResult)
      
      const result = await cartService.removeCartItem("1")
      
      expect(result).toEqual({ error: null })
      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      const deleteCall = mockSupabase.from("cart_items").delete
      expect(deleteCall).toHaveBeenCalled()
      const eqCall = mockSupabase.from("cart_items").delete().eq
      expect(eqCall).toHaveBeenCalledWith("id", "1")
    })
    
    it("should handle errors when removing a cart item", async () => {
      const mockError = new Error("DB error")
      mockChain({ data: null, error: mockError })
      
      const result = await cartService.removeCartItem("1")
      
      expect(result).toEqual({ error: mockError })
    })
  })
  
  describe("clearCart", () => {
    it("should successfully clear a user's cart", async () => {
      const mockResult = { data: null, error: null }
      mockChain(mockResult)
      
      const result = await cartService.clearCart("user-1")
      
      expect(result).toEqual({ error: null })
      expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
      const deleteCall = mockSupabase.from("cart_items").delete
      expect(deleteCall).toHaveBeenCalled()
      const eqCall = mockSupabase.from("cart_items").delete().eq
      expect(eqCall).toHaveBeenCalledWith("user_id", "user-1")
    })
    
    it("should handle errors when clearing a cart", async () => {
      const mockError = new Error("DB error")
      mockChain({ data: null, error: mockError })
      
      const result = await cartService.clearCart("user-1")
      
      expect(result).toEqual({ error: mockError })
    })
  })
})