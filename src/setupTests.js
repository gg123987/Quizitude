import "@testing-library/jest-dom";

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  const actualModule = jest.requireActual("@supabase/supabase-js");

  return {
    ...actualModule,
    createClient: jest.fn(() => ({
      auth: {
        signIn: jest
          .fn()
          .mockResolvedValue({
            user: { id: "123", email: "test@example.com" },
          }),
        signOut: jest.fn().mockResolvedValue({}),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({ data: [], error: null }),
        }),
        insert: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
      })),
    })),
  };
});
