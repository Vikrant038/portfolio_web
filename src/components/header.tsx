import { ShoppingCart, Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  cartItemCount?: number
  onNavigate: (page: string) => void
  currentPage: string
  user?: any
}

export function Header({ cartItemCount = 0, onNavigate, currentPage, user }: HeaderProps) {
  const navItems = [
    { label: "Home", value: "home" },
    { label: "Men's Shoes", value: "mens" },
    { label: "Women's Shoes", value: "womens" },
    { label: "Kids", value: "kids" },
    { label: "Sports", value: "sports" },
    { label: "Sale", value: "sale" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              S
            </div>
            <span className="hidden sm:inline">StepStyle</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={currentPage === item.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden w-64 lg:block">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search shoes..."
                className="pl-9"
              />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate("admin")}>
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>My Orders</DropdownMenuItem>
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate("home")}>
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => onNavigate("login")}>
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("register")}>
                    Register
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => onNavigate("cart")}
          >
            <ShoppingCart className="size-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    variant={currentPage === item.value ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => onNavigate(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
