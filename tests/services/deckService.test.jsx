import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createDeck,
  getDecksByUser,
  getDeckById,
  updateDeck,
  deleteDeck,
} from "@/services/deckService";
import { supabase } from "@/utils/supabase";

// Mock the supabase client
vi.mock("@/utils/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("Deck Service", () => {
  const mockDeckData = { id: "1", user_id: "user1", name: "Test Deck" };
  const mockUserId = "user1";
  const mockDeckId = "1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createDeck", () => {
    it("should create a deck successfully", async () => {
      // Mock the response for successful insert
      const mockResponse = {
        data: [mockDeckData],
        error: null,
      };

      // Mock the method chaining for successful creation
      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce(mockResponse),
        }),
      });

      const result = await createDeck(mockDeckData);
      expect(result).toEqual([mockDeckData]);
      expect(supabase.from).toHaveBeenCalledWith("decks");
    });

    it("should throw an error when deck creation fails", async () => {
      // Create a specific error to throw
      const error = new Error("Create Error");

      // Mock the method chaining for an error response
      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce({
            data: null,
            error: error,
          }),
        }),
      });

      // Ensure the error is thrown as expected
      await expect(createDeck(mockDeckData)).rejects.toThrow(error);
    });
  });

  describe("getDecksByUser", () => {
    it("should fetch decks for a specific user", async () => {
      const mockResponse = [
        { id: "1", user_id: "user1", categories: [], flashcards: [] },
      ];

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

      const result = await getDecksByUser(mockUserId);
      expect(result).toEqual([
        {
          ...mockResponse[0],
          categories: [],
          flashcards_count: 0,
        },
      ]);
      expect(supabase.from).toHaveBeenCalledWith("decks");
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

      const result = await getDecksByUser(mockUserId);
      expect(result).toEqual([]);
    });
  });

  describe("getDeckById", () => {
    it("should fetch a deck by its ID", async () => {
      const mockResponse = {
        data: { ...mockDeckData, categories: [], flashcards: [] },
        error: null,
      };

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnValueOnce(Promise.resolve(mockResponse)),
      });

      const result = await getDeckById(mockDeckId);
      const { flashcards, ...resultWithoutFlashcards } = result;

      expect(resultWithoutFlashcards).toEqual({
        ...mockDeckData,
        categories: [],
        flashcards_count: 0,
      });
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

      const result = await getDeckById(mockDeckId);
      expect(result).toBeNull();
    });
  });

  describe("updateDeck", () => {
    it("should update a deck successfully", async () => {
      const mockResponse = {
        data: [mockDeckData],
        error: null,
      };

      // Mock the Supabase method chain
      const mockSupabaseResponse = {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              // Allowing a second eq
              select: vi.fn().mockResolvedValueOnce(mockResponse),
            }),
          }),
        }),
      };

      supabase.from.mockReturnValueOnce(mockSupabaseResponse);

      const result = await updateDeck(mockDeckId, mockDeckData, mockUserId);
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when updating fails", async () => {
      const mockError = {
        data: null,
        error: new Error("Update Error"),
      };

      const mockSupabaseResponse = {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValueOnce(mockError), // select should return a Promise
            }),
          }),
        }),
      };

      // Mocking the from method to return our mock response
      supabase.from.mockReturnValueOnce(mockSupabaseResponse);

      await expect(
        updateDeck(mockDeckId, mockDeckData, mockUserId)
      ).rejects.toThrow("Update Error");
    });
  });

  describe("deleteDeck", () => {
    it("should delete a deck successfully", async () => {
      const mockResponse = {
        data: [mockDeckData],
        error: null,
      };
      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce(Promise.resolve(mockResponse)), // Ensure eq returns the promise
        }),
      });

      const result = await deleteDeck(mockDeckId);
      expect(result).toEqual([mockDeckData]);
    });

    it("should throw an error when deletion fails", async () => {
      const mockError = {
        data: null,
        error: new Error("Delete Error"),
      };

      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce(Promise.resolve(mockError)),
        }),
      });

      await expect(deleteDeck(mockDeckId)).rejects.toThrow("Delete Error");
    });
  });
});
