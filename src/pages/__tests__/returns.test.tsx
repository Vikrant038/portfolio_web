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