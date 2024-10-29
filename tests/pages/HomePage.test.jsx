import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "@/pages/Home/HomePage";
import useAuth from "@/hooks/useAuth";
import useDecks from "@/hooks/useDecks";
import useCategories from "@/hooks/useCategories";
import useStreak from "@/hooks/useStreak";
import { useOutletContext } from "react-router-dom";

// Mock the hooks
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useDecks");
vi.mock("@/hooks/useCategories");
vi.mock("@/hooks/useStreak");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(), // Mock useOutletContext
  };
});

// Mock for FilteredDecks
vi.mock("@/components/features/DisplayDecks/FilteredDecks", () => {
  return {
    default: function MockFilteredDecks({ filteredAndSortedDecks }) {
      return (
        <div data-testid="filtered-decks">
          {filteredAndSortedDecks.length} Decks
        </div>
      );
    },
  };
});

// Mock for FilteredCategories
vi.mock("@/components/features/DisplayCategories/FilteredCategories", () => {
  return {
    default: function MockFilteredCategories({ filteredAndSortedCategories }) {
      return (
        <div data-testid="filtered-categories">
          {filteredAndSortedCategories.length} Categories
        </div>
      );
    },
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(), // Mock useOutletContext
  };
});

describe("Home Component", () => {
  const mockUserId = "12345";
  const mockUserDetails = {
    full_name: "John Doe",
    last_session: new Date().toString(),
  };

  beforeEach(() => {
    // Mocking useOutletContext
    useOutletContext.mockReturnValue({ userId: mockUserId });

    // Mocking useOutletContext
    useOutletContext.mockReturnValue({ userId: mockUserId });

    // Mocking useAuth
    useAuth.mockReturnValue({
      user: { id: mockUserId },
      userDetails: mockUserDetails,
    });

    // Mocking useDecks
    useDecks.mockReturnValue({
      decks: [],
      loading: false,
      error: null,
    });

    // Mocking useCategories
    useCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: null,
    });

    // Mocking useStreak
    useStreak.mockReturnValue(5);
  });

  test("renders Home component", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome back, John")).toBeInTheDocument();
    expect(
      screen.getByText("Keep going, you are making progress")
    ).toBeInTheDocument();
  });

  test("displays loading spinner while loading decks and categories", () => {
    // Update mocks to simulate loading state
    useDecks.mockReturnValue({
      decks: [],
      loading: true,
      error: null,
    });

    useCategories.mockReturnValue({
      categories: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("handles error state for decks", () => {
    // Mocking error state for decks
    useDecks.mockReturnValue({
      decks: [],
      loading: false,
      error: { message: "Failed to load decks" },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const errorMessages = screen.getAllByText("Failed to load decks");
    expect(errorMessages.length).toBeGreaterThan(0); // Check if at least one error message is present
    expect(errorMessages[0]).toBeInTheDocument(); // Ensure the first one is in the document
  });

  test("handles error state for categories", () => {
    // Mocking error state for categories
    useCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: { message: "Failed to load categories" },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Failed to load categories")).toBeInTheDocument();
  });

  test("displays no recent decks available", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("No recent decks available.")).toBeInTheDocument();
  });

  test("displays no pinned decks available", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("No pinned decks available.")).toBeInTheDocument();
  });

  test("displays no categories available", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("No categories available")).toBeInTheDocument();
  });

  test("displays streak count", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check for the number part
    const streakCount = screen.getByText("5");
    expect(streakCount).toBeInTheDocument();

    // Check for the "Day Streak" part
    const streakText = screen.getByText("Day Streak");
    expect(streakText).toBeInTheDocument();
  });
});
