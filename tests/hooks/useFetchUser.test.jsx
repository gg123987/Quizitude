import { renderHook } from "@testing-library/react-hooks";
import { vi } from "vitest";
import useFetchUser from "@/hooks/useFetchUser";
import { getUserById } from "@/services/userService";

vi.mock("@/services/userService");

describe("useFetchUser", () => {
  it("should return user data when userId is provided", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    getUserById.mockResolvedValue(mockUser);

    const { result, waitForNextUpdate } = renderHook(() => useFetchUser(1));

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should return error when getUserById fails", async () => {
    const mockError = new Error("Failed to fetch user");
    getUserById.mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useFetchUser(1));

    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it("should not fetch user data when userId is not provided", () => {
    const { result } = renderHook(() => useFetchUser(null));

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
