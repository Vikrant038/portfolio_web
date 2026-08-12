import { EmptyCart } from '@/components/EmptyCart';
import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const { items } = useCart();
  
  if (items.length === 0) {
    return <EmptyCart className="max-w-md mx-auto mt-12" />;
  }
  
  return (
    <div>
      {/* Existing cart UI */}
    </div>
  );
}