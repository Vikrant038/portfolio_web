# Plan P-exit03

Refactor: extract the duplicated formatPrice helper into src/lib/format.ts.

## T-1 — Extract shared formatPrice helper from four duplicated copies

Four pages (src/pages/cart.tsx, src/pages/product-detail.tsx, src/pages/home.tsx, src/pages/products.tsx) each define an identical local `formatPrice` closure: `new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)`. Create src/lib/format.ts exporting `export function formatPrice(price: number): string` with exactly that formatting, then replace all four local copies with `import { formatPrice } from "@/lib/format"` and delete the local closures. Behavior must be byte-identical to today. Do not modify test files.

### Frozen tests (workers may NOT modify)

```
src/lib/__tests__/format.test.ts
import { formatPrice } from "../format"

describe("formatPrice", () => {
  it("formats INR without decimals", () => {
    expect(formatPrice(1234.5)).toBe("₹1,235")
  })

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("₹0")
  })

  it("uses Indian digit grouping", () => {
    expect(formatPrice(1234567)).toBe("₹12,34,567")
  })
})
```
