import { supabase } from "@/lib/supabase"
import type { Product, Category } from "@/types"

export const adminService = {
  async createProduct(product: Omit<Product, "id" | "created_at">) {
    try {
      const { data, error } = await supabase.from("products").insert(product).select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateProduct(productId: string, updates: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", productId)
        .select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async deleteProduct(productId: string) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async uploadProductImage(file: File, productId: string) {
    try {
      const fileName = `${productId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName)

      return { url: urlData.publicUrl, error: null }
    } catch (err) {
      return { url: null, error: err }
    }
  },

  async addProductImage(productId: string, imageUrl: string, displayOrder: number) {
    try {
      const { data, error } = await supabase.from("product_images").insert({
        product_id: productId,
        image_url: imageUrl,
        display_order: displayOrder,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async deleteProductImage(imageId: string) {
    try {
      const { error } = await supabase.from("product_images").delete().eq("id", imageId)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  },

  async createCategory(category: Omit<Category, "id" | "created_at">) {
    try {
      const { data, error } = await supabase.from("categories").insert(category).select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateCategory(categoryId: string, updates: Partial<Category>) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", categoryId)
        .select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  },

  async uploadCategoryImage(file: File, categoryId: string) {
    try {
      const fileName = `categories/${categoryId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from("category-images")
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName)

      return { url: urlData.publicUrl, error: null }
    } catch (err) {
      return { url: null, error: err }
    }
  },
}
