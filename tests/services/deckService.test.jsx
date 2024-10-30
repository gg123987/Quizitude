import {
  createDeck,
  getDecksByUser,
  getDeckById,
  updateDeck,
  deleteDeck,
} from "@/services/deckService";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("Deck Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new deck", async () => {
    const deckData = { name: "New Deck", user_id: "test-user-id" };
    const result = await createDeck(deckData);
    expect(result).toEqual({
      id: 1,
      name: "New Deck",
      user_id: "test-user-id",
    });
    expect(vi.mocked(createDeck).mock.calls[0][0]).toEqual(deckData); // Ensure the right data was passed
  });

  it("should fetch all decks for a specific user", async () => {
    const userId = "test-user-id";
    const result = await getDecksByUser(userId);
    expect(result).toEqual([
      { id: 1, name: "Deck 1", user_id: "test-user-id", flashcards_count: 0 },
      { id: 2, name: "Deck 2", user_id: "test-user-id", flashcards_count: 5 },
    ]);
    expect(vi.mocked(getDecksByUser).mock.calls[0][0]).toBe(userId); // Ensure the right user ID was passed
  });

  it("should fetch a specific deck by ID", async () => {
    const deckId = 1;
    const result = await getDeckById(deckId);
    expect(result).toEqual({ id: 1, name: "Deck 1", flashcards_count: 0 });
    expect(vi.mocked(getDeckById).mock.calls[0][0]).toBe(deckId); // Ensure the right deck ID was passed
  });

  it("should update a specific deck", async () => {
    const deckId = 1;
    const deckData = { name: "Updated Deck" };
    const result = await updateDeck(deckId, deckData, "test-user-id");
    expect(result).toEqual({ id: 1, name: "Updated Deck" });
    expect(vi.mocked(updateDeck).mock.calls[0]).toEqual([
      deckId,
      deckData,
      "test-user-id",
    ]); // Ensure the right data was passed
  });

  it("should delete a specific deck", async () => {
    const deckId = 1;
    const result = await deleteDeck(deckId);
    expect(result).toEqual({ id: 1 });
    expect(vi.mocked(deleteDeck).mock.calls[0][0]).toBe(deckId); // Ensure the right deck ID was passed
  });
});
