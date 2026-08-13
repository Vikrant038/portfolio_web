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