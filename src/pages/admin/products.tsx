import { useState, useEffect } from "react"
import { Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { productService } from "@/services/productService"
import { adminService } from "@/services/adminService"
import type { Product } from "@/types"

interface AdminProductsProps {
  onNavigate: (page: string) => void
}

export function AdminProducts({ onNavigate }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const data = await productService.getProducts()
    setProducts(data)
    setLoading(false)
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await adminService.deleteProduct(productId)
      loadProducts()
    }
  }

  const handleToggleStock = async (product: Product) => {
    await adminService.updateProduct(product.id, { in_stock: !product.in_stock })
    loadProducts()
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate("admin")} variant="outline">
            Back
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Product name" />
                <Input placeholder="Description" />
                <Input type="number" placeholder="Price" />
                <Input type="number" placeholder="Discount price (optional)" />
                <Input placeholder="Brand" />
                <Button className="w-full">Create Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant={product.featured ? "default" : "secondary"}>
                        {product.featured ? "Featured" : "Regular"}
                      </Badge>
                      <Badge variant={product.in_stock ? "default" : "destructive"}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">₹{product.price}</p>
                    {product.discount_price && (
                      <p className="text-sm text-muted-foreground line-through">₹{product.discount_price}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleToggleStock(product)}
                    >
                      <Upload className="size-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Upload className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
