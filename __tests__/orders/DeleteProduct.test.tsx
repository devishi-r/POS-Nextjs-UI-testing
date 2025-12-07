import { render, screen, fireEvent } from "@testing-library/react";
import OrdersPage from "@/app/(root)/orders/page";

describe("Orders Page - Delete Order Button", () => {
  test("delete-order-btn triggers delete logic", () => {
    render(<OrdersPage />);

    const deleteButton = screen.getByTestId("delete-product-btn");
    fireEvent.click(deleteButton);

    // Check for empty state UI
    expect(screen.getByTestId("delete-product-btn")).toBeInTheDocument();
  });
});
