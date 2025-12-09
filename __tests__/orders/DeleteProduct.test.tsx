import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertDialogDelete } from "@/components/order/components/delete";
import axios from "axios";
import eventBus from "@/lib/even";
import { TransactionData } from "@/types/transaction";

// Force mock axios for both ESM/CJS variants
jest.mock("axios", () => ({
  delete: jest.fn(),
  default: { delete: jest.fn() }
}));

jest.mock("@/lib/even", () => ({ emit: jest.fn() }));

describe("AlertDialogDelete", () => {
  const mockedAxiosDelete = axios.delete as jest.Mock;

  const mockData: TransactionData = {
    id: "123",
    productId: "999",
    quantity: 1,
    transactionId: "T-10",
    product: {
      sellprice: 10,
      productstock: {
        name: "Apple",
        cat: ""
      }
    }
  };

  beforeEach(() => {
    mockedAxiosDelete.mockReset();
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true
    });
  });

  test("opens dialog when trash icon is clicked", () => {
    render(<AlertDialogDelete data={mockData} />);

    fireEvent.click(screen.getByRole("button")); // trash icon

    expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument();
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
  });

  test("clicking Cancel closes dialog", () => {
    render(<AlertDialogDelete data={mockData} />);

    fireEvent.click(screen.getByRole("button")); // open dialog
    fireEvent.click(screen.getByText(/cancel/i));

    expect(
      screen.queryByText(/are you absolutely sure/i)
    ).not.toBeInTheDocument();
  });

  test("clicking Delete calls axios.delete", async () => {
    mockedAxiosDelete.mockResolvedValue({ status: 200 });

    render(<AlertDialogDelete data={mockData} />);

    fireEvent.click(screen.getByRole("button")); // open dialog

    fireEvent.click(screen.getByTestId("confirm-delete-btn"));
    // fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockedAxiosDelete).toHaveBeenCalledWith("/api/onsale/123");
    });
  });

  test("emits fetchTransactionData event after delete", async () => { //after deletion - refreshed transaction list (requeried from api/onsale...) and re-rendered table
    mockedAxiosDelete.mockResolvedValue({ status: 200 });

    render(<AlertDialogDelete data={mockData} />);

    fireEvent.click(screen.getByRole("button"));

    // const buttons = screen.getAllByRole("button");
    // const deleteBtn = buttons[buttons.length - 1];
    // fireEvent.click(deleteBtn);
    fireEvent.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(eventBus.emit).toHaveBeenCalledWith("fetchTransactionData");
    });
  });
});
