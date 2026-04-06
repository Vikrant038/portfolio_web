import { supabase } from "@/lib/supabase"
import type { Product, Category } from "@/types"

export const productService = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  },

  async getProducts(filters?: {
    featured?: boolean
    inStock?: boolean
    categoryId?: string
  }): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*")

      if (filters?.featured) {
        query = query.eq("featured", true)
      }
      if (filters?.inStock) {
        query = query.eq("in_stock", true)
      }
      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  },

  async getProductImages(productId: string) {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching product images:", error)
      return []
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching products:", error)
      return []
    }
  },
}
