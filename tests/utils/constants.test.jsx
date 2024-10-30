import { describe, it, expect } from "vitest";
import { TABLES, API } from "@/utils/constants";

describe("constants.js", () => {
  it("should have correct TABLES constants", () => {
    expect(TABLES).toEqual({
      DECKS: "decks",
      CATEGORIES: "categories",
      USERS: "users",
      FILES: "files",
      FLASHCARDS: "flashcards",
    });
  });

  it("should have correct API constants", () => {
    expect(API).toEqual({
      BASE_URL: "https://openrouter.ai/api/v1/chat/completions",
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    });
  });
});
