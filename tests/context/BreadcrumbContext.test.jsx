import { renderHook, act } from "@testing-library/react-hooks";
import { BreadcrumbProvider, useBreadcrumb } from "@/context/BreadcrumbContext";

describe("BreadcrumbContext", () => {
  it("provides initial breadcrumb data", () => {
    const { result } = renderHook(() => useBreadcrumb(), {
      wrapper: BreadcrumbProvider,
    });

    expect(result.current.breadcrumbData).toEqual({
      categoryId: null,
      deckId: null,
    });
  });

  it("updates breadcrumb data", () => {
    const { result } = renderHook(() => useBreadcrumb(), {
      wrapper: BreadcrumbProvider,
    });

    act(() => {
      result.current.setBreadcrumbData({
        categoryId: "cat123",
        deckId: "deck456",
      });
    });

    expect(result.current.breadcrumbData).toEqual({
      categoryId: "cat123",
      deckId: "deck456",
    });
  });
});
