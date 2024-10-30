import { renderHook, act } from "@testing-library/react-hooks";
import { vi } from "vitest";
import useFiles from "@/hooks/useFiles";
import { getFilesByUser } from "@/services/fileService";

vi.mock("@/services/fileService");

describe("useFiles", () => {
  const userId = "test-user-id";
  const mockFiles = [
    { id: 1, name: "file1" },
    { id: 2, name: "file2" },
  ];

  beforeEach(() => {
    getFilesByUser.mockClear();
  });

  it("should fetch files and update state", async () => {
    getFilesByUser.mockResolvedValue(mockFiles);

    const { result, waitForNextUpdate } = renderHook(() => useFiles(userId));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.files).toEqual(mockFiles);
    expect(result.current.error).toBe(null);
  });

  it("should handle error", async () => {
    const errorMessage = "Error fetching files";
    getFilesByUser.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useFiles(userId));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.files).toEqual([]);
    expect(result.current.error).toEqual(new Error(errorMessage));
  });

  it("should refetch files", async () => {
    getFilesByUser.mockResolvedValue(mockFiles);

    const { result, waitForNextUpdate } = renderHook(() => useFiles(userId));

    await waitForNextUpdate();

    expect(result.current.files).toEqual(mockFiles);

    const newMockFiles = [{ id: 3, name: "file3" }];
    getFilesByUser.mockResolvedValue(newMockFiles);

    act(() => {
      result.current.refetch();
    });

    await waitForNextUpdate();

    expect(result.current.files).toEqual(newMockFiles);
  });
});
