import { render, screen } from '@testing-library/react';
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