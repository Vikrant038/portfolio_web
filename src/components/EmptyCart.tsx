import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyCartProps {
  className?: string;
}

export function EmptyCart({ className }: EmptyCartProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {/* Illustration placeholder */}
        <div className="mb-4 text-4xl">🛒</div>
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">Add some products to get started</p>
        <Button>Browse Products</Button>
      </CardContent>
    </Card>
  );
}