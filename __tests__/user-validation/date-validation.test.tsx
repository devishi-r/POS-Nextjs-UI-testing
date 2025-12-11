import { render, screen, fireEvent, act } from "@testing-library/react";
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
    expect(screen.getByTestId("chartfour-start")).toHaveValue("2024-05-01");
    expect(screen.getByTestId("chartfour-end")).toHaveValue("2024-05-01");
  });

  test("shows error when start > end", async () => {
    await act(async () => render(<ChartFour />));

    const startInput = screen.getByTestId("chartfour-start");
    const endInput   = screen.getByTestId("chartfour-end");

    await act(async () => {
      fireEvent.change(startInput, { target: { value: "2024-06-10" } });
      fireEvent.change(endInput,   { target: { value: "2024-06-01" } });
    });

    expect(screen.getAllByTestId("date-error").length).toBeGreaterThan(0);
  });

});
