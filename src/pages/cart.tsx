import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { CartItem } from "@/types"

interface CartPageProps {
  cartItems: (CartItem & { product?: any })[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onNavigate: (page: string) => void
}

export function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }: CartPageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discount_price || item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-12 text-muted-foreground" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet
            </p>
          </div>
          <Button size="lg" onClick={() => onNavigate("products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex gap-4 p-4">
                  <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <div className="flex size-full items-center justify-center text-3xl font-bold text-muted-foreground">
                      {item.product?.name?.charAt(0) || "?"}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product?.brand}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Size: {item.size}</Badge>
                      <Badge variant="secondary">Color: {item.color}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-md border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        {item.product?.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {formatPrice(item.product.discount_price * item.quantity)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {subtotal < 999 && (
                <p className="text-sm text-muted-foreground">
                  Add {formatPrice(999 - subtotal)} more for free shipping
                </p>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button size="lg" className="w-full" onClick={() => onNavigate("checkout")}>
                Proceed to Checkout
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => onNavigate("products")}
              >
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
