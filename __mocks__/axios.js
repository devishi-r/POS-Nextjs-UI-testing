export default {
  get: jest.fn((url) => {
    // Income chart API mock
    if (url.includes("income")) {
      return Promise.resolve({
        status: 200,
        data: {
          combinedResult: [
            { totalIncome: 10 },
            { totalIncome: 20 },
            { totalIncome: 30 },
          ],
        },
      });
    }

    // Product sales chart mock
    if (url.includes("productsale")) {
      return Promise.resolve({
        status: 200,
        data: {
          combinedResult: [
            { totalQuantity: 5 },
            { totalQuantity: 10 },
            { totalQuantity: 15 },
          ],
        },
      });
    }

    // Favorite products chart mock
    if (url.includes("favorite")) {
      return Promise.resolve({
        status: 200,
        data: {
          topProducts: [
            { productName: "A", totalQuantity: 10 },
            { productName: "B", totalQuantity: 8 },
            { productName: "C", totalQuantity: 5 },
          ],
          totalQuantity: 23,
        },
      });
    }

    // SAFE fallback for any other endpoint
    return Promise.resolve({
      status: 200,
      data: { combinedResult: [] },
    });
  }),

  post: jest.fn(() =>
    Promise.resolve({
      status: 201,
      data: { id: "123" },
    })
  ),
};

// Mock toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
  useTheme: () => ({ theme: "dark" }),
}));

// Required for fullscreen tests
Object.defineProperty(document, "fullscreenEnabled", { value: true });
