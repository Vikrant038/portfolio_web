import { createContext, useContext, useState } from 'react';

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