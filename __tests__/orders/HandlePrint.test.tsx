import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Detail from "@/components/order/components/detail";

import { useReactToPrint } from "react-to-print";
jest.mock("react-to-print", () => ({
  useReactToPrint: jest.fn(),
}));

jest.mock("axios", () => ({
  patch: jest.fn(),
}));

import axios from "axios";
import { TransactionData } from "@/types/transaction";

describe("Detail Component - Print", () => {
  test("calls handlePrint on print button click", async () => {
    const mockPrint = jest.fn();

    (useReactToPrint as jest.Mock).mockReturnValue(mockPrint);

    (axios.patch as jest.Mock).mockResolvedValue({ status: 200, data: {} });

    const fakeData: TransactionData[] = [
      {
        id: "t1",
        transactionId: "123",
        productId: "1",
        quantity: 1,
        product: {
          sellprice: 10,
          productstock: {
            name: "item",
            cat: ""
          }
        }
      }
    ];

    const mockSetTransactionId = jest.fn();

    await act(async () => {
      render(
        <Detail
          data={fakeData}
          transactionId="123"
          setTransactionId={mockSetTransactionId}
        />,
      );
    });

    const printButton = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(printButton);
    });

    expect(mockPrint).toHaveBeenCalled();
  });
});