import { renderHook } from "@testing-library/react-hooks";
import { describe, it, expect, vi } from "vitest";
import useFile from "@/hooks/useFile";
import { getFileByDeck } from "@/services/fileService";

vi.mock("@/services/fileService");

describe("useFile", () => {
  it("should return file data when fetch is successful", async () => {
    const mockData = [{ id: 1, name: "Test File" }];
    getFileByDeck.mockResolvedValueOnce(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useFile(1));

    await waitForNextUpdate();

    expect(result.current.file).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should return an error when fetch fails", async () => {
    const mockError = new Error("Failed to fetch");
    getFileByDeck.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useFile(1));

    await waitForNextUpdate();

    expect(result.current.file).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });
});
