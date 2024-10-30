import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi } from "vitest";
import useFlashcards from "@/hooks/useFlashcards";
import { getFlashcardsByDeck } from "@/services/flashcardService";

vi.mock("@/services/flashcardService");

describe("useFlashcards", () => {
  it("should fetch flashcards and update state", async () => {
    const mockFlashcards = [{ id: 1, question: "Q1", answer: "A1" }];
    getFlashcardsByDeck.mockResolvedValue(mockFlashcards);

    const { result, waitForNextUpdate } = renderHook(() => useFlashcards(1));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.flashcards).toEqual(mockFlashcards);
    expect(result.current.error).toBe(null);
  });

  it("should handle error", async () => {
    const mockError = new Error("Failed to fetch");
    getFlashcardsByDeck.mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useFlashcards(1));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.flashcards).toEqual([]);
    expect(result.current.error).toBe(mockError);
  });

  it("should refresh flashcards", async () => {
    const mockFlashcards = [{ id: 1, question: "Q1", answer: "A1" }];
    getFlashcardsByDeck.mockResolvedValue(mockFlashcards);

    const { result, waitForNextUpdate } = renderHook(() => useFlashcards(1));

    await waitForNextUpdate();

    expect(result.current.flashcards).toEqual(mockFlashcards);

    const newMockFlashcards = [{ id: 2, question: "Q2", answer: "A2" }];
    getFlashcardsByDeck.mockResolvedValue(newMockFlashcards);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.flashcards).toEqual(newMockFlashcards);
  });
});
