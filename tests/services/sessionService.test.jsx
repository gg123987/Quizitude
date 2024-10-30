import {
  createSession,
  getSessionsByUser,
  getSessionsByDeck,
  getSessionById,
} from "@/services/sessionService";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("Session Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new session", async () => {
    const sessionData = { user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" };
    const result = await createSession(sessionData);
    expect(result).toEqual([
      { id: 1, user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" },
    ]);
    expect(vi.mocked(createSession).mock.calls[0][0]).toEqual(sessionData); // Ensure the right data was passed
  });

  it("should fetch all sessions for a specific user", async () => {
    const userId = 1;
    const result = await getSessionsByUser(userId);
    expect(result).toEqual([
      { id: 1, user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" },
      { id: 2, user_id: 1, deck_id: 2, date_reviewed: "2024-10-29" },
    ]);
    expect(vi.mocked(getSessionsByUser).mock.calls[0][0]).toBe(userId); // Ensure the right user ID was passed
  });

  it("should fetch all sessions for a specific deck", async () => {
    const deckId = 1;
    const result = await getSessionsByDeck(deckId);
    expect(result).toEqual([
      { id: 1, user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" },
      { id: 2, user_id: 2, deck_id: 1, date_reviewed: "2024-10-29" },
    ]);
    expect(vi.mocked(getSessionsByDeck).mock.calls[0][0]).toBe(deckId); // Ensure the right deck ID was passed
  });

  it("should fetch a specific session by ID", async () => {
    const sessionId = 1;
    const result = await getSessionById(sessionId);
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      deck_id: 1,
      date_reviewed: "2024-10-30",
    });
    expect(vi.mocked(getSessionById).mock.calls[0][0]).toBe(sessionId); // Ensure the right session ID was passed
  });
});
