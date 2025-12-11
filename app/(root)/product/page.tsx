"use client";

import React, { useState } from "react";

interface ProductFormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
  qty?: string;
}

export default function ProductCreationPage() {
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Extract typed form values
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const category = (form.elements.namedItem("category") as HTMLInputElement).value.trim();
    const price = Number((form.elements.namedItem("price") as HTMLInputElement).value);
    const stock = Number((form.elements.namedItem("stock") as HTMLInputElement).value);
    const qty = Number((form.elements.namedItem("qty") as HTMLInputElement).value);

    const newErrors: ProductFormErrors = {};

    // -------------------------
    // Basic Required Validation
    // -------------------------
    if (!name) newErrors.name = "Product name is required";
    if (!category) newErrors.category = "Category is required";
    if (!price) newErrors.price = "Price is required";

    // -------------------------
    // Business Logic Validation
    // -------------------------
    if (price <= 0) newErrors.price = "Price must be greater than 0";

    if (stock < 0) newErrors.stock = "Stock cannot be negative";

    if (qty <= 0) newErrors.qty = "Quantity must be at least 1";

    if (qty > stock) newErrors.qty = "Quantity cannot exceed available stock";

    setErrors(newErrors);

    // If errors exist → stop submission
    if (Object.keys(newErrors).length > 0) return;

    // -------------------------
    // Simulate a successful submission
    // -------------------------
    const data = { name, category, price, stock, qty };
    setSubmittedData(data);
    console.log("Product submitted:", data);

    // Optional: Clear form after submission
    form.reset();
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create New Product</h1>

      <form onSubmit={handleSubmit} data-testid="product-form" className="space-y-4">

        {/* Name */}
        <div>
          <input
            name="name"
            placeholder="Product Name"
            className="border p-2 w-full"
            data-testid="name-input"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <input
            name="category"
            placeholder="Category"
            className="border p-2 w-full"
            data-testid="category-input"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Price */}
        <div>
          <input
            name="price"
            type="number"
            placeholder="Price"
            className="border p-2 w-full"
            data-testid="price-input"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Stock */}
        <div>
          <input
            name="stock"
            type="number"
            placeholder="Stock Count"
            className="border p-2 w-full"
            data-testid="stock-input"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>

        {/* Quantity */}
        <div>
          <input
            name="qty"
            type="number"
            placeholder="Purchase Quantity"
            className="border p-2 w-full"
            data-testid="qty-input"
          />
          {errors.qty && <p className="text-red-500 text-sm">{errors.qty}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          data-testid="submit-btn"
        >
          Submit
        </button>
      </form>

      {submittedData && (
        <div className="mt-4 p-4 border bg-green-50" data-testid="success-box">
          <h2 className="font-semibold">Submitted Data:</h2>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
