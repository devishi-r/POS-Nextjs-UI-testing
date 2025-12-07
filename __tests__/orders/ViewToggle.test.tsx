import { render, screen, fireEvent } from "@testing-library/react";
import { Orders } from "@/components/order/demo";

describe("Orders Page – View Toggle & Format Display", () => {

  test("renders table view with table headers initially", () => {
    render(<Orders />);

    const headers = [/product/i, /type/i, /price/i, /(qty|quantity)/i, /amount/i];

    headers.forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });

  test("displays bill format after toggling view", () => {
    render(<Orders />);

    const toggleButton = screen.getByTestId("view-toggle-btn");

    // Switch table → bill view
    fireEvent.click(toggleButton);

    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/tax/i)).toBeInTheDocument();
    expect(screen.getAllByText(/total/i)[0]).toBeInTheDocument();
  });

  test("switches back to table view when toggled twice", () => {
    render(<Orders />);

    const toggleButton = screen.getByTestId("view-toggle-btn");

    fireEvent.click(toggleButton); // bill view
    fireEvent.click(toggleButton); // back to table

    expect(screen.getByText(/product/i)).toBeInTheDocument();
    expect(screen.getByText(/amount/i)).toBeInTheDocument();
  });

});
