import { renderHook, act } from "@testing-library/react-hooks";
import useAvatar from "@/hooks/useAvatar";
import {
  downloadAvatarImage,
  uploadAvatarImage,
} from "@/services/avatarService";
import { vi } from "vitest";

vi.mock("@/services/avatarService");

describe("useAvatar", () => {
  const userId = "123";
  const url = "http://example.com/avatar.jpg";
  const onUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with the provided URL", async () => {
    downloadAvatarImage.mockResolvedValue(url);

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar(userId, url, onUpload)
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.avatarUrl).toBe(url);
    expect(result.current.loading).toBe(false);
  });

  it("should handle upload successfully", async () => {
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const filePath = "http://example.com/new-avatar.jpg";
    uploadAvatarImage.mockResolvedValue(filePath);

    const { result } = renderHook(() => useAvatar(userId, url, onUpload));

    await act(async () => {
      await result.current.handleUpload(file);
    });

    expect(result.current.uploading).toBe(false);
    expect(onUpload).toHaveBeenCalledWith(filePath);
  });

  it("should handle upload error", async () => {
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const errorMessage = "Upload failed";
    uploadAvatarImage.mockRejectedValue(new Error(errorMessage));
    window.alert = vi.fn();

    const { result } = renderHook(() => useAvatar(userId, url, onUpload));

    await act(async () => {
      await result.current.handleUpload(file);
    });

    expect(result.current.uploading).toBe(false);
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
  });

  it("should set avatarUrl to null if no URL is provided", async () => {
    const { result } = renderHook(() => useAvatar(userId, null, onUpload));

    expect(result.current.avatarUrl).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("should update avatarUrl when URL changes", async () => {
    const newUrl = "http://example.com/new-avatar.jpg";
    downloadAvatarImage.mockResolvedValue(newUrl);

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ userId, url, onUpload }) => useAvatar(userId, url, onUpload),
      {
        initialProps: { userId, url, onUpload },
      }
    );

    rerender({ userId, url: newUrl, onUpload });

    await waitForNextUpdate();

    expect(result.current.avatarUrl).toBe(newUrl);
    expect(result.current.loading).toBe(false);
  });

  it("should handle download error", async () => {
    const errorMessage = "Download failed";
    downloadAvatarImage.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() =>
      useAvatar(userId, url, onUpload)
    );

    await waitForNextUpdate();

    expect(result.current.avatarUrl).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
