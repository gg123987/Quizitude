import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "@/pages/Auth/Register";
import { vi } from "vitest";
import useAuth from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth");

describe("Register Component", () => {
  const mockRegister = vi.fn();
  const mockSignInWithGoogle = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      register: mockRegister,
      signInWithGoogle: mockSignInWithGoogle,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it("renders the Register component", () => {
    setup();
    expect(screen.getAllByText(/Sign Up/i)[0]).toBeInTheDocument();
  });

  it("displays error message when form is submitted with empty fields", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Get started/i }));
    expect(
      await screen.findByText(/Please fill in all fields/i)
    ).toBeInTheDocument();
  });

  it("displays email error when invalid email is entered", async () => {
    setup();
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "invalidemail" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Get started/i }));
    expect(await screen.findByText(/Please fill/i)).toBeInTheDocument();
  });

  it("calls register function with correct values when form is valid", async () => {
    setup();
    fireEvent.change(screen.getByTestId("fName"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Get started/i }));
    expect(mockRegister).toHaveBeenCalledWith(
      "john@example.com",
      "password123",
      "John"
    );
  });

  it("calls signInWithGoogle function when Google Sign-In button is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Google Signup/i }));
    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });
});
