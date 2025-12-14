import { render, screen, fireEvent } from "@testing-library/react";
import CouponSection from "@/components/cart/CouponSection";
import "@testing-library/jest-dom";

describe("CouponSection - Validation & Business Logic", () => {
  const setup = (subtotal = 1000, onApplyDiscount = jest.fn()) => {
    render(
      <CouponSection subtotal={subtotal} onApplyCoupon={onApplyDiscount} />
    );
    return { onApplyDiscount };
  };

  test("shows error when coupon input is empty", () => {
    setup();

    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    expect(screen.getByTestId("coupon-error")).toHaveTextContent(
      /enter a coupon/i
    );
  });

  test("shows format error for invalid pattern", () => {
    setup();

    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "ab" }, // too short, not uppercase
    });

    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    expect(screen.getByTestId("coupon-error")).toHaveTextContent(/invalid format/i);
  });

  test("shows error for expired coupon", () => {
    setup();

    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "OLD10" },
    });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    expect(screen.getByTestId("coupon-error")).toHaveTextContent(/expired/i);
  });

  test("shows error for invalid coupon code", () => {
    setup();

    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "ABCDE1" },
    });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    expect(screen.getByTestId("coupon-error")).toHaveTextContent(/invalid coupon/i);
  });

  test("applies percent coupon (SAVE10) correctly", () => {
    const { onApplyDiscount } = setup(1000);

    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "SAVE10" },
    });

    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    // 10% of 1000 = 100 → total = 900
    expect(onApplyDiscount).toHaveBeenCalledWith(900);

    expect(screen.getByTestId("coupon-success")).toHaveTextContent(/save10/i);
    expect(screen.getByTestId("coupon-success")).toHaveTextContent(/100/i);
  });

  test("applies flat coupon (FLAT50) correctly", () => {
    const { onApplyDiscount } = setup(500);

    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "FLAT50" },
    });

    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    // 500 - 50 = 450
    expect(onApplyDiscount).toHaveBeenCalledWith(450);
    expect(screen.getByTestId("coupon-success")).toHaveTextContent(/flat50/i);
    expect(screen.getByTestId("coupon-success")).toHaveTextContent(/50/i);
  });

  test("prevents applying a second coupon after one is applied", () => {
    setup(1000);

    // First apply SAVE10
    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "SAVE10" },
    });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    // Now try applying FLAT50
    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "FLAT50" },
    });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    expect(screen.getByTestId("coupon-error")).toHaveTextContent(
      /already been applied/i
    );
  });

  test("removing coupon resets subtotal", () => {
    const onApplyDiscount = jest.fn();
    setup(1000, onApplyDiscount);

    // Apply coupon
    fireEvent.change(screen.getByTestId("coupon-input"), {
      target: { value: "SAVE10" },
    });
    fireEvent.click(screen.getByTestId("apply-coupon-btn"));

    // Remove coupon
    fireEvent.click(screen.getByTestId("clear-coupon-btn"));

    expect(onApplyDiscount).toHaveBeenCalledWith(1000); // back to subtotal
  });
});


// onApplyDiscount - component's way of storing what value was return to parent component
// test captures that instead of duplication state logic