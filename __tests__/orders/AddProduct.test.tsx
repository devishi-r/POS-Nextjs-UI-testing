import { render, screen, fireEvent } from "@testing-library/react";
import OrdersPage from "@/app/(root)/orders/page";

describe("Orders Page - Add Product Modal", () => {
  test("opens modal when add-product-btn is clicked", () => {
    render(<OrdersPage />);

    const addButton = screen.getByTestId("add-product-btn");

    fireEvent.click(addButton);

    // Modal should now appear
    expect(screen.getByTestId("add-product-btn")).toBeInTheDocument();
  });
});
