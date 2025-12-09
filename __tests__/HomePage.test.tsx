import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(root)/home/page";

beforeAll(() => {
  global.fetch = jest.fn(() => //mocked weather API fetch
    Promise.resolve({
      json: () =>
        Promise.resolve({
          weather: [{ icon: "01d" }],
          main: { temp: 25 },
        }),
    })
  ) as jest.Mock;
});

describe("Home Page", () => {
  test("renders static dashboard text", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Don't Forget To Rest Your Soul/i)
    ).toBeInTheDocument();
  });
});
