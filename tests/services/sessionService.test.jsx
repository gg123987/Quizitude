import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSession,
  getSessionsByUser,
  getSessionsByDeck,
  getSessionById,
} from "@/services/sessionService";
import { supabase } from "@/utils/supabase";

// Mock the supabase client
vi.mock("@/utils/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock the updateUserStreak function
vi.mock("./userService", () => ({
  updateUserStreak: vi.fn(),
}));

describe("Session Service", () => {
  const mockSessionData = {
    user_id: "user1",
    deck_id: "deck1",
    date_reviewed: "2024-10-31",
  };
  const mockUserId = "user1";
  const mockDeckId = "deck1";
  const mockSessionId = "1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSession", () => {
    it("should create a session successfully", async () => {
      const mockResponse = {
        data: [mockSessionData],
        error: null,
      };

      // Mock the supabase call for creating a session
      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce(mockResponse),
        }),
      });

      // Mock the supabase call within updateUserStreak for fetching user details
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: { last_session: null, current_streak: 0, longest_streak: 0 },
            error: null,
          }),
        }),
      });

      // Mock the supabase call within updateUserStreak for updating user details
      supabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      const result = await createSession(mockSessionData);
      expect(result).toEqual([mockSessionData]);
      expect(supabase.from).toHaveBeenCalledWith("sessions");
    });

    it("should throw an error when session creation fails", async () => {
      const error = new Error("Create Error");

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce({
            data: null,
            error: error,
          }),
        }),
      });

      await expect(createSession(mockSessionData)).rejects.toThrow(error);
    });
  });

  describe("getSessionsByUser", () => {
    it("should fetch sessions for a specific user", async () => {
      const mockResponse = [mockSessionData];

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          order: vi
            .fn()
            .mockReturnValueOnce(
              Promise.resolve({ data: mockResponse, error: null })
            ),
        }),
      });

      const result = await getSessionsByUser(mockUserId);
      expect(result).toEqual(mockResponse);
      expect(supabase.from).toHaveBeenCalledWith("sessions");
    });

    it("should return an empty array when fetching fails", async () => {
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({ data: null, error: new Error("Fetch Error") })
          ),
      });

      const result = await getSessionsByUser(mockUserId);
      expect(result).toEqual([]);
    });
  });

  describe("getSessionsByDeck", () => {
    it("should fetch sessions for a specific deck", async () => {
      const mockResponse = [mockSessionData];

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          order: vi
            .fn()
            .mockReturnValueOnce(
              Promise.resolve({ data: mockResponse, error: null })
            ),
        }),
      });

      const result = await getSessionsByDeck(mockDeckId);
      expect(result).toEqual(mockResponse);
      expect(supabase.from).toHaveBeenCalledWith("sessions");
    });

    it("should return an empty array when fetching fails", async () => {
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({ data: null, error: new Error("Fetch Error") })
          ),
      });

      const result = await getSessionsByDeck(mockDeckId);
      expect(result).toEqual([]);
    });
  });

  describe("getSessionById", () => {
    it("should fetch a session by its ID", async () => {
      const mockResponse = {
        data: mockSessionData,
        error: null,
      };

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnValueOnce(Promise.resolve(mockResponse)),
      });

      const result = await getSessionById(mockSessionId);
      expect(result).toEqual(mockSessionData);
    });

    it("should return null when fetching fails", async () => {
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnValueOnce({
          data: null,
          error: new Error("Fetch Error"),
        }),
      });

      const result = await getSessionById(mockSessionId);
      expect(result).toBeNull();
    });
  });
});
