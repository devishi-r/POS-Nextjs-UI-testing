import { render, screen, waitFor } from "@testing-library/react";
import IncomePage from "@/app/(root)/analytics/income/page";

// Required mocks
jest.mock("axios");
jest.mock("next/dynamic", () => () => (props: any) => (
  <img data-testid="apexchart-mock" alt="chart" {...props} /> //since jsdom cant render real canvas elements like apexcharts - fallback: rendering a simple image holder
));

describe("Analytics - Income Chart", () => {
  test("renders income heading", async () => {
    await waitFor(() => render(<IncomePage />));
    // expect(screen.getByText(/income/i)).toBeInTheDocument();
    expect(screen.getByTestId("analytics-income-page")).toBeVisible();
  });

  test("renders date inputs", async () => {
    await waitFor(() => render(<IncomePage />));    
    expect(screen.getByTestId("start-date")).toBeInTheDocument();
    expect(screen.getByTestId("end-date")).toBeInTheDocument();
    });


  test("renders chart canvas element", async () => {
    await waitFor(() => render(<IncomePage />));
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });
});
