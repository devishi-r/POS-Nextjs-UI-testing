/**
 * @file SidebarNavigation.test.tsx
 *
 * Smoke-test for verifying sidebar navigation works for all NAVBAR_ITEMS.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/dashboard/navbar";
import { NAVBAR_ITEMS } from "@/constant/navbarMenu";

// Mocking next/link to behave like normal <a> in tests
jest.mock("next/link", () => {
  return ({ children, href }: any) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  );
});

// Mocking usePathname to always return "/"
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Sidebar Navigation", () => {
  test("renders all sidebar navigation buttons", () => {
    render(<Navbar />);

    NAVBAR_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  test("each navigation link points to the correct route", async () => {
    const user = userEvent.setup();

    render(<Navbar />);

    for (const item of NAVBAR_ITEMS) {
      const link = screen.getByTestId(`link-${item.path}`);

      expect(link).toBeInTheDocument();

      // Simulate clicking the sidebar link
      await user.click(link);

      // Expectation: clicking updates the URL correctly.
      // JSDOM cannot change URL, but we can assert the <a href> is correct.
      expect(link).toHaveAttribute("href", item.path);
    }
  });
});
