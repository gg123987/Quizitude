import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "@/components/Layout/AuthRoute";
import useAuth from "@/hooks/useAuth";

// Mock necessary components and hooks
vi.mock("@/hooks/useAuth");
vi.mock("@/components/Layout/Sidebar/Drawer", () => ({
  default: vi.fn(({ children }) => <div>ResponsiveDrawer Mock {children}</div>), // Ensure children are rendered
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div>Redirect to {to}</div>),
    Outlet: vi.fn(() => <div>Outlet Mock</div>),
  };
});

describe("AuthRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ResponsiveDrawer with Outlet if authenticated and not on StudyMode page", () => {
    useAuth.mockReturnValue({ auth: true, user: { id: "user123" } });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<AuthRoute />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("ResponsiveDrawer Mock")).toBeInTheDocument();
    expect(screen.getByText("Outlet Mock")).toBeInTheDocument();
  });

  it("redirects to login if unauthenticated and not on login/register page", () => {
    useAuth.mockReturnValue({ auth: false, user: null });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<AuthRoute />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Redirect to /login")).toBeInTheDocument();
  });

  it("renders Outlet if authenticated and on StudyMode page", () => {
    useAuth.mockReturnValue({ auth: true, user: { id: "user123" } });

    render(
      <MemoryRouter initialEntries={["/study"]}>
        <Routes>
          <Route path="/study" element={<AuthRoute />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Outlet Mock")).toBeInTheDocument();
    expect(screen.queryByText("ResponsiveDrawer Mock")).not.toBeInTheDocument();
  });

  it("does not redirect on login/register page even if unauthenticated", () => {
    useAuth.mockReturnValue({ auth: false, user: null });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<AuthRoute />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Redirect to /login")).not.toBeInTheDocument();
  });
});
