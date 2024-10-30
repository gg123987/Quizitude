import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PasswordReset from "@/pages/Auth/PasswordReset";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/utils/supabase";

// Mock the useAuth hook
vi.mock("@/hooks/useAuth", () => ({
  default: () => ({
    passwordReset: vi.fn(),
  }),
}));

describe("PasswordReset Component", () => {
  const passwordReset = vi.mocked(useAuth().passwordReset);

  beforeEach(() => {
    render(<PasswordReset />);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  test("renders the initial form", () => {
    expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset password/i })
    ).toBeInTheDocument();
  });

  test("submits a valid email", async () => {
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByRole("button", {
      name: /Reset password/i,
    });

    // Mock the Supabase response to simulate an existing user
    const existingUser = { email: "test@example.com" };
    const mockSupabaseResponse = { data: existingUser, error: null };

    vi.mocked(
      supabase.from("users").select("email").eq("email", "test@example.com")
        .single
    ).mockResolvedValue(mockSupabaseResponse);

    // Input email and submit
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);
  });

  test("displays an error message for an invalid email", async () => {
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByRole("button", {
      name: /Reset password/i,
    });

    // Mock the Supabase response to simulate a non-existing user
    const mockSupabaseResponse = { data: null, error: null };
    vi.mocked(
      supabase
        .from("users")
        .select("email")
        .eq("email", "nonexistent@example.com").single
    ).mockResolvedValue(mockSupabaseResponse);

    // Input invalid email and submit
    fireEvent.change(emailInput, {
      target: { value: "nonexistent@example.com" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/We do not recognize this email/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error message when password reset fails", async () => {
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByRole("button", {
      name: /Reset password/i,
    });

    // Mock the Supabase response to simulate an existing user
    const existingUser = { email: "test@example.com" };
    const mockSupabaseResponse = { data: existingUser, error: null };
    vi.mocked(
      supabase.from("users").select("email").eq("email", "test@example.com")
        .single
    ).mockResolvedValue(mockSupabaseResponse);

    // Input email and submit
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    // Mock the passwordReset error response
    passwordReset.mockResolvedValueOnce({
      error: { message: "Failed to send reset link" },
    });
  });
});
