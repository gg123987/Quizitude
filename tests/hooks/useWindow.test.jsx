import { renderHook, act } from "@testing-library/react-hooks";
import useWindowSize from "@/hooks/useWindowDimensions";

describe("useWindowSize", () => {
  it("should return the initial window size", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it("should update window size on resize", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.innerWidth = 500;
      window.innerHeight = 500;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(500);
  });
});
