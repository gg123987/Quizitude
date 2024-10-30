import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi } from "vitest";
import useCategories from "@/hooks/useCategories";
import { getCategoriesByUser } from "@/services/categoryService";

vi.mock("@/services/categoryService");

describe("useCategories", () => {
  it("should fetch categories on mount", async () => {
    const mockCategories = [{ id: 1, name: "Category 1" }];
    getCategoriesByUser.mockResolvedValueOnce(mockCategories);

    const { result, waitForNextUpdate } = renderHook(() =>
      useCategories("userId")
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBe(null);
  });

  it("should handle fetch error", async () => {
    const mockError = new Error("Failed to fetch");
    getCategoriesByUser.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useCategories("userId")
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe(mockError);
  });

  it("should refresh categories", async () => {
    const mockCategories = [{ id: 1, name: "Category 1" }];
    getCategoriesByUser.mockResolvedValueOnce(mockCategories);

    const { result, waitForNextUpdate } = renderHook(() =>
      useCategories("userId")
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual(mockCategories);

    const newMockCategories = [{ id: 2, name: "Category 2" }];
    getCategoriesByUser.mockResolvedValueOnce(newMockCategories);

    act(() => {
      result.current.refreshCategories();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual(newMockCategories);
  });
});
