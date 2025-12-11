"use client";

import CouponSection from "@/components/cart/CouponSection";
import CartItem from "@/components/cart/CartItem";
import { useState } from "react";

export default function CartPage() {
  const [total, setTotal] = useState(0);

  // Example items
  const items = [
    { name: "Laptop", price: 1000, stock: 5 },
    { name: "Mouse", price: 20, stock: 10 }
  ];

  // Compute subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * 1, 0);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-bold">Cart</h1>

      {/* Render each item */}
      {items.map((i, index) => (
        <CartItem key={index} {...i} />
      ))}

      {/* Coupon Section */}
      <CouponSection
        subtotal={subtotal}
        onApplyDiscount={(newTotal) => setTotal(newTotal)}
      />

      {/* Total display */}
      <div data-testid="final-total" className="text-lg font-semibold">
        Total: ₹{total || subtotal}
      </div>
    </div>
  );
}
