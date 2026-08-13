# Plan P-exit02

Bugfix: cart pricing falls back to full price when a product's discount price is 0.

## T-1 — Fix cart pricing when a product's discount price is 0

In src/pages/cart.tsx two places use the falsy `||` operator with discount_price. (1) The subtotal reducer: `const price = item.product?.discount_price || item.product?.price || 0`. (2) The per-item price rendering: `item.product?.discount_price ? (...) : (...)`. When a product has `discount_price: 0` (a discounted-to-free item), `||` and the truthy ternary fall through to the FULL price, so the cart shows ₹1,999 instead of ₹0 and shipping is computed against the wrong subtotal. Replace the falsy checks with nullish handling (use `??` for the fallback and `!= null` for the discount check) so a discount price of 0 is honored. Do not modify test files. Smallest change.

### Frozen tests (workers may NOT modify)

```
src/pages/__tests__/cart-pricing.test.tsx
import { render, screen } from "@testing-library/react"
import { CartPage } from "../cart"

const item = {
  id: "x1",
  user_id: "guest",
  product_id: "p1",
  quantity: 1,
  size: "9",
  color: "black",
  product: { id: "p1", name: "Test Sneaker", price: 1999, discount_price: 0 },
}

describe("CartPage pricing", () => {
  it("honors a zero discount price instead of falling back to the full price", () => {
    render(
      <CartPage
        cartItems={[item]}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
        onNavigate={() => {}}
      />
    )
    // line price and subtotal must use ₹0 (the discount price), and the
    // subtotal of 0 must trigger the ₹99 shipping fee (total ₹99)
    expect(screen.getAllByText("₹0").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("₹99")).toBeInTheDocument()
  })
})
```
