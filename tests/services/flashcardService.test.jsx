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
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("Flashcard Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new flashcard", async () => {
    const flashcardData = {
      question: "What is the capital of France?",
      answer: "Paris",
      deck_id: 1,
    };
    const result = await createFlashcard(flashcardData);
    expect(result).toEqual([
      { id: 1, question: "What is the capital of France?", answer: "Paris" },
    ]);
    expect(vi.mocked(createFlashcard).mock.calls[0][0]).toEqual(flashcardData); // Ensure the right data was passed
  });

  it("should fetch all flashcards for a specific deck", async () => {
    const deckId = 1;
    const result = await getFlashcardsByDeck(deckId);
    expect(result).toEqual([
      {
        id: 1,
        question: "What is the capital of France?",
        answer: "Paris",
        deck_id: 1,
      },
      { id: 2, question: "What is 2 + 2?", answer: "4", deck_id: 1 },
    ]);
    expect(vi.mocked(getFlashcardsByDeck).mock.calls[0][0]).toBe(deckId); // Ensure the right deck ID was passed
  });

  it("should fetch a specific flashcard by ID", async () => {
    const flashcardId = 1;
    const result = await getFlashcardById(flashcardId);
    expect(result).toEqual([
      { id: 1, question: "What is the capital of France?", answer: "Paris" },
    ]);
    expect(vi.mocked(getFlashcardById).mock.calls[0][0]).toBe(flashcardId); // Ensure the right flashcard ID was passed
  });

  it("should update a specific flashcard", async () => {
    const flashcardId = 1;
    const flashcardData = {
      question: "Updated Question",
      answer: "Updated Answer",
    };
    const result = await updateFlashcard(flashcardId, flashcardData);
    expect(result).toEqual([
      { id: 1, question: "Updated Question", answer: "Updated Answer" },
    ]);
    expect(vi.mocked(updateFlashcard).mock.calls[0]).toEqual([
      flashcardId,
      flashcardData,
    ]); // Ensure the right data was passed
  });

  it("should delete a specific flashcard", async () => {
    const flashcardId = 1;
    const result = await deleteFlashcard(flashcardId);
    expect(result).toEqual([{ id: 1 }]);
    expect(vi.mocked(deleteFlashcard).mock.calls[0][0]).toBe(flashcardId); // Ensure the right flashcard ID was passed
  });

  it("should insert dummy flashcards", async () => {
    const deckId = 1;
    const result = await insertDummyFlashcards(deckId);
    expect(result).toHaveLength(2); // Ensure two dummy flashcards were inserted
    expect(vi.mocked(insertDummyFlashcards).mock.calls[0][0]).toBe(deckId); // Ensure the right deck ID was passed
  });

  it("should insert multiple flashcards", async () => {
    const flashcards = [
      {
        question: "What is the capital of France?",
        answer: "Paris",
        deck_id: 1,
      },
    ];
    const result = await insertFlashcards(flashcards);
    expect(result).toHaveLength(2); // Ensure two flashcards were inserted
  });

  it("should format and insert flashcard data", async () => {
    const flashcards = [
      {
        question: "What is the capital of France?",
        answer: "Paris",
        choices: ["Paris", "London", "Berlin"],
      },
    ];
    const deckId = 1;
    const result = await formatAndInsertFlashcardData(flashcards, deckId);
    expect(result).toHaveLength(2); // Ensure two flashcards were inserted
  });
});
