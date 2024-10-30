import { renderHook } from "@testing-library/react-hooks";
import { describe, it, expect, vi } from "vitest";
import useCategory from "@/hooks/useCategory";
import { getCategoryById } from "@/services/categoryService";

vi.mock("@/services/categoryService");

describe("useCategory", () => {
  it("should return category data when categoryId is provided", async () => {
    const mockCategory = { id: 1, name: "Category 1" };
    getCategoryById.mockResolvedValue(mockCategory);

    const { result, waitForNextUpdate } = renderHook(() => useCategory(1));

    await waitForNextUpdate();

    expect(result.current.category).toEqual(mockCategory);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should return error when getCategoryById fails", async () => {
    const mockError = new Error("Failed to fetch category");
    getCategoryById.mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useCategory(1));

    await waitForNextUpdate();

    expect(result.current.category).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it("should set loading to false when no categoryId is provided", () => {
    const { result } = renderHook(() => useCategory(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.category).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});
