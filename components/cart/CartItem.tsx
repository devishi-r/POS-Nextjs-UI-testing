"use client";

import React, { useState } from "react";

interface CartItemProps {
  name: string;
  price: number;
  stock: number; // available stock
}

export default function CartItem({ name, price, stock }: CartItemProps) {
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const subtotal = qty * price;

  function validateQuantity(value: number) {
    setError(null);

    // 1. Must be a valid number
    if (isNaN(value)) {
      setError("Quantity must be a valid number");
      return false;
    }

    // 2. Business constraints
    if (value < 1) {
      setError("Quantity must be at least 1");
      return false;
    }

    if (value > stock) {
      setError("Quantity exceeds available stock");
      return false;
    }

    return true;
  }


  function handleManualQtyInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (validateQuantity(value)) {
      setQty(value);
    }
  }

  function incrementQty() {
    const newValue = qty + 1;
    if (validateQuantity(newValue)) {
      setQty(newValue);
    }
  }

  function decrementQty() {
    const newValue = qty - 1;
    if (validateQuantity(newValue)) {
      setQty(newValue);
    }
  }

  return (
    <div className="border p-4 rounded space-y-2" data-testid="cart-item">
      <h2 className="font-semibold">{name}</h2>

      <p>Price: ₹{price}</p>
      <p>Available Stock: {stock}</p>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={decrementQty}
          className="px-3 py-1 bg-gray-200 rounded"
          data-testid="decrement-btn"
        >
          -
        </button>

        <input
          type="text"
          value={qty}
          onChange={handleManualQtyInput}
          className="border p-1 w-16 text-center"
          data-testid="qty-input"
        />

        <button
          type="button"
          onClick={incrementQty}
          className="px-3 py-1 bg-gray-200 rounded"
          data-testid="increment-btn"
        >
          +
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm" data-testid="qty-error">
          {error}
        </p>
      )}

      {/* Subtotal */}
      <p data-testid="subtotal" className="font-semibold">
        Subtotal: ₹{subtotal}
      </p>
    </div>
  );
}
