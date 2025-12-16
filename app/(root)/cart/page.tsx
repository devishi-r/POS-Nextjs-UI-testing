"use client";

import { useState, useMemo } from "react";
import CartItem from "@/components/cart/CartItem";
import CouponSection from "@/components/cart/CouponSection";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { name: "Laptop", price: 1000, stock: 5, qty: 1 },
    { name: "Mouse", price: 20, stock: 10, qty: 1 },
  ]);

  // Instead of coupon object, store DISCOUNT amount only
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = useMemo(() => { //useMemo() - allows caching of calculated results between re-renders
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  function updateQty(index: number, newQty: number) {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, qty: newQty } : item
      )
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Cart</h1>

      {cartItems.map((item, index) => (
        <CartItem
          key={index}
          index = {index}
          name={item.name}
          price={item.price}
          stock={item.stock}
          qty={item.qty}
          onQtyChange={(qty) => updateQty(index, qty)}
        />
      ))}

      <CouponSection
        subtotal={subtotal}
        onApplyCoupon={(newTotal) => {
          setDiscountAmount(subtotal - newTotal);
        }}
        onClearCoupon={(resetTotal) => {
          setDiscountAmount(subtotal-resetTotal);
        }}
      />

      <div className="text-lg font-semibold">Subtotal: ₹{subtotal}</div>

      {discountAmount > 0 && (
        <div className="text-green-600">
          Discount Applied: ₹{discountAmount}
        </div>
      )}

      <div data-testid="final-total" className="text-2xl font-bold mt-2">
        Total: ₹{finalTotal}
      </div>
    </div>
  );
}
