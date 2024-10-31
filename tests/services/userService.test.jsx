import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUserById,
  insertUser,
  updateUser,
  deleteUser,
  updateUserStreak,
  checkUserStreak,
} from "@/services/userService"; // Update with the correct path to your user service
import { supabase } from "@/utils/supabase";

// Mock the supabase client
vi.mock("@/utils/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("User Service", () => {
  const mockUserId = "user1";
  const mockUserData = {
    id: mockUserId,
    name: "Test User",
    email: "test@example.com",
    last_session: null,
    current_streak: 0,
    longest_streak: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should fetch a user by ID", async () => {
      const mockResponse = {
        data: mockUserData,
        error: null,
      };

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce(mockResponse),
        }),
      });

      const result = await getUserById(mockUserId);
      expect(result).toEqual(mockUserData);
      expect(supabase.from).toHaveBeenCalledWith("users");
    });

    it("should throw an error if fetching user fails", async () => {
      const error = new Error("Fetch Error");
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({ data: null, error }),
        }),
      });

      await expect(getUserById(mockUserId)).rejects.toThrow(error);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const mockResponse = {
        data: [mockUserData],
        error: null,
      };

      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce(Promise.resolve(mockResponse)),
        }),
      });

      const result = await deleteUser(mockUserId);
      expect(result).toEqual(mockResponse.data);
    });

    it("should log an error when deletion fails", async () => {
      const error = new Error("Delete Error");
      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnValueOnce({
          eq: vi
            .fn()
            .mockReturnValueOnce(Promise.resolve({ data: null, error })),
        }),
      });

      // should return object wih field data and error
      await expect(deleteUser(mockUserId)).rejects.toThrow(error);
    });
  });

  describe("updateUserStreak", () => {
    it("should throw an error if streak update fails", async () => {
      const error = new Error("Streak Update Error");
      const currentDate = new Date();

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: null, error }),
          }),
        }),
      });

      await expect(updateUserStreak(mockUserId, currentDate)).rejects.toThrow(
        error
      );
    });
  });

  describe("checkUserStreak", () => {
    it("should check and reset the user's streak correctly", async () => {
      const mockResponse = {
        data: { ...mockUserData, last_session: new Date() },
        error: null,
      };

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce(mockResponse),
          }),
        }),
      });

      const result = await checkUserStreak(mockUserId);
      expect(result).toBe(mockUserData.current_streak);
    });

    it("should throw an error if streak check fails", async () => {
      const error = new Error("Streak Check Error");
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: null, error }),
          }),
        }),
      });

      await expect(checkUserStreak(mockUserId)).rejects.toThrow(error);
    });
  });
});
