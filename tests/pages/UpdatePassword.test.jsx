import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import { BrowserRouter as Router } from "react-router-dom";

describe("UpdatePassword", () => {
  const mockUpdatePassword = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Router>
        <AuthContext.Provider value={{ updatePassword: mockUpdatePassword }}>
          <UpdatePassword />
        </AuthContext.Provider>
      </Router>
    );

  it("renders the component", () => {
    renderComponent();
    expect(screen.getByText("Set new password")).toBeInTheDocument();
  });
});
