// main.test.jsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import React from "react";
import App from "@/App";

// Mocking the AuthContext
const MockAuthProvider = ({ children }) => {
  const mockAuthContextValue = {
    user: { id: "123", email: "test@example.com" }, // mock user data
    loading: false,
    login: vi.fn(), // mock login function
    logout: vi.fn(), // mock logout function
  };

  return (
    <AuthContext.Provider value={mockAuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

describe("Main Component", () => {
  it("renders App component with AuthProvider and Router", async () => {
    const { getByText } = render(
      <React.StrictMode>
        <BrowserRouter>
          <MockAuthProvider>
            <App />
          </MockAuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );

    // Check for log in
    expect(await getByText(/Log In/i)).toBeInTheDocument();
  });
});
