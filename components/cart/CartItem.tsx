"use client";

import { useState } from "react";

interface CartItemProps { //defining data that parent component should supply
  name: string;
  price: number;
  stock: number;
  qty: number;
  onQtyChange: (qty: number) => void;
  index?: number; // needed for test IDs
}

export default function CartItem({ //destructuring the prop
  name,
  price,
  stock,
  qty,
  onQtyChange,
  index = 0,
}: CartItemProps) {
  const [error, setError] = useState<string | null>(null);

  const subtotal = price * qty;

  function handleIncrement() {
    if (qty >= stock) {
      setError("Cannot exceed stock");
      return;
    }
    setError(null);
    onQtyChange(qty + 1);
  }

  function handleDecrement() {
    if (qty <= 1) {
      setError("Quantity must be at least 1");
      return;
    }
    setError(null);
    onQtyChange(qty - 1);
  }

  function handleInput(value: string) {
    const num = Number(value);

    if (isNaN(num)) {
      setError("Enter a valid number");
      return;
    }

    if (num < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    if (num > stock) {
      setError("Cannot exceed stock");
      return;
    }

    setError(null);
    onQtyChange(num);
  }

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">{name}</h3>

      <div className="flex items-center space-x-2">
        <button
          data-testid={`qty-minus-${index}`}
          onClick={handleDecrement}
        >
          -
        </button>

        <input
          data-testid={`qty-input-${index}`}
          className="border px-2 py-1 w-16 text-center"
          value={qty}
          onChange={(e) => handleInput(e.target.value)}
        />

        <button
          data-testid={`qty-plus-${index}`}
          onClick={handleIncrement}
        >
          +
        </button>
      </div>

      {error && (
        <p
          className="text-red-500 text-sm"
          data-testid={`qty-error-${index}`}
        >
          {error}
        </p>
      )}

      <p data-testid={`subtotal-${index}`}>
        Subtotal: ₹{subtotal}
      </p>
    </div>
  );
}
