import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFlashcard,
  getFlashcardsByDeck,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
  insertDummyFlashcards,
  insertFlashcards,
  formatAndInsertFlashcardData,
} from "@/services/flashcardService";
import { supabase } from "@/utils/supabase";

// Mock the supabase client
vi.mock("@/utils/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("Flashcard Service", () => {
  const mockFlashcardData = {
    id: "1",
    question: "Test Question",
    answer: "Test Answer",
    deck_id: "deck1",
    type: "SA",
  };
  const mockDeckId = "deck1";
  const mockFlashcardId = "1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createFlashcard", () => {
    it("should create a flashcard successfully", async () => {
      const mockResponse = { data: [mockFlashcardData], error: null };

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await createFlashcard(mockFlashcardData);
      expect(result).toEqual(mockResponse.data);
      expect(supabase.from).toHaveBeenCalledWith("flashcards");
    });

    it("should throw an error when flashcard creation fails", async () => {
      const error = new Error("Create Error");

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({ data: null, error }),
      });

      await expect(createFlashcard(mockFlashcardData)).rejects.toThrow(error);
    });
  });

  describe("getFlashcardsByDeck", () => {
    it("should fetch flashcards for a specific deck", async () => {
      const mockResponse = [
        {
          id: "1",
          question: "Test Question",
          answer: "Test Answer",
          deck_id: mockDeckId,
        },
      ];

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({ data: mockResponse, error: null })
          ),
      });

      const result = await getFlashcardsByDeck(mockDeckId);
      expect(result).toEqual(mockResponse);
      expect(supabase.from).toHaveBeenCalledWith("flashcards");
    });

    it("should throw an error when fetching fails", async () => {
      const mockError = new Error("Fetch Error");

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({ data: null, error: mockError })
          ),
      });

      // Ensure the function throws an error as expected
      await expect(getFlashcardsByDeck(mockDeckId)).rejects.toThrow(
        "Fetch Error"
      );
    });
  });

  describe("getFlashcardById", () => {
    it("should fetch a flashcard by its ID", async () => {
      const mockResponse = { data: mockFlashcardData, error: null };

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce(Promise.resolve(mockResponse)),
      });

      const result = await getFlashcardById(mockFlashcardId);
      expect(result).toEqual(mockFlashcardData);
    });

    it("should throw an error when fetching fails", async () => {
      const mockError = new Error("Fetch Error");

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi
          .fn()
          .mockReturnValueOnce(
            Promise.resolve({ data: null, error: mockError })
          ),
      });

      // Ensure the function throws an error as expected
      await expect(getFlashcardById(mockFlashcardId)).rejects.toThrow(
        "Fetch Error"
      );
    });
  });

  describe("updateFlashcard", () => {
    it("should update a flashcard successfully", async () => {
      const mockResponse = { data: [mockFlashcardData], error: null };

      supabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockResolvedValueOnce(mockResponse),
          }),
        }),
      });

      const result = await updateFlashcard(mockFlashcardId, mockFlashcardData);
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when updating fails", async () => {
      const error = new Error("Update Error");

      supabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockResolvedValueOnce({ data: null, error }),
          }),
        }),
      });

      await expect(
        updateFlashcard(mockFlashcardId, mockFlashcardData)
      ).rejects.toThrow(error);
    });
  });

  describe("deleteFlashcard", () => {
    it("should delete a flashcard successfully", async () => {
      const mockResponse = { data: [mockFlashcardData], error: null };

      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce(Promise.resolve(mockResponse)),
        }),
      });

      const result = await deleteFlashcard(mockFlashcardId);
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when deletion fails", async () => {
      const error = new Error("Delete Error");

      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnValueOnce({
          eq: vi
            .fn()
            .mockReturnValueOnce(Promise.resolve({ data: null, error })),
        }),
      });

      await expect(deleteFlashcard(mockFlashcardId)).rejects.toThrow(error);
    });
  });

  describe("insertDummyFlashcards", () => {
    it("should insert dummy flashcards successfully", async () => {
      const mockResponse = { data: [{ id: "1" }, { id: "2" }], error: null };

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await insertDummyFlashcards(mockDeckId);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when dummy insertion fails", async () => {
      const error = new Error("Insert Dummy Error");

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({ data: null, error }),
      });

      await expect(insertDummyFlashcards(mockDeckId)).rejects.toThrow(error);
    });
  });

  describe("insertFlashcards", () => {
    it("should insert flashcards successfully", async () => {
      const mockResponse = { data: [mockFlashcardData], error: null };

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await insertFlashcards([mockFlashcardData]);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when insertion fails", async () => {
      const error = new Error("Insert Error");

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({ data: null, error }),
      });

      await expect(insertFlashcards([mockFlashcardData])).rejects.toThrow(
        error
      );
    });
  });

  describe("formatAndInsertFlashcardData", () => {
    it("should format and insert flashcard data successfully", async () => {
      const flashcards = [
        {
          question: "Test Question",
          answer: "Test Answer",
          choices: ["Choice 1", "Choice 2"],
        },
      ];
      const mockResponse = { data: [{ id: "1" }], error: null };

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await formatAndInsertFlashcardData(flashcards, mockDeckId);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when formatting and inserting fails", async () => {
      const error = new Error("Format and Insert Error");

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({ data: null, error }),
      });

      // Call the function with an empty array
      await expect(
        formatAndInsertFlashcardData([], mockDeckId)
      ).rejects.toThrow("No flashcards to insert");
    });
  });
});
