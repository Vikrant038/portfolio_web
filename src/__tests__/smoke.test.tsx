import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

// Minimal smoke: proves the jsdom + React + testing-library stack works in a
// clean checkout. If a worker breaks the test runner itself, this fails.
describe("test stack smoke", () => {
  it("renders a component into jsdom", () => {
    render(<div data-testid="smoke">hello</div>)
    expect(screen.getByTestId("smoke")).toHaveTextContent("hello")
  })
})
