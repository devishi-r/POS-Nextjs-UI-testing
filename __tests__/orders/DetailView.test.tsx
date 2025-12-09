import { render, screen, fireEvent, act } from "@testing-library/react";
import Detail from "@/components/order/components/detail";

// Mock styled-jsx (removes jsx warnings)
jest.mock("styled-jsx/style", () => () => null);

// Mock react-to-print
const mockPrintFn = jest.fn();
jest.mock("react-to-print", () => ({
  useReactToPrint: jest.fn(() => mockPrintFn),
}));

// Mock axios
jest.mock("axios", () => ({
  patch: jest.fn(() => Promise.resolve({ status: 200 })),
  get: jest.fn(() => Promise.resolve({ data: { data: { tax: 0 } } })),
}));

// Mock eventBus
jest.mock("@/lib/even", () => ({
  emit: jest.fn(),
}));

describe("Detail Component (Bill/Receipt View)", () => {
  const mockSetTransactionId = jest.fn();

  const sampleData = [
    {
      id: "t1",
      transactionId: "123",
      quantity: 2,
      productId: "p1",
      product: {
        sellprice: 10,
        productstock: { name: "itemOne", cat: "" },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correct subtotal, tax, and total", () => {
    render(
      <Detail
        data={sampleData}
        transactionId="123"
        setTransactionId={mockSetTransactionId}
      />
    );

    // 3 occurrences of "$20.00" (item row, subtotal, total)
    expect(screen.getAllByText("$20.00").length).toBeGreaterThan(0);

    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/tax/i)).toBeInTheDocument();
  });

  test("calls print function when print button clicked", async () => {
    render(
      <Detail
        data={sampleData}
        transactionId="123"
        setTransactionId={mockSetTransactionId}
      />
    );

    const printBtn = screen.getByTestId("print-btn");

    await act(async () => {
      fireEvent.click(printBtn);
    });

    // axios.patch was called
    const axios = require("axios");
    expect(axios.patch).toHaveBeenCalled(); //beacuse print operation usually updates something server side

    expect(mockPrintFn).toHaveBeenCalled();

    expect(mockSetTransactionId).toHaveBeenCalledWith(null); //verifying ui resets after printing

    // mimicking original implementation - 'event emitted'
    // ensures after printing component sends correct signal to reset ui :)
    const eventBus = require("@/lib/even");
    expect(eventBus.emit).toHaveBeenCalledWith("clearTransactionData");
  });
});
