import "@testing-library/jest-dom";

// Mock global fetch for components that call APIs in useEffect
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
  })
) as unknown as typeof fetch;


Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),        // deprecated
    removeListener: jest.fn(),     // deprecated
    dispatchEvent: jest.fn(),
  }),
});

// Fully typed and compatible IntersectionObserver mock for Jest + TypeScript
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {
    // no-op
  }

  observe(_target: Element) {
    // no-op
  }

  unobserve(_target: Element) {
    // no-op
  }

  disconnect() {
    // no-op
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

(global as any).IntersectionObserver = MockIntersectionObserver;

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));
