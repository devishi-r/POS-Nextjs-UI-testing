export default {
  get: jest.fn(() => Promise.resolve({ status: 200, data: [] })),
  post: jest.fn(() => Promise.resolve({ status: 201, data: { id: "123" } }))
};

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    warn: jest.fn(),
  }
}));

jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
  useTheme: () => ({ theme: "dark" }),
}));

Object.defineProperty(document, "fullscreenEnabled", { value: true });

