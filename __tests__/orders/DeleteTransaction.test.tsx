import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertDialogDeletetransaction } from "@/components/order/components/dialogDelete";
import axios from "axios";

// Force mock axios for both ESM/CJS variants
jest.mock("axios", () => ({
  delete: jest.fn(),
  default: { delete: jest.fn() }
}));

describe("AlertDialogDeletetransaction", () => {
  beforeEach(() => {
    // Always online for tests
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
    });

    //component deletes something from local storage - inspecting if removeItem is called
    Storage.prototype.removeItem = jest.fn();
  });

  const mockProps = {
    open: true,
    onClose: jest.fn(),
    transactionId: "999",
    setTransactionId: jest.fn(),
  };

  test("dialog renders with transaction ID", () => {
    render(<AlertDialogDeletetransaction {...mockProps} />);

    expect(
      screen.getByText(/are you absolutely sure/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/999/i)).toBeInTheDocument();
  });

  test("Clicking Cancel calls onClose", () => {
    render(<AlertDialogDeletetransaction {...mockProps} />);

    fireEvent.click(screen.getByText(/cancel/i));

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test("Clicking Delete calls axios.delete with transactionId", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({ status: 200 });

    render(<AlertDialogDeletetransaction {...mockProps} />);

    const buttons = screen.getAllByRole("button");
    const deleteBtn = buttons[buttons.length - 1];
    fireEvent.click(deleteBtn);
    // fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/api/transactions/999");
    });
  });

    test("Delete success clears transactionId & localStorage", async () => {
      (axios.delete as jest.Mock).mockResolvedValue({ status: 200 });

      render(<AlertDialogDeletetransaction {...mockProps} />);

      const buttons = screen.getAllByRole("button");
      const deleteBtn = buttons[buttons.length - 1];
      fireEvent.click(deleteBtn);
      // fireEvent.click(screen.getByText(/delete/i));

      await waitFor(() => {
        expect(mockProps.setTransactionId).toHaveBeenCalledWith(null);
        expect(localStorage.removeItem).toHaveBeenCalledWith("transactionId");
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });
});
