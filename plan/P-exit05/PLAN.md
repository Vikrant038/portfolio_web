# Plan P-exit05

Test-backfill: add a vitest suite for cartService and fix its silent error-swallowing.

## T-1 — Add a vitest suite for cartService and fix its silent error-swallowing

src/services/cartService.ts has no tests and swallows fetch errors: `getCartItems` catches errors, logs them, and returns `[]` — a failed fetch is indistinguishable from an empty cart. Write src/services/__tests__/cartService.test.ts that mocks `@/lib/supabase` with vi.mock and covers all five methods (addToCart, getCartItems, updateCartItem, removeCartItem, clearCart) on both success and error paths, asserting the supabase call shapes and the returned `{ data, error }` shapes. Then fix `getCartItems` so its error path returns `{ data: null, error }` (consistent with addToCart/updateCartItem) instead of a silent `[]`; it currently has no callers in the app, so the return-shape change is safe. Do not modify test files.

### Frozen tests (workers may NOT modify)

```
src/services/__tests__/cartService.error-path.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSupabase } = vi.hoisted(() => ({ mockSupabase: { from: vi.fn() } }))

vi.mock("@/lib/supabase", () => ({ supabase: mockSupabase }))

import { cartService } from "../cartService"

function mockChain(result: unknown) {
  mockSupabase.from.mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  } as any)
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("getCartItems surfaces fetch errors instead of silently returning []", async () => {
    mockChain({ data: null, error: new Error("db down") })
    const result = await cartService.getCartItems("user-1")
    expect(result).toEqual({ data: null, error: new Error("db down") })
    expect(mockSupabase.from).toHaveBeenCalledWith("cart_items")
  })
})
```
