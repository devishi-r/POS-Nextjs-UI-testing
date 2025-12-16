import { render, screen, fireEvent } from "@testing-library/react";
import ProductCreationPage from "@/app/(root)/product/page";
import "@testing-library/jest-dom";

describe("Product Creation Form - Validation Tests", () => {
  function fillForm({ //simulates user input
    name = "",
    category = "",
    price = "",
    stock = "",
    qty = "",
  }) {
    if (name !== undefined)
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { value: name },
      });

    if (category !== undefined)
      fireEvent.change(screen.getByTestId("category-input"), {
        target: { value: category },
      });

    if (price !== undefined)
      fireEvent.change(screen.getByTestId("price-input"), {
        target: { value: price },
      });

    if (stock !== undefined)
      fireEvent.change(screen.getByTestId("stock-input"), {
        target: { value: stock },
      });

    if (qty !== undefined)
      fireEvent.change(screen.getByTestId("qty-input"), {
        target: { value: qty },
      });
  }

  function submitForm() {
    fireEvent.click(screen.getByTestId("submit-btn"));
  }

  beforeEach(() => {
    render(<ProductCreationPage />);
  });

  // Required Fields
  test("shows required field errors when form is submitted empty", () => {
    fillForm({});
    submitForm();

    expect(screen.getByText(/Product name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Price must be greater than 0/i)).toBeInTheDocument();
  });

  // Price Validation
  test("shows error when price is negative", () => {
    fillForm({
      name: "Item",
      category: "Snacks",
      price: "-10",
      stock: "10",
      qty: "1",
    });

    submitForm();

    expect(
      screen.getByText(/Price must be greater than 0/i)
    ).toBeInTheDocument();
  });

  // Stock Validation
  test("shows error when stock is negative", () => {
    fillForm({
      name: "Item",
      category: "Food",
      price: "5",
      stock: "-3",
      qty: "1",
    });

    submitForm();

    expect(
      screen.getByText(/Stock cannot be negative/i)
    ).toBeInTheDocument();
  });

  // Quantity Validation
  test("shows error when quantity is less than 1", () => {
    fillForm({
      name: "Item",
      category: "Food",
      price: "10",
      stock: "10",
      qty: "0",
    });

    submitForm();

    expect(
      screen.getByText(/Quantity must be at least 1/i)
    ).toBeInTheDocument();
  });

  test("shows error when qty exceeds stock", () => {
    fillForm({
      name: "Bag",
      category: "Accessories",
      price: "100",
      stock: "5",
      qty: "10",
    });

    submitForm();

    expect(
      screen.getByText(/Quantity cannot exceed available stock/i)
    ).toBeInTheDocument();
  });

  // Successful Submission
  test("submits successfully when all values are valid", () => {
    fillForm({
      name: "Laptop",
      category: "Electronics",
      price: "1500",
      stock: "10",
      qty: "2",
    });

    submitForm();

    // Success box should appear
    expect(screen.getByTestId("product-json-output")).toBeInTheDocument();

    // Submitted data should include correct values
    expect(screen.getByText(/Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/1500/i)).toBeInTheDocument();
    expect(screen.getByText(/10/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });
});

//scope - current validation done by checking appearance of text - not foolproof - check with component id (ensure application implement throws error in clearly defined components)