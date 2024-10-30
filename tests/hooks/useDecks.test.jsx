import { renderHook, act } from "@testing-library/react-hooks";
import { vi } from "vitest";
import useDecks from "@/hooks/useDecks";
import { getDecksByUser } from "@/services/deckService";

// Mock the getDecksByUser service
vi.mock("@/services/deckService", () => ({
  getDecksByUser: vi.fn(),
}));

describe("useDecks", () => {
  it("should fetch decks for a given userId", async () => {
    const userId = "test-user-id";
    const mockDecks = [
      { id: 1, name: "Deck 1", user_id: userId },
      { id: 2, name: "Deck 2", user_id: userId },
    ];

    getDecksByUser.mockResolvedValue(mockDecks);

    const { result, waitFor } = renderHook(() => useDecks(userId));

    // Wait for the loading state to be true
    await waitFor(() => expect(result.current.loading).toBe(true));

    // Wait for the loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.decks).toEqual(mockDecks);
    expect(result.current.error).toBe(null);
  });

  it("should handle error when fetching decks fails", async () => {
    const userId = "test-user-id";
    const mockError = new Error("Failed to fetch decks");

    getDecksByUser.mockRejectedValue(mockError);

    const { result, waitFor } = renderHook(() => useDecks(userId));

    // Wait for the loading state to be true
    await waitFor(() => expect(result.current.loading).toBe(true));

    // Wait for the loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.decks).toEqual([]);
    expect(result.current.error).toBe(mockError);
  });

  it("should not fetch decks if userId is not provided", async () => {
    const { result } = renderHook(() => useDecks(null));

    // Ensure the initial state is set
    expect(result.current.loading).toBe(false);
    expect(result.current.decks).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});
