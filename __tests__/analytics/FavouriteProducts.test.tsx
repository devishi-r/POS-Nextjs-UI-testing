import { render, screen, act } from "@testing-library/react";
import FavoriteProductsPage from "@/app/(root)/analytics/product/favorites/page";

jest.mock("axios");
jest.mock("react-apexcharts", () => () => <div data-testid="apexchart-mock" />);
jest.mock("next/dynamic", () => ({ //whenever page tries to dynamically import a chart - render a dev with testid instead
  __esModule: true,
  default: () =>
    function MockDynamicComponent(props: any) {
      return <div data-testid="apexchart-mock" {...props} />;
    },
}));


describe("Analytics - Favorite Products", () => {
  test("renders chart mock", async () => {
    await act(async () => {
      render(<FavoriteProductsPage />);
    });

    expect(screen.getByTestId("apexchart-mock")).toBeInTheDocument();
  });
});
