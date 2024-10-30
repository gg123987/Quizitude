import { renderHook } from "@testing-library/react-hooks";
import { useSessions, useDeckSessions } from "@/hooks/useSessions";
import {
  getSessionsByUser,
  getSessionsByDeck,
} from "@/services/sessionService";
import { vi } from "vitest";

vi.mock("@/services/sessionService");

describe("useSessions", () => {
  it("should fetch sessions by user", async () => {
    const mockSessions = [{ id: 1, name: "Session 1" }];
    getSessionsByUser.mockResolvedValue(mockSessions);

    const { result, waitForNextUpdate } = renderHook(() =>
      useSessions("user1")
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.sessions).toEqual(mockSessions);
    expect(result.current.error).toBe(null);
  });

  it("should handle error", async () => {
    const mockError = new Error("Failed to fetch");
    getSessionsByUser.mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useSessions("user1")
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.sessions).toEqual([]);
    expect(result.current.error).toBe(mockError);
  });
});

describe("useDeckSessions", () => {
  it("should fetch sessions by deck", async () => {
    const mockSessions = [{ id: 1, name: "Session 1" }];
    getSessionsByDeck.mockResolvedValue(mockSessions);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDeckSessions("deck1")
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.sessions).toEqual(mockSessions);
    expect(result.current.error).toBe(null);
  });

  it("should handle error", async () => {
    const mockError = new Error("Failed to fetch");
    getSessionsByDeck.mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDeckSessions("deck1")
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.sessions).toEqual([]);
    expect(result.current.error).toBe(mockError);
  });
});
