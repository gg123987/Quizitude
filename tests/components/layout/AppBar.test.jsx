import { render, screen, fireEvent } from "@testing-library/react";
import AccountMenu from "@/components/layout/Header/AccountMenu";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as Auth from "@/hooks/useAuth";

describe("AccountMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders account menu with profile and logout options", () => {
    // Mocking the useAuth hook to return a user object and signOut function
    vi.spyOn(Auth, "default").mockImplementation(() => ({
      auth: true, // Simulate that the user is authenticated
      signOut: vi.fn(), // Mock signOut function
    }));

    render(
      <MemoryRouter>
        <AccountMenu />
      </MemoryRouter>
    );

    // Verify if the avatar and profile option are rendered
    expect(screen.getByTestId("account-avatar")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("account-avatar"));
    expect(screen.getByTestId("profile-option")).toBeInTheDocument();
  });

  it("calls signOut and navigates on logout", () => {
    const signOutMock = vi.fn();
    vi.spyOn(Auth, "default").mockImplementation(() => ({
      auth: true,
      signOut: signOutMock,
    }));

    render(
      <MemoryRouter>
        <AccountMenu />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("account-avatar"));
    fireEvent.click(screen.getByTestId("logout-option"));

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("does not show logout option if not authenticated", () => {
    vi.spyOn(Auth, "default").mockImplementation(() => ({
      auth: false, // Simulate that the user is not authenticated
      signOut: vi.fn(),
    }));

    render(
      <MemoryRouter>
        <AccountMenu />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("account-avatar"));
    expect(screen.queryByTestId("logout-option")).not.toBeInTheDocument(); // Verify that the logout option is not present
  });
});
