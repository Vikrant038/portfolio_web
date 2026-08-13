import { useState } from "react"
import { Star, Heart, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/types"

interface ProductDetailPageProps {
  product: Product
  onAddToCart: (productId: string, size: string, color: string, quantity: number) => void
  onNavigate: (page: string) => void
}

export function ProductDetailPage({ product, onAddToCart, onNavigate }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color")
      return
    }
    onAddToCart(product.id, selectedSize, selectedColor, quantity)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => onNavigate("products")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Products
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <div className="flex size-full items-center justify-center text-[200px] font-bold text-muted-foreground">
              {product.name.charAt(0)}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted transition-all hover:border-primary"
              >
                <div className="flex size-full items-center justify-center text-2xl font-bold text-muted-foreground">
                  {product.name.charAt(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {product.featured && <Badge>Featured</Badge>}
              {!product.in_stock && <Badge variant="destructive">Out of Stock</Badge>}
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`size-5 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            {product.discount_price ? (
              <>
                <span className="text-4xl font-bold">{formatPrice(product.discount_price)}</span>
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <Badge variant="destructive">
                  {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                </Badge>
              </>
            ) : (
              <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <Separator />

          <div>
            <Label className="mb-3 text-base">Select Size</Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-input hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-3 text-base">Select Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color}>
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input px-4 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                    >
                      <div className="size-4 rounded-full border" style={{ backgroundColor: color.toLowerCase() }} />
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-3 text-base">Quantity</Label>
            <div className="flex w-32 items-center gap-2 rounded-md border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="flex-1 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
            >
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="size-5" />
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Free Delivery</h4>
                <p className="text-sm text-muted-foreground">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <RotateCcw className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">7 Days Return</h4>
                <p className="text-sm text-muted-foreground">Easy return and exchange policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Warranty</h4>
                <p className="text-sm text-muted-foreground">1 year manufacturer warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Product Details</h2>
        <Card>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Check className="size-5 text-primary" />
              <span>Premium quality materials</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-primary" />
              <span>Comfortable cushioned sole</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-primary" />
              <span>Breathable design</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-primary" />
              <span>Durable and long-lasting</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-primary" />
              <span>Easy to clean</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-primary" />
              <span>Available in multiple sizes</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
