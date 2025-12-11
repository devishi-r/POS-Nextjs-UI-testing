"use client";

import React, { useState } from "react";

type CouponInfo = {
  type: "percent" | "flat";
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
  subtotal: number; // subtotal from cart (sum of item subtotals)
  onApplyDiscount: (discountedTotal: number) => void;
}

export default function CouponSection({
  subtotal,
  onApplyDiscount
}: CouponSectionProps) {
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  function validateAndApply() {
    const trimmed = code.trim().toUpperCase();
    setError(null);

    // Required field
    if (!trimmed) {
      setError("Please enter a coupon code.");
      return;
    }

    // Format rule (letters + numbers only, at least 4 characters)
    if (!/^[A-Z0-9]{4,}$/.test(trimmed)) {
      setError("Invalid format. Use uppercase letters and numbers only.");
      return;
    }

    // Expired coupons list
    if (EXPIRED_COUPONS.includes(trimmed)) {
      setError("This coupon is expired.");
      return;
    }

    // Valid coupon check
    const coupon = VALID_COUPONS[trimmed];
    if (!coupon) {
      setError("Invalid coupon code.");
      return;
    }

    // Prevent double application
    if (appliedCode) {
      setError("A coupon has already been applied.");
      return;
    }

    // Business logic
    let discount = 0;
    if (coupon.type === "percent") {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.value;
    }

    // Prevent negative totals
    const discountedTotal = Math.max(0, subtotal - discount);

    // Update UI
    setAppliedCode(trimmed);
    setDiscountAmount(discount);

    // Notify parent cart page
    onApplyDiscount(discountedTotal);
  }

  function clearCoupon() {
    setAppliedCode(null);
    setDiscountAmount(0);
    setCode("");
    onApplyDiscount(subtotal); // reset total
  }

  return (
    <div className="border p-4 rounded space-y-3" data-testid="coupon-section">
      <h3 className="font-semibold">Apply Coupon</h3>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter coupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 flex-grow"
          data-testid="coupon-input"
        />

        <button
          type="button"
          onClick={validateAndApply}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          data-testid="apply-coupon-btn"
        >
          Apply
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm" data-testid="coupon-error">
          {error}
        </p>
      )}

      {appliedCode && (
        <div className="text-green-600 text-sm" data-testid="coupon-success">
          Applied: {appliedCode} — Discount ₹{discountAmount}
          <button
            onClick={clearCoupon}
            className="ml-3 text-blue-600 underline"
            data-testid="clear-coupon-btn"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
