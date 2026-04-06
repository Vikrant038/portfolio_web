/*
  # Shoe Shop E-commerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `price` (decimal)
      - `discount_price` (decimal, nullable)
      - `category_id` (uuid, foreign key)
      - `brand` (text)
      - `sizes` (jsonb array)
      - `colors` (jsonb array)
      - `in_stock` (boolean)
      - `featured` (boolean)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `display_order` (integer)
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `size` (text)
      - `color` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `order_number` (text, unique)
      - `total_amount` (decimal)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `product_name` (text)
      - `quantity` (integer)
      - `price` (decimal)
      - `size` (text)
      - `color` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their cart
    - Add policies for public read access to products and categories
    - Add policies for users to view their own orders
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  price decimal(10, 2) NOT NULL,
  discount_price decimal(10, 2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand text DEFAULT '',
  sizes jsonb DEFAULT '[]',
  colors jsonb DEFAULT '[]',
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  size text DEFAULT '',
  color text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number text NOT NULL UNIQUE,
  total_amount decimal(10, 2) NOT NULL,
  status text DEFAULT 'pending',
  shipping_address jsonb DEFAULT '{}',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10, 2) NOT NULL,
  size text DEFAULT '',
  color text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products policies (public read)
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Product images policies (public read)
CREATE POLICY "Allow public read access to product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

-- Cart items policies (authenticated users can manage their own cart)
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders policies (users can view their own orders)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies (users can view items from their own orders)
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Men''s Shoes', 'mens-shoes', 'Stylish and comfortable shoes for men', '/images/categories/mens.jpg'),
  ('Women''s Shoes', 'womens-shoes', 'Trendy footwear collection for women', '/images/categories/womens.jpg'),
  ('Kids Shoes', 'kids-shoes', 'Fun and durable shoes for children', '/images/categories/kids.jpg'),
  ('Sports Shoes', 'sports-shoes', 'Performance footwear for athletes', '/images/categories/sports.jpg'),
  ('Casual Shoes', 'casual-shoes', 'Comfortable everyday footwear', '/images/categories/casual.jpg'),
  ('Formal Shoes', 'formal-shoes', 'Elegant shoes for formal occasions', '/images/categories/formal.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, sizes, colors, featured, image_url) 
SELECT 
  'Classic Leather Sneakers',
  'classic-leather-sneakers',
  'Premium quality leather sneakers with cushioned sole for all-day comfort',
  2999.00,
  2499.00,
  (SELECT id FROM categories WHERE slug = 'mens-shoes' LIMIT 1),
  'Urban Step',
  '["6", "7", "8", "9", "10", "11"]',
  '["Black", "Brown", "White"]',
  true,
  '/images/products/sneaker1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'classic-leather-sneakers');

INSERT INTO products (name, slug, description, price, category_id, brand, sizes, colors, featured, image_url)
SELECT
  'Running Pro Max',
  'running-pro-max',
  'High-performance running shoes with advanced cushioning technology',
  3499.00,
  (SELECT id FROM categories WHERE slug = 'sports-shoes' LIMIT 1),
  'Sprint Elite',
  '["7", "8", "9", "10", "11"]',
  '["Blue", "Red", "Black"]',
  true,
  '/images/products/running1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'running-pro-max');

INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, sizes, colors, image_url)
SELECT
  'Elegant Heels',
  'elegant-heels',
  'Stylish high heels perfect for parties and formal events',
  2799.00,
  2299.00,
  (SELECT id FROM categories WHERE slug = 'womens-shoes' LIMIT 1),
  'Bella Fashion',
  '["5", "6", "7", "8", "9"]',
  '["Black", "Red", "Nude"]',
  '/images/products/heels1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'elegant-heels');

INSERT INTO products (name, slug, description, price, category_id, brand, sizes, colors, featured, image_url)
SELECT
  'Formal Oxford Shoes',
  'formal-oxford-shoes',
  'Classic oxford shoes for business and formal occasions',
  3299.00,
  (SELECT id FROM categories WHERE slug = 'formal-shoes' LIMIT 1),
  'Gentleman''s Choice',
  '["7", "8", "9", "10", "11"]',
  '["Black", "Brown"]',
  true,
  '/images/products/oxford1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'formal-oxford-shoes');

INSERT INTO products (name, slug, description, price, category_id, brand, sizes, colors, image_url)
SELECT
  'Kids Colorful Sneakers',
  'kids-colorful-sneakers',
  'Bright and fun sneakers that kids will love',
  1499.00,
  (SELECT id FROM categories WHERE slug = 'kids-shoes' LIMIT 1),
  'Happy Feet',
  '["1", "2", "3", "4", "5"]',
  '["Rainbow", "Pink", "Blue"]',
  '/images/products/kids1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'kids-colorful-sneakers');