import { ArrowRight, Star, TrendingUp, ShieldCheck, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product, Category } from "@/types"

interface HomePageProps {
  featuredProducts: Product[]
  categories: Category[]
  onNavigate: (page: string, params?: any) => void
}

export function HomePage({ featuredProducts, categories, onNavigate }: HomePageProps) {
import { formatPrice } from "@/lib/format";
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      <section className="relative h-[500px] overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl space-y-6">
            <Badge variant="secondary" className="w-fit">
              New Collection 2024
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-balance md:text-6xl">
              Step Into Style & Comfort
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover our exclusive collection of premium footwear. From casual to formal, we have the perfect pair for every occasion.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => onNavigate("products")}>
                Shop Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate("sale")}>
                View Sale
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders above ₹999</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% secure transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Authentic brands only</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">7 days return policy</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground">Find the perfect style for you</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => onNavigate("products", { category: category.slug })}
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <div className="flex size-full items-center justify-center text-4xl font-bold text-muted-foreground transition-transform group-hover:scale-105">
                  {category.name.charAt(0)}
                </div>
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked favorites just for you</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate("products")}>
            View All
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => onNavigate("product", { slug: product.slug })}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <div className="flex size-full items-center justify-center text-6xl font-bold text-muted-foreground transition-transform group-hover:scale-105">
                  {product.name.charAt(0)}
                </div>
                {product.discount_price && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Save {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.5</span>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.discount_price ? (
                    <>
                      <span className="text-lg font-bold">{formatPrice(product.discount_price)}</span>
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                  )}
                </div>
                <Button size="sm" onClick={(e) => {
                  e.stopPropagation()
                  onNavigate("product", { slug: product.slug })
                }}>
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto rounded-lg bg-primary/5 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Join Our Newsletter</h2>
          <p className="mb-6 text-muted-foreground">
            Get exclusive deals, style tips, and early access to new collections
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
