import { supabase } from "@/lib/supabase"
import type { Order } from "@/types"

export const orderService = {
  async createOrder(
    userId: string,
    orderData: {
      customerName: string
      customerEmail: string
      customerPhone: string
      totalAmount: number
      shippingAddress: {
        address_line1: string
        address_line2?: string
        city: string
        state: string
        pincode: string
      }
    }
  ) {
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const { data, error } = await supabase.from("orders").insert({
        user_id: userId,
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        status: "pending",
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async addOrderItem(
    orderId: string,
    productId: string,
    productName: string,
    quantity: number,
    price: number,
    size: string,
    color: string
  ) {
    try {
      const { data, error } = await supabase.from("order_items").insert({
        order_id: orderId,
        product_id: productId,
        product_name: productName,
        quantity,
        price,
        size,
        color,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  },

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching order:", error)
      return null
    }
  },

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}
