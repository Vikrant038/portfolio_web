import { ChartBar as BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminDashboardProps {
  onNavigate: (page: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const stats = [
    { label: "Total Products", value: "124", icon: Package, color: "bg-blue-500/10 text-blue-600" },
    { label: "Total Orders", value: "2,543", icon: ShoppingCart, color: "bg-green-500/10 text-green-600" },
    { label: "Revenue", value: "₹12,45,000", icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Low Stock Items", value: "8", icon: BarChart3, color: "bg-orange-500/10 text-orange-600" },
  ]

  const adminMenus = [
    { label: "Products", value: "admin-products", icon: Package },
    { label: "Categories", value: "admin-categories", icon: "tag" },
    { label: "Orders", value: "admin-orders", icon: ShoppingCart },
    { label: "Analytics", value: "admin-analytics", icon: BarChart3 },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and view analytics</p>
        </div>
        <Button onClick={() => onNavigate("home")} variant="outline">
          Back to Store
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Management Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminMenus.map((menu) => {
            const Icon = menu.icon === "tag" ? Package : (typeof menu.icon === "string" ? Package : menu.icon)
            return (
              <Card
                key={menu.value}
                className="group cursor-pointer transition-all hover:shadow-lg"
                onClick={() => onNavigate(menu.value)}
              >
                <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="rounded-lg bg-primary/10 p-3 transition-all group-hover:bg-primary/20">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{menu.label}</h3>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Order #{1000 + i}</p>
                  <p className="text-sm text-muted-foreground">2 items • ₹{2000 + i * 100}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Pending</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
