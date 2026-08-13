# Plan P-exit01

Feature: add a ProductRating star component and render it on the product detail page.

## T-1 — Add ProductRating star component

Create a new component src/components/rating.tsx exporting `ProductRating` with props `{ rating: number }` (0-5). It renders exactly 5 star icons (use lucide-react `Star`). The first `rating` stars are filled, the rest are empty. Each star must carry a `data-testid` of `star-filled` or `star-empty` respectively. The root element must have `role="img"` and `aria-label` of the form `Rated ${rating} out of 5`. Then integrate it into src/pages/product-detail.tsx: import ProductRating and render `<ProductRating rating={4} />` directly above the price section. Do not modify any test files. Smallest change that satisfies the contract.

### Frozen tests (workers may NOT modify)

```
src/components/__tests__/rating.test.tsx
import { render, screen } from "@testing-library/react"
import { ProductRating } from "../rating"

describe("ProductRating", () => {
  it("announces the rating accessibly", () => {
    render(<ProductRating rating={4} />)
    expect(screen.getByRole("img", { name: "Rated 4 out of 5" })).toBeInTheDocument()
  })

  it("fills exactly `rating` stars", () => {
    render(<ProductRating rating={3} />)
    expect(screen.getAllByTestId("star-filled")).toHaveLength(3)
    expect(screen.getAllByTestId("star-empty")).toHaveLength(2)
  })

  it("fills no stars for rating 0", () => {
    render(<ProductRating rating={0} />)
    expect(screen.getAllByTestId("star-empty")).toHaveLength(5)
  })
})
```
