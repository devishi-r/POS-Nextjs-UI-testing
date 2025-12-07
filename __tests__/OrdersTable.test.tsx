import { render, screen } from "@testing-library/react";
import OrdersPage from "@/app/(root)/orders/page";

describe("Orders Page", () => {
  test("renders table headers", () => {
    render(<OrdersPage />);

    const headers = [
      /product/i,
      /type/i,
      /price/i,
      /(qty|quantity)/i,
      /amount/i
    ];

headers.forEach(h => {
  expect(screen.getByText(h)).toBeInTheDocument();
});


    headers.forEach(h => {
      expect(screen.getByText(new RegExp(h, "i"))).toBeInTheDocument();
    });
  });
});
