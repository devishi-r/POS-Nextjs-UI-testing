import { render, screen, fireEvent } from "@testing-library/react";
import FullscreenButton from "@/components/fullscreen/fullscreen";

describe("FullscreenButton - Toggle Fullscreen", () => {
  let mockRef: React.RefObject<any>; //mock react ref that points to mockelement
  let mockElement: any; //mimics a real DOM node - real component passes `targetRef.current`.requestFullScreen()

  beforeEach(() => {
    
    mockElement = {
      requestFullscreen: jest.fn(),
    };

    mockRef = {
      current: mockElement,
    };

    // Mock browser fullscreen API
    document.exitFullscreen = jest.fn();
  });

  function setFullscreen(isFullscreen: boolean) {
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      value: isFullscreen ? document.documentElement : null,
    });
  }

  test("enters fullscreen when not currently fullscreen", () => {
    setFullscreen(false);

    render(<FullscreenButton targetRef={mockRef} />);

    const btn = screen.getByTestId("fullscreen-btn");

    fireEvent.click(btn);

    expect(mockElement.requestFullscreen).toHaveBeenCalledTimes(1);
    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  test("exits fullscreen when already in fullscreen", () => {
    setFullscreen(true);

    render(<FullscreenButton targetRef={mockRef} />);

    const btn = screen.getByTestId("fullscreen-btn");

    fireEvent.click(btn);

    expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    expect(mockElement.requestFullscreen).not.toHaveBeenCalled();
  });
});
