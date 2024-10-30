// App.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";
import { AuthContext } from "@/context/AuthContext";
import useAuth from "@/hooks/useAuth";

// Mock the useAuth hook
vi.mock("@/hooks/useAuth", () => ({
  default: vi.fn(),
}));

// Create a mock auth provider to pass context values
const MockAuthProvider = ({ children, auth = true }) => {
  const mockAuthValue = {
    auth,
    user: auth ? { id: "123", email: "test@example.com" } : null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  };

  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

describe("App Component", () => {
  describe("Authenticated User", () => {
    beforeEach(() => {
      const mockAuth = vi.mocked(useAuth);
      mockAuth.mockReturnValue({
        auth: true,
        user: { id: "123" },
        loading: false,
      });
    });

    it("renders HomePage for authenticated users", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <MockAuthProvider>
            <App />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Expect the HomePage to be in the document
      // Get all home text, and check greater than 0
      expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
    });

    it("renders Profile page for authenticated users", () => {
      render(
        <MemoryRouter initialEntries={["/profile"]}>
          <MockAuthProvider>
            <App />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Expect the Profile page to be in the document
      // Get all profile text, and check greater than 0
      expect(screen.getAllByText(/Profile/i).length).toBeGreaterThan(0);
    });

    it("renders AllDecks page for authenticated users", () => {
      render(
        <MemoryRouter initialEntries={["/decks"]}>
          <MockAuthProvider>
            <App />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Expect the AllDecks page to be in the document
      // Get all decks text, and check greater than 0
      expect(screen.getAllByText(/Decks/i).length).toBeGreaterThan(0);
    });
  });

  describe("Unauthenticated User", () => {
    beforeEach(() => {
      const mockAuth = vi.mocked(useAuth);
      mockAuth.mockReturnValue({
        auth: false,
        user: null,
        loading: false,
      });
    });

    it("redirects to login for unauthenticated users", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <MockAuthProvider auth={false}>
            <App />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Expect to be redirected to the login page
      expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    });

    it("renders Signin page for unauthenticated users on /login route", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <MockAuthProvider auth={false}>
            <App />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Expect the Signin page to be in the document
      expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    });

    it("renders Register page for unauthenticated users on /register route", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <MockAuthProvider auth={false}>
            <App />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Expect the Register page to be in the document
      // Get all text, and check greater than 0
      expect(screen.getAllByText(/Sign Up/i).length).toBeGreaterThan(0);
    });
  });
});
