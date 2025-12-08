import { render, screen } from "@testing-library/react";
import IncomePage from "@/app/(root)/analytics/income/page";

// Required mocks
jest.mock("axios");
jest.mock("next/dynamic", () => () => (props: any) => (
  <img data-testid="apexchart-mock" alt="chart" {...props} />
));

describe("Analytics - Income Chart", () => {
  test("renders income heading", () => {
    render(<IncomePage />);
    expect(screen.getByText(/income/i)).toBeInTheDocument();
  });

  test("renders date inputs", () => {
    render(<IncomePage />);
    expect(screen.getByDisplayValue("2024-05-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-05-15")).toBeInTheDocument();
    });


  test("renders chart canvas element", () => {
    render(<IncomePage />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });
});
