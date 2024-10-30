import { describe, it, expect, vi } from "vitest";
import { supabase } from "@/utils/supabase";
import {
  login,
  signOut,
  passwordReset,
  updatePassword,
  signInWithGoogle,
  register,
} from "@/services/authService";

// Mock supabase
vi.mock("@/utils/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

describe("authService", () => {
  it("should login a user", async () => {
    const mockData = { user: { id: "123" } };
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await login("test@example.com", "password123");
    expect(result).toEqual(mockData);
  });

  it("should handle login error", async () => {
    const mockError = new Error("Login failed");
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await login("test@example.com", "password123");
    expect(result).toEqual({ error: mockError });
  });

  it("should sign out a user", async () => {
    await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it("should reset password", async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

    const result = await passwordReset("test@example.com");
    expect(result).toEqual({ error: null });
  });

  it("should handle password reset error", async () => {
    const mockError = new Error("Reset failed");
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: mockError });

    const result = await passwordReset("test@example.com");
    expect(result).toEqual({ error: mockError });
  });

  it("should update password", async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: null });

    const result = await updatePassword("newpassword123");
    expect(result).toEqual({ error: null });
  });

  it("should handle update password error", async () => {
    const mockError = new Error("Update failed");
    supabase.auth.updateUser.mockResolvedValue({ error: mockError });

    const result = await updatePassword("newpassword123");
    expect(result).toEqual({ error: mockError });
  });

  it("should sign in with Google", async () => {
    const mockData = { user: { id: "123" } };
    supabase.auth.signInWithOAuth.mockResolvedValue({
      data: mockData,
      error: null,
    });

    await signInWithGoogle();
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  });

  it("should handle Google sign-in error", async () => {
    const mockError = new Error("Google sign-in failed");
    supabase.auth.signInWithOAuth.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await signInWithGoogle();
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
  });

  it("should register a user", async () => {
    const mockData = { user: { id: "123" } };
    supabase.auth.signUp.mockResolvedValue({ data: mockData, error: null });

    const result = await register(
      "test@example.com",
      "password123",
      "Test User"
    );
    expect(result).toEqual(mockData);
  });

  it("should handle registration error", async () => {
    const mockError = new Error("Registration failed");
    supabase.auth.signUp.mockResolvedValue({ data: null, error: mockError });

    const result = await register(
      "test@example.com",
      "password123",
      "Test User"
    );
    expect(result).toEqual({ error: mockError });
  });
});
