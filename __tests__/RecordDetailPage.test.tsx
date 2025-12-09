import { render, screen } from "@testing-library/react";
import DetailPage from "@/app/(root)/records/[id]/page";
import axios from "axios";
import { useRouter } from "next/navigation";

//replacing axios module and nextjs' router with a mock
jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Ensure axios.isAxiosError always returns true 
(axios.isAxiosError as any) = () => true;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

describe("DetailPage (Record Details)", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test("renders transaction items and calculates totals", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        data: { data: { tax: 10 } },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: [
          {
            product: {
              productstock: { name: "Coke" },
              sellprice: 5,
            },
            quantity: 2,
          },
        ],
      });

    render(<DetailPage params={{ id: "1001" }} />);

    // more reliable than waitFor(getByText)
    expect(await screen.findByText(/Coke/i)).toBeInTheDocument();

    expect(screen.getAllByText("$10.00")).toHaveLength(2);
    expect(screen.getByText("$1.00")).toBeInTheDocument();
    expect(screen.getByText("$11.00")).toBeInTheDocument();
  });

  test("redirects to error page when 404 returned", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        data: { data: { tax: 10 } },
      })
      .mockRejectedValueOnce({
        response: { status: 404 },
      });

    render(<DetailPage params={{ id: "9999" }} />);

    // findBy pushes automatically once effects finish
    await screen.findByText("Order Details"); // ensure render

    expect(mockPush).toHaveBeenCalledWith("/_error");
  });

  test("print button disabled when total is 0", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        data: { data: { tax: 10 } },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: [],
      });

    render(<DetailPage params={{ id: "1002" }} />);

    const button = await screen.findByRole("button");
    expect(button).toBeDisabled();
  });
});
