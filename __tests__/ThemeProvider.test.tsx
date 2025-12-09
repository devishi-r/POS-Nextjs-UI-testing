import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";

// ensruing ui doesn't crash on using themeprovider
describe("ThemeProvider", () => {
  test("renders children inside the provider", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument(); 
  });
});
