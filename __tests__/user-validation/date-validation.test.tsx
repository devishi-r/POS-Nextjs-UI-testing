import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ChartFour from "@/components/charts/chartfour";
import "@testing-library/jest-dom";

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: { groupedData: [] }
  })
}));

describe("ChartFour Date Validation", () => {

  test("renders date inputs", async () => {
    await act(async () => render(<ChartFour />));

    // initialising default start dates
    expect(screen.getByTestId("start-date")).toHaveValue("2024-05-01");
    expect(screen.getByTestId("end-date")).toHaveValue("2024-05-15");
  });

  test("shows error when start > end", async () => {
    await act(async () => render(<ChartFour />));

    const startInput = screen.getByTestId("start-date");
    const endInput   = screen.getByTestId("end-date");

    await act(async () => {
      fireEvent.change(startInput, { target: { value: "2024-06-10" } });
      fireEvent.change(endInput,   { target: { value: "2024-06-01" } });
    });

    fireEvent.click(screen.getByTestId("apply-date-filter-btn"));
    
    await waitFor(() => {
      expect(screen.getByTestId("date-error")).toBeInTheDocument();
    });

  });

});
