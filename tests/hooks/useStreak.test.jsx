import { renderHook, waitFor } from "@testing-library/react";
import useStreak from "@/hooks/useStreak";
import { checkUserStreak } from "@/services/userService";

// Mock the checkUserStreak function
vi.mock("@/services/userService");

describe("useStreak", () => {
  it("should fetch and update streak data on mount", async () => {
    const mockUserId = "123";
    const mockStreakData = { streak: 5 };

    // Mock the implementation of checkUserStreak
    checkUserStreak.mockResolvedValue(mockStreakData);

    const { result } = renderHook(() => useStreak(mockUserId));

    // Wait for the hook to update the state
    await waitFor(() => {
      expect(result.current).toEqual(mockStreakData);
    });

    expect(checkUserStreak).toHaveBeenCalledWith(mockUserId);
  });

  it("should handle errors when fetching streak data", async () => {
    const mockUserId = "123";
    const mockError = new Error("Failed to fetch streak data");

    // Mock the implementation of checkUserStreak to throw an error
    checkUserStreak.mockRejectedValue(mockError);

    const { result } = renderHook(() => useStreak(mockUserId));

    // Wait for the hook to update the state
    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(checkUserStreak).toHaveBeenCalledWith(mockUserId);
  });
});
