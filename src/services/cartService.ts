import { supabase } from "@/lib/supabase"
import type { CartItem } from "@/types"

type ServiceResult<T> = { data: T | null; error: unknown }
type ErrorOnlyResult = { error: unknown }

export const cartService = {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
    color: string
  ): Promise<ServiceResult<CartItem>> {
    try {
      const { data, error } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: productId,
        quantity,
        size,
        color,
      })

      if (error) return { data: null, error }
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getCartItems(userId: string): Promise<ServiceResult<CartItem[]>> {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(*)
        `
        )
        .eq("user_id", userId)

      if (error) return { data: null, error }
      return { data: (data as CartItem[]) || [], error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<ServiceResult<CartItem>> {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", itemId)

      if (error) return { data: null, error }
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async removeCartItem(itemId: string): Promise<ErrorOnlyResult> {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) return { error }
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async clearCart(userId: string): Promise<ErrorOnlyResult> {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)

      if (error) return { error }
      return { error: null }
    } catch (error) {
      return { error }
    }
  },
}
