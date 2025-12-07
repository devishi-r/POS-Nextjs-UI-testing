import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/page";

describe("Landing Page", () => {
  test("renders the typewriter animation container", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("typewriter-text")).toBeInTheDocument();
  });

  test("renders the welcome message", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Welcome to Ixuapps/i)).toBeInTheDocument();
  });

  test("renders the Home CTA link", () => {
    render(<LandingPage />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });
});
