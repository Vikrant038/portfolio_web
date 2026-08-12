# Plan P-msqbvvbl

Add a helpful empty state component to the cart page that displays when the cart is empty, including a message, call-to-action button to browse products, and optional illustration. The implementation will create a new EmptyCart component, integrate it into the existing cart page, and ensure proper conditional rendering based on cart items.

## T-1 — Create EmptyCart component with empty state UI

Create a reusable EmptyCart component that displays when cart is empty. Component should include: 1) A heading 'Your cart is empty', 2) Descriptive message 'Add some products to get started', 3) A button linking to products page with text 'Browse Products', 4) Optional empty cart illustration. Component must accept className prop for styling and use shadcn/ui components.

### Interface stubs

```
src/components/EmptyCart.tsx: import { Button } from '@/components/ui/button';
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
```

### Frozen tests (workers may NOT modify)

```
src/components/__tests__/EmptyCart.test.tsx: import { render, screen } from '@testing-library/react';
import { EmptyCart } from '../EmptyCart';

describe('EmptyCart', () => {
  it('renders empty cart message', () => {
    render(<EmptyCart />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some products to get started')).toBeInTheDocument();
  });

  it('renders browse products button', () => {
    render(<EmptyCart />);
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    render(<EmptyCart className="custom-class" />);
    expect(screen.getByRole('article')).toHaveClass('custom-class');
  });
});
```

## T-2 — Integrate EmptyCart into cart page component

Modify the cart page to conditionally render the EmptyCart component when cart is empty. Update src/pages/cart.tsx to: 1) Import EmptyCart component, 2) Check if cart items array is empty, 3) Render EmptyCart when empty, 4) Render existing cart UI when items exist. Ensure the button links to '/products' route.

### Interface stubs

```
src/pages/cart.tsx: import { EmptyCart } from '@/components/EmptyCart';
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
```

### Frozen tests (workers may NOT modify)

```
src/pages/__tests__/cart.test.tsx: import { render, screen } from '@testing-library/react';
import CartPage from '../cart';
import { CartProvider } from '@/hooks/use-cart';

const mockEmptyCart = { items: [] };
const mockPopulatedCart = { items: [{ id: 1, name: 'Test Product', price: 99 }] };

describe('CartPage', () => {
  it('renders EmptyCart when cart is empty', () => {
    render(
      <CartProvider value={mockEmptyCart}>
        <CartPage />
      </CartProvider>
    );
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart UI when cart has items', () => {
    render(
      <CartProvider value={mockPopulatedCart}>
        <CartPage />
      </CartProvider>
    );
    expect(screen.queryByText('Your cart is empty')).not.toBeInTheDocument();
  });
});
```

## T-3 — Create useCart hook for cart state management

Create a useCart hook that provides cart state and methods. Hook should: 1) Return cart items array, 2) Provide loading state, 3) Include methods for add/remove/update, 4) Use CartProvider context. Create both hook and context provider components.

### Interface stubs

```
src/hooks/use-cart.ts: import { createContext, useContext, useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };
  
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  return (
    <CartContext.Provider value={{ items, isLoading, addItem, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

### Frozen tests (workers may NOT modify)

```
src/hooks/__tests__/use-cart.test.tsx: import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../use-cart';

describe('useCart', () => {
  it('provides cart items and methods', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    
    act(() => {
      result.current.addItem({ id: 1, name: 'Test', price: 99, quantity: 1 });
    });
    
    expect(result.current.items).toHaveLength(1);
  });
});
```

## T-4 — Wrap app with CartProvider in main App.tsx

Update the main App.tsx to wrap the application with CartProvider context to make cart state available throughout the app. Import CartProvider and wrap children components.

### Interface stubs

```
src/App.tsx: import { CartProvider } from '@/hooks/use-cart';

export default function App() {
  return (
    <CartProvider>
      {/* Existing app content */}
    </CartProvider>
  );
}
```

### Frozen tests (workers may NOT modify)

```
src/__tests__/App.test.tsx: import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```
