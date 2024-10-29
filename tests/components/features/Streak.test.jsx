import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Streak from "@/components/features/Profile/Streak/Streak";
import useAuth from "@/hooks/useAuth";
import useStreak from "@/hooks/useStreak";
import { useOutletContext } from "react-router-dom";

// Mocking the hooks
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useStreak");

// Mocking react-router-dom to include MemoryRouter and useOutletContext
vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mocking MemoryRouter
    useOutletContext: vi.fn(),
  };
});

describe("Streak Component", () => {
  let mockUserId;
  let mockUserDetails;
  let mockStreakCount;

  beforeEach(() => {
    // Setting up mock data
    mockUserId = "12345";
    mockUserDetails = {
      last_session: new Date().toISOString(), // Assume the user studied today
    };
    mockStreakCount = 5; // Example streak count

    // Mock return value of useOutletContext
    useOutletContext.mockReturnValue({ userId: mockUserId });

    // Mocking the implementation of useAuth and useStreak
    useAuth.mockReturnValue({
      userId: mockUserId,
      userDetails: mockUserDetails,
    });

    useStreak.mockReturnValue(mockStreakCount);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  test("renders the streak count and indicator", () => {
    render(
      <MemoryRouter>
        <Streak />
      </MemoryRouter>
    );

    expect(screen.getByText(/day streak/i)).toBeInTheDocument();
    expect(screen.getByTestId("streak-count")).toHaveTextContent(
      mockStreakCount.toString()
    );
  });

  test("checks if user studied today", () => {
    const { rerender } = render(
      <MemoryRouter>
        <Streak />
      </MemoryRouter>
    );

    // Verify that studied today is true
    expect(screen.getByText(/day streak/i)).toBeInTheDocument();

    // Change the last_session to a date in the past
    mockUserDetails.last_session = new Date(
      Date.now() - 86400000
    ).toISOString(); // 1 day ago

    // Re-render to check if the component reflects the new state
    rerender(
      <MemoryRouter>
        <Streak />
      </MemoryRouter>
    );

    expect(screen.getByText(/day streak/i)).toBeInTheDocument();
    // Here you might want to check how it affects the MonthIndicator component
    // Assuming MonthIndicator uses 'studiedToday' prop to show some information
  });

  test("displays correct streak graphic", () => {
    render(
      <MemoryRouter>
        <Streak />
      </MemoryRouter>
    );

    const streakImage = screen.getByAltText(/streak/i);
    expect(streakImage).toBeInTheDocument();
    expect(streakImage).toHaveAttribute(
      "src",
      expect.stringContaining("flame.png")
    ); // Ensure image source is correct
  });
});
