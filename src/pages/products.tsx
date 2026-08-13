import { useState } from "react"
import { Star, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import type { Product, Category } from "@/types"

interface ProductsPageProps {
  products: Product[]
  categories: Category[]
  onNavigate: (page: string, params?: any) => void
}

export function ProductsPage({ products, categories, onNavigate }: ProductsPageProps) {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")

  const brands = Array.from(new Set(products.map(p => p.brand)))

import { formatPrice } from "@/lib/format";
  }

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelectedCategories(
                    checked
                      ? [...selectedCategories, category.id]
                      : selectedCategories.filter((id) => id !== category.id)
                  )
                }}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer text-sm"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 font-semibold">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            step={100}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 font-semibold">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  setSelectedBrands(
                    checked
                      ? [...selectedBrands, brand]
                      : selectedBrands.filter((b) => b !== brand)
                  )
                }}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="cursor-pointer text-sm"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([])
          setSelectedBrands([])
          setPriceRange([0, 5000])
        }}
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground">
          Showing {products.length} products
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20">
            <FilterSection />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 size-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
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
                  {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </CardContent>
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
                  <Button size="sm" disabled={!product.in_stock}>
                    {product.in_stock ? "View" : "Unavailable"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
              <div className="text-6xl">👟</div>
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
