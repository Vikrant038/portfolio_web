import { Share2, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                S
              </div>
              <span className="text-lg font-bold">StepStyle</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Your trusted destination for quality footwear. Discover the perfect shoes for every occasion.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="size-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="size-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => onNavigate?.("home")} className="hover:text-foreground text-left">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("home")} className="hover:text-foreground text-left">Contact</button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("home")} className="hover:text-foreground text-left">Track Order</button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("home")} className="hover:text-foreground text-left">Shipping Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("returns")} className="hover:text-foreground text-left">Returns & Exchanges</button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">Men's Shoes</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Women's Shoes</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Kids Shoes</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Sports Shoes</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">Formal Shoes</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>123 MG Road, Bangalore, Karnataka 560001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>support@stepstyle.in</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Newsletter</h4>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="h-8" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2024 StepStyle. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
