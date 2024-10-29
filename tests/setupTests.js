// tests/setupTests.js
import { expect, vi } from "vitest";
import "@testing-library/jest-dom";

// Mock Supabase client
beforeAll(() => {
  vi.mock("@supabase/supabase-js", () => {
    const actualModule = vi.importActual("@supabase/supabase-js");

    return {
      ...actualModule,
      createClient: vi.fn(() => ({
        auth: {
          signIn: vi.fn().mockResolvedValue({
            user: { id: "123", email: "test@example.com" },
          }),
          signOut: vi.fn().mockResolvedValue({}),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({ data: [], error: null }),
          }),
          insert: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
        })),
        storage: {
          from: vi.fn().mockReturnThis(), // Support chaining
          download: vi
            .fn()
            .mockResolvedValue({ data: new Blob(), error: null }), // Mock download
          upload: vi
            .fn()
            .mockResolvedValue({ data: { path: "test-path" }, error: null }), // Mock upload
        },
      })),
    };
  });

  // Mock the LLM API for now
  vi.mock("@/api/LLM", () => ({
    __esModule: true, // Indicate that this is an ES module
    default: vi.fn(() => Promise.resolve([])), // Mock the default function
  }));

  vi.mock("react-pdf", () => ({
    pdfjs: {
      GlobalWorkerOptions: {
        workerSrc: "",
      },
    },
  }));

  vi.mock("react-pdftotext", () => ({
    __esModule: true,
    default: vi.fn().mockResolvedValue("Mocked PDF text"), // Mock PDF text extraction
  }));

  // Mock the required hooks
  vi.mock("@/hooks/useAuth", () => ({
    default: vi.fn(),
  }));

  vi.mock("@/hooks/useCategories", () => ({
    default: vi.fn(),
  }));

  vi.mock("@/hooks/useDecks", () => ({
    default: vi.fn(),
  }));

  vi.mock("@/hooks/useModal", () => ({
    default: vi.fn(),
  }));

  vi.mock("@/hooks/useAvatar", () => ({
    default: vi.fn(),
  }));

  vi.mock("@/services/fileService", () => ({
    uploadFileAndCreateDeck: vi.fn(),
  }));

  vi.mock("@/services/deckService", () => ({
    createDeck: vi.fn(),
  }));

  vi.mock("@/services/categoryService", () => ({
    createCategory: vi.fn(),
  }));

  vi.mock("@/services/flashcardService", () => ({
    deleteFlashcard: vi.fn().mockResolvedValue({}),
    updateFlashcard: vi.fn().mockResolvedValue({}),
  }));
});
