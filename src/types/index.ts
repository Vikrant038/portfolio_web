export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price?: number
  category_id: string
  brand: string
  sizes: string[]
  colors: string[]
  in_stock: boolean
  featured: boolean
  image_url: string
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  size: string
  color: string
  product?: Product
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  total_amount: number
  status: string
  shipping_address: {
    address_line1: string
    address_line2?: string
    city: string
    state: string
    pincode: string
  }
  customer_name: string
  customer_email: string
  customer_phone: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  size: string
  color: string
  created_at: string
}
