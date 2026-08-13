import { Button } from "@/components/ui/button"

export default function ReturnsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Returns & Exchanges</h1>
        <p className="text-muted-foreground mb-8">
          We offer a 7-day return window for unworn shoes with original tags attached. If you're not completely satisfied with your purchase, you can return it for a refund or exchange within 7 days of receiving your order.
        </p>
        <Button onClick={() => onNavigate("home")}>Back to Home</Button>
      </div>
    </div>
  )
}