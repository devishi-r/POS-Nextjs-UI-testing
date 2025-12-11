"use client";

import { useState } from "react";

export interface CartItemProps {
  name: string;
  price: number;
  stock: number;
  qty: number; // REQUIRED
  onQtyChange: (newQty: number) => void;
}

export default function CartItem({
  name,
  price,
  stock,
  qty,
  onQtyChange,
}: CartItemProps) {
  const [error, setError] = useState<string | null>(null);

  function validateQuantity(raw: string): number | null {
    setError(null);

    if (!/^\d+$/.test(raw)) {
      setError("Quantity must be a valid number");
      return null;
    }

    const value = Number(raw);

    if (value < 1) {
      setError("Quantity must be at least 1");
      return null;
    }

    if (value > stock) {
      setError("Quantity exceeds available stock");
      return null;
    }

    return value;
  }

  function handleManualInput(e: React.ChangeEvent<HTMLInputElement>) {
    const validated = validateQuantity(e.target.value);
    if (validated !== null) {
      onQtyChange(validated);
    }
  }

  function increment() {
    const newQty = qty + 1;
    if (newQty <= stock) {
      onQtyChange(newQty);
    } else {
      setError("Quantity exceeds available stock");
    }
  }

  function decrement() {
    const newQty = qty - 1;
    if (newQty >= 1) {
      onQtyChange(newQty);
    } else {
      setError("Quantity must be at least 1");
    }
  }

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">{name}</h3>
      <p>Price: ₹{price}</p>
      <p>Available Stock: {stock}</p>

      <div className="flex items-center space-x-2">
        <button onClick={decrement} className="border px-2 py-1">-</button>

        <input
          type="text"
          value={qty.toString()}
          onChange={handleManualInput}
          data-testid="qty-input"
          className="border p-1 w-16 text-center"
        />

        <button onClick={increment} className="border px-2 py-1">+</button>
      </div>

      <p data-testid="subtotal">Subtotal: ₹{qty * price}</p>

      {error && (
        <p data-testid="qty-error" className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
