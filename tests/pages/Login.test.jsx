import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignInSide from "@/pages/Auth/LogIn";
import { vi } from "vitest";
import useAuth from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth");

describe("SignInSide", () => {
  const mockLogin = vi.fn();
  const mockSignInWithGoogle = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      login: mockLogin,
      signInWithGoogle: mockSignInWithGoogle,
    });
  });

  it("renders the login form", () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome back! Please enter your details./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/or Sign in with Email/i)).toBeInTheDocument();
  });

  it("handles Google sign-in button click", () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    const googleButton = screen.getByRole("button", { name: /Google Login/i });
    fireEvent.click(googleButton);

    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });

  it("handles form submission with empty fields", async () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(signInButton);

    expect(
      await screen.findByText(/Please fill in the fields/i)
    ).toBeInTheDocument();
  });

  it("handles form submission with invalid credentials", async () => {
    mockLogin.mockResolvedValueOnce({
      user: null,
      session: null,
      error: { message: "Invalid login credentials" },
    });

    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password" },
    });

    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(signInButton);

    expect(
      await screen.findByText(
        /We do not recognize this email. Please try again/i
      )
    ).toBeInTheDocument();
  });
});
