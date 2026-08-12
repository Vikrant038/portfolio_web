import { render, screen } from '@testing-library/react';
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