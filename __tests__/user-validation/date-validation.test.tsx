import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ChartFour from "@/components/charts/chartfour";
import "@testing-library/jest-dom";
import ChartOne from "@/components/charts/chartone";

jest.mock("axios", () => ({ //mocking fetchapi implemented in components>charts 
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

  test("shows error when end date is in the future", async () => {
    await act(async () => render(<ChartFour />));

    const futureDate = "2099-01-01";

    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: futureDate },
    });

    fireEvent.click(screen.getByTestId("apply-date-filter-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("date-error"))
        .toHaveTextContent(/end date cannot be in the future/i);
    });

    expect(screen.queryByTestId("analytics-chart")).not.toBeInTheDocument();
  });

  test("shows error when start date is in the future", async () => {
    await act(async () => render(<ChartFour />));

    const futureDate = "2099-01-01";

    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: futureDate },
    });

    fireEvent.click(screen.getByTestId("apply-date-filter-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("date-error"))
        .toHaveTextContent(/start date cannot be in the future/i);
    });

    // chart should not render when error exists
    expect(screen.queryByTestId("analytics-chart")).not.toBeInTheDocument();
  });
});


describe("ChartOne Date Validation", () => {

  test("renders date inputs", async () => {
    await act(async () => render(<ChartOne />));

    // initialising default start dates
    expect(screen.getByTestId("start-date")).toHaveValue("2024-05-01");
    expect(screen.getByTestId("end-date")).toHaveValue("2024-05-15");
  });

  test("shows error when start > end", async () => {
    await act(async () => render(<ChartOne />));

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

  test("shows error when start date is in the future", async () => {
    await act(async () => render(<ChartOne />));

    const futureDate = "2099-01-01";

    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: futureDate },
    });

    fireEvent.click(screen.getByTestId("apply-date-filter-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("date-error"))
        .toHaveTextContent(/start date cannot be in the future/i);
    });

    expect(screen.queryByTestId("analytics-chart")).not.toBeInTheDocument();
  });

  test("shows error when end date is in the future", async () => {
    await act(async () => render(<ChartOne />));

    const futureDate = "2099-01-01";

    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: futureDate },
    });

    fireEvent.click(screen.getByTestId("apply-date-filter-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("date-error"))
        .toHaveTextContent(/end date cannot be in the future/i);
    });

    expect(screen.queryByTestId("analytics-chart")).not.toBeInTheDocument();
  });


});

