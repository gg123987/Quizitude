import { renderHook } from "@testing-library/react-hooks";
import { vi } from "vitest";
import useFlashcard from "@/hooks/useFlashcard";
import { getFlashcardById } from "@/services/flashcardService";

vi.mock("@/services/flashcardService");

describe("useFlashcard", () => {
  it("should fetch flashcard data successfully", async () => {
    const flashcardData = {
      id: 1,
      question: "What is Vitest?",
      answer: "A testing framework",
    };
    getFlashcardById.mockResolvedValue(flashcardData);

    const { result, waitForNextUpdate } = renderHook(() => useFlashcard(1));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.flashcard).toEqual(flashcardData);
    expect(result.current.error).toBe(null);
  });

  it("should handle error while fetching flashcard data", async () => {
    const errorMessage = "Failed to fetch flashcard";
    getFlashcardById.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useFlashcard(1));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.flashcard).toEqual([]);
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
