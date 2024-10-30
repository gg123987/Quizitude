import { renderHook, act, waitFor } from "@testing-library/react";
import useDeck from "@/hooks/useDeck";
import { getDeckById } from "@/services/deckService";
import { vi } from "vitest";

// Mock the deckService
vi.mock("@/services/deckService", () => ({
  getDeckById: vi.fn(),
}));

describe("useDeck", () => {
  const deckId = 1; // Example deck ID

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should return initial loading state", () => {
    const { result } = renderHook(() => useDeck(deckId));
    expect(result.current.loading).toBe(true);
    expect(result.current.deck).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should fetch deck data successfully", async () => {
    const mockDeck = { id: deckId, name: "Test Deck" };
    getDeckById.mockResolvedValueOnce(mockDeck); // Mock successful fetch

    const { result } = renderHook(() => useDeck(deckId));

    // Wait for the useEffect to run
    await waitFor(() => {
      return !result.current.loading;
    });

    expect(getDeckById).toHaveBeenCalledWith(deckId); // Check if the service was called with the right ID
    expect(result.current.deck).toEqual(mockDeck); // Check if the deck state is updated
    expect(result.current.loading).toBe(false); // Loading should be false after fetch
    expect(result.current.error).toBe(null); // No error should occur
  });

  it("should handle errors when fetching deck data", async () => {
    const mockError = new Error("Failed to fetch deck");
    getDeckById.mockRejectedValueOnce(mockError); // Mock a failed fetch

    const { result } = renderHook(() => useDeck(deckId));

    // Wait for useEffect to run
    await waitFor(() => {
      return !result.current.loading;
    });

    expect(getDeckById).toHaveBeenCalledWith(deckId); // Ensure the service was called
    expect(result.current.deck).toEqual([]); // Deck state should remain empty
    expect(result.current.loading).toBe(false); // Loading should be false after fetch
    expect(result.current.error).toBe(mockError); // The error should be set correctly
  });

  it("should not fetch when deckId is not provided", async () => {
    const { result } = renderHook(() => useDeck(null));

    // Directly check the initial state without waiting for updates
    expect(result.current.loading).toBe(false); // Loading should be false
    expect(result.current.deck).toEqual([]); // Deck should be empty
    expect(result.current.error).toBe(null); // No error should occur
  });

  it("should refresh the deck data", async () => {
    const mockDeck = { id: deckId, name: "Test Deck" };
    getDeckById.mockResolvedValueOnce(mockDeck); // Mock the first fetch

    const { result } = renderHook(() => useDeck(deckId));

    // Wait for the first fetch to complete
    await waitFor(() => {
      return !result.current.loading;
    });

    expect(result.current.deck).toEqual(mockDeck); // Check initial fetch

    const newMockDeck = { id: deckId, name: "Updated Test Deck" };
    getDeckById.mockResolvedValueOnce(newMockDeck); // Mock the updated fetch

    await act(async () => {
      await result.current.refreshDeck(); // Trigger refresh
    });

    expect(getDeckById).toHaveBeenCalledTimes(2); // Check that it was called twice
    expect(result.current.deck).toEqual(newMockDeck); // Check that the deck is updated
  });
});
