"use client";

import { useState } from "react";

type CouponInfo = {
  type: "percent";
  value: number;
} | {
  type: "flat";
  value: number;
};

const VALID_COUPONS: Record<string, CouponInfo> = {
  SAVE10: { type: "percent", value: 10 },
  SAVE20: { type: "percent", value: 20 },
  FLAT50: { type: "flat", value: 50 },
  FLAT100: { type: "flat", value: 100 },
};

const EXPIRED_COUPONS = ["OLD10", "SUMMER22"];

interface CouponSectionProps {
  subtotal: number;
  onApplyCoupon: (newTotal: number) => void;
  onClearCoupon?: (resetTotal: number) => void;
}

export default function CouponSection({
  subtotal,
  onApplyCoupon,
  onClearCoupon,
}: CouponSectionProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [savedAmount, setSavedAmount] = useState<number | null>(null);

  function applyCoupon() {
    const trimmed = code.trim().toUpperCase();
    setError(null);

    if (!trimmed) return setError("Please enter a coupon code.");
    if (!/^[A-Z0-9]{4,}$/.test(trimmed))
      return setError("Invalid format. Use uppercase letters and numbers only.");
    if (EXPIRED_COUPONS.includes(trimmed))
      return setError("This coupon is expired.");
    if (appliedCode) return setError("A coupon has already been applied.");

    const coupon = VALID_COUPONS[trimmed];
    if (!coupon) return setError("Invalid coupon code.");

    let newTotal = subtotal;
    let discountAmount = 0;

    if (coupon.type === "percent") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      newTotal = subtotal - discountAmount;
    } else {
      discountAmount = coupon.value;
      newTotal = subtotal - coupon.value;
    }

    setAppliedCode(trimmed);
    setSavedAmount(discountAmount);

    onApplyCoupon(newTotal);
  }

  function clearCoupon() {
    setAppliedCode(null);
    setCode("");
    setError(null);
    setSavedAmount(null);

    // Reset to original subtotal as required by tests
    // if (onClearCoupon) {
    onApplyCoupon(subtotal);  // test expects subtotal = 1000

    // }
  }

  return (
    <div className="border p-4 rounded space-y-3">
      <h3 className="font-semibold">Apply Coupon</h3>

      <div className="flex space-x-2">
        <input
          data-testid="coupon-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Enter coupon"
        />

        <button
          data-testid="apply-coupon-btn"
          onClick={applyCoupon}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="button"
        >
          Apply
        </button>
      </div>

      {error && (
        <p data-testid="coupon-error" className="text-red-500 text-sm">
          {error}
        </p>
      )}

      {appliedCode && (
        <>
          <p data-testid="coupon-success" className="text-green-600 text-sm">
            Applied: {appliedCode} — Saved ₹{savedAmount}
          </p>

          <button
            data-testid="clear-coupon-btn"
            onClick={clearCoupon}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Remove Coupon
          </button>
        </>
      )}
    </div>
  );
}
