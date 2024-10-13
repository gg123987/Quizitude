import { expect, vi } from "vitest";
import { beforeAll } from "vitest";

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
      })),
    };
  });

  // Mocking fetch API
  global.fetch = vi.fn((url) => {
    if (url === "https://openrouter.ai/api/v1/chat/completions") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    {
                      question: "What is the capital of France?",
                      choices: ["Berlin", "Madrid", "Paris", "Rome"],
                      answer: "Paris",
                    },
                  ]),
                },
              },
            ],
          }),
      });
    }

    // Handle other URLs if necessary
    return Promise.reject(new Error("Unknown URL"));
  });
});
