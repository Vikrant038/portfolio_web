import { supabase } from "@/lib/supabase"
import type { CartItem } from "@/types"

export const cartService = {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
    color: string
  ) {
    try {
      const { data, error } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: productId,
        quantity,
        size,
        color,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getCartItems(userId: string) {
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

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateCartItem(itemId: string, quantity: number) {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", itemId)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async removeCartItem(itemId: string) {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async clearCart(userId: string) {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },
}
