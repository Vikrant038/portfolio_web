# Plan P-exit04

Greenfield: build a new Returns & Exchanges page and wire it into the app.

## T-1 — Add a Returns & Exchanges page

Create a new standalone page src/pages/returns.tsx with a default export `ReturnsPage` taking props `{ onNavigate: (page: string) => void }`. It must render: a heading "Returns & Exchanges", a paragraph mentioning a 7-day return window for unworn shoes with original tags, and a "Back to Home" button that calls `onNavigate("home")`. Then wire it into the app: add a `returns` case to the page switch in src/App.tsx rendering `<ReturnsPage onNavigate={handleNavigate} />`, and add a "Returns" entry to the Quick Links list in src/components/footer.tsx that calls `onNavigate("returns")`. Do not modify test files.

### Frozen tests (workers may NOT modify)

```
src/pages/__tests__/returns.test.tsx
import { render, screen } from "@testing-library/react"
import ReturnsPage from "../returns"

describe("ReturnsPage", () => {
  it("renders the policy heading and copy", () => {
    render(<ReturnsPage onNavigate={() => {}} />)
    expect(screen.getByRole("heading", { name: "Returns & Exchanges" })).toBeInTheDocument()
    expect(screen.getByText(/7-day return/i)).toBeInTheDocument()
  })

  it("navigates home from the back button", () => {
    const onNavigate = vi.fn()
    render(<ReturnsPage onNavigate={onNavigate} />)
    screen.getByRole("button", { name: /back to home/i }).click()
    expect(onNavigate).toHaveBeenCalledWith("home")
  })
})
```
