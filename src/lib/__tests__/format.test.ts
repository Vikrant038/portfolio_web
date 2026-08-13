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