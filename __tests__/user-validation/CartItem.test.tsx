import { render, screen, fireEvent } from "@testing-library/react";
import CartItem from "@/components/cart/CartItem";
import "@testing-library/jest-dom";

describe("CartItem – Quantity Validation & UI Logic", () => {
  const setup = (props = {}) =>
    render(
      <CartItem
        name="Laptop"
        price={1000}
        stock={5}
        {...props}
      />
    );

  test("renders initial qty = 1 and correct subtotal", () => {
    setup();

    expect(screen.getByTestId("qty-input")).toHaveValue("1");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("1000"); // qty 1 * price 1000
  });

  test("increment button increases quantity until stock limit", () => {
    setup();

    const incrementBtn = screen.getByTestId("increment-btn");
    const qtyInput = screen.getByTestId("qty-input");

    // Press + four times: 1 → 5 (limit)
    for (let i = 0; i < 4; i++) fireEvent.click(incrementBtn);

    expect(qtyInput).toHaveValue("5");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("5000"); // 5 * 1000
  });

  test("increment beyond stock shows error and does not update qty", () => {
    setup();

    const incrementBtn = screen.getByTestId("increment-btn");

    // Reach stock limit
    for (let i = 0; i < 5; i++) fireEvent.click(incrementBtn);

    // Try going beyond
    fireEvent.click(incrementBtn);

    expect(screen.getByTestId("qty-error")).toHaveTextContent(
      /exceeds available stock/i
    );
    expect(screen.getByTestId("qty-input")).toHaveValue("5");
  });

  test("decrement button decreases quantity until minimum of 1", () => {
    setup();

    const incrementBtn = screen.getByTestId("increment-btn");
    const decrementBtn = screen.getByTestId("decrement-btn");

    // Make qty = 3
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);

    fireEvent.click(decrementBtn);

    expect(screen.getByTestId("qty-input")).toHaveValue("2");
  });

  test("decrementing below 1 shows error and prevents update", () => {
    setup();

    const decrementBtn = screen.getByTestId("decrement-btn");

    // qty starts at 1 → try to reduce below
    fireEvent.click(decrementBtn);

    expect(screen.getByTestId("qty-error")).toHaveTextContent(/at least 1/i);
    expect(screen.getByTestId("qty-input")).toHaveValue("1");
  });

  test("manual input updates qty correctly when valid", () => {
    setup();

    const qtyInput = screen.getByTestId("qty-input");

    fireEvent.change(qtyInput, { target: { value: "3" } });

    expect(qtyInput).toHaveValue("3");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("3000");
  });

  test("manual input beyond stock shows error and prevents update", () => {
    setup();

    const qtyInput = screen.getByTestId("qty-input");

    fireEvent.change(qtyInput, { target: { value: "10" } });

    expect(screen.getByTestId("qty-error")).toHaveTextContent(
      /exceeds available stock/i
    );

    // qty remains unchanged (should stay 1)
    expect(qtyInput).toHaveValue("1");
  });

  test("non-numeric input shows validation error", () => {
    setup();

    const qtyInput = screen.getByTestId("qty-input");

    fireEvent.change(qtyInput, { target: { value: "abc" } });

    expect(screen.getByTestId("qty-error")).toHaveTextContent(
      /valid number/i
    );

    // Value should not be updated
    expect(qtyInput).toHaveValue("1");
  });
});
