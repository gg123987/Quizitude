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

vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
}));
vi.mock("react-pdftotext", () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue("Mocked PDF text"),
}));

// Clear all mocks between each test to prevent shared state issues
beforeEach(() => {
  vi.clearAllMocks();
});
