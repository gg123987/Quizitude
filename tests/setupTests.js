// Setup test file
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { createClient } from "@supabase/supabase-js";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

// Setup mock for supabase client methods
const mockTableMethods = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  mockResolvedValue(value) {
    this.select.mockResolvedValue({ data: value, error: null });
    this.insert.mockResolvedValue({ data: value, error: null });
    this.delete.mockResolvedValue({ data: value, error: null });
    this.update.mockResolvedValue({ data: value, error: null });
    this.single.mockResolvedValue({ data: value, error: null });
  },
};

// Define the main supabase mock client
const mockSupabaseClient = {
  from: vi.fn(() => mockTableMethods),
  auth: {
    signIn: vi.fn().mockResolvedValue({
      user: { id: "123", email: "test@example.com" },
    }),
    signOut: vi.fn().mockResolvedValue({}),
    onAuthStateChange: vi.fn((callback) => {
      // Simulate signed-in state
      callback("SIGNED_IN", { user: { id: "123" } });
      return { subscription: { unsubscribe: vi.fn() } };
    }),
    getUser: vi.fn().mockResolvedValue({
      id: "123",
      email: "",
      user_metadata: { full_name: "Test User" },
    }),
    getSession: vi.fn().mockResolvedValue({ user: { id: "123" } }),
  },
  storage: {
    from: vi.fn().mockReturnThis(),
    download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
    upload: vi
      .fn()
      .mockResolvedValue({ data: { path: "test-path" }, error: null }),
  },
};

// Assign the mock client to createClient for every instance
createClient.mockReturnValue(mockSupabaseClient);

// Other mocks for external libraries and hooks
vi.mock("@/api/LLM", () => ({
  default: vi.fn().mockImplementation(async (id, pdf, type) => {
    if (type === "multiple-choice") {
      return [
        {
          question: "What is 2 + 2?",
          choices: ["3", "4", "5", "6"],
          answer: "4",
        },
      ];
    } else if (type === "short-answer") {
      return [
        {
          question: "What is the capital of France?",
          answer: "Paris",
        },
      ];
    }
    throw new Error("Unsupported question type");
  }),
}));

vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
}));
vi.mock("react-pdftotext", () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue("Mocked PDF text"),
}));

// File Service Mock
vi.mock("@/services/fileService", () => ({
  uploadFileAndCreateDeck: vi
    .fn()
    .mockImplementation(async (file, deckData) => {
      // Mock the return value you expect for this test
      return {
        deck: { id: "deck-id", name: "Test Deck" },
        file: { id: "file-id" },
      };
    }),
  checkForDuplicateFile: vi.fn(),
  uploadFile: vi.fn(),
  getFilesByUser: vi.fn(),
  getFileByDeck: vi.fn(),
  getFileById: vi.fn(),
  deleteFile: vi.fn(),
}));

// Category Service Mock
vi.mock("@/services/categoryService", () => ({
  createCategory: vi
    .fn()
    .mockResolvedValue([
      { id: 1, name: "New Category", user_id: "test-user-id" },
    ]),
  getCategoriesByUser: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Category 1",
      user_id: "test-user-id",
      decks_count: 1,
      decks: [],
    },
    {
      id: 2,
      name: "Category 2",
      user_id: "test-user-id",
      decks_count: 0,
      decks: [],
    },
    { id: 0, name: "Uncategorised", decks_count: 0, decks: [] },
  ]),
  getCategoryById: vi.fn().mockResolvedValue({ id: 1, name: "Category 1" }),
  updateCategory: vi.fn().mockResolvedValue({
    data: [{ id: 1, name: "Updated Category" }],
    error: null,
  }),
  deleteCategory: vi.fn().mockResolvedValue({ error: null }),
}));

// Deck Service Mock
vi.mock("@/services/deckService", () => ({
  createDeck: vi
    .fn()
    .mockResolvedValue({ id: 1, name: "New Deck", user_id: "test-user-id" }),
  getDecksByUser: vi.fn().mockResolvedValue([
    { id: 1, name: "Deck 1", user_id: "test-user-id", flashcards_count: 0 },
    { id: 2, name: "Deck 2", user_id: "test-user-id", flashcards_count: 5 },
  ]),
  getDeckById: vi
    .fn()
    .mockResolvedValue({ id: 1, name: "Deck 1", flashcards_count: 0 }),
  updateDeck: vi.fn().mockResolvedValue({ id: 1, name: "Updated Deck" }),
  deleteDeck: vi.fn().mockResolvedValue({ id: 1 }),
}));

// Flashcard Service Mock
vi.mock("@/services/flashcardService", () => ({
  createFlashcard: vi
    .fn()
    .mockResolvedValue([
      { id: 1, question: "What is the capital of France?", answer: "Paris" },
    ]),
  getFlashcardsByDeck: vi.fn().mockResolvedValue([
    {
      id: 1,
      question: "What is the capital of France?",
      answer: "Paris",
      deck_id: 1,
    },
    { id: 2, question: "What is 2 + 2?", answer: "4", deck_id: 1 },
  ]),
  getFlashcardById: vi
    .fn()
    .mockResolvedValue([
      { id: 1, question: "What is the capital of France?", answer: "Paris" },
    ]),
  updateFlashcard: vi
    .fn()
    .mockResolvedValue([
      { id: 1, question: "Updated Question", answer: "Updated Answer" },
    ]),
  deleteFlashcard: vi.fn().mockResolvedValue([{ id: 1 }]),
  insertDummyFlashcards: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  insertFlashcards: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  formatAndInsertFlashcardData: vi
    .fn()
    .mockResolvedValue([{ id: 1 }, { id: 2 }]),
}));

// Session Service Mock
vi.mock("@/services/sessionService", () => ({
  createSession: vi
    .fn()
    .mockResolvedValue([
      { id: 1, user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" },
    ]),
  getSessionsByUser: vi.fn().mockResolvedValue([
    { id: 1, user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" },
    { id: 2, user_id: 1, deck_id: 2, date_reviewed: "2024-10-29" },
  ]),
  getSessionsByDeck: vi.fn().mockResolvedValue([
    { id: 1, user_id: 1, deck_id: 1, date_reviewed: "2024-10-30" },
    { id: 2, user_id: 2, deck_id: 1, date_reviewed: "2024-10-29" },
  ]),
  getSessionById: vi.fn().mockResolvedValue({
    id: 1,
    user_id: 1,
    deck_id: 1,
    date_reviewed: "2024-10-30",
  }),
}));

// User Service Mock
vi.mock("@/services/userService", () => ({
  getUserById: vi.fn().mockResolvedValue({ id: 1, name: "Test User" }),
  insertUser: vi.fn().mockResolvedValue([{ id: 1, name: "New User" }]),
  updateUser: vi.fn().mockResolvedValue([{ id: 1, name: "Updated User" }]),
  deleteUser: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
  updateUserStreak: vi.fn(),
  checkUserStreak: vi.fn().mockResolvedValue(0),
}));

// Clear all mocks between each test to prevent shared state issues
beforeEach(() => {
  vi.clearAllMocks();
});
