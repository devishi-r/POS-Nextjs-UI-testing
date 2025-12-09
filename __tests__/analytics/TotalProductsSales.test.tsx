import { render, screen, act } from "@testing-library/react";
import SalesPage from "@/app/(root)/analytics/product/sales/page";

jest.mock("axios");
jest.mock("react-apexcharts", () => () => <div data-testid="apexchart-mock" />);

describe("Analytics - Total Products Sales", () => {
  test("renders page title", async () => {
    await act(async () => {
      render(<SalesPage />);
    });

    expect(screen.getAllByText(/Total Products Sales/i).length).toBeGreaterThan(0);
  });

  test("renders date inputs", async () => {
    await act(async () => {
      render(<SalesPage />);
    });

    const start = screen.getByLabelText(/start/i); //getLabelByText() returns form control associated with argument label text
    const end = screen.getByLabelText(/end/i); //presence of input elements (date filters) is confirmed

    expect(start).toHaveAttribute("type", "date");
    expect(end).toHaveAttribute("type", "date");

    expect(start).toBeInTheDocument();
    expect(end).toBeInTheDocument();
  });

  test("renders chart placeholder", async () => {
    await act(async () => {
      render(<SalesPage />);
    });

    expect(screen.getByTestId("apexchart-mock")).toBeInTheDocument(); //expects dynamic render of chart to be triggered
  });
});
