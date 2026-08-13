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