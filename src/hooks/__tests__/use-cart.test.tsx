import { renderHook, act } from '@testing-library/react';
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