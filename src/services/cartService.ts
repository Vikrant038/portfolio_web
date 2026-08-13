import { supabase } from "@/lib/supabase"

export const cartService = {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
    color: string
  ) {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          size,
          color,
        })
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Returns { data, error } so callers can distinguish a failed fetch from an
  // empty cart; no callers exist in this repo yet, so the shape change is safe.
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
      return { data: data ?? [], error: null }
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
        .select()

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
