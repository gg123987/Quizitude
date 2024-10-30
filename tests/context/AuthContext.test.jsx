import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthProvider, { AuthContext } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";

describe("AuthProvider", () => {
  const mockUser = { id: "123", email: "test@example.com" };
  const mockUserProfile = { id: "123", name: "Test User" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch user and user details on mount", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUserProfile }),
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <div data-testid="auth">{value.auth.toString()}</div>
              <div data-testid="user">{value.user?.email}</div>
              <div data-testid="userDetails">{value.userDetails?.name}</div>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
      expect(screen.getByTestId("user").textContent).toBe(mockUser.email);
      expect(screen.getByTestId("userDetails").textContent).toBe(
        mockUserProfile.name
      );
    });
  });

  it("should handle SIGNED_IN event", async () => {
    const mockSession = { user: mockUser };
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback("SIGNED_IN", mockSession);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockUserProfile }),
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <div data-testid="auth">{value.auth.toString()}</div>
              <div data-testid="user">{value.user?.email}</div>
              <div data-testid="userDetails">{value.userDetails?.name}</div>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
      expect(screen.getByTestId("user").textContent).toBe(mockUser.email);
      expect(screen.getByTestId("userDetails").textContent).toBe(
        mockUserProfile.name
      );
    });
  });

  it("should handle SIGNED_OUT event", async () => {
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback("SIGNED_OUT", null);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <>
              <div data-testid="auth">{value.auth.toString()}</div>
              <div data-testid="user">{value.user?.email}</div>
              <div data-testid="userDetails">{value.userDetails?.name}</div>
            </>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("false");
    });
  });
});
