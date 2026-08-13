import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomePage } from "@/pages/home"
import { ProductsPage } from "@/pages/products"
import { ProductDetailPage } from "@/pages/product-detail"
import { CartPage } from "@/pages/cart"
import { LoginPage } from "@/pages/auth/login"
import { RegisterPage } from "@/pages/auth/register"
import { AdminDashboard } from "@/pages/admin/dashboard"
import { AdminProducts } from "@/pages/admin/products"
import { ReturnsPage } from "@/pages/returns"
import { productService } from "@/services/productService"
import { authService } from "@/services/authService"
import type { Product, Category, CartItem } from "@/types"

export function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [currentParams, setCurrentParams] = useState<any>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      const { user: currentUser } = await authService.getCurrentUser()
      setUser(currentUser)

      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)
      setLoading(false)
    }

    initApp()

    const { data: authListener } = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page)
    setCurrentParams(params || {})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAddToCart = (productId: string, size: string, color: string, quantity: number) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: "guest",
      product_id: productId,
      quantity,
      size,
      color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product: products.find(p => p.id === productId),
    }
    setCartItems([...cartItems, newItem])
    alert("Product added to cart!")
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity, updated_at: new Date().toISOString() } : item
    ))
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId))
  }

  const featuredProducts = products.filter(p => p.featured)
  const cartItemsWithProducts = cartItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.product_id),
  }))

  const renderPage = () => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    switch (currentPage) {
      case "home":
        return (
          <HomePage
            featuredProducts={featuredProducts}
            categories={categories}
            onNavigate={handleNavigate}
          />
        )
      case "products":
      case "mens":
      case "womens":
      case "kids":
      case "sports":
      case "sale":
        return (
          <ProductsPage
            products={products}
            categories={categories}
            onNavigate={handleNavigate}
          />
        )
      case "product":
        const product = products.find(p => p.slug === currentParams.slug)
        if (!product) return <div className="container mx-auto py-12">Product not found</div>
        return (
          <ProductDetailPage
            product={product}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )
      case "cart":
        return (
          <CartPage
            cartItems={cartItemsWithProducts}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
          />
        )
      case "login":
        return (
          <LoginPage
            onNavigate={handleNavigate}
            onLoginSuccess={() => setUser({ id: "user" })}
          />
        )
      case "register":
        return (
          <RegisterPage
            onNavigate={handleNavigate}
            onRegisterSuccess={() => setUser({ id: "user" })}
          />
        )
      case "admin":
        if (!user) return <div className="container mx-auto py-12">Access Denied</div>
        return <AdminDashboard onNavigate={handleNavigate} />
      case "admin-products":
        if (!user) return <div className="container mx-auto py-12">Access Denied</div>
        return <AdminProducts onNavigate={handleNavigate} />
      case "returns":
        return <ReturnsPage onNavigate={handleNavigate} />
      default:
        return (
          <HomePage
            featuredProducts={featuredProducts}
            categories={categories}
            onNavigate={handleNavigate}
          />
        )
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      {currentPage !== "login" && currentPage !== "register" && (
        <Header
          cartItemCount={cartItems.length}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          user={user}
        />
      )}
      <main className="flex-1">
        {renderPage()}
      </main>
      {currentPage !== "login" && currentPage !== "register" && <Footer onNavigate={handleNavigate} />}
    </div>
  )
}

export default App
