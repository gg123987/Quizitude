import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccountMenu from "@/components/Layout/Header/AccountMenu";
import useAuth from "@/hooks/useAuth";

// Mock the useAuth hook
vi.mock("@/hooks/useAuth");

// Mocking useNavigate from react-router-dom
const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

// Create a mock implementation of useAuth
const mockSignOut = vi.fn();
useAuth.mockReturnValue({
  auth: true,
  signOut: mockSignOut,
});

describe("AccountMenu Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AccountMenu />
      </MemoryRouter>
    );
  });

  test("renders account menu button", () => {
    const avatar = screen.getByTestId("account-avatar");
    expect(avatar).toBeInTheDocument();
  });

  test("opens menu on avatar click", () => {
    const avatar = screen.getByTestId("account-avatar");
    fireEvent.click(avatar);

    const profileMenuItem = screen.getByText(/profile/i);
    expect(profileMenuItem).toBeInTheDocument();
  });

  test("navigates to profile when profile menu item is clicked", () => {
    const avatar = screen.getByTestId("account-avatar");
    fireEvent.click(avatar);

    const profileMenuItem = screen.getByTestId("profile-option");
    fireEvent.click(profileMenuItem);

    expect(navigate).toHaveBeenCalledWith("/profile");
  });

  test("calls signOut and navigates to logout on logout menu item click", () => {
    const avatar = screen.getByTestId("account-avatar");
    fireEvent.click(avatar);

    const logoutMenuItem = screen.getByTestId("logout-option");
    fireEvent.click(logoutMenuItem);

    expect(mockSignOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/logout");
  });
});
